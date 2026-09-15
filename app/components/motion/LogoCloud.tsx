"use client";

import Image from "next/image";
import { useRef } from "react";

import { cn } from "@/app/lib/cn";
import { asset } from "@/app/lib/basePath";

export type CloudLogo = {
  name: string;
  src: string;
  top: string;
  left: string;
  speed: number;
  /** Freigestellte Weißfassung? Sonst greift der Graustufen-Rückfall. */
  mono?: boolean;
  /**
   * Runde 5: einzelne Positionen (die seitlich neben dem Textblock in
   * Ecosystem.tsx) verschwinden unter lg — auf schmalen Schirmen ist
   * der Text breiter relativ zur Bühne und liegt genau dort, wo diese
   * Logos sonst hinter ihm sitzen würden.
   */
  hideOnMobile?: boolean;
};

/**
 * Große, freistehende Logos rings um den Text — wie im Entwurf.
 *
 * Sie lagen in Runde 2 als graue Kacheln ÜBER der Überschrift und
 * verdeckten sie; die Antwort darauf war, sie klein danebenzustellen.
 * Richtig ist beides nicht: sie gehören groß um den Text herum, und die
 * Sektion muss hoch genug sein, dass dafür Platz ist. Der Textblock
 * behält eine Schutzzone in der Mitte, in die keine Position fällt.
 *
 * Zwei Bewegungen, beide nur `transform`:
 *   • Parallax gegen den Text (--speed je Logo, siehe .parallax)
 *   • Ausweichen vor dem Zeiger, per CSS-Transition interpoliert, damit
 *     es Trägheit bekommt statt am Zeiger zu kleben
 *
 * Bei Grobzeiger und reduzierter Bewegung passiert nichts.
 */
/*
  Ausweichen vor dem Zeiger.

  Runde 3 stand auf 150 px Radius, 18 px Ausschlag und 500 ms — das las
  sich als kurzes Zucken direkt unter dem Zeiger. Ein größerer Radius
  bei kleinerem Ausschlag und längerer Nachlaufzeit macht daraus eine
  ruhige Strömung: die Logos merken den Zeiger früher, bewegen sich
  weniger weit und kommen träger zur Ruhe.
*/
const RADIUS = 220;
const MAX_PUSH = 10;

export function LogoCloud({ logos, className }: { logos: CloudLogo[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointer.current = { x: e.clientX, y: e.clientY };
    // Ein Bild je Frame. Ohne das lief die Schleife über alle Logos bei
    // jedem einzelnen Zeigerereignis — inklusive Layout-Rücklesung.
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      apply();
    });
  };

  const apply = () => {
    const root = ref.current;
    if (!root) return;
    const { x, y } = pointer.current;

    for (const item of Array.from(root.children) as HTMLElement[]) {
      const r = item.getBoundingClientRect();
      const dx = r.left + r.width / 2 - x;
      const dy = r.top + r.height / 2 - y;
      const dist = Math.hypot(dx, dy);

      if (dist > RADIUS || dist === 0) {
        item.style.removeProperty("--dodge-x");
        item.style.removeProperty("--dodge-y");
        continue;
      }
      const push = (1 - dist / RADIUS) * MAX_PUSH;
      item.style.setProperty("--dodge-x", `${((dx / dist) * push).toFixed(1)}px`);
      item.style.setProperty("--dodge-y", `${((dy / dist) * push).toFixed(1)}px`);
    }
  };

  const reset = () => {
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    const root = ref.current;
    if (!root) return;
    for (const item of Array.from(root.children) as HTMLElement[]) {
      item.style.removeProperty("--dodge-x");
      item.style.removeProperty("--dodge-y");
    }
  };

  return (
    <div
      ref={ref}
      aria-hidden
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {logos.map((logo) => (
        <span
          key={logo.name}
          className={cn(
            "logo-float pointer-events-auto absolute",
            logo.hideOnMobile && "hidden xl:block",
          )}
          style={
            {
              top: logo.top,
              left: logo.left,
              "--speed": logo.speed,
            } as React.CSSProperties
          }
        >
          <Image
            src={asset(logo.src)}
            alt=""
            width={200}
            height={200}
            loading="lazy"
            className={cn(
              "w-auto object-contain",
              // Runde 5: mobil kleiner (war h-12) — bei zwanzig Logos
              // auf einer schmalen Bühne trugen sie zu viel Gewicht
              // gegen den jetzt kleineren Überschriftentext. Runde 10:
              // nochmals kleiner (war h-8 md:h-16) — die Bühne ist jetzt
              // nur noch ca. eine Bildschirmhöhe statt 150svh, die Logos
              // müssen entsprechend enger und kleiner um den Text passen.
              "h-6 md:h-10",
              logo.mono ? "opacity-45" : "opacity-35 grayscale",
            )}
          />
        </span>
      ))}
    </div>
  );
}
