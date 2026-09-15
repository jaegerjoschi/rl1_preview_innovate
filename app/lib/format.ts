/**
 * Datumsformatierung an einer Stelle.
 *
 * Bewusst mit fester Locale statt der Browsersprache: Server und Browser
 * müssen dasselbe Ergebnis liefern, sonst meldet React einen
 * Hydration-Mismatch und der Text springt beim Laden um.
 */
export function formatDate(iso: string, style: "short" | "long" = "short"): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
