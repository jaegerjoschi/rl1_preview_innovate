/**
 * Die einzige Scroll-Engine des Projekts.
 *
 * Ein Modul, eine rAF-Schleife, ein IntersectionObserver-Register.
 * `registerScroll(el, onFrame)` ruft onFrame nur auf, solange das
 * Element sichtbar ist; onFrame schreibt selbst die gewünschte Custom
 * Property (meist --p). Ist nichts sichtbar, ruht die Schleife komplett
 * — null Kosten auf Seiten ohne Scroll-Effekte.
 *
 * Hausregel: --p hat den CSS-Default 1. JS bewegt ihn nur nach unten.
 * Bei prefers-reduced-motion registriert sich nichts — jeder Fehlerfall
 * (kein JS, gedrosselter Tab, stummer Observer) landet auf "voll
 * sichtbar / Endzustand".
 *
 * Pro Frame: erst alle getBoundingClientRect() lesen, dann alle
 * onFrame() ausführen (die schreiben) — Read-then-write, kein
 * Layout-Thrashing.
 */

type FrameFn = (rect: DOMRect, vh: number) => void;
type Entry = { el: HTMLElement; onFrame: FrameFn; visible: boolean };

const entries = new Set<Entry>();
let io: IntersectionObserver | null = null;
let raf = 0;
let running = false;

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function loop() {
  const vh = window.innerHeight;
  const pending: Array<[Entry, DOMRect]> = [];
  for (const e of entries) {
    if (e.visible) pending.push([e, e.el.getBoundingClientRect()]);
  }
  for (const [e, rect] of pending) e.onFrame(rect, vh);

  if (pending.length > 0) {
    raf = requestAnimationFrame(loop);
  } else {
    running = false;
    raf = 0;
  }
}

function wake() {
  if (running || prefersReduced()) return;
  running = true;
  raf = requestAnimationFrame(loop);
}

function ensureObserver() {
  if (io) return;
  io = new IntersectionObserver(
    (records) => {
      for (const rec of records) {
        for (const e of entries) {
          if (e.el === rec.target) e.visible = rec.isIntersecting;
        }
      }
      wake();
    },
    // etwas Vorlauf, damit der erste Frame nicht am Rand ruckelt
    { rootMargin: "25% 0px 25% 0px" },
  );
}

export function registerScroll(el: HTMLElement, onFrame: FrameFn): () => void {
  if (prefersReduced()) return () => {};
  ensureObserver();
  const entry: Entry = { el, onFrame, visible: false };
  entries.add(entry);
  io!.observe(el);
  wake();
  return () => {
    entries.delete(entry);
    io?.unobserve(el);
  };
}

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * Runde 5/6: der Vorlauf, mit dem die Story-Bühne (`stage`-Profil,
 * MotionRoot) --p schon VOR dem Anliegen des Pins zu bewegen beginnt —
 * „deutlich früher starten" (Runde 5). Steht hier statt nur in
 * MotionRoot, weil `ScrollProgressRail` (Runde 6, jetzt navigierbar)
 * dieselbe Formel UMGEKEHRT braucht, um aus einem Ziel-`p` die
 * Scroll-Position zu berechnen — dieselbe Konstante an zwei Stellen zu
 * pflegen, liefe irgendwann auseinander.
 */
export const STAGE_LEAD_FRACTION = 0.22;

/**
 * Fensterprofile — WANN im Vorbeiziehen ein Effekt von 0 auf 1 läuft.
 *
 * Bis Runde 2 gab es nur eine feste Lesezone (0.85 → 0.35). Für lange
 * Blöcke war die zu früh fertig: Die Überschrift "RL1 is an ecosystem"
 * war durchgelaufen, bevor man überhaupt bei ihr ankam.
 *
 *  enter  — startet beim Einlaufen, fertig in Leseposition.
 *           Für Text, der sich beim Herankommen aufbauen soll.
 *  late   — startet später und ist erst fertig, wenn der Block die
 *           Bildmitte verlässt. Für große Aussagen, bei denen man den
 *           Aufbau tatsächlich sehen soll.
 *  slow   — für hohe Sektionen mit klebendem Inhalt: 0, sobald das
 *           klebende Kind anliegt, 1 genau dann, wenn es sich wieder
 *           löst. Die Strecke dazwischen misst MotionRoot am Kind
 *           selbst (data-pin), damit Aufbau und Klebephase deckungs-
 *           gleich sind und am Ende kein toter Rest bleibt.
 *           Der Text steht dabei still und füllt sich — so wie in der
 *           Referenz. Ein Satz bekommt damit mehrere hundert Pixel
 *           Scrollweg statt eines Bruchteils davon.
 *  stage  — wie `slow`, aber MotionRoot zerlegt den Fortschritt in
 *           gewichtete Fenster und schreibt je Frame ein eigenes --p
 *           sowie die Deckkraft direkt auf style.opacity. Für die
 *           Story: vier Sätze auf einer Bühne.
 *  travel — 0 → 1 über die gesamte Durchreise. Für Parallax und für
 *           Bilder, die auf- und wieder abblenden.
 */
export type ScrollProfile = "enter" | "late" | "slow" | "stage" | "travel";

export const profiles: Record<ScrollProfile, (rect: DOMRect, vh: number) => number> = {
  enter: (rect, vh) => clamp01((vh - rect.top) / (vh * 0.65)),
  late: (rect, vh) => clamp01((vh * 0.75 - rect.top) / (vh * 0.6)),
  slow: (rect, vh) => clamp01(-rect.top / Math.max(rect.height - vh, vh * 0.5)),
  /* `stage` rechnet MotionRoot selbst aus — hier steht nur der
     Rückfall, falls die Bühne keine Frames enthält. */
  stage: (rect, vh) => clamp01(-rect.top / Math.max(rect.height - vh, vh * 0.5)),
  travel: (rect, vh) => clamp01((vh - rect.top) / (vh + rect.height)),
};

/** Rückwärtskompatibler Name — entspricht dem Profil `enter`. */
export const readingProgress = profiles.enter;
