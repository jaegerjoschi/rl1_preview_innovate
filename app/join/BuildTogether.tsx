import { Container, Section } from "@/app/components/ui/primitives";
import { Icon } from "@/app/components/ui/icons";
import { ScrollText } from "@/app/components/motion/ScrollText";
import { benefits } from "@/app/data/benefits";

/**
 * „Unlock the shared rail." — Einladungssatz links, was Mitgliedschaft
 * konkret bringt rechts.
 *
 * Die Argumente laufen beim Scrollen von halbem auf volles Weiß (derselbe
 * Wort-Scrub wie in der Story). Sie sind das eigentliche Verkaufsargument
 * der Seite und sollen sich aufbauen, statt fertig dazustehen.
 */
export function BuildTogether() {
  return (
    <Section id="benefits" tone="off-black">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-measure">
            <h2 className="text-h2 text-ink">Unlock the shared rail.</h2>
            <p className="mt-4 text-lead text-ink-3">
              Open to licensed banks, central banks, market infrastructure operators, custodians
              and regulated asset managers. Technology operators and observers join on other
              terms.
            </p>
          </div>

          <div>
            <p className="mb-5 text-label uppercase text-ink-3">You&rsquo;ll get</p>
            <ul className="flex flex-col gap-5">
              {benefits.map((b) => (
                <li key={b.label} className="flex items-start gap-3.5">
                  <Icon name="check" size={18} className="mt-1 shrink-0 text-success" />
                  <ScrollText
                    profile="late"
                    className="text-body-lg"
                    lead={b.label + "."}
                    rest={b.detail}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
