import type { ReactNode } from "react";

/**
 * Icon-Pfade als Name → SVG. Eine Strichstärke (1.3), ein Stil — kein Zoo
 * aus verschiedenen Sets. Datendateien referenzieren nur den Namen und
 * bleiben so serialisierbar.
 *
 * Nutzung: <Icon name="digital-bonds" /> oder ICON_PATHS[name] direkt.
 * Diese Datei steht bewusst auf der Ausnahmeliste des Token-Checks —
 * hier stehen die einzigen rohen SVG-Zahlen im Projekt.
 */
export const ICON_PATHS: Record<string, ReactNode> = {
  "digital-bonds": <path d="M3 5h18v14H3zM7 12h10M7 9h5M7 15h4" />,
  "tokenized-rwa": (
    <path d="M12 2l8.5 5.5v9L12 22l-8.5-5.5v-9L12 2zM3.5 7.5l8.5 5 8.5-5M12 12.5V22" />
  ),
  collateral: <path d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" />,
  stablecoins: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v10M9.5 9.5h5M9.5 14.5h5" />,
  "bank-money": <path d="M3 21h18M12 3L3 9h18L12 3zM6 9v12M12 9v12M18 9v12" />,
  "digital-funds": <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  repo: <path d="M7 16H3v-4M3 16a9 9 0 0 0 14.7 2.7M17 8h4v4M21 8A9 9 0 0 0 6.3 5.3" />,
  derivatives: <path d="M3 3v18h18M7 15l4-5 3 3 5-7" />,
  target: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 11.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z" />,
  rocket: <path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2c.9-.9.9-2.3 0-3.2a2.3 2.3 0 0 0-3 .2zM9.5 14.5L7 12l1-3.5A11 11 0 0 1 19 3a11 11 0 0 1-5.5 11L10 15zM14 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />,
  institution: <path d="M3 21h18M12 3L3 8h18L12 3zM6 8v13M10.5 8v13M13.5 8v13M18 8v13" />,
  code: <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" />,
  shield: <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6l8-3zM9 12l2 2 4-4" />,
  vote: <path d="M4 20h16M6 20V9l6-4 6 4v11M10 20v-5h4v5M12 9.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  // Runde 11: Gegenstück für Zurück-Navigationen (BackButton) — dieselbe
  // Geometrie gespiegelt, damit „zurück" und „weiter" gleich aussehen.
  "arrow-left": <path d="M19 12H5M11 18l-6-6 6-6" />,
  /*
    Runde 12: Abwärtspfeil für den „How it works"-Sprung in Hero und
    AboutHero — er zeigt auf die Sektion DARUNTER, nicht nach vorn.

    Exakt `arrow` um 90° gedreht ((x,y) → (24−y,x)): (5,12)→(12,5),
    (19,12)→(12,19), (13,6)→(18,13), (13,18)→(6,13). Damit tragen alle
    drei Richtungen dieselbe Strichlänge und denselben Spitzenwinkel,
    so wie `arrow-left` schon die Spiegelung ist.
  */
  "arrow-down": <path d="M12 5v14M6 13l6 6 6-6" />,
  check: <path d="M20 6L9 17l-5-5" />,
  /*
    Runde 6: eigener Schlüssel für „Network validators" im
    Netzwerk-Schaubild (NetworkDiagram.tsx) — NICHT `repo` wiederverwenden
    oder dessen Pfad ändern: derselbe Schlüssel trägt in use-cases.ts das
    Icon für „Repo & Securities Lending" (ein Finanzinstrument, andere
    Bedeutung als „Validator/Serverbetreiber"). `repo`s bisheriges
    Sync-Symbol war dort schon richtig — das kaputte/verzerrte Icon, das
    der Auftraggeber meinte, war seine Zweitverwendung im Schaubild.
    Zwei einfache Server-Riegel statt der beiden Kreisbögen.
  */
  server: <path d="M4 5h16v5H4zM4 14h16v5H4zM7.5 7.5h.01M7.5 16.5h.01" />,
  /*
    Runde 10: eigenes Plus statt des Text-Glyphs "+" in Accordion.tsx und
    UseCases.tsx. Ein Font-Zeichen hat je nach Schriftschnitt ungleich
    lange/nicht exakt zentrierte Striche — beim rotate(45deg) zu "×" wurde
    daraus sichtbar ein schiefes Kreuz. Zwei exakt gleich lange, zentrierte
    Striche hier lösen das unabhängig vom Schriftschnitt.
  */
  plus: <path d="M12 5v14M5 12h14" />,
};

export function Icon({
  name,
  size = 24,
  className,
}: {
  name: keyof typeof ICON_PATHS | (string & {});
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {ICON_PATHS[name] ?? null}
    </svg>
  );
}

