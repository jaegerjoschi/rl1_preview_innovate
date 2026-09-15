/**
 * Zentrale Stammdaten der Seite.
 *
 * Alles, was in Metadaten, JSON-LD, Sitemap, robots.txt und llms.txt
 * auftaucht, kommt von hier — damit Domain, Name oder Beschreibung nie an
 * fünf Stellen auseinanderlaufen.
 */
export const site = {
  name: "Regulated Layer One",
  shortName: "RL1",
  url: "https://rl1.network",
  locale: "en",

  tagline: "Permissioned layer one solution compliant by design",

  /** Langfassung. Geht ins JSON-LD, wo es keine Längengrenze gibt. */
  description:
    "An open, neutral, compliance-optimized and non-profit network for the European " +
    "financial industry, operated as a shared utility by a European cooperative for " +
    "the benefit of its members.",

  /*
    Kurzfassung für <meta name="description"> und Open Graph.

    Google schneidet bei rund 155 Zeichen ab. Die Langfassung hat 185 —
    abgeschnitten wurde ausgerechnet der Teil mit dem Unterscheidungs-
    merkmal ("by a European cooperative for the benefit of its members").
    Diese Fassung zieht es nach vorn und bleibt unter der Grenze.
  */
  metaDescription:
    "An open, neutral, non-profit network for the European financial industry — " +
    "owned and governed by its members as a European cooperative.",

  // Bis zum SWIAT→RL1-Cut-over (Anfang/Mitte Dez. 2026) werden Use
  // Cases als "in Arbeit" kommuniziert, nicht als Live-Zusagen. Danach
  // hier auf true — das kippt die ganze Sektion.
  useCasesLive: false,

  /*
    ACHTUNG, hier stand bis 13.09.2026 "contact@rl1.network.io" — mit
    einem .io am Ende, das nicht zu RL1 gehört: rl1.network.io löst auf
    eine fremde Parkdomain auf (MX → ookla-parking-*.amazonaws.com).
    Post an diese Adresse kam nie an. Die echte Domain rl1.network hat
    einen eigenen Microsoft-365-Eintrag
    (MX → rl1-network.mail.protection.outlook.com).

    Die Adresse steht auch in public/llms.txt — also in genau der Datei,
    aus der KI-Systeme den Kontaktweg vorlesen. Beide Stellen müssen
    zusammen gepflegt werden.
  */
  contactEmail: "contact@rl1.network",
  linkedin: "https://www.linkedin.com/company/regulated-layer-one-rl1/",
} as const;

/** Wird im <head> ausgegeben, damit Suchmaschinen und KI-Systeme die
 *  Organisation eindeutig zuordnen können. Nur belegbare Fakten. */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: site.shortName,
  legalName: "Regulated Layer One SCE",
  url: site.url,
  logo: `${site.url}/rl1-logo/rl1-logo-light.svg`,
  description: site.description,
  // Beleg: Pressemitteilung vom 28.07.2026 und der Faktenblock auf
  // /resources ("Founded: July 2026"). Genauer als der Monat ist die
  // Gründung öffentlich nicht belegt — also bleibt es beim Monat.
  foundingDate: "2026-07",
  address: {
    "@type": "PostalAddress",
    addressCountry: "LU",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "membership and general enquiries",
    email: site.contactEmail,
    areaServed: "EU",
    availableLanguage: ["en", "de"],
  },
  /*
    sameAs ist der Ankerpunkt, über den Suchmaschinen und KI-Systeme die
    Entität "Regulated Layer One" mit den Erwähnungen auf fremden Seiten
    zusammenführen. Solange hier nur LinkedIn steht, ist das ein einziger
    Beleg. Ein Wikidata-Eintrag existiert bisher nicht; sobald er angelegt
    ist, gehört seine Q-ID hierher.
  */
  sameAs: [site.linkedin],
} as const;

/** Macht die Domain als benannte Website eindeutig — Voraussetzung dafür,
 *  dass Google Sitelinks unter dem Haupttreffer ausspielt. */
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  inLanguage: site.locale,
  publisher: { "@type": "Organization", name: site.name, url: site.url },
} as const;
