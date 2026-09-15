"use client";

import { useMemo, useState } from "react";
import { cn } from "@/app/lib/cn";

/**
 * Terminvorschlag — bewusst als PRÄFERENZ, nicht als Buchung.
 *
 * Ein selbstgebautes Raster kennt die echte Verfügbarkeit der
 * Ansprechperson nicht; jeder gezeigte Slot wäre geraten. Deshalb steht
 * genau das in der UI: „schlagen Sie bis zu drei Zeiten vor", die
 * Einladung folgt danach. Sobald booking.bookingUrl gefüllt ist, kann
 * hier zusätzlich der Weg zu einem bestätigten Slot erscheinen.
 *
 * Gibt seine Werte über verborgene Felder ans Formular:
 *   wantsMeeting, lengthMinutes, timeZone, slot (mehrfach)
 */
const SLOT_HOURS = [9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX_SLOTS = 3;

function fmtHour(h: number) {
  const hh = Math.floor(h);
  const mm = h % 1 ? "30" : "00";
  return `${String(hh).padStart(2, "0")}:${mm}`;
}

function monthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Montag = 0
  const days: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  const total = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= total; d++) days.push(new Date(year, month, d));
  return days;
}

export function MeetingPreference() {
  const [enabled, setEnabled] = useState(false);
  const [length, setLength] = useState<30 | 60>(30);
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [day, setDay] = useState<Date | null>(null);
  const [slots, setSlots] = useState<string[]>([]);

  const tz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Berlin",
    [],
  );
  const [timeZone, setTimeZone] = useState(tz);

  const cells = useMemo(
    () => monthMatrix(cursor.year, cursor.month),
    [cursor],
  );
  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const toggleSlot = (iso: string) => {
    setSlots((cur) =>
      cur.includes(iso)
        ? cur.filter((s) => s !== iso)
        : cur.length < MAX_SLOTS
          ? [...cur, iso]
          : cur,
    );
  };

  const shiftMonth = (delta: number) => {
    setCursor((c) => {
      const m = c.month + delta;
      return { year: c.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 };
    });
    setDay(null);
  };

  return (
    <div className="rounded-md bg-tint-10 p-block">
      <input type="hidden" name="wantsMeeting" value={enabled ? "true" : "false"} />
      <input type="hidden" name="lengthMinutes" value={length} />
      <input type="hidden" name="timeZone" value={timeZone} />
      {slots.map((s) => (
        <input key={s} type="hidden" name="slot" value={s} />
      ))}

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="mt-1 checkbox"
        />
        <span>
          <span className="block text-body text-ink">Suggest a time for a video call</span>
          <span className="block text-caption text-ink-3">
            Pick up to three slots that suit you. We confirm one by email and send the invite.
          </span>
        </span>
      </label>

      {enabled && (
        <div className="mt-6 flex flex-col gap-6">
          <div className="flex flex-wrap gap-8">
            <fieldset>
              <legend className="mb-2 text-label uppercase text-ink-3">Length</legend>
              <div className="flex gap-2">
                {([30, 60] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={length === m}
                    onClick={() => setLength(m)}
                    className={cn(
                      "rounded-control px-4 py-2 text-body transition-colors duration-150", // Runde 5: Kapsel
                      length === m ? "bg-ink text-bg" : "bg-tint-10 text-ink-2 hover:bg-tint-20",
                    )}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-2">
              <label htmlFor="mp-tz" className="text-label uppercase text-ink-3">
                Your time zone
              </label>
              <input
                id="mp-tz"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                // text-input statt text-body: fest bei 16px, sonst zoomt iOS Safari beim Fokussieren (Runde 5, wie Field.tsx)
                className="rounded-sm border border-tint-30 bg-tint-05 px-4 py-3 text-input text-ink transition-colors duration-150 ease-hover hover:border-tint-50 hover:bg-tint-10 focus:border-accent-hover focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Kalender */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-body text-ink">{monthLabel}</p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() => shiftMonth(-1)}
                    className="rounded-control px-2 py-1 text-ink-2 hover:bg-tint-20"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() => shiftMonth(1)}
                    className="rounded-control px-2 py-1 text-ink-2 hover:bg-tint-20"
                  >
                    ›
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {WEEKDAYS.map((w) => (
                  <span key={w} className="py-1 text-micro uppercase text-ink-3">
                    {w}
                  </span>
                ))}
                {cells.map((d, i) => {
                  if (!d) return <span key={i} />;
                  const past = d < today;
                  const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                  const disabled = past || isWeekend;
                  const selected = day?.toDateString() === d.toDateString();
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={disabled}
                      onClick={() => setDay(d)}
                      className={cn(
                        "rounded-control py-1.5 text-caption transition-colors duration-150", // Runde 5: Kapsel -> Kreis, wie Apples Kalender-Tagesauswahl
                        disabled && "text-ink-3 opacity-40",
                        !disabled && !selected && "text-ink-2 hover:bg-tint-20",
                        selected && "bg-ink text-bg",
                      )}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slots */}
            <div>
              <p className="mb-3 text-body text-ink-2">
                {day
                  ? day.toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      timeZone: "UTC",
                    })
                  : "Pick a day first"}
              </p>
              {/* Kein eigenes Scroll-Fenster: der fette Balken neben dem
                  Kalender war die auffälligste Kante im ganzen Formular.
                  Das Raster wächst jetzt mit, die Seite scrollt. */}
              {day && (
                <div className="grid grid-cols-3 gap-2">
                  {SLOT_HOURS.map((h) => {
                    const dt = new Date(day);
                    dt.setHours(Math.floor(h), h % 1 ? 30 : 0, 0, 0);
                    const iso = dt.toISOString();
                    const chosen = slots.includes(iso);
                    const full = !chosen && slots.length >= MAX_SLOTS;
                    return (
                      <button
                        key={h}
                        type="button"
                        aria-pressed={chosen}
                        disabled={full}
                        onClick={() => toggleSlot(iso)}
                        className={cn(
                          "rounded-control border px-2 py-2 text-caption transition-colors duration-150", // Runde 5: Kapsel
                          chosen
                            ? "border-ink bg-ink text-bg"
                            : "border-tint-30 text-ink-2 hover:border-accent-hover",
                          full && "opacity-40",
                        )}
                      >
                        {fmtHour(h)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <p className="text-caption text-ink-3">
            {slots.length === 0
              ? "No slot selected yet. Add up to three so we can match your calendar on the first try."
              : `${slots.length} of ${MAX_SLOTS} slots selected.`}
          </p>
        </div>
      )}
    </div>
  );
}
