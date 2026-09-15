import type { Metadata } from "next";

import Hero from "@/app/components/sections/Hero";
import ScrollStorySection from "@/app/components/sections/ScrollStorySection";
import Quote from "@/app/components/sections/Quote";
import WhatMakesSpecial, {
  type SpecialVariant,
} from "@/app/components/sections/WhatMakesSpecial";
import Drivers from "@/app/components/sections/Drivers";
import LatestNews from "@/app/components/sections/LatestNews";
import UseCases from "@/app/components/sections/UseCases";
import Ecosystem from "@/app/components/sections/Ecosystem";
import Faq from "@/app/components/sections/Faq";
import { TrustStrip } from "@/app/components/ui/TrustStrip";
import { faq } from "@/app/data/faq";

/*
  Die Startseite hatte bisher gar keinen eigenen metadata-Export und lebte
  vollständig von den Vorgaben des Root-Layouts. Title und Description
  kommen weiterhin von dort — nur der Canonical steht jetzt hier, weil er
  im Layout nicht mehr gesetzt werden darf (er würde sonst an alle Seiten
  vererbt, siehe Kommentar in app/layout.tsx).
*/
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/*
  Startseite: was RL1 ist (vier Story-Sektionen), wer dazugehört
  (Ecosystem), wer dahinter steht (Zitat), was es besonders macht,
  die letzten Meldungen, wofür es genutzt wird, FAQ. Die Tiefe — wer
  alles im Netzwerk ist, wie regiert wird — liegt auf /about.

  Das Vertrauensband steht direkt unter dem Hero: Wer zum ersten Mal
  hier landet, sieht als Erstes, wer schon beteiligt ist.
*/

// Welche Darstellung von "What makes RL1 special" läuft. Alle drei
// stehen unter /_preview/special/ nebeneinander.
const SPECIAL_VARIANT: SpecialVariant = "table";

/*
  Runde 8: „What makes RL1 special" ist vorerst ausgeblendet — der Code
  bleibt vollständig stehen (Komponente, Varianten, /_preview/special/),
  nur die Einbindung unten hängt an diesem Schalter. Auf true setzen
  bringt die Sektion unverändert zurück.
*/
const SHOW_SPECIAL = false;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.home.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Hero />
      <TrustStrip />
      <ScrollStorySection />
      <Ecosystem />
      <Quote />
      {/* Runde 7: "Our Values" und "What makes RL1 special" tauschen die
          Plätze (war: WhatMakesSpecial hier, Drivers hinter UseCases). */}
      <Drivers />
      <LatestNews />
      <UseCases />
      {SHOW_SPECIAL && <WhatMakesSpecial variant={SPECIAL_VARIANT} />}
      <Faq page="home" />
    </>
  );
}
