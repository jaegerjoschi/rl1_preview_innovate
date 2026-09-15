#!/usr/bin/env node
/**
 * Den Export von Dateien befreien, die nicht ins Web gehören.
 *
 * Zwei Sorten sammeln sich in `out/` an, beide unauffällig:
 *
 *   .DS_Store   Legt der Finder an, sobald jemand den Ordner im Fenster
 *               öffnet. Die Datei listet die Namen aller Dateien daneben —
 *               auch der später gelöschten. Sie wird nicht verlinkt, ist
 *               über die Adresse aber abrufbar, sobald der Ordner
 *               ausgeliefert wird.
 *
 *   *.map       Source-Maps bilden das gebaute JavaScript auf den
 *               Originalquelltext zurück, inklusive Kommentaren. Next
 *               erzeugt sie für die Auslieferung normalerweise nicht
 *               (`productionBrowserSourceMaps` steht auf dem Standard
 *               `false`) — was hier landet, sind Reste aus früheren Läufen,
 *               die niemand aufräumt, weil `out/` nicht geleert wird.
 *
 * Dazu kommen ganze Ordner, die nur intern gebraucht werden:
 *
 *   preview/    Entscheidungsvorlagen — dieselbe Sektion in mehreren
 *               Varianten untereinander, damit die Wahl im Browser fällt.
 *               Die Seiten tragen `robots: { index: false }`, aber das hält
 *               nur Suchmaschinen ab, nicht Besucher: Wer die Adresse kennt
 *               oder rät, sieht unfertige Entwürfe. Unter `next dev` bleiben
 *               sie erreichbar — entfernt wird nur aus dem Export.
 *
 * Läuft als erster Schritt im postbuild, also VOR precompress: sonst
 * entstünden .gz/.br-Kopien von Dateien, die gleich darauf verschwinden.
 *
 * Aufruf:  node scripts/clean-export.mjs [--dry]
 */

import { existsSync, mkdirSync, readdirSync, rmSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "out";
const DRY = process.argv.includes("--dry");

/** Trifft zu = Datei fliegt raus. */
const unwanted = (name) => name === ".DS_Store" || name.endsWith(".map");

/** Ganze Ordner, die nicht ausgeliefert werden. Pfade relativ zu out/. */
const unwantedDirs = ["preview"];

let removed = 0;
let bytes = 0;

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // Ordner existiert nicht — kein Build vorhanden, nichts zu tun
  }

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(path);
      continue;
    }

    if (!unwanted(entry.name)) continue;

    bytes += statSync(path).size;
    removed += 1;
    console.log(`  ${DRY ? "wäre entfernt" : "entfernt"}  ${path}`);
    if (!DRY) unlinkSync(path);
  }
}

for (const dir of unwantedDirs) {
  const path = join(ROOT, dir);
  try {
    statSync(path);
  } catch {
    continue; // nicht vorhanden — nichts zu tun
  }
  console.log(`  ${DRY ? "wäre entfernt" : "entfernt"}  ${path}/ (Ordner)`);
  removed += 1;
  if (!DRY) rmSync(path, { recursive: true, force: true });
}

walk(ROOT);

// ── Cache-Regel für die gehashten Dateien ────────────────────────────────
//
// Sie steht bewusst NICHT in der Haupt-.htaccess: <LocationMatch> ist dort
// verboten (Apache: "not allowed in <Directory> context" → 500 für die
// ganze Seite), und eine Endungs-Regel im selben Block würde mit der
// Bilder/Schriften-Regel kollidieren — die Schriften unter
// _next/static/media/ sind .woff2 und bekämen eine Woche statt eines
// Jahres. Apache mischt .htaccess von oben nach unten; die tiefere Datei
// gewinnt. Deshalb hier, als eigene Datei.
const STATIC_DIR = join(ROOT, "_next", "static");
const STATIC_HTACCESS = `# Erzeugt von scripts/clean-export.mjs — nicht von Hand ändern.
#
# Jeder Dateiname hier trägt einen Inhalts-Hash. Ändert sich der Inhalt,
# ändert sich der Name — die Datei darf deshalb dauerhaft im Cache bleiben.
# Überschreibt die Regeln der .htaccess im Wurzelverzeichnis.
<IfModule mod_headers.c>
  Header set Cache-Control "public, max-age=31536000, immutable"
</IfModule>
`;

if (!DRY && existsSync(STATIC_DIR)) {
  mkdirSync(STATIC_DIR, { recursive: true });
  writeFileSync(join(STATIC_DIR, ".htaccess"), STATIC_HTACCESS, "utf8");
  console.log(`  geschrieben  ${join(STATIC_DIR, ".htaccess")}`);
} else if (DRY && existsSync(STATIC_DIR)) {
  console.log(`  würde schreiben  ${join(STATIC_DIR, ".htaccess")}`);
}

console.log(
  removed === 0
    ? "clean-export: nichts zu entfernen"
    : `clean-export: ${removed} Datei(en), ${(bytes / 1024).toFixed(1)} KB${DRY ? " (Probelauf)" : ""}`,
);
