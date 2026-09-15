"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  clamp01,
  profiles,
  registerScroll,
  STAGE_LEAD_FRACTION,
  type ScrollProfile,
} from "./useScrollProgress";

/**
 * Einmal im Layout gemountet. Schaltet die scroll-gekoppelten Effekte
 * scharf (html.scroll-ready, analog zu reveal-ready) und registriert
 * jedes [data-scrub]-Element bei der Engine — so bleiben ScrollText & Co.
 * reine Server-Komponenten und der volle Text steht im HTML.
 *
 * Der Attributwert wählt das Fensterprofil: leer = `enter`,
 * "late" für große Aussagen, "travel" für Parallax und Bildblenden.
 *
 * Bei prefers-reduced-motion passiert hier nichts: scroll-ready wird
 * nicht gesetzt, --p bleibt auf dem CSS-Default 1.
 */
export default function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("scroll-ready");

    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scrub]"),
    );
    const cleanups = els.map((el) => {
      // data-scrub="late" | "slow" | "stage" | "travel" | "" (= enter)
      const name = (el.dataset.scrub || "enter") as ScrollProfile;
      const compute = profiles[name] ?? profiles.enter;

      /*
        `slow` gehört zu klebendem Inhalt: das Element selbst steht
        still, sein eigenes rect taugt also nicht als Maß. Gemessen wird
        die umgebende Sektion, geschrieben wird trotzdem auf das
        Element — Vererbung von --p über mehrere Ebenen erwies sich als
        unzuverlässig, ein direkt gesetzter Wert nicht.

        Die Strecke kommt vom klebenden Kind (data-pin): --p ist 0, wenn
        es oben anliegt, und 1 in dem Moment, in dem es sich löst. Würde
        stattdessen fest mit (Höhe − Fensterhöhe) gerechnet, liefe der
        Aufbau bei einem Kind, das kleiner als das Fenster ist, zu früh
        aus — der Rest der Klebephase wäre tot.
      */
      /*
        `stage` — vier Frames auf EINER klebenden Bühne.

        Bis Runde 3 war jeder Frame eine eigene hohe Sektion. Dazwischen
        lagen 640 px, in denen der fertige Satz nur weggeschoben und der
        nächste herangeschoben wurde: Bewegung ohne Aussage. Jetzt steht
        die Bühne still, und die Frames wechseln an derselben Stelle.

        Der Fortschritt der Sektion wird in Fenster zerlegt — eines je
        Frame, GEWICHTET nach Zeichenzahl. Gleich große Fenster hätten
        den längsten Satz (313 Zeichen) 2,2-mal schneller aufgebaut als
        den kürzesten (141); so bleibt die Lesegeschwindigkeit gleich.

        Innerhalb eines Fensters: Zeichenaufbau bis (1 − FADE), dann
        Überblendung. Die Überblendung teilen sich zwei Frames — der
        eine geht von 1 auf 0, während der andere von 0 auf 1 geht, ihre
        Summe bleibt 1. Ohne diese Überlappung wäre der Bildschirm am
        Fensterwechsel für einen Moment leer.

        Gerechnet wird hier und nicht in verschachteltem CSS-calc: die
        Werte sind so nachmessbar.
      */
      if (name === "stage") {
        const section = el.closest("section") ?? el;
        const pin = section.querySelector<HTMLElement>("[data-pin]");
        const frames = Array.from(
          el.querySelectorAll<HTMLElement>("[data-frame]"),
        );
        if (frames.length === 0) return () => {};

        // Fenstergrenzen nach Zeichenzahl. Die Zeichen stehen schon im
        // HTML (ScrollText splittet zur Build-Zeit), also ist das ein
        // einmaliges Zählen ohne Layout-Kosten.
        const weights = frames.map(
          (f) => f.querySelectorAll(".char").length || 1,
        );
        const total = weights.reduce((a, b) => a + b, 0);
        const bounds: Array<[number, number]> = [];
        let acc = 0;
        for (const w of weights) {
          bounds.push([acc / total, (acc + w) / total]);
          acc += w;
        }
        frames.forEach((f, i) => {
          f.dataset.start = bounds[i][0].toFixed(4);
        });

        /*
          Runde 6: SEQUENZIELLER Wechsel statt Überblendung — auf
          Wunsch des Auftraggebers das Gegenteil der Runde-4-Entscheidung
          (siehe die alte Fassung dieses Kommentars in der Historie):
          erst blendet der auslaufende Frame vollständig auf 0, dann erst
          der einlaufende von 0 hoch. Beide teilen sich weiterhin
          dieselbe Breite FADE (nicht je eine eigene), aber nicht mehr
          dieselbe STRECKE: `fadeOut` läuft wie zuvor über die LETZTEN
          FADE der eigenen Fensterbreite (bis genau `to`), `fadeIn` aber
          erst AB `from` (statt schon davor) über die ERSTEN FADE der
          eigenen Fensterbreite. Beide Zonen grenzen exakt aneinander
          (`to_i === from_{i+1}`), überlappen also nicht mehr — an der
          Grenze selbst stehen kurz BEIDE bei 0, die Bühne ist für einen
          Wimpernschlag leer, bevor der nächste Satz erscheint.
          FADE wächst dafür von 0.035 auf 0.09: mit der alten, engen
          Breite wäre der leere Moment kaum wahrnehmbar gewesen.
        */
        const FADE = 0.09;
        const texts = frames.map((f) =>
          f.querySelector<HTMLElement>(".two-tone"),
        );
        let lastActive = -1;
        let pinHeight = 0;
        let pinOffset = 0;
        let measuredFor = 0;

        const invalidate = () => {
          measuredFor = 0;
        };
        window.addEventListener("resize", invalidate, { passive: true });

        const stop = registerScroll(section, (rect, vh) => {
          if (vh !== measuredFor) {
            pinHeight = pin ? pin.offsetHeight : vh;
            pinOffset = pin ? parseFloat(getComputedStyle(pin).top) || 0 : 0;
            measuredFor = vh;
          }
          const span = Math.max(rect.height - pinHeight, vh * 0.5);
          // LEAD verschiebt den Nullpunkt vor das Anliegen (siehe oben),
          // OHNE den Endpunkt zu verschieben: bei rect.top === pinOffset
          // − span (der alte p=1-Punkt) ergibt die Formel weiterhin
          // genau 1, weil Zähler und Nenner um denselben LEAD wachsen.
          const lead = vh * STAGE_LEAD_FRACTION;
          const p = clamp01((pinOffset - rect.top + lead) / (span + lead));
          el.style.setProperty("--p", p.toFixed(4));

          let active = 0;
          let bestO = -1;
          frames.forEach((f, i) => {
            const [from, to] = bounds[i];

            // Sequenziell (Runde 6): fadeIn beginnt erst AB `from`
            // (nicht schon davor) — grenzt exakt an fadeOut des
            // Vorgängers, statt sich mit ihm zu überlappen.
            const fadeIn = i === 0 ? 1 : clamp01((p - from) / FADE);
            const fadeOut =
              i === frames.length - 1 ? 1 : clamp01((to - p) / FADE);
            const o = Math.min(fadeIn, fadeOut);

            /*
              DIREKT auf opacity schreiben, NICHT über eine Custom
              Property.

              --o wurde von genau einer Regel gelesen (motion.css,
              `html.scroll-ready .story-frame`), aber Custom Properties
              VERERBEN: jede Änderung an --o zwang den Browser, die
              berechneten Stile aller 703 Zeichen-Spans unter diesem
              Frame neu zu ermitteln — obwohl .char das --o nie benutzt.

              Gerendert wird exakt dasselbe; die Regel in motion.css
              steht deshalb auf `opacity: 0` und wird hier überschrieben,
              statt auf `var(--o, 0)` zu warten.

              EHRLICHE EINORDNUNG (gemessen am 13.09.2026, Chrome
              headless, 1440×900 @2×, echtes Scrollen durch die Bühne):
              Isoliert kostet dieser Schreibvorgang als Custom Property
              11,6 ms, als style.opacity 0,04 ms. Auf die Bildrate
              schlägt das NICHT durch — bei vierfach gedrosselter CPU
              messen alte und neue Fassung identische 47,1 fps, bei
              sechsfacher 36,7 gegen 39,3 fps. Das ist Aufräumen von
              nachweislich überflüssiger Arbeit, kein Performance-Gewinn.
              Der eigentliche Kostenträger sind die 703 Zeichen-Spans
              selbst; nur eine gröbere Granularität (Wort statt Zeichen)
              würde daran etwas ändern, und das ist eine gestalterische
              Entscheidung, keine technische.
            */
            f.style.opacity = o.toFixed(3);

            /*
              Der Zeichenaufbau nur für Frames, die man auch SIEHT.

              Vorher liefen alle vier — also auch die drei unsichtbaren,
              deren Text niemand lesen kann. Bei sequenzieller
              Überblendung ist fast immer genau einer sichtbar, während
              der Wechsel kurz zwei. Aus vier Teilbäumen mit zusammen
              703 Spans werden so ein bis zwei.

              Nicht „nur der aktive Frame": `active` wird unten über die
              höchste Deckkraft bestimmt und wechselt erst in der Mitte
              der Blende. Ein einlaufender Frame wäre also schon zu
              sehen, bevor er aktiv ist — und zeigte so lange einen
              veralteten Aufbaustand.

              Ein Frame bei o === 0 behält seinen letzten Wert. Das ist
              richtig: unsichtbar, und beim nächsten Erscheinen wird er
              im selben Frame wieder geschrieben.
            */
            if (o > 0) {
              // Der Aufbau ist fertig, BEVOR das Ausblenden beginnt.
              const build = clamp01((p - from) / Math.max(to - from - FADE, 1e-4));
              f.style.setProperty("--p", build.toFixed(4));
              texts[i]?.style.setProperty("--p", build.toFixed(4));
            }

            // Der deckendste Frame ist der aktive. Ein fester
            // Schwellwert versagte mitten in der Überblendung, wo keiner
            // der beiden darüber liegt.
            if (o > bestO) {
              bestO = o;
              active = i;
            }
          });

          if (active !== lastActive) {
            lastActive = active;
            el.dataset.active = String(active);

            /*
              Runde 5: der letzte Frame trägt jetzt einen CTA-Button.
              Alle Frames liegen absolut übereinander — ohne dieses
              Schalten wäre der Button auch dann klickbar (bzw. bei
              Tastatur-Tab erreichbar), wenn sein Frame gerade
              unsichtbar unter einem anderen liegt. Nur der AKTIVE
              Frame bekommt pointer-events; die CSS-Regel (.story-frame)
              setzt „none" als Grundzustand, das hier NUR für den
              aktiven Frame überschrieben wird.
            */
            frames.forEach((f, i) => {
              f.style.pointerEvents = i === active ? "auto" : "";
            });
          }
        });

        return () => {
          window.removeEventListener("resize", invalidate);
          stop();
          // Die oben gesetzte Inline-Deckkraft wieder abräumen, sonst
          // bliebe sie beim Seitenwechsel an den Frames hängen und
          // überstimmte die CSS-Regel des nächsten Zustands.
          frames.forEach((f) => {
            f.style.opacity = "";
          });
        };
      }

      if (name === "slow") {
        const section = el.closest("section") ?? el;
        const pin = section.querySelector<HTMLElement>("[data-pin]");
        let pinHeight = 0;
        let pinOffset = 0;
        let measuredFor = 0;

        // Neu vermessen, wenn sich das Fenster ändert — die Bandhöhe
        // hängt an einem Breakpoint, nicht nur an der Fensterhöhe.
        const invalidate = () => {
          measuredFor = 0;
        };
        window.addEventListener("resize", invalidate, { passive: true });

        const stop = registerScroll(section, (rect, vh) => {
          if (vh !== measuredFor) {
            // Sonst läse hier jeder Frame Layout zurück, mitten in der
            // Schreibphase.
            pinHeight = pin ? pin.offsetHeight : vh;
            pinOffset = pin ? parseFloat(getComputedStyle(pin).top) || 0 : 0;
            measuredFor = vh;
          }
          const span = Math.max(rect.height - pinHeight, vh * 0.5);
          el.style.setProperty("--p", clamp01((pinOffset - rect.top) / span).toFixed(4));
        });

        return () => {
          window.removeEventListener("resize", invalidate);
          stop();
        };
      }

      return registerScroll(el, (rect, vh) => {
        el.style.setProperty("--p", compute(rect, vh).toFixed(4));
      });
    });

    // Notausgang: laufen die rAF-Frames nie (JS-Fehler, dauerhaft
    // gedrosselter Tab), bleibt kein Scrub-Text unter der Lesbarkeit
    // hängen. Gleiche Idee wie der 2,5-s-Timer in Reveal.
    const failsafe = window.setTimeout(() => {
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.style.setProperty("--p", "1");
        }
      }
    }, 4000);

    return () => {
      cleanups.forEach((fn) => fn());
      window.clearTimeout(failsafe);
    };
  }, [pathname]);

  return null;
}
