import Image from "next/image";

import { Container, Section } from "@/app/components/ui/primitives";
import { Reveal } from "@/app/components/motion/Reveal";
import { Button } from "@/app/components/ui/Button";
import { supervisoryBoard, managementBoard } from "@/app/data/governance";
import { asset } from "@/app/lib/basePath";

/**
 * "Member-Led Governance" — die Ebenen der Kooperative als Stapel:
 * Generalversammlung → Aufsichtsrat (mit Fotos, Vorsitz markiert) →
 * Vorstand.
 *
 * Die Ebene "Technical Operations" ist in Runde 2 entfallen: SWIAT ist
 * Dienstleister, keine Governance-Ebene. Sie steht als Validator im
 * Netzwerkdiagramm.
 */
const LAYERS = [
  {
    title: "General Assembly",
    body: "All member institutions of the SCE — collective sovereign of the network.",
  },
  {
    title: "Supervisory Board",
    body: "Elected by member institutions. Oversees strategy, governance and compliance.",
    board: supervisoryBoard,
  },
  {
    title: "Management Board",
    body: "Elected by the Supervisory Board. Responsible for the company's day-to-day management, the development and execution of its business strategy.",
    board: managementBoard,
  },
];

export default function GovernanceDiagram() {
  return (
    <Section id="governance" tone="off-black" label="Member-Led Governance">
      <Container>
        <h2 className="text-h2 text-ink">Member-Led Governance</h2>
        {/* Runde 5: gekürzt auf zwei Zeilen (war ein Absatz aus zwei
            Sätzen, lief auf drei bis vier), max-w-2xl statt
            max-w-measure für etwas mehr Raum je Zeile. */}
        <p className="mt-4 max-w-2xl text-body-lg text-ink-3">
          Members steer the network in the General Assembly. Oversight, operations and
          technical execution keep it neutral, secure and aligned with their interests.
        </p>

        {/*
          Die drei Ebenen hängen zusammen: General Assembly wählt den
          Supervisory Board, der den Management Board. Bis Runde 3 stand
          das nur im Text — jetzt zeigt es ein Pfeil, und die Karten
          laufen nacheinander ein statt alle zugleich.
        */}
        <ol className="mt-10 flex flex-col">
          {LAYERS.map((layer, i) => (
            <li key={layer.title} className="flex flex-col">
              {i > 0 && (
                // Runde 6: py-3 → py-1.5, Strang h-10 → h-8 — die Karten
                // rücken näher zueinander.
                <Reveal
                  delayIndex={i * 5 - 2}
                  className="flex flex-col items-center py-1.5"
                  aria-hidden
                >
                  <span className="flow-line flow-line--v flow-line--v-thick h-8" />
                  {/* Runde 6: strokeWidth 2 → 2.5 — „Pfeile dicker",
                      passend zur jetzt 3px starken Linie darüber. */}
                  <svg
                    width="12"
                    height="7"
                    viewBox="0 0 12 7"
                    fill="none"
                    className="-mt-1 text-accent-soft"
                  >
                    <path
                      d="M1 1l5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Reveal>
              )}

              {/*
                Runde 6: „nacheinander einfaden" war schon die Absicht
                (siehe Kommentar oben), aber bei drei dicht gestapelten
                Karten überschreiten alle IntersectionObserver fast im
                selben Sekundenbruchteil ihre 15%-Schwelle — der alte
                Versatz (i*2, macht bei 40ms/Schritt nur 0/80/160ms)
                blieb dadurch kaum wahrnehmbar. i*5 spreizt denselben
                Mechanismus auf 0/200/400ms, sichtbar geprüft.
              */}
              <Reveal
                delayIndex={i * 5}
                className="rounded-md border border-hairline bg-tint-05 p-block"
              >
              <p className="text-h3 text-ink">{layer.title}</p>
              {/* Runde 5: max-w-measure entfernt — die Karte ist breiter
                  als das Maß, genau dadurch entstanden unnötige Umbrüche
                  mitten in kurzen Sätzen wie „…transitions to the
                  ⏎ network." */}
              <p className="mt-1 text-caption text-ink-3">{layer.body}</p>

              {layer.board && (
                // Runde 5: eine Spalte unter sm (war grid-cols-2) — auf
                // 375px blieb je Karte kaum über 140px, Name und
                // Organisation überlappten und liefen ineinander.
                <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
                  {layer.board.map((m) => (
                    <li key={m.name} className="flex items-center gap-3">
                      <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-bg-2">
                        {m.photo && (
                          /*
                            Der alt-Text nennt Person, Rolle und Haus.
                            Vorher stand hier alt="" — bei einem rein
                            dekorativen Bild richtig, hier aber nicht:
                            Es sind neun namentlich benannte Personen,
                            und genau diese Namen sind das Signal, über
                            das Suchmaschinen und KI-Systeme die
                            Zugehörigkeit zum Netzwerk herstellen.
                            Screenreader-Nutzer hören die Zeile ohnehin
                            nur einmal — Name und Organisation stehen
                            daneben im Text, deshalb ist die Rolle die
                            einzige Zusatzinformation.
                          */
                          <Image
                            src={asset(m.photo)}
                            alt={`${m.name}, ${m.role}, ${m.org}`}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        )}
                      </span>
                      {/*
                        Runde 5: „Chair" steht UNTER Name und
                        Organisation, nicht mehr inline neben dem Namen —
                        die flex-Reihe dort quetschte auf schmalen
                        Spalten beides gegeneinander. `truncate` an der
                        Organisation ist ersatzlos gestrichen: nichts
                        wird mehr abgeschnitten, lieber bricht „Boerse
                        Stuttgart Group)" um, als „Setu…" zu zeigen.

                        Runde 6: „Chair" → „Chairman", und das Abzeichen
                        neu gebaut — die Pille (bg-accent-soft, py-px)
                        wirkte auf 12px-Text optisch gequetscht. Jetzt
                        eine kleine, nicht-textliche Markierung (ein
                        Punkt in --color-accent-soft — die Farbe ist
                        laut Designsystem ohnehin NUR für Nicht-Text
                        gedacht, nie für die Schrift selbst, siehe
                        DESIGN.md) plus normaler Fließtext in text-ink-2
                        statt einer Fläche, in der etwas klemmen könnte.
                      */}
                      <span className="min-w-0">
                        <span className="block text-caption text-ink">{m.name}</span>
                        <span className="block text-micro text-ink-3">{m.org || m.role}</span>
                        {m.chairman && (
                          <span className="mt-1 flex items-center gap-1.5 text-micro uppercase tracking-wide text-ink-2">
                            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent-soft" />
                            Chairman
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          {/* Runde 10: Ghost-/Outline-Button, treffendere Copy — der
              Button führt zur Dokumente-Übersicht, kein Direkt-Download. */}
          <Button href="/resources" variant="flat">
            Show downloadable documents
          </Button>
        </div>
      </Container>
    </Section>
  );
}
