"use client";

import { useState } from "react";

import { Container, Section } from "@/app/components/ui/primitives";
import { Icon } from "@/app/components/ui/icons";
import { useCases } from "@/app/data/use-cases";
import { cn } from "@/app/lib/cn";

/**
 * „RL1 enables use cases" — acht Karten schweben im Kreis um den Text.
 *
 * Absolut positioniert, und das ist der Punkt: Aufklappen verschiebt
 * damit nichts anderes auf der Seite. Der Radius ist so gewählt, dass
 * sich auch zwei benachbarte OFFENE Karten nicht überlagern (Bogenmaß
 * bei acht Karten auf 38/40 % der Bühnenbreite ≈ 300 px, Karte 256 px).
 *
 * Es ist immer höchstens eine Karte offen — eine zweite zu öffnen
 * schließt die vorige.
 *
 * Beim Scrollen bekommt jede Karte einen eigenen Versatz auf der
 * Z-Achse (--depth, siehe .usecase-ring in motion.css), wodurch der
 * Ring beim Vorbeiziehen leicht atmet.
 *
 * Unter xl fällt das Ganze auf eine gestapelte Liste zurück — ein Ring
 * auf 390 px Breite wäre unlesbar. Runde 10: Umschaltpunkt von lg auf xl
 * angehoben (war 1024px) — bei RX/RY unten und der festen Kartenbreite
 * (w-64) überlappten sich aufgeklappte Nachbarkarten gemessen zwischen
 * 1024–1279px (die Bühne ist dort schmaler als 36 % Radius plus 256px
 * Kartenbreite brauchen); ab 1280px (xl) ist gemessen für JEDE einzeln
 * geöffnete Karte kollisionsfrei.
 */
/*
  Radius in Prozent der Bühne.

  32/36 ließ zwischen Kartenkante und Textblock nur rund 35 px — bei
  aufgeklappter Karte schnitten sich Karte und Text. 36/38 auf einer
  höheren Bühne und ein schmalerer Textblock bringen den Abstand auf
  etwa 105 px. Gemessen wird nach jeder Änderung, nicht geschätzt: die
  Kommentare hier standen bis Runde 3 auf Werten, die im Code längst
  nicht mehr galten.
*/
const RX = 36;
const RY = 38;

