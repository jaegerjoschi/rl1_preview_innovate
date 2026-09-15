#!/usr/bin/env node
/**
 * Bilder für die Auslieferung verkleinern und neu kodieren.
 *
 * Beim statischen Export gibt es keine Bildoptimierung zur Laufzeit — die
 * Dateien gehen so raus, wie sie im Repo liegen. Deshalb werden sie einmalig
 * hier bearbeitet.
 *
 * Dateinamen bleiben gleich: Es müssen keine Pfade in Daten oder Code
 * angefasst werden.
 *
 * Aufruf:  node scripts/optimize-images.mjs [--dry]
 *
 * ── ZWEI DINGE, DIE HIER FRÜHER FALSCH WAREN ─────────────────────────────
 *
 * 1. `sips` taugt nicht als JPEG-Encoder. Gemessen am 13.09.2026:
 *    hero-rail.jpg (121 KB) wurde bei „formatOptions 82" auf 163 KB
 *    AUFGEBLÄHT, drivers-bg.jpg von 355 auf 360 KB. Nur die 10-%-Regel
 *    weiter unten hat verhindert, dass das je übernommen wurde — das
 *    Skript hat bei den großen Bildern also schlicht nie etwas bewirkt.
 *    Es läuft jetzt über ImageMagick, wo dieselben Dateien bei q82 auf
 *    98 bzw. 200 KB gehen. sips bleibt als Rückfall für reines
 *    Verkleinern; ohne ImageMagick ist die Ausbeute klein.
 *
 * 2. Die Zielbreiten waren geraten, nicht gemessen — und für die
 *    vollflächigen Bilder in die falsche Richtung. Jede Breite unten ist
 *    jetzt am gebauten Stand nachgemessen (größte Anzeigebreite über alle
 *    Viewports bis 2560 px, mal zwei für hochauflösende Displays).
 */

