#!/usr/bin/env node
/**
 * Prebuild-Wächter für das Designsystem.
 *
 * Bricht den Build ab, wenn in app/**\/*.tsx ein roher Hexwert oder eine
 * arbiträre Tailwind-Klasse für Farbe / Schriftgröße / Radius / Abstand
 * steht. Genau diese Werte gehören in den @theme-Block von
 * app/globals.css und nirgends sonst — sonst wachsen die 13
 * Schriftgrößen des Figma-Entwurfs binnen eines Monats zurück.
 *
 * Erlaubt bleiben einmalige Maßangaben (w-, h-, size-, min-/max-, top-,
 * inset-, grid-cols-, translate-, aspect- …) und die Ausnahmeliste unten.
 *
 * Warnt zusätzlich (ohne Abbruch), solange ein Testimonial `draft` trägt.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "app";
// app/layout.tsx: der Preloader (#rl1-pre) muss sichtbar sein, bevor das
// kompilierte Stylesheet garantiert geladen ist — er darf sich deshalb
// nicht auf @theme-Tokens verlassen, sondern braucht bewusst Literale.
// Nur diese Preview-Kopie hat einen Preloader; rl1-merged nicht.
const ALLOW_FILES = new Set(["app/components/ui/icons.tsx", "app/layout.tsx"]);

// Verbotene Muster: roher Hex + arbiträre Werte für Farbe/Größe/Abstand
const HEX = /(?:bg|text|border|fill|stroke|from|via|to|shadow|ring|outline|decoration|accent)-\[#[0-9a-fA-F]{3,8}\]|(?<![\w-])#[0-9a-fA-F]{3,8}\b/;
const ARBITRARY = /(?:^|[\s"'`(])(?:text|rounded|p[xytrbl]?|m[xytrbl]?|gap|leading|tracking|font)-\[[^\]]+\]/;

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === "_archive" || name === "node_modules") continue;
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (p.endsWith(".tsx")) files.push(p);
  }
})(ROOT);

const hits = [];
for (const file of files) {
  if (ALLOW_FILES.has(file)) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    const t = line.trimStart();
    if (t.startsWith("*") || t.startsWith("//")) return;
    // Next-Metadata: themeColor MUSS ein Literal sein, keine CSS-Klasse.
    if (/themeColor/.test(line)) return;
    if (HEX.test(line) || ARBITRARY.test(line)) {
      hits.push(`${file}:${i + 1}  ${line.trim().slice(0, 100)}`);
    }
  });
}

// Draft-Zitate: nur warnen
try {
  const t = readFileSync("app/data/testimonials.ts", "utf8");
  if (/draft:\s*true/.test(t)) {
    console.warn(
      "\x1b[33m⚠  Platzhalter-Zitate aktiv (draft: true in app/data/testimonials.ts).\x1b[0m",
    );
  }
} catch {}

if (hits.length > 0) {
  console.error("\x1b[31m✖ Rohe Werte in TSX — gehören in @theme (app/globals.css):\x1b[0m");
  for (const h of hits) console.error("  " + h);
  process.exit(1);
}

console.log("\x1b[32m✓ Token-Check bestanden.\x1b[0m");
