import Image from "next/image";

import { Container, Section } from "@/app/components/ui/primitives";
import { Button } from "@/app/components/ui/Button";
import { ScrollText } from "@/app/components/motion/ScrollText";
import { ScrollProgressRail } from "@/app/components/motion/ScrollProgressRail";
import { storyFrames } from "@/app/data/story";
import { asset } from "@/app/lib/basePath";

/**
 * Die Story — vier Sätze auf EINER klebenden Bühne.
 *
 * Bis Runde 3 war jeder Frame eine eigene 220svh hohe Sektion. Der Satz
 * baute sich über 1164 px auf, danach folgten 640 px, in denen er nur
 * nach oben weggeschoben und der nächste heraufgeschoben wurde — ein
 * Drittel der Strecke ohne Aussage, und zwischen zwei Sätzen stand der
 * Bildschirm kurz leer.
 *
 * Jetzt steht die Bühne still und die Frames wechseln an derselben
 * Stelle: Satz fertig → überblenden → nächster Satz. Die Fenster sind
 * nach Zeichenzahl gewichtet, damit sich jeder Satz gleich schnell
 * liest; die Rechnung steht in MotionRoot unter `stage`.
 *
 * Bild und Text tauschen je Frame die Seite, damit die Bühne nicht
 * statisch wirkt, obwohl sie steht.
 *
 * Runde 5:
 * — Die Punktnavigation (StoryNav) ist entfallen, dafür steht rechts am
 *   Fensterrand eine Fortschrittsleiste (ScrollProgressRail) — vier
 *   Segmente, die sich mit demselben `--p` füllen wie der Text.
 * — Der Aufbau beginnt jetzt schon beim Einlaufen der Sektion, nicht
 *   erst wenn sie bereits anliegt (siehe LEAD in MotionRoot). Dazu ist
 *   die Bühne insgesamt kürzer (340svh statt 460svh) — dieselbe Menge
 *   Text braucht dadurch spürbar weniger Scrollweg.
 * — Unter `lg` steht das Bild jetzt ÜBER dem Text (vorher: Text zuerst
 *   im DOM, dadurch schon oben) und ist niedriger (30svh statt 46vh),
 *   damit beides gemeinsam in die Klebefläche passt.
 * — Der letzte Frame trägt einen CTA. Er wird nur klickbar, wenn dieser
 *   Frame auch der aktive ist (MotionRoot schaltet `pointer-events` pro
 *   Frame) — sonst ließe sich ein unsichtbar überlagerter Button aus
 *   einem früheren Frame heraus anklicken.
 */
export default function ScrollStorySection() {
  return (
    <Section
      id="story"
      scrub="stage"
      /*
        minHeight="none": die Standardeinstellung "screen" macht die
        Sektion zu einer zentrierten Flex-Spalte. Das klebende Kind
        bekäme dadurch seinen Startpunkt in der Sektionsmitte —
        gemessen 1462 px statt 64 — und begänne erst dort zu kleben.
        Höhe und Kleben stehen ohnehin in motion.css.
      */
      minHeight="none"
      label="What RL1 is"
      className="story-stage overflow-x-clip"
    >
      <ScrollProgressRail />

      {/* Kleben, Höhe und das Stapeln der Frames stehen in motion.css
          und schalten sich erst mit html.scroll-ready scharf. Ohne
          JavaScript stehen die vier Sätze untereinander statt
          ineinander gedruckt. */}
      <div data-pin>
        <Container className="story-container relative">
          {storyFrames.map((frame, i) => {
            const isLast = i === storyFrames.length - 1;
            return (
              <div
                key={frame.id}
                data-frame
                id={frame.id}
                className={
                  // inset-0 spannt den PADDING-Kasten des Containers auf,
                  // nicht dessen Inhaltsfläche — ohne eigene Polsterung
                  // stieße der Text auf Mobil an den Fensterrand
                  // (gemessen: 375 px Textbreite auf 375 px Fenster).
                  // Ab lg bleibt links Platz für die Navigation.
                  "story-frame flex items-center px-6 md:px-10 lg:px-0 lg:pl-16"
                }
              >
                <div
                  className={
                    "grid w-full items-center gap-6 lg:gap-14 " +
                    /*
                      Ungerade Frames spiegeln: Text rechts, Bild links.
                      Gespiegelt wird das RASTER mit, nicht nur die
                      Reihenfolge — sonst rutscht der Text in die schmale
                      Spalte und braucht dort mehr Zeilen statt weniger
                      (gemessen: 31 Zeichen je Zeile statt 44). Das gilt
                      erst ab lg; darunter entscheidet order (siehe die
                      beiden Kinder unten), nicht grid-cols.
                    */
                    (i % 2 === 1
                      ? "lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:[&>*:first-child]:order-2"
                      : "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]")
                  }
                >
                  <div className="relative z-10 order-2 flex max-w-2xl flex-col gap-4 lg:order-none lg:gap-5">
                    <p className="text-label-lg uppercase text-ink">{frame.eyebrow}</p>
                    {/* Runde 6: Poppins statt Roboto Condensed — eigene
                        Stufe (text-prose), nicht text-statement, das
                        auch Resources-Zeilen, Rollentitel und die
                        Special-Tabelle trägt und bei Condensed bleibt. */}
                    <ScrollText
                      profile="inherit"
                      className="text-prose"
                      lead={frame.lead}
                      rest={frame.rest}
                    />
                    {isLast && (
                      <div className="story-frame-cta mt-2">
                        {/* Runde 10: Outline-/Ghost-Button, auf Wunsch
                            des Auftraggebers speziell für diese Stelle
                            in der Scroll-Story — die übrigen "Become a
                            member"-CTAs (Header, Hero, AboutHero,
                            NetworkDiagram) bleiben Primary. */}
                        <Button href="/join" variant="outline">
                          Become a member
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Weiche Maske statt beschnittenem Rechteck — sonst
                      steht die Bildkante sichtbar in der Fläche.
                      Runde 5: unter lg steht das Bild ÜBER dem Text
                      (order-1) statt danach — vorher stand es zweiter im
                      DOM und damit automatisch unten. */}
                  <div
                    aria-hidden
                    className="story-media pointer-events-none z-0 order-1 lg:order-none"
                  >
                    {/*
                      Der erste Frame lädt früh, aber NICHT mit `priority`.

                      `priority` erzeugt ein <link rel="preload"> — und das
                      Bild steht gemessen bei 1284 px, bei 900 px Fensterhöhe
                      also unter der Falte. Es hat damit im kritischen Pfad
                      mit dem Hero-Bild um Bandbreite gestritten, obwohl man
                      es beim ersten Blick gar nicht sieht: sieben Ressourcen
                      mit Höchstpriorität, eine davon unsichtbar.

                      `loading="eager"` behält das frühe Laden, verzichtet
                      aber auf den Preload. Die übrigen drei Frames bleiben
                      lazy — sie kommen erst, wenn die Bühne erreicht ist.
                    */}
                    <Image
                      src={asset(frame.image)}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 50vw, 120vw"
                      className="object-cover object-center"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </Container>
      </div>
    </Section>
  );
}