import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { copyFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";

const DRY = process.argv.includes("--dry");

/**
 * JPEG-Qualität für das Neu-Kodieren.
 *
 * Nachgemessen gegen die Originale: normalisierter RMSE zwischen 0,0002
 * und 0,009 — im schlechtesten Fall rund zwei von 255 Helligkeitsstufen,
 * bei 1:1-Ansicht nicht unterscheidbar. Alle Quelldateien liegen bereits
 * in sRGB ohne eingebettetes ICC-Profil und mit 4:2:0-Unterabtastung vor;
 * `-strip` und `-sampling-factor` ändern daran also nichts, sie halten den
 * Zustand nur fest.
 */
const QUALITY = 82;

/**
 * Zielbreiten — GEMESSEN, nicht geschätzt.
 *
 * `maxWidth: null` heißt: NICHT verkleinern, nur neu kodieren. Das gilt für
 * jedes Bild, das über die volle Fensterbreite läuft (`sizes="100vw"`):
 * auf einem 2560er Schirm mit doppelter Pixeldichte bräuchte es 5120 px,
 * die Dateien sind mit 1900–2400 px also ohnehin schon zu KLEIN. Sie zu
 * verkleinern würde sie sichtbar weichzeichnen — die richtige Lösung dafür
 * sind Breitenvarianten mit srcset, nicht eine kleinere Einzeldatei.
 */
const TARGETS = [
  {
    dir: "public/hero",
    maxWidth: null,
    note: "vollflächig (100vw) — nur neu kodieren, NIE verkleinern",
  },
  {
    dir: "public/drivers",
    only: ["drivers-bg.jpg"],
    maxWidth: null,
    note: "vollflächiger Hintergrund — nur neu kodieren",
  },
  {
    dir: "public/drivers",
    skip: ["drivers-bg.jpg"],
    maxWidth: 500,
    note: "Treiber-Karten, gemessen 234 px Anzeige",
  },
  {
    dir: "public/story",
    maxWidth: null,
    note: "klebende Bühne mit object-cover — nur neu kodieren",
    /*
      Hier stand zwischenzeitlich 1000 px, hergeleitet aus der gemessenen
      ANZEIGEBREITE von 477 px. Das war falsch, und zwar lehrreich falsch:
      die Bilder stehen mit `object-cover` in einem Kasten von 477 × 864 px
      (2560er Schirm, volle Bühnenhöhe). Bei cover muss die Quelle BEIDE
      Maße abdecken — gebraucht werden also 954 × 1728, vorhanden sind
      1400 × 788. In der Höhe fehlt es schon heute um mehr als das Doppelte.
      Verkleinern hätte das sichtbar verschlimmert.
    */
  },
  {
    dir: "public/board",
    maxWidth: 320,
    fit: "min",
    note: "Porträts, gemessen 120 px (Quote) bzw. 40 px (Governance)",
    /*
      `fit: "min"` misst die KÜRZERE Seite, nicht die Breite. Die Porträts
      stehen in einem runden Rahmen mit object-cover: bei henning-vollbehr
      (367 × 240) hätte eine Begrenzung auf 320 BREITE die Höhe auf 209
      gedrückt — unter die 240, die der 120-px-Kreis bei doppelter
      Pixeldichte braucht. Das Bild wäre durch die „Optimierung" unschärfer
      geworden.
    */
  },
  {
    dir: "public/logos",
    recurse: true,
    maxWidth: 400,
    note: "Institutslogos, gemessen bis 160 px Anzeige",
    /*
      Hier stand 200 px. Das war zu klein: auf /about laufen die Logos mit
      160 px Anzeigebreite, brauchen also 320. Ein Lauf mit dem alten Wert
      hätte sie verschlechtert statt verbessert. 400 ist eine Obergrenze,
      die heute keine Datei erreicht — die Logos werden also nur noch neu
      kodiert, nicht mehr beschnitten.

      `recurse` ist ebenfalls neu: public/logos/mono/ liegt eine Ebene
      tiefer und wurde von readdirSync nie erfasst — zwanzig Dateien, die
      das Skript schlicht übersehen hat.
    */
  },
];

const RASTER = new Set([".jpg", ".jpeg", ".png"]);
const kb = (bytes) => Math.round(bytes / 1024);

/* ── Encoder bestimmen ──────────────────────────────────────────────────
   ImageMagick 7 heißt `magick`, Version 6 `convert`. Beide sind keine
   Projektabhängigkeit, sondern ein Werkzeug auf dem Rechner der Person,
   die Bilder einpflegt — dieses Skript läuft nie im Docker-Build.        */
function detectEncoder() {
  for (const bin of ["magick", "convert"]) {
    try {
      execFileSync(bin, ["-version"], { stdio: "ignore" });
      return bin;
    } catch {
      /* weiter suchen */
    }
  }
  return null;
}

const MAGICK = detectEncoder();

if (!MAGICK) {
  console.warn(
    "\nImageMagick nicht gefunden — Rückfall auf sips.\n" +
      "sips kann nur verkleinern; beim Neu-Kodieren macht es Dateien eher\n" +
      "größer, diese Schritte entfallen deshalb. Für das volle Ergebnis:\n" +
      "  brew install imagemagick\n",
  );
}

/**
 * Verkleinern + neu kodieren in EINEM Durchgang, in die Zieldatei `out`.
 *
 * `fit` steuert, worauf sich maxWidth bezieht:
 *   "width" (Standard) — die längere Kante der Breite nach begrenzen.
 *                        Richtig für Bilder, die in einen Kasten passen
 *                        (object-contain) oder deren Höhe mitläuft.
 *   "min"              — die KÜRZERE Kante auf maxWidth bringen. Richtig
 *                        für object-cover, wo die Quelle beide Maße
 *                        abdecken muss.
 */
function encode(src, out, maxWidth, fit = "width") {
  if (MAGICK) {
    const args = [src];
    // Das ">" heißt in beiden Fällen: nur verkleinern, nie vergrößern.
    // Das "^" bei "min" bedeutet „Mindestmaße", misst also die kurze Kante.
    if (maxWidth) {
      args.push("-resize", fit === "min" ? `${maxWidth}x${maxWidth}^>` : `${maxWidth}x>`);
    }
    /*
      JPEG-Einstellungen gehören NUR an JPEGs. Auf ein PNG angewandt heißt
      `-interlace JPEG` nämlich Adam7-Verschränkung, und die macht die Datei
      typischerweise GRÖSSER — die Logos liegen zum Teil als PNG vor (mit
      Transparenz, die erhalten bleiben muss). Für sie gibt es nur
      verlustfreies Nachpacken.
    */
    if (extname(out).toLowerCase() === ".png") {
      args.push("-strip", "-define", "png:compression-level=9", out);
    } else {
      args.push(
        "-quality",
        String(QUALITY),
        "-sampling-factor",
        "4:2:0",
        "-strip",
        "-interlace",
        "JPEG",
        out,
      );
    }
    execFileSync(MAGICK, args, { stdio: "ignore" });
    return true;
  }

  // Rückfall ohne ImageMagick: nur verkleinern. Ein reines Neu-Kodieren
  // würde mit sips nichts bringen (siehe Kopfkommentar), und die kurze
  // Kante zu messen kann sips gar nicht — dann lieber nichts anfassen.
  if (!maxWidth || fit === "min") return false;
  copyFileSync(src, out);
  execFileSync("sips", ["-Z", String(maxWidth), out], { stdio: "ignore" });
  return true;
}

let before = 0;
let after = 0;

for (const target of TARGETS) {
  const { dir, maxWidth, fit, note, only, skip, recurse } = target;

  let files;
  try {
    files = readdirSync(dir, { withFileTypes: true });
  } catch {
    console.log(`übersprungen (fehlt): ${dir}`);
    continue;
  }

  const paths = [];
  for (const entry of files) {
    if (entry.isDirectory()) {
      if (!recurse) continue;
      try {
        for (const sub of readdirSync(join(dir, entry.name))) {
          paths.push([join(dir, entry.name, sub), sub]);
        }
      } catch {
        /* unlesbarer Unterordner: überspringen */
      }
      continue;
    }
    paths.push([join(dir, entry.name), entry.name]);
  }

  console.log(`\n${dir} — ${note}${maxWidth ? `, max ${maxWidth}px` : ""}`);

  for (const [path, name] of paths) {
    if (!RASTER.has(extname(name).toLowerCase())) continue;
    if (only && !only.includes(name)) continue;
    if (skip && skip.includes(name)) continue;

    const sizeBefore = statSync(path).size;
    before += sizeBefore;

    if (DRY) {
      let dims = "?";
      try {
        dims = MAGICK
          ? execFileSync(MAGICK, ["identify", "-format", "%wx%h", path], {
              encoding: "utf8",
            }).trim()
          : execFileSync("sips", ["-g", "pixelWidth", path], { encoding: "utf8" })
              .trim()
              .split(":")
              .pop()
              .trim();
      } catch {
        /* Maße sind im Probelauf nur Beiwerk */
      }
      console.log(`  ${name}: ${kb(sizeBefore)} KB, ${dims}`);
      after += sizeBefore;
      continue;
    }

    // Erst in eine Kopie rechnen und nur übernehmen, wenn es wirklich kleiner
    // wird. Neu-Kodieren macht bereits optimierte oder kleine Dateien sonst
    // größer statt kleiner — und kostet zusätzlich Bildqualität.
    const tmp = join(tmpdir(), `rl1-opt-${randomUUID()}${extname(name)}`);

    try {
      if (!encode(path, tmp, maxWidth, fit)) {
        after += sizeBefore;
        console.log(`  ${name}: ${kb(sizeBefore)} KB — ohne ImageMagick nichts zu holen`);
        continue;
      }

      const candidate = statSync(tmp).size;

      // Mindestens 10 % Ersparnis, sonst lohnt der Qualitätsverlust nicht.
      if (candidate < sizeBefore * 0.9) {
        copyFileSync(tmp, path);
        after += candidate;
        console.log(
          `  ${name}: ${kb(sizeBefore)} → ${kb(candidate)} KB` +
            `  (−${Math.round(((sizeBefore - candidate) / sizeBefore) * 100)} %)`,
        );
      } else {
        after += sizeBefore;
        console.log(`  ${name}: ${kb(sizeBefore)} KB — schon gut, unverändert gelassen`);
      }
    } finally {
      rmSync(tmp, { force: true });
    }
  }
}

console.log(
  `\nGesamt: ${kb(before)} → ${kb(after)} KB` +
    (before > after ? `  (−${Math.round(((before - after) / before) * 100)} %)` : ""),
);
