"use client";

import { useId, useState } from "react";
import { cn } from "@/app/lib/cn";
import { Icon } from "@/app/components/ui/icons";

export type AccordionEntry = {
  q: string;
  a: React.ReactNode;
};

/**
 * Eine headless Accordion-Implementierung für FAQ, die "special"-
 * Variante A und die About-Netzwerkzeilen.
 *
 * <button aria-expanded> + <div role="region">, +/−-Glyph.
 * Die Höhe animiert über grid-template-rows: 0fr → 1fr — die eine
 * dokumentierte Ausnahme von der reinen transform/opacity-Regel, weil
 * <details> die Höhe über Browser hinweg noch nicht zuverlässig
 * animiert. Die Region bleibt im DOM (nur zusammengefaltet), damit
 * Screenreader-Suche und Ctrl+F sie finden.
 *
 * Bewegung nach Emil Kowalskis Regeln: Transition statt Keyframes (damit
 * schnelles Auf-und-Zu sauber umlenkt statt neu zu starten), 220 ms,
 * starke ease-out-Kurve, Höhe und Deckkraft gekoppelt, Druckfeedback auf
 * der Zeile. Kein ease-in — das verzögert genau den Moment, in dem man
 * am genauesten hinsieht.
 */
export function Accordion({
  items,
  defaultOpen,
  className,
}: {
  items: AccordionEntry[];
  /** Index, der initial offen ist. Ohne Angabe: alle zu. */
  defaultOpen?: number;
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen ?? null);
  const baseId = useId();

  return (
    /*
      Zeilen statt gefüllter Kästen. bg-tint-20 sind 20 % Weiß — sieben
      solcher Flächen untereinander waren der Hauptgrund, warum die
      Sektion so laut wirkte. Eine Haarlinie je Zeile trennt genauso
      gut und tritt zurück.
    */
    <div className={cn("flex flex-col border-t border-hairline", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="overflow-hidden border-b border-hairline">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${baseId}-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start gap-6 py-5 text-left transition-transform duration-150 ease-hover active:scale-[0.99]"
              >
                {/* Runde 5: text-body statt text-body-lg — die FAQ-Sektion
                    stand insgesamt zu groß gegen ihre neue Breite (max-w-3xl
                    in Faq.tsx). */}
                <span className="flex-1 text-body text-ink">{item.q}</span>
                {/* Rechts, auf Höhe der ersten Zeile. Dreht sich zum ×
                    statt hart umzuspringen — ein Zeichen, das seinen
                    Zustand zeigt, statt ihn auszutauschen. Echtes SVG
                    (icons.tsx) statt Text-Glyph: ein Font-"+" ist beim
                    Drehen sichtbar schief, ein gezeichnetes Plus nicht. */}
                <span
                  aria-hidden
                  className="mt-0.5 w-4 shrink-0 text-accent transition-transform duration-200 ease-out-expo"
                  style={{ transform: isOpen ? "rotate(45deg)" : undefined }}
                >
                  <Icon name="plus" size={16} />
                </span>
              </button>
            </h3>
            <div
              id={`${baseId}-${i}`}
              role="region"
              data-open={isOpen}
              className="acc-region"
            >
              <div className="min-h-0 overflow-hidden">
                {/* Runde 5: text-caption statt text-body. max-w-measure
                    bleibt HIER am Absatz (Runde 5 verschiebt es hierher
                    von Faq.tsx, das jetzt max-w-3xl am ganzen Block hat)
                    — die Zeilenlänge der Antworten bleibt unverändert im
                    HIG-Korridor, unabhängig davon, wie breit der Block
                    um sie herum ist. */}
                <p className="max-w-measure pb-5 pr-10 text-caption text-ink-3">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
