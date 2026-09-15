/**
 * Bildsprache der "Our Values"-Karten (Drivers.tsx): drei Formen, mehr
 * nicht — Quadrat (ein Mitglied), Linie (die Schiene), Halbkreis (das
 * Regelwerk darüber). Reine Strichzeichnung, Farbe kommt ausschließlich
 * aus den CSS-Tokens in Drivers.values.css.
 *
 * `ValueSymbols` legt die wiederverwendeten Grundformen einmal pro Seite
 * ab (nicht pro Karte); `ValueVisual` wählt darüber die sechs Animationen
 * je Karte aus. Bewegt werden nur Größe, Abstand, Farbe und Deckkraft —
 * nie Rotation, Pfad oder Filter.
 */

export type ValueVariant =
  | "trust"
  | "neutrality"
  | "autonomy"
  | "interoperability"
  | "cooperation"
  | "compliance";

export function ValueSymbols() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        <g id="sq">
          <rect className="sq" x="-20" y="-40" width="40" height="40" />
        </g>
        <path id="domeFill" d="M -100,0 A 100,100 0 0 1 100,0 Z" />
        <path id="domeArc" d="M -100,0 A 100,100 0 0 1 100,0" />
      </defs>
    </svg>
  );
}

function TrustVisual() {
  return (
    <svg
      className="stage"
      viewBox="0 0 260 150"
      role="img"
      aria-label="Eine geschlossene Kuppel über drei Quadraten wird durchsichtig."
    >
      <line className="rail" x1="40" y1="120" x2="220" y2="120" />
      <use href="#sq" transform="translate(84,120) scale(.8)" />
      <use href="#sq" transform="translate(130,120) scale(.8)" />
      <use href="#sq" transform="translate(176,120) scale(.8)" />
      <g transform="translate(130,120) scale(.78)">
        <use href="#domeFill" className="dm t-fill" />
        <use href="#domeArc" className="dm-line" />
      </g>
    </svg>
  );
}

function NeutralityVisual() {
  return (
    <svg
      className="stage"
      viewBox="0 0 260 150"
      role="img"
      aria-label="Vier ungleich große Quadrate werden gleich groß und gleich weit auseinander."
    >
      <line className="rail" x1="34" y1="120" x2="226" y2="120" />
      <use href="#sq" className="n1" />
      <use href="#sq" className="n2" />
      <use href="#sq" className="n3" />
      <use href="#sq" className="n4" />
    </svg>
  );
}

function AutonomyVisual() {
  return (
    <svg
      className="stage"
      viewBox="0 0 260 150"
      role="img"
      aria-label="Zwei Quadrate gleiten auseinander, die Linie trägt weiter."
    >
      <line className="rail" x1="26" y1="120" x2="234" y2="120" />
      <use href="#sq" className="a1" />
      <use href="#sq" className="a2" />
    </svg>
  );
}

function InteroperabilityVisual() {
  return (
    <svg
      className="stage"
      viewBox="0 0 260 150"
      role="img"
      aria-label="Das mittlere Linienstück wird weiß, ein Element wechselt unterwegs den Tonwert."
    >
      <line className="rail" x1="26" y1="120" x2="92" y2="120" />
      <line className="rail i-mid" x1="92" y1="120" x2="168" y2="120" />
      <line className="rail" x1="168" y1="120" x2="234" y2="120" />
      <use href="#sq" transform="translate(70,120) scale(.8)" />
      <use href="#sq" transform="translate(190,120) scale(.8)" />
      <g className="pkt">
        <rect x="-5" y="-10" width="10" height="10" />
      </g>
    </svg>
  );
}

function CooperationVisual() {
  return (
    <svg
      className="stage"
      viewBox="0 0 260 150"
      role="img"
      aria-label="Ein viertes Quadrat tritt ein, die anderen rücken auf, der Halbkreis wächst mit."
    >
      <line className="rail" x1="26" y1="120" x2="248" y2="120" />
      <use href="#sq" className="co1" />
      <use href="#sq" className="co2" />
      <use href="#sq" className="co3" />
      <use href="#sq" className="co4" />
      <g className="co-dome tf">
        <use href="#domeArc" className="dm-line" />
      </g>
    </svg>
  );
}

function ComplianceVisual() {
  return (
    <svg
      className="stage"
      viewBox="0 0 260 150"
      role="img"
      aria-label="Zwei Halbkreise pulsieren versetzt über drei verbundenen Quadraten, eine Verbindung fällt aus, die beiden anderen übernehmen."
    >
      <line className="rail" x1="30" y1="128" x2="230" y2="128" style={{ opacity: 0.5 }} />
      <line className="rail cs-main" x1="92" y1="128" x2="168" y2="128" />
      <line className="rail cs-by" x1="90" y1="124" x2="118" y2="98" />
      <line className="rail cs-by" x1="170" y1="124" x2="142" y2="98" />
      <use href="#sq" transform="translate(130,96) scale(.62)" />
      <use href="#sq" transform="translate(78,128) scale(.62)" />
      <use href="#sq" transform="translate(182,128) scale(.62)" />
      <g transform="translate(130,128) scale(.84)">
        <use href="#domeArc" className="dm-line cs-inner" />
      </g>
      <g transform="translate(130,128) scale(1.02)">
        <use href="#domeArc" className="dm-line cs-outer" />
      </g>
    </svg>
  );
}

export function ValueVisual({ variant }: { variant: ValueVariant }) {
  switch (variant) {
    case "trust":
      return <TrustVisual />;
    case "neutrality":
      return <NeutralityVisual />;
    case "autonomy":
      return <AutonomyVisual />;
    case "interoperability":
      return <InteroperabilityVisual />;
    case "cooperation":
      return <CooperationVisual />;
    case "compliance":
      return <ComplianceVisual />;
  }
}
