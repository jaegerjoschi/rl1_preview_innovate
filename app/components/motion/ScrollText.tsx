import { cn } from "@/app/lib/cn";

/**
 * Text, der sich beim Scrollen Zeichen für Zeichen aufhellt.
 *
 * Aufbau 1:1 nach der Referenz (sharplink.com/about). Dort steht im
 * Stylesheet:
 *
 *   .word { color: inherit !important; display: inline-block;
 *           white-space: nowrap }
 *   .char { opacity: .4 }
 *
 * Das Wort ist also nur die Umbruch-Einheit — animiert wird das
 * ZEICHEN. Genau daher kommt der Eindruck eines Leuchtstreifens, der
 * durch den Satz wandert. Unsere frühere Fassung animierte ganze
 * Wörter und las sich deshalb als weiche Folge statt als Kante.
 *
 * Server-Komponente: der Split passiert zur BUILD-Zeit. Der
 * vollständige Satz steht im ausgelieferten HTML — kein CLS, kein
 * Umbruch-Sprung nach der Hydration, lesbar für Crawler.
 *
 * Ohne JavaScript bleibt --p auf 1 und damit jedes Zeichen sichtbar.
 */

/** Über welchen Anteil des Fortschritts sich die Startpunkte verteilen. */
const SPREAD = 0.85;

export function ScrollText({
  lead,
  rest,
  as: Tag = "p",
  className,
  profile,
  start = 0,
  span = SPREAD,
  static: isStatic = false,
}: {
  lead: string;
  rest?: string;
  as?: "p" | "h2" | "h3" | "blockquote";
  className?: string;
  /**
   * Fensterprofil der Scroll-Engine (siehe useScrollProgress).
   * "inherit" registriert NICHT selbst — --p kommt dann von einem
   * Vorfahren. Nötig bei klebendem Inhalt: ein sticky Element steht
   * still, sein eigenes rect taugt also nicht als Fortschrittsmaß.
   */
  profile?: "enter" | "late" | "slow" | "inherit";
  /**
   * Welchen Abschnitt des Fortschritts dieser Block belegt. Nötig, wenn
   * MEHRERE Blöcke an derselben Sektion hängen: ohne Versatz bekämen
   * alle dasselbe --p und würden gleichzeitig aufleuchten — die Kante
   * liefe dann durch zwei Absätze parallel statt durch beide nachein-
   * ander. Die Werte der Geschwister müssen zusammen auf SPREAD passen.
   */
  start?: number;
  span?: number;
  static?: boolean;
}) {
  const text = [lead, rest].filter(Boolean).join(" ").trim();

  if (isStatic) {
    return (
      <Tag className={className}>
        {lead ? <span className="text-ink">{lead} </span> : null}
        {rest ? <span className="text-ink-ghost">{rest}</span> : null}
      </Tag>
    );
  }

  // "\n" im Text erzwingt einen Zeilenumbruch, ohne den Scrub zu teilen
  const words = text.split(/[ \t]+/);
  const totalChars = Math.max(text.replace(/\s+/g, "").length - 1, 1);
  let seen = 0;

  return (
    <Tag
      className={cn("two-tone", className)}
      {...(profile === "inherit" ? {} : { "data-scrub": profile ?? "" })}
    >
      {words.map((word, w) => {
        const [before, after] = word.split("\n");
        const render = (chunk: string) =>
          Array.from(chunk).map((ch, c) => {
            const s = (start + (seen++ / totalChars) * span).toFixed(4);
            return (
              <span key={c} className="char" style={{ "--s": s } as React.CSSProperties}>
                {ch}
              </span>
            );
          });

        return (
          <span key={w}>
            {before ? <span className="word">{render(before)}</span> : null}
            {after !== undefined ? <br /> : null}
            {after ? <span className="word">{render(after)}</span> : null}
            {w < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </Tag>
  );
}
