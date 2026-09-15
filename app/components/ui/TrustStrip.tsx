import Image from "next/image";

import { participants, type Role } from "@/app/data/participants";
import { cn } from "@/app/lib/cn";
import { asset } from "@/app/lib/basePath";

/**
 * Vertrauensband: Label über einem durchlaufenden Logostreifen.
 *
 * Bewusst EINE Komponente für Startseite, Über uns und Kontakt. Die Zahl
 * im Text kommt aus den Daten, nicht aus dem Markup.
 *
 * Die Logos sind die weißen, freigestellten Fassungen aus
 * public/logos/mono (erzeugt von scripts/build-logo-mono.mjs). Die
 * Quelldateien sind undurchsichtige Quadrate — "grayscale + opacity"
 * darauf ergab graue Kacheln statt freistehender Marken. Wo noch keine
 * Monoversion existiert, fällt die Darstellung sichtbar auf das Original
 * zurück, damit die Lücke auffällt statt still zu verschwinden.
 *
 * Der Streifen läuft zweimal durch das Markup; nach der ersten Hälfte
 * springt die Animation zurück, und weil dort derselbe Inhalt steht,
 * sieht man den Sprung nicht. Bewegt wird nur `transform`, gleichmäßig —
 * siehe .marquee in globals.css. `prefers-reduced-motion` hält an.
 *
 * Runde 6: optional auf eine Rolle einschränkbar (`role`) mit eigenem
 * Text (`label`) — /join zeigt damit nur die Mitgliedsbanken statt aller
 * Beteiligten („wer schon Member ist", nicht „wer das Netzwerk
 * betreibt/beobachtet" — auf der Kontaktseite die richtigere Aussage).
 * Startseite und /about bleiben unverändert (kein `role`, alle Logos).
 */
export function TrustStrip({
  className,
  role,
  label,
}: {
  className?: string;
  role?: Role;
  label?: string;
}) {
  const scoped = role ? participants.filter((p) => p.roles?.includes(role)) : participants;

  // Alphabetisch, damit die Reihenfolge nicht wie eine Rangliste wirkt
  const logos = scoped
    .filter((p) => p.logo)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "en"));

  // Runde 11: „supported" statt „observed" — dasselbe Verb benennt jetzt
  // die Rolle, die auf der Seite „Supporters" heißt (vorher „Observers").
  const text = label ?? `Regulated Layer One is built, run and supported by ${scoped.length} institutions`;

  return (
    <section
      aria-label={text}
      className={cn("overflow-hidden py-16", className)}
    >
      <p className="mb-10 text-center text-label-lg uppercase text-ink-2">{text}</p>

      <div className="marquee">
        <ul className="marquee-track">
          {[0, 1].map((copy) => (
            <li key={copy} aria-hidden={copy === 1} className="marquee-group">
              {logos.map((p) => (
                <span key={`${copy}-${p.name}`} className="shrink-0">
                  <Image
                    src={asset(p.logoMono ?? p.logo!)}
                    alt={copy === 0 ? p.name : ""}
                    width={180}
                    height={72}
                    loading="lazy"
                    className={cn(
                      "h-10 w-auto object-contain sm:h-16",
                      p.logoMono ? "opacity-90" : "opacity-70 grayscale",
                    )}
                  />
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
