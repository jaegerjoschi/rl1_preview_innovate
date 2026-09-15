import { Container, Section } from "@/app/components/ui/primitives";
import { Button } from "@/app/components/ui/Button";
import { ScrollText } from "@/app/components/motion/ScrollText";
import { LogoCloud, type CloudLogo } from "@/app/components/motion/LogoCloud";
import { participants } from "@/app/data/participants";

/**
 * „RL1 is an ecosystem." — die Aussage baut sich beim Scrollen auf,
 * ringsherum schweben die Logos der Beteiligten.
 *
 * Die Positionen legen einen Ring um den mittigen Text: oben, unten und
 * — neu in Runde 4 — auch LINKS und RECHTS daneben. Dafür ist der
 * Textblock schmaler geworden (max-w-2xl statt max-w-4xl), sonst gäbe
 * es seitlich keinen Platz. Die Schutzzone, in der kein Logo steht,
 * schrumpft von 28–72 % auf 38–62 %; die seitlichen Plätze liegen
 * innerhalb dieser Bahn, aber weit genug außen.
 *
 * Es sind so viele Positionen wie Teilnehmer — bis Runde 3 waren es 16
 * bei 20 Instituten, und die letzten drei alphabetisch fielen still
 * hinten runter.
 */
const POSITIONS: Omit<CloudLogo, "name" | "src">[] = [
  /*
    Runde 10: Ring enger um den Text gezogen — die Sektion ist jetzt nur
    noch ca. eine Bildschirmhöhe hoch (siehe Section unten), vorher lief
    sie über 150svh. Zwei Anpassungen waren dafür nötig, nicht nur die
    Prozentwerte:

    1. Der Text nimmt auf der jetzt kürzeren Bühne einen VIEL größeren
       Anteil der Höhe ein (gemessen 31–69 % statt vorher grob 38–62 %
       auf der langen Bühne) — die Bahnen rücken entsprechend dichter an
       die Ränder: obere Bahn 10–19 %, untere Bahn 81–90 % (weiter um
       50 % gespiegelt).
    2. Der Parallax-Versatz (--lift in motion.css, `speed * 30vh`) ist
       auf die alte, lange Bühne kalibriert — auf 30vh bezogen driftete
       ein schnelles Logo (speed 0.45) um bis zu ±0,5 × 0,45 × 30vh, auf
       der neuen Bühnenhöhe (~628px bei 720px Fenster) über 10 % der
       Bühne und damit MITTEN in den Text, obwohl die statische Position
       sicher war (gemessen: 7 von 20 Logos liefen so beim Scrollen in
       Text/Button). Die speed-Werte sind deshalb auf ca. 0,08–0,20
       gestaucht (vorher 0,16–0,46) — der Drift bleibt sichtbar, bleibt
       aber innerhalb der Bahn statt in die Schutzzone zu laufen.
  */
  { top: "11%", left: "10%", speed: 0.15 },
  { top: "14%", left: "27%", speed: 0.1 },
  { top: "10%", left: "46%", speed: 0.18 },
  { top: "15%", left: "65%", speed: 0.12 },
  { top: "12%", left: "82%", speed: 0.17 },
  { top: "18%", left: "18%", speed: 0.14 },
  { top: "19%", left: "56%", speed: 0.2 },
  { top: "17%", left: "74%", speed: 0.1 },
  /*
    Seitlich neben dem Text. top ist ein px-Offset vom Bühnenmittelpunkt
    statt ein Prozentwert (die Texthöhe bleibt mit dem breiteren Block
    konstant, unabhängig von der Bühnenhöhe). Runde 10: Offset von
    ±230px auf ±150px verkleinert, passend zur jetzt niedrigeren Bühne.
    Niedrige speed-Werte, damit die Parallax-Amplitude den knappen
    horizontalen Abstand nicht auffrisst. Ab xl statt lg sichtbar (siehe
    LogoCloud.tsx) — bei 1024px reicht die vertikale Trennung allein
    nicht mehr, der breitere Textkasten überlappt sie sonst horizontal.
  */
  { top: "calc(50% - 150px)", left: "8%", speed: 0.1, hideOnMobile: true },
  { top: "calc(50% + 150px)", left: "12%", speed: 0.09, hideOnMobile: true },
  { top: "calc(50% - 150px)", left: "92%", speed: 0.1, hideOnMobile: true },
  { top: "calc(50% + 150px)", left: "88%", speed: 0.08, hideOnMobile: true },
  { top: "89%", left: "20%", speed: 0.14 },
  { top: "85%", left: "58%", speed: 0.2 },
  { top: "90%", left: "78%", speed: 0.1 },
  { top: "82%", left: "10%", speed: 0.19 },
  { top: "86%", left: "30%", speed: 0.14 },
  { top: "81%", left: "49%", speed: 0.1 },
  { top: "83%", left: "67%", speed: 0.2 },
  { top: "88%", left: "86%", speed: 0.12 },
];

