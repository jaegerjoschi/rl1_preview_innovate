import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/app/lib/cn";
import { Icon } from "@/app/components/ui/icons";

type Variant = "primary" | "outline" | "flat";
type Size = "sm" | "md";

/*
  Runde 12: dritte Richtung. `down` trägt den Sprung in die Sektion
  DARUNTER (Hero, AboutHero) — ein Rechtspfeil zeigte dort nach vorn,
  obwohl es hinunter geht.

  Name und Hover-Bewegung als Tabelle statt verschachtelter Ternäre: bei
  drei Richtungen wird die zweite Verzweigung unleserlich, und eine
  vierte müsste sonst an zwei Stellen nachgetragen werden.
*/
type ArrowDir = "right" | "left" | "down";

const ARROW_ICON: Record<ArrowDir, string> = {
  right: "arrow",
  left: "arrow-left",
  down: "arrow-down",
};

/* Der Pfeil wandert beim Hover in seine eigene Richtung. */
const ARROW_NUDGE: Record<ArrowDir, string> = {
  right: "group-hover:translate-x-0.5",
  left: "group-hover:-translate-x-0.5",
  down: "group-hover:translate-y-0.5",
};

/*
  Eine Bedienelement-Geometrie für die ganze Seite — Buttons, Pills,
  Formular-Submit. Wer irgendwo px-8 statt dieser Größen schreibt, bricht
  das System.

  Höhen nach dem Entwurf (dort durchgängig 43–47px), nicht nach einer
  runden Zahl: 48px wirkte in dichten Kontexten klobig.

  `active:scale-[0.97]` ist der wichtigste Teil: ohne Druckfeedback wirkt
  ein Button tot. 160 ms liegt im Bereich, in dem sich der Druck sofort
  anfühlt, ohne zu zappeln. Nur die Eigenschaften animieren, die sich
  wirklich ändern — `transition-all` überwacht sonst jede.

  Runde 10: `border-transparent` steht NICHT mehr hier in `base`, sondern
  in JEDER Variante einzeln (auch dort, wo sie unsichtbar bleibt). Grund:
  `outline` braucht eine echte Randfarbe (`border-accent`) — läge
  `border-transparent` weiter in `base`, konkurrierten zwei Utility-
  Klassen um dieselbe CSS-Property (border-color), und welche gewinnt,
  hinge von Tailwinds interner Generierungsreihenfolge ab, nicht von der
  Reihenfolge im className-String. `base` setzt jetzt nur noch die Breite
  (`border`), die Farbe kommt ausschließlich aus der Variante.
*/
/*
  Runde 11: `font-semibold` statt `font-medium` — die Beschriftung läuft
  in Poppins 600 (Wunsch des Auftraggebers; kurz auf 700 gestellt, dann
  auf Semibold zurückgenommen). 600 liegt ohnehin im geladenen Satz, es
  kommt also keine zusätzliche Schriftdatei dazu.
*/
const base =
  "group inline-flex items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap " +
  "border " +
  "transition-[transform,background-color,border-color,color] duration-150 ease-hover " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

/*
  Drei Varianten, auf Wunsch des Auftraggebers (Runde 10) auf die neue
  Akzentfarbe `--color-accent` vereinheitlicht — der Farbwert selbst
  steckt allein im Token (globals.css), hier stehen nur die drei STILE,
  die ihn tragen:
    primary  gefüllt   — bg-accent, dunkler Text (accent-ink) für Kontrast
    outline  umrandet  — transparenter Grund, Rand + Text in accent
    flat     nur Text  — kein Rand, keine Fläche, Text in accent
  `ghost`/`quiet` hießen bisher uneinheitlich (quiet trug z. B. „How it
  works", sah aber nicht wie „ghost" aus) — die neuen Namen beschreiben
  direkt den sichtbaren Stil.
*/
const variants: Record<Variant, string> = {
  primary: "border-transparent bg-accent text-accent-ink hover:bg-accent-hover",
  /*
    Runde 12: der Outline-Button FÜLLT sich beim Hovern — das nimmt die
    Runde-6-Entscheidung zurück, die den Flächen-Hover ausdrücklich
    herausgenommen hatte (damals ebenfalls auf Wunsch des Auftraggebers).

    Gefüllt wird mit `accent-hover`, NICHT mit `accent`: sonst sähe ein
    gehoverter Outline-Button aus wie ein RUHENDER Primary, und beide
    stehen an mehreren Stellen nebeneinander (not-found.tsx, BandCta).
    So gilt projektweit dieselbe Regel — „gehovert heißt accent-hover
    gefüllt", unabhängig von der Variante.

    Die Textfarbe MUSS mitwechseln: `accent` auf `accent-hover` misst
    1,49:1 und wäre unlesbar. Mit `accent-ink` sind es 8,31:1 — dieselbe
    dunkle Tinte, die Primary schon auf `accent` trägt.

    Kein zusätzlicher transition-Eintrag nötig: `base` überwacht
    background-color, border-color und color bereits.
  */
  outline:
    "border-accent bg-transparent text-accent " +
    "hover:border-accent-hover hover:bg-accent-hover hover:text-accent-ink",
  flat: "border-transparent text-accent hover:text-accent-hover",
};

