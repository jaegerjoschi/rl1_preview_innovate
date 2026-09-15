import { Poppins, Roboto_Condensed } from "next/font/google";

/**
 * Zwei Familien, klar getrennte Aufgaben.
 *
 *   Roboto Condensed  →  Überschriften und Aussagen (Display)
 *   Poppins           →  Fließtext, Bedienelemente, Labels
 *
 * Dieselbe Paarung wie auf den bestehenden RL1-Seiten; die GRÖSSEN
 * stammen aber nicht von dort, sondern aus der Skala in globals.css.
 *
 * Zur Build-Zeit heruntergeladen und selbst ausgeliefert — kein
 * Google-Fonts-Aufruf beim Besucher (DSGVO), und die CSP darf
 * `font-src 'self'` behalten.
 *
 * Roboto Condensed liegt bei Google als Variable Font: ohne `weight`
 * kommt EINE Datei für alle Schnitte. Poppins gibt es nur in festen
 * Schnitten, die deshalb einzeln benannt werden müssen — 300 ist nicht
 * dabei, weil ein so leichter Schnitt auf schwarzem Grund als Fließtext
 * nicht trägt (siehe die Schnittregel in globals.css).
 *
 * SCHRIFTWECHSEL: hier die Instanz tauschen und in app/globals.css
 * --font-display bzw. --font-body auf die neue --font-*-Variable zeigen
 * lassen. Komponenten lesen nur die Tokens, nie eine Familie direkt.
 */
export const displayFont = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
  display: "swap",
  adjustFontFallback: true,
});

export const bodyFont = Poppins({
  subsets: ["latin"],
  // Runde 11: die Buttons laufen in Poppins Semibold (Button.tsx,
  // `font-semibold`) — 600 ist hier ohnehin dabei. Der zwischenzeitlich
  // ergänzte Schnitt 700 ist wieder raus: ihn trug nur der Button, und
  // eine ungenutzte Schriftdatei muss niemand laden.
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
  adjustFontFallback: true,
});
