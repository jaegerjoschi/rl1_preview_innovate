/**
 * Illustration neben dem SCE-Absatz auf /about (AboutIntro.tsx): acht
 * unterschiedlich große, unregelmäßig verteilte Quadrate gleichen sich
 * an, ordnen sich auf einem Kreis an, dann schließt sich Segment für
 * Segment die Verbindung zwischen ihnen — einmal herum, bis der Kreis
 * geschlossen ist. Die Mitte bleibt leer.
 *
 * Reine Strichzeichnung. Animiert werden ausschließlich Größe, Abstand,
 * Farbe und Deckkraft (nie Rotation, Pfad oder Filter) — dieselbe
 * Sprache wie ValueSymbols.tsx. `.sq`/`.arc`/`.k*`/`.g*` sind an
 * `AboutIntro.coop.css` gebunden, ausgelöst über `.is-in` auf dem
 * Section-Wrapper (siehe AboutIntro.tsx), nicht auf Hover.
 *
 * Nur EINE Instanz pro Seite — anders als bei ValueSymbols lohnt sich
 * ein separater <defs>-Block hier nicht, das Quadrat steht direkt in
 * dieser einen SVG.
 */
export function CooperativeVisual() {
  return (
    <svg
      className="coop__svg"
      viewBox="0 0 260 150"
      role="img"
      aria-label="Acht unterschiedlich große Quadrate werden gleich groß, ordnen sich auf einem Kreis an, und die Verbindung zwischen ihnen schließt sich einmal herum."
    >
      <defs>
        <g id="coop-sq">
          <rect className="sq" x="-20" y="-20" width="40" height="40" />
        </g>
      </defs>

      <path className="arc g0" d="M130,19 A56,56 0 0 1 169.6,35.4" />
      <path className="arc g1" d="M169.6,35.4 A56,56 0 0 1 186,75" />
      <path className="arc g2" d="M186,75 A56,56 0 0 1 169.6,114.6" />
      <path className="arc g3" d="M169.6,114.6 A56,56 0 0 1 130,131" />
      <path className="arc g4" d="M130,131 A56,56 0 0 1 90.4,114.6" />
      <path className="arc g5" d="M90.4,114.6 A56,56 0 0 1 74,75" />
      <path className="arc g6" d="M74,75 A56,56 0 0 1 90.4,35.4" />
      <path className="arc g7" d="M90.4,35.4 A56,56 0 0 1 130,19" />

      <use href="#coop-sq" className="k0" />
      <use href="#coop-sq" className="k1" />
      <use href="#coop-sq" className="k2" />
      <use href="#coop-sq" className="k3" />
      <use href="#coop-sq" className="k4" />
      <use href="#coop-sq" className="k5" />
      <use href="#coop-sq" className="k6" />
      <use href="#coop-sq" className="k7" />
    </svg>
  );
}
