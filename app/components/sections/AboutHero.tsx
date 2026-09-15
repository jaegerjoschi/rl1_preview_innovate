import Image from "next/image";

import { Container } from "@/app/components/ui/primitives";
import { Button } from "@/app/components/ui/Button";
import { StageCueButton } from "@/app/components/ui/StageCueButton";
import { Reveal, RevealLines } from "@/app/components/motion/Reveal";
import { basePath } from "@/app/lib/basePath";

/**
 * Kopf von /about. Gleiche Bauart wie der Startseiten-Hero (Bild +
 * .hero-scrim, dasselbe Mobil-Grid aus Hero.tsx), eigener Text.
 *
 * Runde 5: stand vorher auf `min-h-[62svh]` ohne Rücksicht auf die
 * sticky Navbar — der Block zentrierte sich zwar INNERHALB dieser
 *62svh, aber weil die Navbar davor noch echten Platz im Fluss
 * beansprucht (sie ist sticky, nicht fixed), lag das sichtbare Zentrum
 * spürbar über der Bildschirmmitte. `min-h-[calc(100svh-var(--spacing-
 * header))]` macht daraus wieder einen echten Bildschirm — Navbar
 * eingerechnet — und `items-center` zentriert jetzt tatsächlich mittig.
 *
 * Runde 6 — „Text mittig": dieselbe Grid-Umkehr wie in Hero.tsx — die
 * Textzeile ist jetzt `minmax(0,1fr)` und zentriert sich selbst
 * (`self-center`), das Bild bekommt eine eigene feste Höhe (`h-[38svh]`)
 * statt sich die Restfläche zu nehmen.
 *
 * Runde 8 (siehe Hero.tsx): auch mobil liegt das Motiv wieder hinter
 * dem Text, der Textblock steht mittig darauf — kein getrenntes
 * Zeilen-Grid mehr.
 */
export default function AboutHero() {
  return (
    <section className="hero-scrim about-hero relative flex min-h-[calc(100svh-var(--spacing-header))] items-center overflow-hidden md:min-h-[calc(100svh-var(--spacing-header-md))]">
      <div aria-hidden className="hero-media-sm">
        <Image
          src={`${basePath}/hero/about-hero.jpg`}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[88%_45%] md:object-center"
        />
      </div>

      <Container className="relative z-10 py-8 md:py-0">
        <div className="max-w-3xl">
          <RevealLines
            as="h1"
            className="text-h1 text-ink"
            lines={["RL1 belongs exclusively", "to its members."]}
          />
          <Reveal delayIndex={2} className="mt-4 md:mt-6">
            <p className="max-w-measure text-lead text-ink-2">
              To build the future of digital capital markets together as equals, we have
              democratized the network by establishing a cooperative.
            </p>
          </Reveal>
          <Reveal delayIndex={3} className="mt-6 md:mt-9">
            {/* Runde 11: Flex-Zeile statt ButtonRow — siehe Hero.tsx. */}
            {/* Runde 12: gap-6 statt gap-4 — die Buttons sind auf die
                kleinere Geometrie gerückt (Button.tsx), 16px standen
                daneben zu eng. Der Flatbutton hat kein seitliches
                Polster, der Abstand ist also der EINZIGE Trenner
                zwischen gefüllter Kapsel und Linktext. */}
            <div className="flex flex-wrap items-center gap-6">
              <Button href="/join" size="md">
                Become a member
              </Button>
              {/* Runde 9: Ziel #cooperative (AboutIntro.tsx, der
                  SCE-Absatz) statt #network — passender zur Frage „wie
                  funktioniert es". Runde 11: Flatbutton, sitesweit
                  konsistent mit Hero.tsx. Runde 12: Abwärtspfeil und
                  zentriertes Scrollen, ebenfalls wie im Hero —
                  #cooperative hat dasselbe [data-pin]. */}
              <StageCueButton href="#cooperative">How it works</StageCueButton>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
