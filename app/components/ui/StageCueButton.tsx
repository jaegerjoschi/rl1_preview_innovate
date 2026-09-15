"use client";

import type { MouseEvent, ReactNode } from "react";

import { Button } from "@/app/components/ui/Button";

/**
 * „How it works" — der Sprung vom Hero in die klebende Bühne darunter.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WARUM DER GEWÖHNLICHE ANKERSPRUNG DANEBENLIEGT
 *
 * `href="#story"` setzt die OBERKANTE der Sektion unter die Navbar
 * (`scroll-mt-24` in primitives.tsx). Der Text hängt dort aber nicht.
 * Dazwischen liegen:
 *
 *   1. `py-section` der Sektion — 120px ab md
 *   2. ein klebendes `[data-pin]` mit `top: var(--spacing-header-md)` (92px)
 *      und `height: calc(100svh − 92px)`
 *   3. darin `align-items: center`
 *
 * Nach dem Ankersprung beginnt der Pin bei 96 + 120 = 216px und klebt noch
 * NICHT — sein Inhalt zentriert sich deshalb in einem Kasten, der weit unter
 * die Fensterkante reicht. Bei 900px Fensterhöhe landet der Satz rund 170px
 * zu tief. Das ist das gemeldete „steht unten statt mittig".
 *
 * ─────────────────────────────────────────────────────────────────────────
 * DIE RICHTIGE ZIELPOSITION
 *
 * Die, an der der Pin GERADE ANLIEGT. Dann füllt er exakt die sichtbare
 * Fläche unter dem Header, und `align-items: center` setzt den Satz dort
 * mittig — dieselbe Zentrierung, die die Bühne während des ganzen Scrollens
 * hält. Etwas anderes kann „mittig" auf dieser Bühne nicht heißen; jede
 * andere Definition konkurrierte mit der, die das Scrollen selbst benutzt.
 *
 *     Ziel = Oberkante Sektion + padding-top der Sektion − top des Pins
 *
 * Beide Summanden werden BERECHNET gelesen, nicht als Zahl eingetragen:
 * ändert sich `--spacing-section` oder `--spacing-header`, stimmt die
 * Rechnung weiter.
 *
 * Bewusst NICHT die Umkehrformel aus ScrollProgressRail.tsx: die braucht
 * STAGE_LEAD_FRACTION und die Bühnenlänge und wäre eine dritte Stelle, an
 * der dieselbe Geometrie gepflegt werden müsste.
 * ─────────────────────────────────────────────────────────────────────────
 */
export function StageCueButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  function handleClick(event: MouseEvent<HTMLElement>) {
    // Mit Modifier will der Nutzer einen neuen Tab oder ein neues Fenster —
    // das darf der Handler ihm nicht wegnehmen.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = document.getElementById(href.slice(1));
    const pin = target?.querySelector<HTMLElement>("[data-pin]");
    if (!target || !pin) return;

    /*
      Kein klebendes Kind = keine Bühne. Bei `prefers-reduced-motion` setzt
      MotionRoot die Klasse `scroll-ready` nie, motion.css lässt [data-pin]
      dann auf `position: static`, und die Frames stehen untereinander. In
      dem Fall fassen wir den Klick gar nicht erst an: der gewöhnliche
      Ankersprung mit `scroll-mt-24` ist dafür richtig und erprobt.
    */
    if (getComputedStyle(pin).position !== "sticky") return;

    event.preventDefault();

    const padTop = parseFloat(getComputedStyle(target).paddingTop) || 0;
    const pinTop = parseFloat(getComputedStyle(pin).top) || 0;
    const top =
      target.getBoundingClientRect().top + window.scrollY + padTop - pinTop;

    /*
      "instant", NICHT "auto". `auto` heißt laut Spezifikation „nimm den
      CSS-Wert" — und der steht am <html> global auf `smooth`
      (globals.css). Ein Nutzer mit reduzierter Bewegung bekäme sonst genau
      die Animation, die er abbestellt hat.
    */
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "instant" : "smooth" });
  }

  /*
    Variante, Größe und Pfeilrichtung stehen absichtlich HIER und nicht in
    den Props: Hero und AboutHero verpflichten sich in ihren Kommentaren
    gegenseitig auf dasselbe Aussehen — so können sie gar nicht erst
    auseinanderlaufen.
  */
  return (
    <Button href={href} variant="flat" size="md" arrow="down" onClick={handleClick}>
      {children}
    </Button>
  );
}
