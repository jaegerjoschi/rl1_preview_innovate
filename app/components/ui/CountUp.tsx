"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Zahl, die beim Eintritt einmal hochzählt. Der Endwert steht im HTML —
 * JS ersetzt ihn nur während der ~900 ms und stellt ihn danach wieder
 * her. Ohne JS oder bei reduzierter Bewegung: sofort der Endwert.
 *
 * `tabular-nums` (in der Klasse) hält die Breite konstant, damit nichts
 * springt.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;
        io.disconnect();

        const start = performance.now();
        const dur = 900;
        const from = 0;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(Math.round(from + (value - from) * eased));
          if (t < 1) requestAnimationFrame(tick);
          else setDisplay(value);
        };
        setDisplay(0);
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {new Intl.NumberFormat("en-US").format(display)}
      {suffix}
    </span>
  );
}
