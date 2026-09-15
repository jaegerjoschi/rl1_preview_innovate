import { Container, Section } from "@/app/components/ui/primitives";
import { specialItems } from "@/app/data/special";
import { SpecialAccordion } from "./Accordion";
import { SpecialTable } from "./Table";
import { SpecialScroll } from "./ScrollBuild";

export type SpecialVariant = "accordion" | "table" | "scroll";

/**
 * "What makes RL1 special" — drei Darstellungen derselben vier Merkmale
 * (app/data/special.ts). Alle drei sind hier gebaut; welche auf der
 * Startseite läuft, entscheidet das `variant`-Prop. Unter
 * /_preview/special/ stehen alle drei nebeneinander.
 */
export default function WhatMakesSpecial({
  variant = "table",
}: {
  variant?: SpecialVariant;
}) {
  return (
    <Section id="what-special" label="What makes RL1 special">
      <Container>
        {variant !== "table" && (
          <h2 className="mb-12 text-center text-h2 text-ink">What makes RL1 special</h2>
        )}
        {variant === "accordion" && <SpecialAccordion items={specialItems} />}
        {variant === "table" && <SpecialTable items={specialItems} />}
        {variant === "scroll" && <SpecialScroll items={specialItems} />}
      </Container>
    </Section>
  );
}
