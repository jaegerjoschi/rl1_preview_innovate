import { Container, Section } from "@/app/components/ui/primitives";
import { ScrollText } from "@/app/components/motion/ScrollText";
import { CooperativeVisual } from "@/app/components/ui/CooperativeVisual";

import "./AboutIntro.coop.css";

/**
 * Was RL1 rechtlich ist — zwei Absätze, durch die eine Leuchtkante
 * wandert.
 *
 * Bis Runde 3 hing der Aufbau an einer Sektion von genau einer
 * Bildschirmhöhe. Das Profil `slow` rechnet dann mit seiner Untergrenze
 * (halbe Fensterhöhe), und der Text füllte sich erst, während er oben
 * schon hinauslief — gemessen war er bei 250 px Scroll bereits
 * vollständig hell. Jetzt steht er still und füllt sich dabei, wie in
 * der Story auf der Startseite.
 *
 * Beide Absätze hängen an derselben Sektion und bekämen damit dasselbe
 * --p. `start`/`span` teilen den Fortschritt unter ihnen auf, sodass die
 * Kante erst durch den ersten und dann durch den zweiten läuft.
 *
 * Runde 7/8: ab lg steht RECHTS neben dem Text eine eigene Illustration
 * (acht Quadrate ordnen sich zu einem Kreis, dann schließt sich Segment
 * für Segment die Verbindung). Sie hängt am selben Scrollfortschritt wie
 * der Zeichenaufbau der Absätze: `data-scrub="slow"` lässt MotionRoot
 * --p daraufschreiben, AboutIntro.coop.css interpoliert alles daraus.
 * Damit bestimmt die Scrollposition den Fortschritt — vorwärts wie
 * rückwärts — statt einmalig abzulaufen, und weil --p erst mit dem
 * Andocken der Sektion über 0 geht, startet sie nicht zu früh. Unter lg
 * steht die Grafik unter dem Text statt daneben; beide behalten ihr
 * Format, nichts wird ausgeblendet.
 */
export default function AboutIntro() {
  return (
    // Runde 9: id für den "How it works"-Anker in AboutHero.tsx.
    <Section id="cooperative" label="What RL1 is" minHeight="story" className="overflow-x-clip">
      <div
        data-pin
        /*
          Runde 5: h-svh -> h-[calc(100svh-var(--spacing-header))] — auf
          Mobil wurde der Text abgeschnitten, weil zwei text-statement-
          Absätze mit gap-8 in ein volles h-svh gezwungen wurden, ohne
          dass die Navbar davon abging. Dieselbe Rechnung wie bei jeder
          anderen "ein Bildschirm"-Sektion (siehe --spacing-header in
          globals.css) — UND aus demselben Grund `top-[var(--spacing-
          header)]` statt `top-0`: klebt es an der 0, liegen die ersten
          64px der Fläche hinter dem opaken Header, `items-center`
          zentriert dann relativ zur halb verdeckten statt zur
          sichtbaren Fläche (gemessen am selben Fehler auf der
          Story-Sektion, siehe motion.css). Ab lg bleibt die eigene
          11svh/78svh-Logik unverändert — die dient der Leerstrecke
          zwischen den Sektionen, nicht dem Header (siehe DESIGN.md),
          und 11svh liegt an jeder gängigen Fensterhöhe ohnehin über der
          Desktop-Headerhöhe.
        */
        className="sticky top-[var(--spacing-header)] flex h-[calc(100svh-var(--spacing-header))] items-center lg:top-[11svh] lg:h-[78svh]"
      >
        <Container className="w-full">
          {/* data-scrub="slow": MotionRoot schreibt --p auf dieses
              Element (gemessen an der Sektion und ihrem [data-pin]),
              AboutIntro.coop.css rechnet daraus den Fortschritt der
              Illustration. Derselbe Mechanismus wie bei den Absätzen
              daneben, nur mit eigener Nutzung des Werts. */}
          <div
            data-scrub="slow"
            className="coop grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16"
          >
            <div className="flex max-w-4xl flex-col gap-5 md:gap-8">
              <ScrollText
                profile="slow"
                start={0}
                span={0.4}
                // Runde 6: Poppins statt Roboto Condensed (text-prose,
                // nicht text-statement — siehe globals.css).
                className="text-prose"
                lead="Regulated Layer One (RL1) is a European cooperative society (Société Coopérative Européenne) registered in Luxembourg. It has no external shareholders"
                rest="and is non-profit driven."
              />
              <ScrollText
                profile="slow"
                start={0.45}
                span={0.4}
                // Runde 6: Poppins statt Roboto Condensed (text-prose,
                // nicht text-statement — siehe globals.css).
                className="text-prose"
                lead="Membership dues cover the costs of establishing and operating the"
                rest="organization. In return, each member gets one vote at the General Meeting, direct access to the network and a proportional share of its economics as it grows."
              />
            </div>
            {/* Runde 8: mobil ÜBER dem Text (order-first), ab lg wieder
                an seiner DOM-Stelle und damit rechts daneben. */}
            <div className="coop__visual order-first lg:order-none">
              <CooperativeVisual />
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}
