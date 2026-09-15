"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Container, Section } from "@/app/components/ui/primitives";
import { networkRoles } from "@/app/data/network-roles";
import { participants } from "@/app/data/participants";
import { cn } from "@/app/lib/cn";
import { asset } from "@/app/lib/basePath";

/**
 * „The Regulated Layer One Network" — drei Rollenzeilen, rechts ein
 * klebendes Feld, dessen Logos zur gerade gelesenen Zeile gehören.
 *
 * Runde 5: vorher hing der Wechsel an einem eigenen Scroll-Listener mit
 * Mindestverweildauer (DWELL_MS) und Hysterese-Schwelle — ein
 * Workaround gegen das Nervösе Hin-und-Herspringen, weil die Sektion
 * selbst nicht klebte, sondern nur der rechte Rand per `sticky top-28`
 * innerhalb der eigenen (variablen) Zeilenhöhe. Jetzt ist die Sektion
 * eine echte Klebebühne wie AboutIntro und die Story (`minHeight="story"`,
 * `data-pin`, `scrub="slow"`): sie hält an, sobald sie mittig steht, und
 * erst Weiterscrollen bewegt den aktiven Zustand durch die drei Rollen —
 * das ist genau das gewünschte Verhalten, nicht mehr ein Symptom, das
 * mit Dwell/Hysterese kaschiert werden musste.
 *
 * `active` kommt aus `--p` (0→1 über die Klebestrecke), das MotionRoot
 * (`slow`) ohnehin auf die Sektion schreibt: ein MutationObserver auf
 * das style-Attribut liest es, sobald es sich ändert — dieselbe Technik,
 * mit der vorher StoryNav den aktiven Story-Frame gelesen hat.
 */
export default function NetworkRoles() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = document.getElementById("network");
    if (!section) return;

    const read = () => {
      const raw = getComputedStyle(section).getPropertyValue("--p");
      const p = parseFloat(raw) || 0;
      const next = Math.min(networkRoles.length - 1, Math.floor(p * networkRoles.length));
      setActive((cur) => (cur === next ? cur : next));
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(section, { attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
  }, []);

  return (
    <Section
      id="network"
      label="The Regulated Layer One Network"
      scrub="slow"
      minHeight="story"
      className="overflow-x-clip"
    >
      <div
        data-pin
        className="sticky top-[var(--spacing-header)] flex h-[calc(100svh-var(--spacing-header))] items-center lg:top-[var(--spacing-header-md)] lg:h-[calc(100svh-var(--spacing-header-md))]"
      >
        <Container className="w-full">
          <h2 className="text-h2 text-ink">The Regulated Layer One Network</h2>

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16">
            <div className="border-t border-hairline">
              {networkRoles.map((role, i) => (
                <div
                  key={role.id}
                  className="grid gap-3 border-b border-hairline py-9 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8"
                >
                  <h3
                    className={cn(
                      "text-statement transition-colors duration-300 ease-hover",
                      i === active ? "text-ink" : "text-ink-3",
                    )}
                  >
                    {role.title}
                  </h3>
                  <p className="text-body-lg text-ink-3">{role.body}</p>
                </div>
              ))}
            </div>

            <div className="hidden lg:block">
              <p className="mb-5 text-label uppercase text-ink-3">
                {networkRoles[active].title}
              </p>
              <div className="relative">
                {networkRoles.map((role, i) => (
                  <LogoGrid key={role.id} role={role.role} shown={i === active} stacked={i > 0} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}

/** Alle Sätze liegen übereinander und blenden über — kein Springen. */
function LogoGrid({
  role,
  shown,
  stacked,
}: {
  role: "member" | "validator" | "supporter";
  shown: boolean;
  stacked: boolean;
}) {
  // Runde 6: alphabetisch, wie NetworkDiagram.tsx schon sortiert —
  // hier fehlte das .sort() bisher, die Reihenfolge folgte der
  // Eintragsreihenfolge in participants.ts und bevorzugte so unbeabsichtigt,
  // wer zuerst eingetragen wurde.
  const logos = participants
    .filter((p) => p.logo && p.roles?.includes(role))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "en"));

  return (
    <ul
      aria-hidden={!shown}
      className={cn(
        // Kein Kasten mehr um jedes Logo, und eine feste Spaltenbreite
        // statt eines Rasters, das sich nach der Anzahl richtet —
        // dadurch sind die Abstände bei jeder Rolle gleich.
        "grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] items-center gap-x-8 gap-y-7",
        "transition-opacity duration-300 ease-hover",
        stacked && "absolute inset-0",
        shown ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {/* Logo mit dem Namen klein darunter, kein Kasten — dieselbe
          Behandlung wie TrustStrip.tsx und NetworkDiagram.tsx: die
          Deckkraft sitzt NUR auf dem Bild (opacity-90 bei echter
          Monoversion, opacity-70+grayscale im Fallback), nicht mehr
          pauschal auf dem ganzen Eintrag (Runde 10 — vorher lief hier
          zusätzlich opacity-50 aufs <li>, wodurch die Logos sichtbar
          transparenter als im Trust-Strip wirkten). Der Name steht
          sichtbar da, das alt-Attribut bleibt deshalb leer. */}
      {logos.map((p) => (
        <li key={p.name} className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 items-center">
            <Image
              src={asset(p.logoMono ?? p.logo!)}
              alt=""
              width={200}
              height={80}
              loading="lazy"
              className={cn(
                "h-11 w-auto object-contain",
                p.logoMono ? "opacity-90" : "opacity-70 grayscale",
              )}
            />
          </span>
          <span className="text-micro leading-tight text-ink-2">{p.name}</span>
        </li>
      ))}
    </ul>
  );
}
