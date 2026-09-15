#!/usr/bin/env node
/**
 * Baut das Vorschaubild für Open Graph / LinkedIn.
 *
 * Warum ein Skript und keine Bilddatei im Repo: Das Bild soll aus den
 * Assets der Seite selbst entstehen — Hero-Motiv, Wortmarke, Schriften,
 * Farbtokens. Ändert sich der Hero, wird das Bild neu gebaut und ist
 * wieder stimmig. Eine einmal exportierte JPG driftet dagegen weg.
 *
 * 1200 × 630 ist die Größe, die LinkedIn, Slack und X gleichermaßen
 * verarbeiten; Facebook/LinkedIn schneiden nichts ab, X beschneidet auf
 * 2:1 — deshalb bleibt der Text innerhalb der sicheren Mitte.
 *
 * Aufruf:  node scripts/build-og-image.mjs
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer from "puppeteer";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "public/og/default.jpg");

const WIDTH = 1200;
const HEIGHT = 630;

/* Die Farbwerte stammen aus dem @theme-Block in app/globals.css. Sie sind
   hier bewusst dupliziert statt importiert: Das Skript läuft ohne Build-
   Pipeline, und drei Hex-Werte rechtfertigen keinen CSS-Parser. Bei einer
   Änderung der Marke sind sie mitzuziehen. */
const BG = "#000000";
const INK = "#ffffff";
const PERI = "#c0beea";

/** Bilder als data:-URI, damit die Seite ohne laufenden Server rendert. */
const dataUri = (relPath, mime) => {
  const abs = resolve(ROOT, "public", relPath);
  if (!existsSync(abs)) throw new Error(`Asset fehlt: ${abs}`);
  return `data:${mime};base64,${readFileSync(abs).toString("base64")}`;
};

const hero = dataUri("hero/hero-rail.jpg", "image/jpeg");

/* Das Logo wird INLINE eingebettet, nicht als <img>. Nur so lässt sich
   der viewBox nachträglich auf die echten Inhaltsgrenzen ziehen — als
   externes Bild ist der Inhalt für die Seite nicht messbar. Die XML-
   Deklaration muss dabei raus, sie darf nicht mitten im Dokument stehen. */
const logoSvg = readFileSync(resolve(ROOT, "public/rl1-logo/rl1-logo-light.svg"), "utf8")
  .replace(/<\?xml[^>]*\?>/, "")
  .trim();

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;500&family=Poppins:wght@400;500&display=swap">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; }
  body {
    background: ${BG};
    position: relative;
    overflow: hidden;
    font-family: Poppins, sans-serif;
    color: ${INK};
  }

  /* Hero-Motiv rechts, wie auf der Startseite. Der Verlauf darüber ist
     dasselbe Prinzip wie .hero-scrim: links dunkel genug für Text,
     rechts das Motiv frei. */
  .media {
    position: absolute; inset: 0;
    background: url("${hero}") right center / cover no-repeat;
  }
  .scrim {
    position: absolute; inset: 0;
    background: linear-gradient(
      100deg,
      ${BG} 0%,
      ${BG} 26%,
      rgba(0,0,0,.88) 42%,
      rgba(0,0,0,.45) 62%,
      rgba(0,0,0,.1) 100%
    );
  }

  .frame {
    position: relative;
    height: 100%;
    padding: 64px 72px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }

  /* Die Höhe setzt das Skript, nachdem es die echten Inhaltsgrenzen des
     SVG gemessen hat — der viewBox der Datei ist quadratisch und deutlich
     größer als die Marke darin. */
  .brand { display: flex; align-items: center; gap: 14px; }
  .brand svg { height: 38px; width: auto; display: block; }

  h1 {
    font-family: "Roboto Condensed", sans-serif;
    font-weight: 400;
    font-size: 76px;
    line-height: 1.02;
    letter-spacing: -0.015em;
    max-width: 15ch;
  }
  h1 span { display: block; }

  .sub {
    margin-top: 22px;
    font-size: 23px;
    line-height: 1.45;
    color: rgba(255,255,255,.8);
    max-width: 30ch;
  }

  .foot {
    display: flex; align-items: center; gap: 14px;
    font-size: 19px;
    color: rgba(255,255,255,.6);
  }
  .dot { width: 5px; height: 5px; border-radius: 50%; background: ${PERI}; }
</style>
</head>
<body>
  <div class="media"></div>
  <div class="scrim"></div>
  <div class="frame">
    <div class="brand">${logoSvg}</div>
    <div>
      <h1><span>One shared rail,</span><span>owned by its members.</span></h1>
      <p class="sub">A non-profit blockchain network for the European financial industry, owned as a cooperative.</p>
    </div>
    <div class="foot"><span>rl1.network</span><span class="dot"></span><span>Regulated Layer One SCE · Luxembourg</span></div>
  </div>
</body>
</html>`;

/*
  Puppeteer sucht standardmäßig genau die Chrome-Version, die zu seiner
  eigenen Version gehört. Liegt im Cache eine andere (weil ein anderes
  Projekt sie gezogen hat) oder gar keine, bricht der Start ab — obwohl
  ein brauchbarer Chrome vorhanden ist. Deshalb hier der Reihe nach:
  Cache-Verzeichnis, dann der system-installierte Chrome.
*/
const findChrome = () => {
  const cacheRoot = resolve(process.env.HOME ?? "", ".cache/puppeteer/chrome");
  if (existsSync(cacheRoot)) {
    const builds = readdirSync(cacheRoot).sort().reverse();
    for (const b of builds) {
      const bin = resolve(
        cacheRoot,
        b,
        "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
      );
      if (existsSync(bin)) return bin;
    }
  }
  const system = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (existsSync(system)) return system;
  return undefined; // dann soll Puppeteer es selbst versuchen
};

const browser = await puppeteer.launch({
  args: ["--no-sandbox"],
  executablePath: findChrome(),
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);

  /*
    Der viewBox der Logodatei ist quadratisch (566 × 566), die Marke darin
    füllt aber nur einen schmalen Streifen — bei fester Höhe wird die
    Wortmarke deshalb winzig. getBBox() liefert die echten Grenzen des
    gezeichneten Inhalts; damit wird der viewBox eng gezogen und das Logo
    füllt die ihm zugewiesene Höhe tatsächlich aus.
  */
  const box = await page.evaluate(() => {
    const svg = document.querySelector(".brand svg");
    if (!svg) return null;
    const b = svg.getBBox();
    const pad = 1;
    svg.setAttribute(
      "viewBox",
      `${b.x - pad} ${b.y - pad} ${b.width + pad * 2} ${b.height + pad * 2}`,
    );
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    return { w: Math.round(b.width), h: Math.round(b.height) };
  });
  if (!box) throw new Error("Logo-SVG nicht im Dokument gefunden");

  mkdirSync(dirname(OUT), { recursive: true });
  await page.screenshot({ path: OUT, type: "jpeg", quality: 88 });
} finally {
  await browser.close();
}

const kb = Math.round(execFileSync("stat", ["-f%z", OUT]).toString().trim() / 1024);
console.log(`og:image gebaut → public/og/default.jpg (${WIDTH}×${HEIGHT}, ${kb} KB)`);
