import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Statischer Export — wie heute auf rl1.network ausgeliefert.
   * `next build` erzeugt den Ordner `out/`, der 1:1 auf den Webserver geht.
   *
   * Folge daraus: es gibt keinen Node-Prozess, der HTTP-Header setzen oder
   * Formulare entgegennehmen könnte. Die Sicherheits-Header liegen deshalb
   * als fertiges Snippet unter deploy/security-headers.conf und werden am
   * Webserver eingespielt; die Content-Security-Policy steht zusätzlich als
   * Meta-Tag in app/layout.tsx.
   */
  output: "export",

  /** Erzeugt /pfad/index.html — entspricht dem Verhalten der Live-Seite. */
  trailingSlash: true,

  /**
   * GitHub Pages liefert ein Projekt-Repo unter /<repo-name>/ aus, nicht
   * unter der Domain-Wurzel — ohne das hier zeigen alle absoluten Pfade
   * (Assets, interne Links) ins Leere.
   */
  basePath: "/rl1_preview_innovate",
  assetPrefix: "/rl1_preview_innovate",

  /**
   * Ohne Node-Laufzeit gibt es keine Bildoptimierung zur Auslieferung.
   * Die Bilder werden stattdessen einmalig beim Einpflegen komprimiert
   * (siehe scripts/optimize-images.mjs).
   */
  images: { unoptimized: true },

  /** Verrät die eingesetzte Next-Version nicht im Antwort-Header. */
  poweredByHeader: false,
};

export default nextConfig;
