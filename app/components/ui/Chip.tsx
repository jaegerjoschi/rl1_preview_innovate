"use client";

import { useId } from "react";
import { cn } from "@/app/lib/cn";

/**
 * Auswahl als Chips — eine echte Radiogruppe. Pfeiltasten wechseln die
 * Auswahl (Roving-Tabindex), damit sie sich wie native Radios bedient.
 */
export function Chip({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const groupId = useId();

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = options.indexOf(value);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(options[(i + 1) % options.length]);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(options[(i - 1 + options.length) % options.length]);
    }
  };

  return (
    <div role="radiogroup" aria-labelledby={groupId}>
      <p id={groupId} className="mb-3 text-label uppercase text-ink-3">
        {label}
      </p>
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-wrap gap-2" onKeyDown={onKeyDown}>
        {options.map((opt) => {
          const selected = opt === value;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected || (!value && opt === options[0]) ? 0 : -1}
              onClick={() => onChange(opt)}
              className={cn(
                // rounded-control: Runde 5, Kapselform für alle Bedienelemente.
                // Runde 6: deutlich kleiner (war px-4 py-2.5 text-body) —
                // die Chips standen größer als die größte Überschrift der
                // Seite. pointer-coarse:min-h-11 hält das Tap-Ziel trotzdem
                // am HIG-Minimum.
                "rounded-control px-3 py-1.5 text-micro transition-colors duration-150 ease-hover pointer-coarse:min-h-11 md:text-caption",
                selected
                  ? "bg-ink text-bg"
                  : "bg-tint-10 text-ink-2 hover:bg-tint-20 hover:text-ink",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
