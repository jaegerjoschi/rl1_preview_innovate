"use client";

import { storyFrames } from "@/app/data/story";
import { STAGE_LEAD_FRACTION } from "./useScrollProgress";

/**
 * Rand-Indikator für die Story-Bühne — ersetzt `StoryNav` (die Punkte
 * links neben dem Text, Runde 5 entfernt). Zeigt eine schmale Leiste
 * am rechten Fensterrand, wie weit man durch die vier Sätze gescrollt
 * ist und wie viel noch kommt: vier Segmente, eines je Frame, mit
 * kleinem Abstand dazwischen.
 *
 * Der FÜLLSTAND ist reines CSS: Position und Ein-/Ausblenden hängen
 * nur an `--p`, dem Fortschritt, den MotionRoot (der `stage`-Zweig)
 * ohnehin schon auf die Sektion schreibt und der an jedes Kind vererbt
 * — kein zusätzlicher Scroll-Listener dafür.
 *
 * Runde 6: „auf der Statusleiste soll man auch navigieren können" —
 * jedes Segment ist jetzt ein `<button>`. Ein Klick berechnet die
 * UMKEHRUNG der Formel, mit der MotionRoot `--p` aus der Scrollposition
 * bildet (`p = (pinOffset − rect.top + lead) / (span + lead)`), löst
 * nach der Scrollposition auf und scrollt dorthin. `STAGE_LEAD_FRACTION`
 * kommt deshalb aus demselben gemeinsamen Modul wie in MotionRoot —
 * zwei Kopien derselben Konstante liefen sonst irgendwann auseinander.
 *
 * Auch mobil sichtbar (vorher `hidden lg:flex`) — dort schmaler und
 * näher am Rand, siehe `.story-rail`/`.story-rail-track` in motion.css.
 *
 * Die Segmentbreiten sind nach ZEICHENZAHL gewichtet, exakt wie
 * MotionRoot die Frame-Fenster gewichtet (siehe dort): ein gleich
 * breites Segment je Frame liefe für den längsten Satz sichtbar
 * langsamer voll als für den kürzesten. Gerechnet wird hier separat
 * (React, beim Rendern) statt einen Wert aus MotionRoot zu übernehmen —
 * beide zählen dieselben Zeichen aus denselben Daten, das Ergebnis ist
 * deckungsgleich, ohne dass die beiden Module sich kennen müssen.
 */
export function ScrollProgressRail() {
  const weights = storyFrames.map(
    (f) => (f.lead + " " + f.rest).replace(/\s+/g, "").length,
  );
  const total = weights.reduce((a, b) => a + b, 0);

  let acc = 0;
  const segments = storyFrames.map((frame, i) => {
    const from = acc / total;
    acc += weights[i];
    const to = acc / total;
    return { frame, from, to };
  });

  const goTo = (targetP: number) => {
    const stage = document.querySelector<HTMLElement>(".story-stage");
    const pin = stage?.querySelector<HTMLElement>("[data-pin]");
    if (!stage || !pin) return;

    const rect = stage.getBoundingClientRect();
    const vh = window.innerHeight;
    const pinHeight = pin.offsetHeight;
    const pinOffset = parseFloat(getComputedStyle(pin).top) || 0;
    const span = Math.max(rect.height - pinHeight, vh * 0.5);
    const lead = vh * STAGE_LEAD_FRACTION;

    // Umkehrung von MotionRoots p-Formel: dort ist
    // p = (pinOffset − rect.top + lead) / (span + lead), aufgelöst
    // nach rect.top und dann nach der absoluten Scrollposition.
    const stageAbsoluteTop = rect.top + window.scrollY;
    const targetScrollY = stageAbsoluteTop - pinOffset - lead + targetP * (span + lead);

    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  };

  return (
    <div className="story-rail fixed inset-y-16 right-1 z-20 flex flex-col gap-2 md:inset-y-20 md:right-4 lg:right-6">
      {segments.map(({ frame, from, to }) => (
        <button
          key={frame.id}
          type="button"
          aria-label={frame.eyebrow}
          onClick={() => goTo(from + 0.02)}
          className="story-rail-track-wrap"
        >
          <span className="story-rail-track">
            <span
              className="story-rail-fill"
              style={
                {
                  "--seg-from": from.toFixed(4),
                  "--seg-to": to.toFixed(4),
                } as React.CSSProperties
              }
            />
          </span>
        </button>
      ))}
    </div>
  );
}
