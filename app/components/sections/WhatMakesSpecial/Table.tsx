import { CountUp } from "@/app/components/ui/CountUp";
import { Button } from "@/app/components/ui/Button";
import type { SpecialItem } from "@/app/data/special";

/**
 * Variante B: tabellarisch mit Haarlinien. Titel links, Text rechts,
 * darunter die Kennzahl, die beim Eintritt hochzählt.
 */
export function SpecialTable({ items }: { items: SpecialItem[] }) {
  return (
    <div>
      <h2 className="text-h2 text-ink">What makes RL1 special</h2>

      <dl className="mt-10 border-t border-hairline">
        {items.map((it) => (
          <div
            key={it.id}
            className="grid gap-4 border-b border-hairline py-8 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:gap-12"
          >
            <dt className="text-statement text-ink">{it.title}</dt>
            <dd className="flex flex-col gap-3">
              {/* Das Maß gehört an den Absatz: die Spalte ist 880 px
                  breit, das ergab gemessen 96–114 Zeichen je Zeile. */}
              <p className="max-w-measure text-body text-ink-3">{it.body}</p>
              {it.metric !== undefined && (
                <p className="text-h3 text-ink tabular-nums">
                  <CountUp
                    value={it.metric}
                    prefix={it.metricPrefix ?? ""}
                    suffix={it.metricSuffix ?? ""}
                  />
                  {it.metricLabel && (
                    <span className="ml-2 text-caption text-ink-3">{it.metricLabel}</span>
                  )}
                </p>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-10">
        <Button href="/about">
          Learn more
        </Button>
      </div>
    </div>
  );
}
