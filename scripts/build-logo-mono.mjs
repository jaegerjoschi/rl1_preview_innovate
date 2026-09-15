#!/usr/bin/env node
/**
 * Weiße Monoversionen der Institutslogos erzeugen.
 *
 * Alle Quelllogos sind undurchsichtige Quadrate — meist mit weißem, teils
 * mit farbigem Hintergrund (adesso blau, LBBW navy, NatWest lila …).
 * Auf schwarzem Grund ergibt "grayscale + opacity" deshalb graue Kacheln
 * statt freistehender Marken. Das ist ein Asset-Problem, kein CSS-Problem.
 *
 * Dieses Skript stanzt den Hintergrund frei und färbt die verbleibende
 * Marke rein weiß:
 *   1. sips normalisiert jedes Format auf 8-bit-RGBA-PNG
 *   2. die Hintergrundfarbe wird aus den vier Ecken bestimmt (Median)
 *   3. Alpha = Abstand des Pixels zur Hintergrundfarbe (weich, damit
 *      Kanten nicht ausfransen), Farbe = Weiß
 *   4. Ergebnis nach public/logos/mono/<name>.png
 *
 * Bewusst ohne Bibliothek: PNG lesen und schreiben ist mit Node-zlib
 * überschaubar, und das Projekt soll keine Bildabhängigkeit bekommen.
 * sips ist bereits Voraussetzung (siehe optimize-images.mjs).
 *
 * Aufruf:  node scripts/build-logo-mono.mjs [--dry]
 *
 * Die sechs farbig hinterlegten Logos prüft das Skript nicht inhaltlich —
 * es meldet sie am Ende zur Sichtkontrolle.
 */
import { execFileSync } from "node:child_process";
import { deflateSync, inflateSync } from "node:zlib";
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join, basename } from "node:path";

const DRY = process.argv.includes("--dry");
const SRC = "public/logos";
const OUT = join(SRC, "mono");

/* ── PNG lesen ──────────────────────────────────────────────────────── */

function readPng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("kein PNG");
  let pos = 8;
  let width = 0, height = 0, bitDepth = 0, colorType = 0;
  let palette = null, trns = null;
  const idat = [];

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === "PLTE") {
      palette = Buffer.from(data);
    } else if (type === "tRNS") {
      trns = Buffer.from(data);
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") break;
    pos += 12 + len;
  }

  if (bitDepth !== 8) throw new Error(`bitDepth ${bitDepth} nicht unterstützt`);
  // colorType 3 = Palette: ein Byte je Pixel, Farbe steht in PLTE
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  if (!channels) throw new Error(`colorType ${colorType} nicht unterstützt`);
  if (colorType === 3 && !palette) throw new Error("Palettenbild ohne PLTE");

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const px = Buffer.alloc(height * stride);
  let prev = Buffer.alloc(stride);

  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const cur = Buffer.alloc(stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? cur[i - channels] : 0;
      const b = prev[i];
      const c = i >= channels ? prev[i - channels] : 0;
      let v = line[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      cur[i] = v & 0xff;
    }
    cur.copy(px, y * stride);
    prev = cur;
  }

  // auf RGBA vereinheitlichen
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const s = i * channels;
    let r, g, b, a;
    if (colorType === 3) {
      const idx = px[s];
      r = palette[idx * 3]; g = palette[idx * 3 + 1]; b = palette[idx * 3 + 2];
      a = trns && idx < trns.length ? trns[idx] : 255;
    }
    else if (channels === 1) { r = g = b = px[s]; a = 255; }
    else if (channels === 2) { r = g = b = px[s]; a = px[s + 1]; }
    else if (channels === 3) { r = px[s]; g = px[s + 1]; b = px[s + 2]; a = 255; }
    else { r = px[s]; g = px[s + 1]; b = px[s + 2]; a = px[s + 3]; }
    rgba.set([r, g, b, a], i * 4);
  }
  return { width, height, rgba };
}

