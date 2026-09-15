#!/usr/bin/env node
/**
 * Textdateien im Export einmalig vorkomprimieren.
 *
 * Beim statischen Export steht jeder Byte zur Build-Zeit fest. Ein Server,
 * der bei jeder Anfrage neu gzippt, rechnet also bei jedem Besucher dasselbe
 * Ergebnis noch einmal aus — und zwar auf einer niedrigen Stufe, weil er es
 * schnell braucht. Hier ist Zeit im Überfluss: Stufe 9 bzw. Brotli-Qualität
 * 11 kosten im Build ein paar Sekunden und sparen bei jedem Abruf Bytes.
 *
 * Erzeugt wird NEBEN jeder Datei eine .gz und eine .br. Der Server liefert
 * sie aus, wenn er danach sucht:
 *
 *   nginx   gzip_static on;     (im offiziellen Image enthalten — steht in
 *                                deploy/nginx.conf schon eingeschaltet)
 *           brotli_static on;   (braucht das Modul ngx_brotli, im
 *                                offiziellen Image NICHT enthalten)
 *   Apache  mod_deflate + eine RewriteRule, siehe
 *           deploy/WEBSERVER-UEBERGABE.md
 *
 * Findet der Server die Dateien nicht, sind sie tote Fracht im Export und
 * sonst nichts — sie werden nie ausgeliefert, weil niemand sie verlinkt.
 * Kaputt gehen kann dabei nichts.
 *
 * Aufruf:  node scripts/precompress.mjs [--dry]
 *          läuft automatisch als postbuild nach `pnpm build`
 */

import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import { readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const DRY = process.argv.includes("--dry");
const ROOT = "out";

/**
 * Nur Textformate. Bilder, Schriften und PDFs sind bereits komprimiert —
 * sie noch einmal durch gzip zu schicken kostet Rechenzeit und macht sie
 * im Zweifel größer.
 *
 * .woff2 fehlt hier bewusst: das Format bringt Brotli schon eingebaut mit.
 */
const TEXT = new Set([".html", ".css", ".js", ".mjs", ".json", ".svg", ".xml", ".txt"]);

/** Unter dieser Größe lohnt der zusätzliche Datei-Overhead nicht. */
const MIN_BYTES = 1024;

/** Mindestens so viel muss die komprimierte Fassung einsparen. */
const MIN_SAVING = 0.1;

const kb = (bytes) => (bytes / 1024).toFixed(1);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.isFile()) yield path;
  }
}

let files = 0;
let rawTotal = 0;
let gzTotal = 0;
let brTotal = 0;
let skipped = 0;

try {
  statSync(ROOT);
} catch {
  console.error(`Kein Ordner "${ROOT}" — erst \`pnpm build\` laufen lassen.`);
  process.exit(1);
}

for (const path of walk(ROOT)) {
  const ext = extname(path).toLowerCase();

  // Ergebnisse eines früheren Laufs: wegräumen, sonst bleiben verwaiste
  // .gz-Dateien liegen, wenn ihre Quelle beim nächsten Build wegfällt.
  if (ext === ".gz" || ext === ".br") {
    if (!DRY) unlinkSync(path);
    continue;
  }

  if (!TEXT.has(ext)) continue;

  const raw = readFileSync(path);
  if (raw.length < MIN_BYTES) {
    skipped++;
    continue;
  }

  const gz = gzipSync(raw, { level: 9 });
  const br = brotliCompressSync(raw, {
    params: {
      [constants.BROTLI_PARAM_QUALITY]: 11,
      [constants.BROTLI_PARAM_SIZE_HINT]: raw.length,
    },
  });

  if (gz.length > raw.length * (1 - MIN_SAVING)) {
    skipped++;
    continue;
  }

  files++;
  rawTotal += raw.length;
  gzTotal += gz.length;
  brTotal += br.length;

  if (!DRY) {
    writeFileSync(`${path}.gz`, gz);
    writeFileSync(`${path}.br`, br);
  }
}

const pct = (n) => Math.round((1 - n / rawTotal) * 100);

console.log(
  `Vorkomprimiert: ${files} Dateien` +
    (skipped ? `, ${skipped} übersprungen (zu klein oder nicht komprimierbar)` : "") +
    (DRY ? "  [Probelauf, nichts geschrieben]" : ""),
);
if (files > 0) {
  console.log(`  roh    ${kb(rawTotal)} KB`);
  console.log(`  gzip   ${kb(gzTotal)} KB  (−${pct(gzTotal)} %)`);
  console.log(`  brotli ${kb(brTotal)} KB  (−${pct(brTotal)} %)`);
}
