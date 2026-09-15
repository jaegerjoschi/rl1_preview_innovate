import type { Metadata } from "next";

import AboutHero from "@/app/components/sections/AboutHero";
import AboutIntro from "@/app/components/sections/AboutIntro";
import NetworkRoles from "@/app/components/sections/NetworkRoles";
import NetworkDiagram from "@/app/components/sections/NetworkDiagram";
import GovernanceDiagram from "@/app/components/sections/GovernanceDiagram";
import Principles from "@/app/components/sections/Principles";
import { BandCta } from "@/app/components/sections/BandCta";

export const metadata: Metadata = {
  // Runde 11: „About us" statt „About RL1" — wie im Navigationslabel.
  title: "About us",
  // ≤ 155 Zeichen, sonst schneidet Google die Aussage in der Mitte ab.
  description:
    "A Société Coopérative Européenne registered in Luxembourg, owned by its member banks with one vote each. Who is in the network and how it is governed.",
  alternates: { canonical: "/about" },
};

/*
  Die Tiefenseite: was RL1 rechtlich ist, wer im Netzwerk steht, wer es
  betreibt, wie regiert wird, warum es für institutionelle Abläufe gebaut
  ist, die Roadmap. Die #network- und #governance-Anker kommen aus der
  Navigation.
*/
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutIntro />
      <NetworkRoles />
      <NetworkDiagram />
      <GovernanceDiagram />
      <Principles />
      <BandCta
        title="See how membership actually works."
        body="Book a call and we'll walk you through the cooperative structure, the vote and what it means for your team day to day."
        // Runde 11: Ghost-/Outline-Button statt gefüllt.
        actions={[{ label: "Book a call", href: "/join#book", variant: "outline" }]}
        size="tight"
        // Runde 10: weniger Abstand nach oben (schließt zur Principles-
        // Sektion darüber auf), deutlich mehr Abstand nach unten zum
        // Footer — !important-Utilities, weil sie denselben py-* der
        // size-Vorgabe gezielt überstimmen müssen.
        className="!pt-8 !pb-24 md:!pt-10 md:!pb-32"
      />
    </>
  );
}
