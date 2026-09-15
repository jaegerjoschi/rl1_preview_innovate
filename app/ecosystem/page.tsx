import type { Metadata } from "next";
import Link from "next/link";

import { Container, Section } from "@/app/components/ui/primitives";
import { basePath } from "@/app/lib/basePath";

/**
 * Weiterleitung von der alten Ecosystem-Adresse.
 *
 * Der Inhalt ist in /about#network aufgegangen. `/ecosystem/` kann
 * verlinkt oder indexiert sein; beim statischen Export gibt es keinen
 * Server für einen 301 — deshalb Meta-Refresh plus sichtbarer Link, und
 * ein Canonical auf das neue Ziel.
 */
export const metadata: Metadata = {
  title: "Our Network",
  alternates: { canonical: "/about" },
  robots: { index: false, follow: true },
};

export default function EcosystemRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${basePath}/about/#network`} />

      <Section>
        <Container className="text-center">
          <h1 className="text-h2 text-ink">This page has moved</h1>
          <p className="mx-auto mt-4 max-w-measure text-lead text-ink-3">
            You will be redirected to Our Network automatically.
          </p>
          <Link
            href="/about#network"
            className="mt-8 inline-block text-accent-hover underline underline-offset-4"
          >
            Continue to Our Network
          </Link>
        </Container>
      </Section>
    </>
  );
}
