import type { Metadata } from "next";

import { TrustStrip } from "@/app/components/ui/TrustStrip";
import { JoinTop } from "./JoinTop";
import { BookingEmbed } from "./BookingEmbed";
import { BuildTogether } from "./BuildTogether";

export const metadata: Metadata = {
  title: "Let's Talk",
  // ≤ 155 Zeichen — siehe app/lib/site.ts.
  description:
    "Regulated European institutions join RL1 as members of a European cooperative, with a governance seat and an equal voice. Enquire or suggest a call.",
  alternates: { canonical: "/join" },
};

/*
  Formular zuerst — es ist die Hauptfunktion dieser Seite. Darunter der
  Beleg (wer schon dabei ist) und die Benefits. Terminwunsch ist Teil des
  Formulars. Die FAQ ist in Runde 2 entfallen: Einwände beantwortet die
  Startseite, hier soll nichts vom Absenden ablenken.
*/
export default function JoinPage() {
  return (
    <>
      <JoinTop />
      <BookingEmbed />
      {/* Runde 6: nur Mitgliedsbanken statt aller Beteiligten — auf der
          Kontaktseite ist „wer schon Member ist" die richtigere Aussage
          als „wer das Netzwerk betreibt/beobachtet" (Startseite/-about). */}
      <TrustStrip role="member" label="The following banks are already members" />
      <BuildTogether />
    </>
  );
}
