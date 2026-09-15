/**
 * Muss exakt `basePath` aus next.config.ts spiegeln.
 *
 * next/image prefixt bei `images.unoptimized: true` den `src` nicht
 * automatisch mit basePath — deshalb hier von Hand für alle Referenzen
 * auf public/-Dateien, die als literaler String (nicht als Import)
 * eingebunden sind.
 */
export const basePath = "/rl1_preview_innovate";

/** Prefixt einen public/-Pfad mit basePath; lässt absolute URLs unangetastet. */
export function asset(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${basePath}${path}`;
}
