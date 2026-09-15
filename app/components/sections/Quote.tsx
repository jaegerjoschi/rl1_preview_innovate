import { Container, Section } from "@/app/components/ui/primitives";
import { Portrait } from "@/app/components/ui/Portrait";
import { Button } from "@/app/components/ui/Button";
import { Reveal } from "@/app/components/motion/Reveal";
import { homeQuote } from "@/app/data/quote";

/**
 * Statement eines Aufsichtsratsmitglieds. Der Wortlaut ist noch
 * Platzhalter (homeQuote.draft) — der Prebuild-Check warnt, solange das
 * so ist.
 */
export default function Quote() {
  return (
    /*
      Runde 10: minHeight="none" statt des geerbten Defaults "screen" —
      der Zitat-Block braucht keine volle Bildschirmhöhe.

      Runde 11: asymmetrisches Polster, damit das Zitat optisch MITTIG
      zwischen seinen Nachbarn steht. Gemessen bei 1440×900 stand es
      vorher bei 138px Abstand nach oben gegen 328px nach unten, aus zwei
      Gründen:
        • Oben zieht die Ecosystem-Sektion ihre Logo-Wolke per
          `absolute inset-0` bis an die eigene Unterkante — ihr Polster
          erzeugt dort keinen sichtbaren Abstand.
        • Unten liegen zwischen Zitat und „Our Values"-Überschrift nicht
          nur die beiden Sektionspolster, sondern zusätzlich rund 200px
          Leerraum aus der klebenden Drivers-Bühne: sie ist 100svh hoch
          und zentriert ihren Inhalt darin.
      Der zweite Anteil hängt an der Fensterhöhe und lässt sich mit einem
      festen Wert nicht für jede Höhe exakt ausgleichen; die Werte hier
      sind auf den üblichen Desktop-Bereich gemessen (bei 900px
      Fensterhöhe gehen beide Abstände auf rund 300px auf).
    */
    <Section
      label="Quote"
      size="tight"
      minHeight="none"
      className="!pt-48 !pb-6 md:!pt-56 md:!pb-8"
    >
      <Container>
        {/* Runde 6: zwei getrennte Reveals mit Versatz statt eines
            einzigen um den ganzen Block — ein einzelnes Reveal um
            Portrait+Text war als Bewegung kaum wahrnehmbar (beide
            erscheinen gleichzeitig, wirkt wie ein harter Schnitt).
            Runde 7: deutlicherer Versatz (0/4 statt 0/1) und größerer
            Bewegungsweg (.reveal--strong) — sollte sich als zwei klar
            getrennte Schritte lesen, nicht als kaum wahrnehmbare
            Überlappung. */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-16">
          <Reveal delayIndex={0} className="reveal--strong">
            <Portrait
              src={homeQuote.photo}
              name={homeQuote.name}
              size={120}
              className="shrink-0"
            />
          </Reveal>
          <Reveal delayIndex={4} className="reveal--strong flex flex-col gap-4">
            <blockquote className="text-lead italic text-ink">
              &ldquo;{homeQuote.quote}&rdquo;
            </blockquote>
            <div className="text-body">
              <p className="text-ink">{homeQuote.name}</p>
              <p className="text-ink-2">
                {homeQuote.role}
                {homeQuote.org ? `, ${homeQuote.org}` : ""}
              </p>
            </div>
            {/* Runde 10: Flatbutton statt ArrowLink, Ziel jetzt die
                "The Regulated Layer One Network"-Sektion (id="network",
                NetworkRoles.tsx) statt #governance — passender zu "die
                Menschen hinter RL1". */}
            <Button href="/about#network" variant="flat" className="mt-2 self-start">
              Meet the people behind RL1
            </Button>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
