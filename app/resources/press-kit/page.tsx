import type { Metadata } from "next";
import Link from "next/link";

import { Container, Section } from "@/app/components/ui/primitives";
import { basePath } from "@/app/lib/basePath";

/**
 * Weiterleitung — der Press Kit ist in /resources aufgegangen.
 *
 * Die Adresse stand in der Navigation und kann verlinkt oder indexiert
 * sein. Beim statischen Export gibt es keinen Server, der einen 301
 * schicken könnte — deshalb Meta-Refresh plus ein sichtbarer Link als
 * Rückfallebene, genau wie bei /news. Das Canonical zeigt auf die neue
 * Adresse, damit Suchmaschinen sie übernehmen.
 */
export const metadata: Metadata = {
  title: "Press Kit",
  alternates: { canonical: "/resources" },
  robots: { index: false, follow: true },
};

export default function PressKitRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${basePath}/resources/`} />

      <Section>
        <Container className="text-center">
          <h1 className="text-h2 text-ink">The press kit has moved</h1>
          <p className="mx-auto mt-4 max-w-measure text-body-lg text-ink-3">
            Logos, key facts and the media contact are now part of Resources.
          </p>
          <Link
            href="/resources"
            className="mt-8 inline-block text-accent-hover underline underline-offset-4"
          >
            Continue to Resources
          </Link>
        </Container>
      </Section>
    </>
  );
}
