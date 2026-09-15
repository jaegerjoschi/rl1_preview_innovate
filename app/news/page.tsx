import type { Metadata } from "next";
import Link from "next/link";

import { Container, Section } from "@/app/components/ui/primitives";
import { basePath } from "@/app/lib/basePath";

/**
 * Weiterleitung von der alten News-Adresse.
 *
 * `/news/` ist seit Juli live und kann verlinkt oder indexiert sein. Beim
 * statischen Export gibt es keinen Server, der einen 301 schicken könnte —
 * deshalb Meta-Refresh plus ein sichtbarer Link als Rückfallebene. Das
 * Canonical zeigt auf die neue Adresse, damit Suchmaschinen sie übernehmen.
 */
export const metadata: Metadata = {
  title: "News",
  alternates: { canonical: "/resources/news" },
  robots: { index: false, follow: true },
};

export default function NewsRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${basePath}/resources/news/`} />

      <Section>
        <Container className="text-center">
          <h1 className="text-h2 text-ink">News has moved</h1>
          <p className="mx-auto mt-4 max-w-md text-lead text-ink-3">
            You will be redirected automatically.
          </p>
          <Link
            href="/resources/news"
            className="mt-8 inline-block text-accent-hover underline underline-offset-4"
          >
            Continue to News
          </Link>
        </Container>
      </Section>
    </>
  );
}
