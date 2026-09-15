"use client";

import { useEffect } from "react";

/**
 * Gibt die Einblendungen frei, sobald die Schriften geladen sind — sonst
 * springt der Text mitten in der Animation, wenn die Ersatzschrift durch die
 * echte ersetzt wird.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * Hier lief vorher Lenis (weiches Scrollen). Wieder ausgebaut, weil es genau
 * das Problem erzeugt, das es lösen soll: Lenis fängt das native Scrollen ab
 * und interpoliert die Position, wodurch die Seite dem Finger nicht mehr 1:1
 * folgt, sondern nachzieht. Am Trackpad fühlt sich das träge an.
 *
 * Dazu kommt: Scrollen ist die häufigste Interaktion überhaupt. Was hundert-
 * fach am Tag passiert, animiert man nicht — dieselbe Regel, nach der auch
 * Tastaturbefehle ohne Animation auskommen. Natives Scrollen ist bereits vom
 * Browser optimiert und läuft außerhalb des Hauptthreads.
 * ─────────────────────────────────────────────────────────────────────────
 */
export default function FontsReady() {
  useEffect(() => {
    const html = document.documentElement;
    const mark = () => html.classList.add("fonts-ready");

    if (document.fonts?.status === "loaded") {
      mark();
      return;
    }

    document.fonts?.ready.then(mark).catch(mark);
    // Notausgang: bei blockierten Schriften nie dauerhaft ohne Animation bleiben
    const timer = setTimeout(mark, 1500);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
