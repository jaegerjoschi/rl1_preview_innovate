import { Container, Section } from "@/app/components/ui/primitives";
import { Accordion } from "@/app/components/ui/Accordion";
import { Button } from "@/app/components/ui/Button";
import { faq } from "@/app/data/faq";

/**
 * FAQ. Der Periwinkle-Verlauf ist in Runde 2 entfallen (reines Schwarz,
 * eckige Zeilen). Die Antworten der Startseite sind noch Platzhalter
 * (faq.home[*].draft).
 *
 * Eigene FAQPage-JSON-LD gibt die jeweilige Seite aus, nicht diese
 * Komponente — damit Startseite und Join-Seite getrennte Strukturdaten
 * haben.
 */
export default function Faq({
  page = "home",
  id = "faq",
}: {
  page?: "home" | "join";
  id?: string;
}) {
  const items = faq[page].map((f) => ({ q: f.q, a: f.a }));

  return (
    <Section id={id} label="Frequently asked questions">
      <Container>
        {/*
          Runde 6: kein max-w-3xl mehr — die Sektion nutzt die volle
          Containerbreite wie alle anderen (Runde 5 hatte sie extra
          verschmälert, jetzt der umgekehrte Wunsch). Die Zeilenlänge der
          ANTWORTEN bleibt trotzdem im HIG-Korridor: max-w-measure sitzt
          am Antwort-Absatz selbst (Accordion.tsx), nicht am Block.
        */}
        <h2 className="text-h2 text-ink">FAQ</h2>
        {/* Runde 8: ohne defaultOpen — alle Fragen stehen zu, die Sektion
            beginnt als reine Liste statt mit einer schon offenen Antwort. */}
        <Accordion className="mt-8" items={items} />
        {/* Ein echter Button statt eines Textlinks — die Sektion
            endet sonst als einzige auf einem Pfeil-Link statt einem
            erkennbaren Abschluss-CTA wie überall sonst auf der Seite. */}
        <div className="mt-10">
          <Button href="/join" variant="outline">
            Got more questions?
          </Button>
        </div>
      </Container>
    </Section>
  );
}
