import { Container, Section } from "@/app/components/ui/primitives";
import { Button } from "@/app/components/ui/Button";

/**
 * Abschließendes CTA. Der Periwinkle-Verlauf ist in Runde 2 entfallen —
 * er zog die Aufmerksamkeit von der Handlung ab und zwang den Text in
 * einen Kontrastbereich, in dem Weiß nicht sauber lesbar war.
 */
export function BandCta({
  title,
  body,
  actions,
  size,
  className,
}: {
  title: string;
  body: string;
  actions: { label: string; href: string; variant?: "primary" | "outline" | "flat" }[];
  size?: "default" | "compact" | "tight";
  /**
   * Runde 10: additiv, für den einen Aufruf auf /about, der oben etwas
   * weniger und unten deutlich mehr Abstand braucht als der generische
   * `size`-Wert liefert — der Rest der Komponente bleibt unverändert
   * wiederverwendbar.
   */
  className?: string;
}) {
  return (
    // Runde 7: minHeight="none" — Section erzwingt sonst per Default
    // ("screen") eine volle Bildschirmhöhe, egal wie klein die Polsterung
    // (size) ist. Für ein abschließendes CTA-Band war das nie beabsichtigt
    // und ist genau der Grund, warum die Sektion trotz size="tight" noch
    // zu hoch wirkte.
    <Section label={title} size={size} minHeight="none" className={className}>
      <Container>
        <h2 className="text-h2 text-ink">{title}</h2>
        <p className="mt-4 max-w-measure text-lead text-ink-3">{body}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          {actions.map((a) => (
            <Button key={a.href} href={a.href} variant={a.variant ?? "primary"}>
              {a.label}
            </Button>
          ))}
        </div>
      </Container>
    </Section>
  );
}
