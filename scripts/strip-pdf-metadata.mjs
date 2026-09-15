#!/usr/bin/env node
/**
 * Personenbezogene Metadaten aus den ausgelieferten PDFs entfernen.
 *
 * WARUM
 *
 * Word und PowerPoint schreiben beim Export das Konto mit, aus dem
 * exportiert wurde. In public/downloads/ stand dadurch:
 *
 *   /Author(hbenaoun@kpmg.com)          the-rl1-network.pdf
 *   /Author(Ben Aoun, Hichem)           rl1-at-a-glance.pdf
 *
 * Beide Dateien sind von /resources frei herunterladbar. Bei Material, das
 * an Presse und Institutionen geht, gehoert das entfernt — im Dokument
 * steht sonst eine Privatadresse, die auf der Seite selbst bewusst nicht
 * steht.
 *
 * WAS BLEIBT
 *
 * /Title bleibt: Der Titel erscheint im Reiter des PDF-Betrachters und in
 * Suchergebnissen, er ist gewollt. Die vielen /Title-Eintraege in der
 * zweiten Datei sind die Lesezeichen der Folien — ebenfalls Navigation,
 * keine Metadaten.
 *
 * WIE — und warum nicht einfach ersetzen
 *
 * Ein PDF traegt am Ende eine Querverweistabelle (xref) mit der Byte-
 * Position jedes Objekts. Wird die Datei auch nur um ein Byte kuerzer,
 * zeigen alle Offsets dahinter ins Leere und der Betrachter meldet die
 * Datei als beschaedigt.
 *
 * Deshalb wird **laengentreu** ersetzt: Aus
 *
 *   /Author(hbenaoun@kpmg.com)      26 Bytes
 *
 * wird
 *
 *   /Author()·················      26 Bytes  (· = Leerzeichen)
 *
 * Der Wert ist leer, die Laenge stimmt, und Leerraum zwischen
 * Dictionary-Eintraegen ist im PDF-Format bedeutungslos. Die Datei behaelt
 * ihre Groesse auf das Byte genau.
 *
 * Zwei Bereiche werden getrennt behandelt, damit nichts falsch trifft:
 *
 *   Info-Dictionary  nur AUSSERHALB von stream/endstream. Ein Zufallstreffer
 *                    in einem komprimierten Datenstrom wuerde diesen
 *                    zerstoeren.
 *   XMP              nur INNERHALB des <?xpacket?>-Bereichs. Der liegt per
 *                    Definition unkomprimiert vor, genau damit Werkzeuge ihn
 *                    an Ort und Stelle bearbeiten koennen.
 *
 * Aufruf:  node scripts/strip-pdf-metadata.mjs [--dry]
 *          laeuft automatisch als postbuild nach `next build`
 *
 * Arbeitet auf out/, nicht auf public/: Die Quelldateien bleiben unangetastet
 * (das Repository ist privat), und jedes PDF, das spaeter dazukommt, wird
 * ohne weiteres Zutun mitbehandelt.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "out";
const DRY = process.argv.includes("--dry");

/** Info-Dictionary: diese Schluessel werden geleert. /Title bleibt. */
const INFO_KEYS = ["Author", "Creator", "Producer", "Company", "Subject", "Keywords"];

/** XMP: diese Elemente werden geleert. dc:title bleibt. */
const XMP_TAGS = [
  "dc:creator",
  "xmp:CreatorTool",
  "pdf:Producer",
  "pdf:Author",
  "xmpMM:DocumentID",
  "xmpMM:InstanceID",
];

/** Bereiche zwischen `stream` und `endstream` — dort wird nicht angefasst. */
function streamRanges(buf) {
  const text = buf.toString("latin1");
  const ranges = [];
  const re = /\bstream\r?\n?/g;
  let m;
  while ((m = re.exec(text))) {
    const end = text.indexOf("endstream", m.index);
    if (end === -1) break;
    ranges.push([m.index, end + "endstream".length]);
    re.lastIndex = end;
  }
  return ranges;
}

const inside = (ranges, pos) => ranges.some(([a, b]) => pos >= a && pos < b);

/** Ersetzt `slice` an Position `pos` laengentreu durch `replacement` + Leerzeichen. */
function padReplace(text, pos, originalLength, replacement) {
  if (replacement.length > originalLength) return text; // waere laenger — nicht anfassen
  const padded = replacement + " ".repeat(originalLength - replacement.length);
  return text.slice(0, pos) + padded + text.slice(pos + originalLength);
}

function strip(file) {
  const before = readFileSync(file);
  let text = before.toString("latin1");
  const streams = streamRanges(before);
  const hits = [];

  // ── Info-Dictionary ────────────────────────────────────────────────────
  // PDF-Strings duerfen escapte Klammern enthalten: ( ... \( ... ) — das
  // Muster beruecksichtigt das, sonst endet der Treffer zu frueh.
  for (const key of INFO_KEYS) {
    const re = new RegExp(`/${key}\\s*\\((?:\\\\.|[^\\\\()])*\\)`, "g");
    let m;
    while ((m = re.exec(text))) {
      if (inside(streams, m.index)) continue;
      const value = m[0].slice(m[0].indexOf("(") + 1, -1);
      if (!value) continue;
      hits.push(`/${key}`);
      text = padReplace(text, m.index, m[0].length, `/${key}()`);
      re.lastIndex = m.index + m[0].length;
    }
  }

  // ── XMP ────────────────────────────────────────────────────────────────
  const xmpStart = text.indexOf("<?xpacket");
  const xmpEnd = text.lastIndexOf("<?xpacket end");
  if (xmpStart !== -1 && xmpEnd > xmpStart) {
    for (const tag of XMP_TAGS) {
      const re = new RegExp(`(<${tag}[^>]*>)([\\s\\S]*?)(</${tag}>)`, "g");
      let m;
      while ((m = re.exec(text))) {
        if (m.index < xmpStart || m.index > xmpEnd) continue;
        const innerText = m[2].replace(/<[^>]*>/g, "").trim();
        if (!innerText) continue;
        hits.push(tag);
        // Nur den Textinhalt leeren, die Struktur (rdf:Seq/rdf:li) bleibt —
        // gleiche Laenge, damit die Offsets stimmen.
        const cleaned = m[2].replace(
          />([^<]+)</g,
          (_, t) => ">" + " ".repeat(t.length) + "<",
        );
        const replacement = m[1] + cleaned + m[3];
        text = padReplace(text, m.index, m[0].length, replacement);
        re.lastIndex = m.index + m[0].length;
      }
    }
  }

  if (hits.length === 0) return null;

  const after = Buffer.from(text, "latin1");
  if (after.length !== before.length) {
    throw new Error(
      `${file}: Laenge haette sich geaendert (${before.length} -> ${after.length}) — abgebrochen, die Datei waere unlesbar geworden`,
    );
  }
  if (!DRY) writeFileSync(file, after);
  return hits;
}

let files = 0;
let fields = 0;

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(path);
    } else if (entry.name.toLowerCase().endsWith(".pdf")) {
      const hits = strip(path);
      if (hits) {
        files += 1;
        fields += hits.length;
        const size = statSync(path).size;
        console.log(
          `  ${DRY ? "wäre bereinigt" : "bereinigt"}  ${path} (${size} B, unverändert) — ${[...new Set(hits)].join(", ")}`,
        );
      }
    }
  }
}

walk(ROOT);

console.log(
  files === 0
    ? "strip-pdf-metadata: keine PDFs mit Metadaten"
    : `strip-pdf-metadata: ${files} PDF(s), ${fields} Feld(er)${DRY ? " (Probelauf)" : ""}`,
);