/**
 * Massiver Zweitsatz — NUR für die Principles-Karten auf /about.
 *
 * Warum überhaupt zwei Sätze: Der Satz oben ist durchgehend auf dünne
 * Striche ausgelegt (1.3, kein Füllkörper). Auf den hellen Akzentkarten
 * verschwindet das — dort braucht es Gewicht. Statt den ganzen Satz
 * umzustellen (er trägt Netzwerk-Schaubild, Governance, Buttons und
 * Akkordeon, wo die feine Linie eine bewusste Entscheidung ist) steht
 * hier ein eigener, klar abgegrenzter Satz mit sechs Einträgen.
 *
 * Gemischt aus Flächen und dicken Strichen: Ein Bogen (Funksignal) und
 * spitze Winkel (Klammern) lassen sich als Fläche nicht sauber
 * beschreiben, als 2.4er-Strich mit runden Enden dagegen schon — und
 * optisch trägt beides gleich schwer.
 *
 * Schild und Wahlurne nutzen `fillRule="evenodd"`: die innere Figur ist
 * eine Aussparung im selben Pfad, kein zweites Element in der Farbe des
 * Untergrunds. So bleibt das Icon auf jedem Grund richtig.
 */
export const ICON_SOLID_PATHS: Record<string, ReactNode> = {
  /* Funksignal — „RL1 is live today": ein sendender Punkt, keine Rakete. */
  signal: (
    <g>
      <circle cx="12" cy="12" r="2.7" />
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M7.9 7.9a5.8 5.8 0 0 0 0 8.2" />
        <path d="M16.1 7.9a5.8 5.8 0 0 1 0 8.2" />
        <path d="M5 5a9.9 9.9 0 0 0 0 14" />
        <path d="M19 5a9.9 9.9 0 0 1 0 14" />
      </g>
    </g>
  ),

  /* Stecker — „EVM-compatible": passt in das, was schon da ist. */
  plug: (
    <g>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M9 2.5v5.2" />
        <path d="M15 2.5v5.2" />
        <path d="M12 17.6v3.9" />
      </g>
      <path d="M5.9 8.6h12.2v2.7a6.1 6.1 0 0 1-12.2 0V8.6z" />
    </g>
  ),

  /* Bankgebäude — „Compatible with the Eurosystem". */
  institution: (
    <g>
      <path d="M12 2.2 1.9 7.6v2.2h20.2V7.6L12 2.2z" />
      <path d="M4.1 11.3h2.7v7.2H4.1zM10.6 11.3h2.8v7.2h-2.8zM17.2 11.3h2.7v7.2h-2.7z" />
      <path d="M1.9 19.9h20.2v2.1H1.9z" />
    </g>
  ),

  /* Code-Klammern — „Integration via standard APIs". */
  brackets: (
    <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M9.1 7.4 4.6 12l4.5 4.6" />
      <path d="M14.9 7.4 19.4 12l-4.5 4.6" />
    </g>
  ),

  /* Schild mit Person — „Keep the key management and custody providers". */
  shield: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2.1 3.9 5.2v6.3c0 4.7 3.3 8.3 8.1 10 4.8-1.7 8.1-5.3 8.1-10V5.2L12 2.1zm0 5.4a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6zm0 5.7c-2.3 0-4.2 1.4-4.2 3 0 .6 2.1 1.5 4.2 1.5s4.2-.9 4.2-1.5c0-1.6-1.9-3-4.2-3z"
    />
  ),

  /* Wahlurne mit Stimmzettel — „Every member has one vote". */
  vote: (
    <g>
      {/* Der Zettel ist MASSIV, nicht ausgespart: als Rahmen mit Loch las
          er sich wie ein Koffergriff — im Rendering nachgeprüft. */}
      <path d="M8.5 2.2h7a1 1 0 0 1 1 1v8.1h-9V3.2a1 1 0 0 1 1-1z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.9 12.4h18.2a1.1 1.1 0 0 1 1.1 1.1v7.2a1.1 1.1 0 0 1-1.1 1.1H2.9a1.1 1.1 0 0 1-1.1-1.1v-7.2a1.1 1.1 0 0 1 1.1-1.1zm5.6 2.5h7a1.1 1.1 0 0 1 0 2.2h-7a1.1 1.1 0 0 1 0-2.2z"
      />
    </g>
  ),
};

/** Wie `Icon`, aber massiv. Siehe ICON_SOLID_PATHS. */
export function IconSolid({
  name,
  size = 20,
  className,
}: {
  name: keyof typeof ICON_SOLID_PATHS | (string & {});
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden
      className={className}
    >
      {ICON_SOLID_PATHS[name] ?? null}
    </svg>
  );
}
