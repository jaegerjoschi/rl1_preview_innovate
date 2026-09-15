"use client";

import { useEffect, useRef } from "react";

import { Container, Section } from "@/app/components/ui/primitives";
import { registerScroll, profiles } from "@/app/components/motion/useScrollProgress";
import { ValueSymbols, ValueVisual, type ValueVariant } from "@/app/components/ui/ValueSymbols";
import { drivers } from "@/app/data/drivers";

import "./Drivers.values.css";

/**
 * "Our Values" (vormals "What drives Regulated Layer One?", Runde 5).
 * Der waagerechte Lauf, ohne Kartenchrom: Bild, Titel und Text stehen
 * frei auf Schwarz, jede Karte ist breiter (25rem statt 18.75rem),
 * damit sie den gewonnenen Raum auch nutzt. Kein Hintergrundbild mehr
 * (`/drivers/drivers-bg.jpg` ist entfallen).
 *
 * Runde 5 stellte diese Fassung testweise neben eine zweite (eine
 * senkrechte Liste, baugleich zu `SpecialTable`) — der Auftraggeber hat
 * sich für diese hier entschieden, die Liste ist wieder entfallen.
 *
 * GRUNDZUSTAND IST DER ECHTE SCROLL-CONTAINER. Ohne JavaScript und bei
 * reduzierter Bewegung bleibt die Spur ein normaler Scrollbereich mit
 * Scroll-Snap — Trackpad, Touch und Tastatur kommen überall hin. Erst
 * html.scroll-ready macht daraus den gezogenen Lauf.
 */
/**
 * Wie weit die Animation dem seitlichen Lauf vorauseilt — in Kartenfenstern,
 * nicht in Prozent der Bühne, damit der Wert auch bei einer anderen Anzahl
 * Karten dasselbe bedeutet. 0.42 ist gemessen: darunter läuft die erste
 * Karte noch sichtbar aus dem Bild, darüber wird ihr eigenes Fenster zu
 * kurz für die 1000–1150ms lange Animation.
 */
const ACTIVATION_LEAD = 0.42;

export default function Drivers() {
  const trackRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      /*
        Gemessen wird gegen die INHALTSBREITE des Containers, nicht
        gegen die Spur selbst: sobald html.scroll-ready die Spur auf
        `width: max-content` setzt, ist sie kein Scroll-Container mehr,
        und scrollWidth === clientWidth — die Strecke käme als 0 heraus.
      */
      const box = track.parentElement;
      if (!box) return;
      const cs = getComputedStyle(box);
      const visible =
        box.clientWidth -
        parseFloat(cs.paddingLeft) -
        parseFloat(cs.paddingRight);
      const distance = Math.max(track.scrollWidth - visible, 0);
      track.style.setProperty("--travel", `${distance}px`);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    /*
      Die Aktivierung hängt an demselben --p, das auch die Spur seitlich
      zieht (`scrub="slow"` oben, von MotionRoot auf .drivers-stage
      geschrieben; die Spur selbst liest es per calc() in motion.css).
      `profiles.slow` liefert exakt 0, solange die Bühne nicht angedockt
      hat, und steigt erst danach gleichmäßig bis 1 — daher startet
      „Trust" nicht zu früh, sondern genau dann, wenn die Klebephase
      beginnt. Der Fortschritt wird in gleich große Fenster geteilt,
      eines je Karte: es ist immer GENAU eine Karte aktiv, sie wechseln
      nacheinander, und zwar parallel zum seitlichen Lauf statt mit
      eigener Wartezeit.

      Runde 8: die zwischenzeitliche Fassung sperrte nach jeder Karte
      per Timer den nächsten Schritt („erst abspielen, dann
      weiterscrollen") und hielt die Spur dafür fest. Das las sich beim
      Scrollen als Haken — die Seite reagierte kurz nicht mehr. Die
      Sperre ist deshalb wieder raus; die Karten laufen jetzt ohne
      Pausen im Takt des Scrollens.

      Direktes classList-Toggle statt React-State: Karten wechseln
      mehrfach pro Sekunde, ein Re-Render je Wechsel wäre unnötige
      Arbeit für sechs ohnehin über Refs erreichbare Elemente.
    */
    const cards = cardRefs.current.filter((el): el is HTMLLIElement => el !== null);
    const stage = trackRef.current?.closest<HTMLElement>(".drivers-stage");
    if (cards.length === 0 || !stage) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cards.forEach((card) => card.classList.add("is-active"));
      return;
    }

    return registerScroll(stage, (rect, vh) => {
      const p = profiles.slow(rect, vh);
      /*
        Runde 11: Vorlauf. Gemessen (1440×900) war eine Karte am ENDE
        ihres Fensters längst halb aus dem Bild gelaufen — Karte 1 nur
        noch zu 18 % sichtbar, Karte 2 zu 46 % — weil die Spur während
        des Fensters rund 330px nach links zieht, die Animationen aber
        1000–1150ms brauchen. Die Aktivierung läuft deshalb dem Lauf um
        einen Bruchteil eines Kartenfensters voraus.

        Der Vorlauf wird auf p ADDIERT, statt den Index zu verschieben
        (`floor(p * n + lead)`): letzteres hätte Karte 1 verschluckt, weil
        ihr Fenster dann bei negativem p begänne — sie wäre beim Andocken
        übersprungen worden. So behält jede Karte ihr Fenster, nur die
        erste wird etwas kürzer.
      */
      const lead = ACTIVATION_LEAD / cards.length;
      const pActive = Math.min(1, p + lead);
      const activeIndex =
        p > 0 ? Math.min(cards.length - 1, Math.floor(pActive * cards.length)) : -1;
      cards.forEach((card, i) => {
        card.classList.toggle("is-active", i === activeIndex);
      });
    });
  }, []);

  return (
    <Section
      label="Our Values"
      scrub="slow"
      minHeight="none"
      size="tight"
      className="values drivers-stage overflow-x-clip"
    >
      <ValueSymbols />
      <div data-pin className="drivers-pin">
        <Container className="flex w-full flex-col justify-center">
          <h2 className="text-h2 text-ink">Our Values</h2>

          <ul ref={trackRef} className="drivers-track mt-12">
            {drivers.map((d, i) => (
              <li
                key={d.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                // Runde 7: unter sm nicht breiter als der sichtbare
                // Viewport (100vw − 2×px-6-Polsterung des Containers) —
                // 25rem (400px) lief auf Mobiltelefonen über den
                // Bildschirmrand hinaus und war dadurch nicht mehr ohne
                // horizontales Nachscrollen EINER Karte lesbar.
                className="value-card w-[calc(100vw-3rem)] shrink-0 snap-start sm:w-[25rem]"
              >
                <div className="mb-8 w-full aspect-[26/15]">
                  <ValueVisual variant={d.id as ValueVariant} />
                </div>
                <h3 className="text-h3 text-ink">{d.title}</h3>
                {/* Gleiche Mindesthöhe: die Texte reichen von 83 bis 155
                    Zeichen, ohne das franst die Kartenreihe unten aus. */}
                <p className="mt-2 min-h-24 text-caption text-ink-2">{d.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </Section>
  );
}