export default function UseCases() {
  const [open, setOpen] = useState<string | null>(null);

  const cards = useCases.map((uc, i) => {
    // Start oben, im Uhrzeigersinn — die Lücke oben und unten bleibt frei
    const angle = (i / useCases.length) * Math.PI * 2 - Math.PI / 2;
    return {
      uc,
      left: 50 + Math.cos(angle) * RX,
      top: 50 + Math.sin(angle) * RY,
      depth: 0.3 + ((i % 4) / 4) * 0.7,
    };
  });

  return (
    <Section
      id="use-cases"
      label="Use cases"
      scrub="travel"
      minHeight="tall"
      size="tight"
      className="overflow-hidden"
    >
      <Container className="flex min-h-[120svh] items-center">
        <div className="relative w-full">
          {/* Ring ab xl (Runde 10, war lg — siehe Kommentar oben) */}
          {/* Runde 8: 54rem → 44rem. Der Radius ist prozentual (RX/RY),
              der Ring schrumpft also mitsamt seinen Abständen — die
              Karten kommen sich dadurch nicht näher als vorher. */}
          <div className="usecase-ring relative hidden h-[44rem] w-full xl:block">
            <div className="usecase-center absolute left-1/2 top-1/2 w-full max-w-md text-center">
              <Heading />
            </div>

            {cards.map(({ uc, left, top, depth }) => (
              <div
                key={uc.id}
                className="usecase-slot absolute w-64"
                style={
                  { left: `${left}%`, top: `${top}%`, "--depth": depth } as React.CSSProperties
                }
              >
                <Card
                  layout="ring"
                  useCase={uc}
                  open={open === uc.id}
                  onToggle={() => setOpen(open === uc.id ? null : uc.id)}
                />
              </div>
            ))}
          </div>

          {/* Gestapelt darunter — Runde 10: xl:hidden (war lg:hidden),
              siehe Kommentar zum Ring oben. */}
          <div className="flex flex-col gap-5 xl:hidden">
            <Heading />
            {useCases.map((uc) => (
              <Card
                key={uc.id}
                layout="stack"
                useCase={uc}
                open={open === uc.id}
                onToggle={() => setOpen(open === uc.id ? null : uc.id)}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function Heading() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-h2 text-ink">RL1 enables use cases</h2>
      {/* Runde 5: leading-snug statt der Fließtext-Zeilenhöhe (1.6) —
          bei der jetzt breiteren Spalte (max-w-md am Wrapper im
          Ring-Layout) reicht das für 1-2 Zeilen statt drei. Der
          „in development"-Hinweis ist entfallen. */}
      <p className="leading-snug text-body text-ink-3">
        Purpose-built for the instruments and operations that define regulated
        financial markets.
      </p>
    </div>
  );
}

function Card({
  useCase,
  open,
  onToggle,
  layout,
}: {
  useCase: (typeof useCases)[number];
  open: boolean;
  onToggle: () => void;
  /**
   * Ring und gestapelte Liste stehen beide im HTML — je nach Breite ist
   * eine der beiden display:none. Ohne eigenes Präfix vergäben sie
   * dieselben IDs: aria-controls der Liste zeigte dann auf die
   * ausgeblendete Fläche des Rings, weil der Browser den ersten Treffer
   * im Dokument nimmt.
   */
  layout: "ring" | "stack";
}) {
  const id = `uc-${layout}-${useCase.id}`;

  return (
    <div className={cn("card-metal overflow-hidden rounded-md", open && "z-10")}>
      <h3>
        {/*
          Zwei Zeilen statt einer: der Eyebrow bekommt die volle
          Kartenbreite, Icon und Titel teilen sich die zweite.

          Vorher standen Icon, Eyebrow, Titel und Plus nebeneinander —
          dem Text blieben davon rund 120 px. Fünf der acht Eyebrows und
          drei Titel brachen dadurch um, und die Karten waren zwischen
          79 und 151 px hoch. So passt „MONETARY INFRASTRUCTURE" in eine
          Zeile und der Titel in höchstens zwei.
        */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="flex w-full flex-col gap-2 p-4 text-left"
        >
          <span className="flex w-full items-start justify-between gap-3">
            <span className="text-label uppercase text-ink-3">{useCase.eyebrow}</span>
            {/* Gleiches Icon, gleiche Kurve wie im FAQ (Accordion.tsx) —
                echtes SVG statt Text-"+", das beim Drehen schief wirkte. */}
            <span
              aria-hidden
              className={cn(
                "-mt-0.5 w-4 shrink-0 text-accent",
                "transition-transform duration-200 ease-out-expo",
              )}
              style={{ transform: open ? "rotate(45deg)" : undefined }}
            >
              <Icon name="plus" size={16} />
            </span>
          </span>

          <span className="flex w-full items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-tint-30 bg-tint-10">
              <Icon name={useCase.icon} size={18} className="text-ink" />
            </span>
            <span className="font-display min-w-0 flex-1 text-body-lg text-ink">
              {useCase.title}
            </span>
          </span>
        </button>
      </h3>

      <div id={id} data-open={open} className="acc-region">
        <div className="min-h-0 overflow-hidden">
          {/*
            Runde 5: schließt auch beim Klick auf den ausgeklappten Text
            selbst, nicht nur auf die Kopfzeile — die Karte ist klein,
            ein Klick daneben (statt auf den vier Zeilen Text mittendrin)
            ist der unwahrscheinlichere Reflex. Text bleibt markierbar:
            ausgelöst wird nur, wenn die Auswahl beim Klick leer ist,
            sonst würde ein Markieren die Karte mitten im Kopieren
            zuklappen.
          */}
          <p
            onClick={() => {
              if (window.getSelection()?.toString()) return;
              onToggle();
            }}
            className="cursor-pointer px-4 pb-4 text-micro text-ink-2"
          >
            {useCase.body}
          </p>
        </div>
      </div>
    </div>
  );
}
