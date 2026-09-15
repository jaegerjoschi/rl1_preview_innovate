"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Die einzige Einblende-Logik im Projekt.
 *
 * Bewusst kein Animations-Framework: ein IntersectionObserver plus zwei
 * CSS-Klassen kosten rund 1 KB. Ein komplettes Framework nur für Fade-ins
 * wären ~80 KB, die jeder Besucher lädt.
 *
 * Der Inhalt steht dabei vollständig im ausgelieferten HTML — Suchmaschinen
 * und AI-Crawler lesen ihn auch dann, wenn JavaScript nie läuft.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delayIndex = 0,
  once = true,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Staffelung innerhalb einer Gruppe: 0, 1, 2 … je 70 ms Versatz */
  delayIndex?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      // Positiver unterer Rand: Der Beobachter meldet, BEVOR das Element
      // ins Bild kommt. Vorher lag hier -60px — das Element musste erst
      // 60px im Bild sein, bevor es überhaupt loslegte, sodass man ihm beim
      // Erscheinen zusah. Jetzt ist es fertig, wenn man ankommt.
      { threshold: 0, rootMargin: "0px 0px 15% 0px" },
    );

    io.observe(el);

    // Sicherheitsnetz: Liefert der Observer nichts — etwa weil der Browser den
    // Tab nicht rendert — wird nach kurzer Zeit trotzdem eingeblendet. Ein
    // Besucher darf nie vor unsichtbarem Inhalt sitzen.
    const failsafe = setTimeout(() => setShown(true), 2500);

    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "is-revealed" : ""} ${className}`.trim()}
      style={{ "--i": delayIndex } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

/**
 * Überschrift, die sich zeilenweise aufbaut — der Effekt von sharplink.com.
 *
 * Wichtig: Die Zeilen werden vorgegeben, nicht zur Laufzeit aus dem Text
 * berechnet. Damit steht der vollständige Text im HTML und es gibt keinen
 * Layout-Sprung, während JavaScript den Text zerlegt.
 */
export function RevealLines({
  lines,
  as: Tag = "h2",
  className = "",
  lineClassName = "",
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 12% 0px" },
    );

    io.observe(el);

    // Gleiches Sicherheitsnetz wie oben: keine Überschrift bleibt unsichtbar,
    // nur weil der Observer nichts meldet.
    const failsafe = setTimeout(() => setShown(true), 2500);

    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, []);

  return (
    <Tag ref={ref} className={`${shown ? "is-revealed" : ""} ${className}`.trim()}>
      {lines.map((line, i) => (
        /*
          Das Leerzeichen zwischen den Zeilen ist Absicht.

          Die Spans sind `block`, zwischen zwei Blockkästen wird reiner
          Leerraum nicht gezeichnet — sichtbar ändert sich also nichts.
          Wer das HTML aber OHNE das Stylesheet liest, sieht sonst zwei
          unmittelbar aneinanderhängende Inline-Spans und damit
          „One shared rail,owned by its members." Genau so lesen viele
          KI-Crawler-Pipelines die Seite, und genau dieser Satz wird
          dann zitiert.
        */
        <Fragment key={i}>
          {i > 0 ? " " : null}
          <span
            className={`reveal-line block ${lineClassName}`.trim()}
            style={{ "--i": i } as React.CSSProperties}
          >
            {line}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
