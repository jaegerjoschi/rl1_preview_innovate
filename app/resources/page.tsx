import type { Metadata } from "next";

import { Container, Section } from "@/app/components/ui/primitives";
import { Button } from "@/app/components/ui/Button";
import { Reveal } from "@/app/components/motion/Reveal";
import { resources } from "@/app/data/resources";
import { updates } from "@/app/data/updates";

export const metadata: Metadata = {
  title: "Resources",
  description: "Board material, logos and key facts for Regulated Layer One.",
  alternates: { canonical: "/resources" },
};

/**
 * Die EINE Resources-Seite.
 *
 * Bis Runde 3 gab es zwei: „Take it to your board" auf /resources und
 * den Press Kit auf /resources/press-kit, den die Navigation
 * „Resources" nannte. Wer im Menü auf den Oberpunkt klickte, landete
 * also auf einer anderen Seite als der, die dort „Resources" hieß.
 * Beides steht jetzt hier; /resources/press-kit leitet hierher um.
 *
 * Ohne Datei kann eine Zeile nur „COMING SOON" sein (der Typ in
 * data/resources.ts erzwingt das).
 */
export default function ResourcesPage() {
  return (
    <Section label="Resources">
      <Container>
        <h1 className="text-h1 text-ink">Resources</h1>
        {/* Runde 5: "For your board" als eigene Überschrift ist
            entfallen — der Lead sagt das jetzt selbst, die Zeilen
            darunter stehen direkt im Anschluss. */}
        <p className="mt-4 max-w-measure text-body-lg text-ink-3">
          What you need to take Regulated Layer One to your board.
        </p>

        {/* Runde 11: EINE durchlaufende Liste. Die Überschrift „For the
            press" ist entfallen, die Logo-Zeile steht jetzt einfach als
            letzte Zeile derselben Liste — so laufen die Trennlinien
            durch, statt nach zwei Zeilen abzubrechen und neu anzusetzen.
            Alle drei Zeilen laden direkt herunter (`download`), statt das
            PDF im Browser-Viewer zu öffnen. */}
        <div className="mt-10 border-t border-hairline">
          {resources.map((row, i) => (
            <Reveal
              key={row.id}
              delayIndex={Math.min(i, 4)}
              className="grid items-center gap-4 border-b border-hairline py-8 md:grid-cols-[16rem_minmax(0,1fr)_auto] md:gap-10"
            >
              <h3 className="text-statement text-ink-3">{row.title}</h3>
              <p className="max-w-measure text-body text-ink-3">{row.description}</p>
              {row.status === "available" ? (
                <Button variant="outline" size="sm" href={row.file} download>
                  Download PDF
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Coming soon
                </Button>
              )}
            </Reveal>
          ))}

          <Reveal
            delayIndex={Math.min(resources.length, 4)}
            className="grid items-center gap-4 border-b border-hairline py-8 md:grid-cols-[16rem_minmax(0,1fr)_auto] md:gap-10"
          >
            <h3 className="text-statement text-ink-3">Logo</h3>
            <p className="max-w-measure text-body text-ink-3">
              Word and figure mark, light on dark, as SVG.
            </p>
            <Button variant="outline" size="sm" href="/rl1-logo/rl1-logo-light.svg" download>
              Download SVG
            </Button>
          </Reveal>
        </div>

        {/* Runde 5: "Media contact" entfernt — der Link führte auf
            dieselbe Adresse, für die es an anderer Stelle schon einen
            Weg gibt (Footer), doppelt geführt hier ohne eigenen Wert. */}

        <div className="mt-14">
          {/* Runde 11: Flatbutton statt ArrowLink — der Pfeil kommt jetzt
              als SVG aus der Variante, die Komponente ArrowLink entfällt. */}
          <Button href="/resources/news" variant="flat">
            News &amp; press releases · {updates.length}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
