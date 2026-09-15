import { Container, Section } from "@/app/components/ui/primitives";
import { IconSolid } from "@/app/components/ui/icons";
import { Reveal } from "@/app/components/motion/Reveal";
import { principles } from "@/app/data/principles";

/**
 * "Designed from day one for the realities of institutional finance in
 * regulated capital markets." — sechs nummerierte Karten.
 */
export default function Principles() {
  return (
    // Runde 10: zusätzliches !pb-* senkt das untere Padding unter den
    // tight-Wert — verkleinert die Sektion und verringert direkt den
    // Abstand zur folgenden BandCta ("See how membership actually
    // works."). mt-8/10 statt mt-12 vor dem Karten-Grid trägt ebenfalls
    // zur insgesamt niedrigeren Sektion bei.
    <Section
      label="Designed for institutional finance"
      size="tight"
      className="!pb-8 md:!pb-12"
    >
      <Container>
        <h2 className="max-w-4xl text-h2 text-ink">
          Designed from day one for the realities of institutional finance in regulated capital
          markets.
        </h2>

        <ul className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal
              as="li"
              key={p.n}
              delayIndex={i % 3}
              /* Runde 5: kleinere Karten bis einschließlich Tablet
                 (p-4, size-8) — sechs Karten in gap-4 wirkten dort zu
                 schwer gegen den jetzt kleineren Fließtext.

                 Runde 12: `card-metal` entfällt. Die Karte steht jetzt
                 flächig auf dem Akzent, ohne Rand und ohne Hover — der
                 Chrom-Verlauf, der Schatten und das mauszeigergeführte
                 Glanzlicht waren auf hellem Grund ohnehin kaum sichtbar.
                 Schwarze Tinte auf dem Akzent misst 12,4:1. */
              className="flex items-center gap-4 rounded-md bg-accent p-4 md:p-6"
            >
              {/* Runde 12: echter Kreis statt abgerundetem Quadrat, ohne
                  Rand — auf der hellen Karte trennt schon der Helligkeits-
                  sprung, ein zusätzlicher Strich wirkte doppelt gemoppelt. */}
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-tint-80 md:size-10">
                <IconSolid name={p.icon} size={18} className="text-accent-icon" />
              </span>
              {/* text-micro bis Tablet, leading-snug: die sechs Texte
                  (82-108 Zeichen) bleiben damit gemessen bei höchstens
                  drei Zeilen statt vier bis fünf. */}
              {/* Runde 12: Poppins Medium (500) statt Regular — auf dem
                  hellen Grund trug 400 den Text nicht mehr mit derselben
                  Präsenz wie weiß auf schwarz. Der Schnitt ist bereits
                  geladen (fonts.ts: 400/500/600), kostet also nichts. */}
              <p className="leading-snug text-micro font-medium text-accent-ink md:text-caption">
                {p.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
