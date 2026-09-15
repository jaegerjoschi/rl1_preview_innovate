import { ScrollText } from "@/app/components/motion/ScrollText";
import type { SpecialItem } from "@/app/data/special";

/**
 * Variante C: zentrierte Typo, jeder Block baut sich beim Scrollen auf
 * (ScrollText). Das Visual fehlt im Entwurf noch — hier steht nur der
 * Textaufbau.
 */
export function SpecialScroll({ items }: { items: SpecialItem[] }) {
  return (
    <div className="mx-auto flex max-w-measure flex-col gap-24 text-center">
      {items.map((it) => (
        <div key={it.id} className="flex flex-col gap-4">
          <h3 className="text-h2 text-ink">{it.title}</h3>
          <ScrollText lead="" rest={it.body} className="text-lead" />
        </div>
      ))}
    </div>
  );
}
