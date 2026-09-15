import { Container, Section } from "@/app/components/ui/primitives";
import { Reveal, RevealLines } from "@/app/components/motion/Reveal";
import { EnquiryForm } from "./EnquiryForm";

/**
 * Kopf der Kontaktseite ("Let's Talk"). Zwei Spalten: links die
 * Einladung, rechts das Formular — das ist die Haupthandlung.
 *
 * Mail- und LinkedIn-Link standen bis Runde 2 links unten. Sie führten
 * an dem Formular vorbei, das die Seite eigentlich ausmacht, und sind
 * deshalb entfallen — der Weg über LinkedIn steht weiterhin im Footer.
 */
export function JoinTop() {
  return (
    <Section label="Contact">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
          <div>
            <RevealLines as="h1" className="text-h1 text-ink" lines={["Let's Talk"]} />
            <Reveal delayIndex={1} className="mt-6">
              <p className="max-w-measure text-body text-ink-3">
                Tell us where your institution stands. Together, we&rsquo;ll figure out how you
                take part in shaping Europe&rsquo;s digital capital markets.
              </p>
            </Reveal>
          </div>

          <Reveal delayIndex={3}>
            <EnquiryForm />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