/* ── PNG schreiben ──────────────────────────────────────────────────── */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function writePng({ width, height, rgba }) {
  const stride = width * 4;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // Filter "none"
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ── Freistellen ────────────────────────────────────────────────────── */

/** Hintergrundfarbe aus den vier Ecken (Median je Kanal). */
function backgroundColor({ width, height, rgba }) {
  const at = (x, y) => {
    const i = (y * width + x) * 4;
    return [rgba[i], rgba[i + 1], rgba[i + 2]];
  };
  const corners = [at(0, 0), at(width - 1, 0), at(0, height - 1), at(width - 1, height - 1)];
  return [0, 1, 2].map((c) => {
    const v = corners.map((k) => k[c]).sort((a, b) => a - b);
    return Math.round((v[1] + v[2]) / 2);
  });
}

/**
 * Alpha aus dem Abstand zur Hintergrundfarbe. Der weiche Übergang
 * zwischen NEAR und FAR verhindert ausgefranste Kanten — ein harter
 * Schwellwert lässt Antialiasing-Pixel als Sägezahn stehen.
 */
const NEAR = 26;
const FAR = 78;

function knockout(img) {
  const [br, bg, bb] = backgroundColor(img);
  const { width, height, rgba } = img;
  const out = Buffer.alloc(rgba.length);
  let kept = 0;

  for (let i = 0; i < width * height; i++) {
    const s = i * 4;
    const d = Math.hypot(rgba[s] - br, rgba[s + 1] - bg, rgba[s + 2] - bb);
    let a = d <= NEAR ? 0 : d >= FAR ? 255 : Math.round(((d - NEAR) / (FAR - NEAR)) * 255);
    a = Math.round((a * rgba[s + 3]) / 255);
    if (a > 0) kept++;
    out.set([255, 255, 255, a], s); // Marke wird rein weiß
  }

  return { img: { width, height, rgba: out }, bg: [br, bg, bb], coverage: kept / (width * height) };
}

/* ── Lauf ───────────────────────────────────────────────────────────── */

const tmp = join(tmpdir(), `rl1-mono-${process.pid}`);
mkdirSync(tmp, { recursive: true });
if (!DRY) mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter((f) => /\.(png|jpe?g|avif)$/i.test(f));
const review = [];

for (const file of files) {
  const name = basename(file, extname(file));
  const norm = join(tmp, `${name}.png`);
  try {
    execFileSync("sips", ["-s", "format", "png", join(SRC, file), "--out", norm], {
      stdio: "ignore",
    });
    const { img, bg, coverage } = knockout(readPng(readFileSync(norm)));
    const isWhiteBg = bg[0] > 235 && bg[1] > 235 && bg[2] > 235;

    if (!DRY) writeFileSync(join(OUT, `${name}.png`), writePng(img));

    // Zu wenig oder zu viel übrig heißt: die Ecken waren nicht der
    // Hintergrund, oder die Marke selbst hat Hintergrundfarbe.
    const suspicious = coverage < 0.02 || coverage > 0.55 || !isWhiteBg;
    if (suspicious) review.push({ name, bg: `rgb(${bg.join(",")})`, coverage });

    console.log(
      `  ${suspicious ? "⚠" : "✓"} ${name.padEnd(24)} bg=rgb(${bg.join(",")})`.padEnd(52) +
        `${(coverage * 100).toFixed(1)} % Deckung`,
    );
  } catch (err) {
    console.log(`  ✖ ${name}: ${err.message}`);
    review.push({ name, bg: "—", coverage: 0 });
  }
}

rmSync(tmp, { recursive: true, force: true });

if (review.length > 0) {
  console.log(`\n⚠  Sichtkontrolle nötig (${review.length}):`);
  for (const r of review) console.log(`   ${r.name} — ${r.bg}, ${(r.coverage * 100).toFixed(1)} %`);
  console.log("   Diese Quellen haben keinen weißen Hintergrund oder ein");
  console.log("   auffälliges Ergebnis. Am besten durch eine echte SVG ersetzen.");
}
console.log(DRY ? "\n(dry run — nichts geschrieben)" : `\nGeschrieben nach ${OUT}/`);
