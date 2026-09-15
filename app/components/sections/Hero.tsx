import Image from "next/image";

import { Container } from "@/app/components/ui/primitives";
import { Button } from "@/app/components/ui/Button";
import { StageCueButton } from "@/app/components/ui/StageCueButton";
import { Reveal, RevealLines } from "@/app/components/motion/Reveal";
import { basePath } from "@/app/lib/basePath";

/**
 * Startseiten-Hero: randloses Schienenbild hinter linksbündigem Text.
 *
 * Das Bild ist das LCP-Element und trägt deshalb `priority`. Die
 * Verlaufsmasken (.hero-scrim) dunkeln die linke Spalte ab, damit die
 * Überschrift auf near-black sitzt, während die Schienen rechts sichtbar
 * bleiben — beide Verläufe stehen als Token in globals.css.
 *
 * Runde 5 — Mobil neu aufgebaut: Text und Bild lagen bis dahin als zwei
 * LAGEN übereinander (Bild absolut ab top:54%, Text im normalen Fluss
 * darüber) statt in einer festen Ordnung. Jetzt ist die Sektion mobil
 * ein GRID mit zwei Zeilen in einer Box von genau Bildschirmhöhe minus
 * Navbar — Text und Bild können sich dadurch nie mehr überlappen. Ab
 * `md` bleibt die alte Bauart unverändert: das Bild liegt randlos
 * HINTER dem Text, die Sektion ist ein flex-Container mit zentriertem
 * Inhalt.
 *
 * Runde 6 — „Text mittig": die Textzeile war `auto` (sitzt oben, alle
 * Luft ging ans Bild darunter). Jetzt ist sie `minmax(0,1fr)` und
 * zentriert ihren Inhalt selbst (`self-center` am Container) — das
 * Bild bekommt dafür eine EIGENE feste Höhe (`h-[38svh]`) in der jetzt
 * `auto`-Zeile, statt sich die Restfläche zu nehmen.
 *
 * Runde 8: mobil KEIN zweizeiliges Grid mehr. Das Motiv liegt jetzt
 * auch hier randlos HINTER dem Text (`.hero-media-sm` ist ab sofort auf
 * allen Breiten absolut, siehe globals.css), der Textblock steht mittig
 * darauf — dieselbe Bauart wie ab `md`, nur mit einem flächigeren Scrim
 * (--gradient-hero-side-sm) für die Lesbarkeit auf 375 px. Die
 * Zwischenfassungen aus Runde 5 bis 7 (getrennte Zeilen, mal Text oben,
 * mal Bild oben) sind damit vom Tisch.
 */
export default function Hero() {
  return (
    <section className="hero-scrim relative flex h-[calc(100svh-var(--spacing-header))] items-center overflow-hidden md:h-auto md:min-h-[88svh]">
      <div aria-hidden className="hero-media-sm">
        <Image
          src={`${basePath}/hero/hero-rail.jpg`}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[88%_45%] md:object-center"
        />
      </div>

      <Container className="relative z-10 py-8 md:py-24">
        <div className="max-w-3xl">
          <RevealLines
            as="h1"
            className="text-h1 text-ink"
            lines={["One shared rail,", "owned by its members."]}
          />

          <Reveal delayIndex={2} className="mt-4 md:mt-6">
            <p className="max-w-measure text-lead text-ink-2">
              RL1 is a live blockchain infrastructure for regulated capital markets,
              replacing fragmented solutions with a shared foundation.
            </p>
          </Reveal>

          <Reveal delayIndex={3} className="mt-6 md:mt-9">
            {/* Runde 11: gewöhnliche Flex-Zeile statt ButtonRow — der
                zweite Button ist jetzt ein randloser Flatbutton, dem
                eine erzwungene gleiche Spaltenbreite nur unsichtbare
                Fläche um den Text gelegt hätte. */}
            {/* Runde 12: gap-6 statt gap-4 — die Buttons sind auf die
                kleinere Geometrie gerückt (Button.tsx), 16px standen
                daneben zu eng. Der Flatbutton hat kein seitliches
                Polster, der Abstand ist also der EINZIGE Trenner
                zwischen gefüllter Kapsel und Linktext. */}
            <div className="flex flex-wrap items-center gap-6">
              <Button href="/join" size="md">
                Become a member
              </Button>
              {/* Runde 11: Flat statt Outline, sitesweit konsistent mit
                  AboutHero. Runde 12: Abwärtspfeil, und ein eigener
                  Handler statt des blanken Ankersprungs — der setzt den
                  Satz auf der Bühne rund 170px zu tief (Begründung in
                  StageCueButton.tsx). */}
              <StageCueButton href="#story">How it works</StageCueButton>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
