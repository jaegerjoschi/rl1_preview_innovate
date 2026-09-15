import { Accordion } from "@/app/components/ui/Accordion";
import type { SpecialItem } from "@/app/data/special";

/** Variante A: aufklappbare Boxen mit "+"-Präfix. */
export function SpecialAccordion({ items }: { items: SpecialItem[] }) {
  return (
    <Accordion
      items={items.map((it) => ({
        q: it.title,
        a: it.body,
      }))}
      defaultOpen={0}
    />
  );
}
