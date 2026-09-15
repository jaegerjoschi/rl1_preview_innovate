import type { ElementType, ReactNode } from "react";
import { cn } from "@/app/lib/cn";

/**
 * Layout-Primitives. Jede Sektion setzt sich hieraus zusammen, statt eigene
 * Abstände und Breiten mitzubringen — so bleibt der vertikale Rhythmus über
 * die ganze Seite gleich und lässt sich an einer Stelle ändern.
 */

/*
  EINE Sektionsbreite. `narrow` gab es bis Runde 2 zusätzlich (800px) —
  daneben stand `page` (1312px), beide zentriert, wodurch die linke Kante
  zwischen zwei Sektionen um ~256px sprang. Das war das sichtbare
  "Flattern" der Randabstände.

  Kürzere Zeilenlänge kommt jetzt über `max-w-measure` am TEXTBLOCK, nicht
  über einen schmaleren Container — dann fluchtet die Kante über die
  ganze Seite und der Fließtext bleibt trotzdem lesbar breit.
*/
const widths = {
  page: "max-w-page", // 1312 — der Standard, und praktisch der einzige
  prose: "max-w-measure", // ~672 — nur für reine Textseiten
} as const;

export function Container({
  children,
  className,
  as: Tag = "div",
  width = "page",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  width?: keyof typeof widths;
}) {
  return (
    <Tag className={cn("mx-auto w-full px-6 md:px-10 lg:px-16", widths[width], className)}>
      {children}
    </Tag>
  );
}

export function Section({
  children,
  id,
  className,
  tone = "black",
  surface, // veraltet — fällt weg; solange als Alias auf tone
  size = "default",
  label,
  scrub,
  minHeight = "screen",
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  tone?: "black" | "off-black";
  surface?: "base" | "raised";
  size?: "default" | "compact" | "tight";
  /**
   * Mindesthöhe. Jede Inhaltssektion füllt einen Bildschirm; die
   * Story-Sektionen sind höher, damit der Textaufbau Zeit bekommt;
   * Bänder (Logostreifen) behalten ihre natürliche Höhe.
   *
   * Bewusst ein Prop statt einer Utility im className: `cn` ist ein
   * einfaches Join ohne tailwind-merge — zwei min-h-Klassen am selben
   * Element würden sich nach CSS-Reihenfolge überschreiben, nicht nach
   * Absicht.
   */
  minHeight?: "screen" | "tall" | "story" | "none";
  /** Für Screenreader, wenn die Sektion keine sichtbare Überschrift hat */
  label?: string;
  /**
   * Registriert die Sektion bei der Scroll-Engine. --p liegt dann auf der
   * Sektion und VERERBT sich an alle Kinder — so können Bild und andere
   * Deko am Fortschritt der Sektion hängen, während der Text sein eigenes
   * --p mitbringt (das das geerbte auf sich selbst überschreibt).
   */
  scrub?: "enter" | "late" | "slow" | "stage" | "travel";
}) {
  const effectiveTone = surface === "raised" ? "off-black" : tone;

  return (
    <section
      id={id}
      aria-label={label}
      data-scrub={scrub}
      className={cn(
        "relative",
        size === "default" && "py-section-sm md:py-section",
        size === "compact" && "py-16 md:py-20",
        // Runde 7: für Sektionen, die enger aneinander stehen sollen als
        // der Standardrhythmus (Latest News, Use Cases, Our Values,
        // Principles) — eigener Wert statt "compact", weil "compact"
        // mobil (64px) sogar über dem Standard (48px) liegt.
        size === "tight" && "py-10 md:py-16",
        // Sektionen trennen sich über Fläche und Abstand, nicht über
        // Linien — die Striche dazwischen sind in Runde 3 entfallen.
        // Runde 5: zieht die Höhe der sticky Navbar ab (--spacing-header
        // in globals.css), damit Header + Sektion zusammen exakt 100svh
        // ergeben. Ohne das ist jede „Bildschirm"-Sektion um die
        // Headerhöhe zu hoch, weil der sticky Header selbst Platz im
        // Fluss beansprucht statt nur zu überlagern.
        minHeight === "screen" &&
          "flex min-h-[calc(100svh-var(--spacing-header))] flex-col justify-center md:min-h-[calc(100svh-var(--spacing-header-md))]",
        // Runde 8: 150svh → 120svh („Use cases etwas niedriger"). Der
        // Ring darin ist kleiner geworden (UseCases.tsx), die Sektion
        // braucht die anderthalb Bildschirme nicht mehr.
        minHeight === "tall" && "min-h-[120svh]",
        // Story: das klebende Kind ist 100svh hoch, also ist die
        // Aufbaustrecke (Höhe − 100svh) das, was der Leser als Tempo
        // wahrnimmt. Bei 150svh waren das 50svh Aufbau gegen 100svh
        // reines Durchschieben — zwei Drittel Leerlauf. 220svh dreht
        // das Verhältnis um: 120svh Aufbau, 100svh Übergang.
        minHeight === "story" && "min-h-[220svh]",
        effectiveTone === "off-black" && "bg-bg-2",
        // Anker-Ziele dürfen nicht unter dem Sticky-Header landen
        id && "scroll-mt-24",
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * Kopfbereich einer Unterseite. Trägt das einzige <h1> der Seite.
 */
export function PageHero({
  title,
  lead,
  children,
  eyebrow,
}: {
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div>
      <Container className="py-20 md:py-28">
        {eyebrow && (
          <p className="mb-5 text-label-lg uppercase text-ink-3">{eyebrow}</p>
        )}
        <h1 className="max-w-4xl text-h1 text-ink">{title}</h1>
        {lead && <p className="mt-6 max-w-measure text-lead text-ink-3">{lead}</p>}
        {children && <div className="mt-9">{children}</div>}
      </Container>
    </div>
  );
}

/**
 * Sektions-Kopf: optionales Label, Überschrift, optionaler Einleitungssatz.
 */
export function SectionHeader({
  title,
  lead,
  eyebrow,
  align = "left",
  className,
}: {
  title: ReactNode;
  lead?: ReactNode;
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-measure",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-4 text-label-lg uppercase text-ink-3">{eyebrow}</p>
      )}
      <h2 className="text-h2 text-ink">{title}</h2>
      {lead && (
        <p className={cn("mt-4 text-lead text-ink-3", align === "center" && "mx-auto")}>
          {lead}
        </p>
      )}
    </div>
  );
}