export default function Ecosystem() {
  // Alle Beteiligten, nicht nur die mit Monoversion. Crédit Mutuel hat
  // keine (Verlaufsvorlage, siehe scripts/build-logo-mono.mjs) und fiel
  // bisher ganz heraus; es läuft jetzt über denselben Graustufen-
  // Rückfall wie im Logoband mit.
  const marks = participants
    .filter((p) => p.logo)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "en"));

  const logos: CloudLogo[] = POSITIONS.slice(0, marks.length).map((pos, i) => ({
    ...pos,
    name: marks[i].name,
    src: marks[i].logoMono ?? marks[i].logo!,
    mono: Boolean(marks[i].logoMono),
  }));

  return (
    // Runde 10: minHeight="screen" statt "tall" (war 120svh + eine
    // zusätzliche innere 150svh-Mindesthöhe) — die Sektion soll nur noch
    // ca. eine Bildschirmhöhe einnehmen, wie jede andere normale
    // Sektion, und mittig im Viewport stehen. scrub="travel" bleibt
    // aktiv (Logos driften weiter beim Scrollen), nur die Scrollstrecke
    // dafür ist jetzt kürzer.
    <Section
      id="ecosystem"
      label="RL1 is an ecosystem"
      scrub="travel"
      minHeight="screen"
      className="overflow-hidden"
    >
      {/* absolute inset-0 statt h-full: die Section legt ihre Höhe über
          min-height fest (nicht height), und ein height:100%-Kind löst
          gegen eine solche NUR-min-height-Flex-Section nicht zuverlässig
          auf — es fiel auf seine Inhaltshöhe (~238px, Text+Button) statt
          auf die vollen ~708px der Section zurück. Gemessen: dadurch
          landeten die Logo-Prozentwerte (top: 11 % etc.) nicht bei 11 %
          der Section, sondern bei 11 % der viel kleineren Inhaltshöhe —
          mitten im Text. absolute inset-0 spannt zuverlässig die volle
          Section auf, unabhängig davon, wie ihre Höhe zustande kommt. */}
      <div className="absolute inset-0 flex items-center">
        <LogoCloud logos={logos} />

        <Container className="relative z-10">
          {/* Runde 12: zurück auf zentriert (mx-auto/text-center) — der
              Logo-Ring drumherum ist auf einen mittigen Text ausgelegt,
              siehe Kommentar oben an der Sektion. */}
          <div className="mx-auto max-w-2xl text-center lg:max-w-3xl xl:max-w-4xl">
            {/*
              Drei Zeilen wie im Figma-Entwurf: zwei \n erzwingen die
              Umbrüche, statt den Satz frei umbrechen zu lassen — sonst
              wickelt text-h2 die 95 Zeichen je nach Fensterbreite
              unvorhersagbar auf zwei bis vier Zeilen.

              Runde 6: mobil entfällt der ZWEITE Umbruch (nach
              „Validators,") — dafür stehen hier zwei Fassungen
              desselben Satzes, per hidden/md:hidden getrennt sichtbar.
              Beide zählen dieselben Zeichen (nur das eingefügte "\n"
              unterscheidet sie), der Zeichenaufbau bleibt also in
              beiden identisch getaktet — nur die sichtbare Fassung
              registriert sich beim Scroll-Engine (ein `display:none`-
              Element hat kein Rect und wird von IntersectionObserver
              nie als sichtbar gemeldet).
            */}
            <ScrollText
              as="h2"
              profile="late"
              className="text-h2 md:hidden"
              lead={"RL1 is an ecosystem.\nOwned by its Members, run by its Validators,"}
              rest="and endorsed by its Supporters."
            />
            <ScrollText
              as="h2"
              profile="late"
              className="hidden text-h2 md:block"
              lead={"RL1 is an ecosystem.\nOwned by its Members, run by its Validators,\n"}
              rest="and endorsed by its Supporters."
            />
            {/* Eine Zeile: kein max-w-measure mehr (das erzwang den
                Umbruch), stattdessen text-balance mobil und
                whitespace-nowrap ab md, wo die Spalte breit genug ist.
                Runde 6: mt-3 statt mt-6 — steht jetzt näher an der
                Überschrift darüber. */}
            <p className="mt-3 text-balance text-body-lg text-ink-3 md:whitespace-nowrap">
              Ownership, operation and endorsement stay separate by design.
            </p>
            <div className="mt-10">
              {/* Runde 12: Outline statt Primary — der Abschnitt hat keinen
                  eigenen Hauptaufruf, der Weg zur Governance ist eine
                  Vertiefung, keine Handlungsaufforderung. */}
              <Button href="/about#governance" variant="outline">
                See the governance framework
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}