/*
  Runde 12: EINE Geometrie für alle Buttons. `md` trug bis hier h-10/h-11
  und text-caption/text-body; auf Wunsch des Auftraggebers laufen jetzt
  alle Buttons auf der bisherigen sm-Geometrie — die der Download-Buttons
  auf /resources, die als Maßstab genannt wurde.

  Beide Schlüssel bleiben bestehen (21 Aufrufstellen nennen `md`, und die
  API soll sich nicht ändern), zeigen aber auf DENSELBEN String. Zwei
  Kopien liefen beim nächsten Nachjustieren auseinander.

  `pointer-coarse:h-11` trägt weiterhin das Tap-Ziel: die Klasse steht im
  generierten CSS nach `md:h-9` und gewinnt bei gleicher Spezifität —
  44 px bleiben 44 px, auch auf Tablets oberhalb von 768 px.
*/
const CONTROL =
  "h-8 px-3.5 text-micro pointer-coarse:h-11 md:h-9 md:px-4 md:text-caption";

const sizes: Record<Size, string> = { sm: CONTROL, md: CONTROL };

/*
  Runde 11: `flat` ist ein Link-Button — kein seitliches Polster, damit er
  an der Textkante steht statt wie ein Bedienelement mit unsichtbarer
  Fläche zu wirken (Wunsch des Auftraggebers). Höhe und Schriftgröße
  bleiben aus dem Raster oben, nur die `px-*` fallen weg.

  Eigene Tabelle statt eines zusätzlichen `px-0` im selben `cn()`: zwei
  Utilities für dieselbe CSS-Property (padding-inline) konkurrieren mit
  gleicher Spezifität, und wer gewinnt, hinge an Tailwinds interner
  Generierungsreihenfolge — derselbe Fallstrick wie bei der Randfarbe in
  Runde 10.
*/
const CONTROL_FLAT = "h-8 text-micro pointer-coarse:h-11 md:h-9 md:text-caption";

const flatSizes: Record<Size, string> = { sm: CONTROL_FLAT, md: CONTROL_FLAT };

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  href?: string;
  external?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /**
   * Lädt die verlinkte Datei herunter, statt sie im Browser zu öffnen.
   * Nur für eigene Dateien sinnvoll — `download` ignoriert der Browser
   * bei fremden Ursprüngen. Trägt /resources (PDF-Downloads).
   */
  download?: boolean;
  /**
   * Richtung des Pfeils im Flatbutton. Standard ist "right"; "left" trägt
   * die Zurück-Navigation (BackButton), damit sie flach aussieht, ohne
   * nach vorn zu zeigen; "down" den Sprung in die Sektion darunter
   * (Hero, AboutHero). Bei den anderen Varianten ohne Wirkung — dort
   * steht nie ein Pfeil.
   */
  arrow?: ArrowDir;
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  external,
  disabled,
  type,
  onClick,
  download,
  arrow = "right",
}: Props) {
  const isFlat = variant === "flat";
  const classes = cn(
    base,
    variants[variant],
    isFlat ? flatSizes[size] : sizes[size],
    className,
  );

  /*
    Runde 11: der Flatbutton trägt IMMER einen Pfeil (Wunsch des
    Auftraggebers) — als SVG aus dem Icon-Satz, nicht als „→"-Schriftzeichen:
    ein Glyph hängt am Schnitt der Schrift und stand an den bisherigen
    Fundstellen sichtbar anders da als die gezeichneten Icons daneben.
    Der `gap-2` dafür steht schon in `base`.
  */
  const arrowIcon = (
    <Icon
      name={ARROW_ICON[arrow]}
      size={16}
      className={cn(
        "shrink-0 transition-transform duration-150 ease-out-soft",
        ARROW_NUDGE[arrow],
      )}
    />
  );

  const content = isFlat ? (
    arrow === "left" ? (
      <>
        {arrowIcon}
        {children}
      </>
    ) : (
      <>
        {children}
        {arrowIcon}
      </>
    )
  ) : (
    children
  );

  // Kein href → echter <button> (Formulare, Scroll-Trigger)
  if (!href) {
    return (
      <button type={type ?? "button"} className={classes} disabled={disabled} onClick={onClick}>
        {content}
      </button>
    );
  }

  // mailto:, tel:, Anker und externe Ziele gehen nicht durch den Next-Router
  const isPlainLink = external || /^(https?:|mailto:|tel:|#)/.test(href);

  if (isPlainLink) {
    return (
      <a
        href={href}
        className={classes}
        /*
          Runde 12: Anker-Links dürfen einen Handler tragen. „How it
          works" fängt seinen eigenen Klick ab, weil der gewöhnliche
          Ankersprung den Zieltext zu tief setzt (siehe
          StageCueButton.tsx). Ohne diese Zeile verpuffte der Handler
          still — der Sprung fände trotzdem statt, nur eben falsch.
        */
        onClick={onClick}
        {...(download ? { download: "" } : {})}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={classes}
      onClick={onClick}
      {...(download ? { download: "" } : {})}
    >
      {content}
    </Link>
  );
}

/*
  `ButtonRow` (zwei Buttons auf EINER Breite, min-w-52) ist in Runde 11
  entfallen. Es gab sie nur für die Hero-Paare — dort steht neben dem
  gefüllten Button jetzt ein Flatbutton, also ein randloser Link. Eine
  erzwungene 208px-Spalte hätte dessen Text mittig in eine unsichtbare
  Fläche gesetzt, statt ihn an der Textkante beginnen zu lassen. Hero und
  AboutHero nutzen jetzt eine gewöhnliche Flex-Zeile.
*/
