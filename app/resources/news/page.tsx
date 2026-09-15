import type { Metadata } from "next";

import { updates } from "@/app/data/updates";
import { Container, Section } from "@/app/components/ui/primitives";
import { Reveal } from "@/app/components/motion/Reveal";
import { formatDate } from "@/app/lib/format";
import { site } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "News",
  description:
    "Announcements, press releases and milestones from the Regulated Layer One network.",
  alternates: { canonical: "/resources/news" },
};

export default function NewsPage() {
  const sorted = [...updates].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Hilft Suchmaschinen und KI-Systemen, die Meldungen als Artikel zu erkennen.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: sorted.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "NewsArticle",
        headline: item.title,
        datePublished: item.date,
        description: item.excerpt,
        ...(item.url?.startsWith("/") ? { url: `${site.url}${item.url}` } : {}),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Überschrift und Liste stehen in EINER Sektion. Vorher lagen ein
          PageHero mit Unterkante und eine eigene Sektion darunter — das
          ergab einen Strich plus einen vollen Sektionsabstand zwischen
          der Zeile und der ersten Meldung. */}
      <Section>
        <Container>
          <h1 className="text-h1 text-ink">News</h1>
          <p className="mt-4 max-w-measure text-lead text-ink-3">
            {sorted.length} announcements, press releases and milestones from the network.
          </p>

          <ul className="mt-12 divide-y divide-hairline border-b border-hairline">
            {sorted.map((item, i) => {
              const isExternal = item.url?.startsWith("http");
              return (
                <Reveal as="li" key={item.slug} delayIndex={Math.min(i, 4)}>
                  <a
                    href={item.url ?? "#"}
                    {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
 className="group flex flex-col gap-4 py-8 md:flex-row md:gap-10"
                  >
                    <div className="flex shrink-0 items-center gap-3 md:w-52 md:flex-col md:items-start md:gap-2">
                      <time
                        dateTime={item.date}
 className="text-body text-ink-3 tabular-nums"
                      >
                        {formatDate(item.date, "long")}
                      </time>
                      <span className="rounded-full border border-hairline px-2.5 py-0.5 text-micro text-ink-3">
                        {item.category}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-h3 text-ink transition-colors duration-150 ease-hover group-hover:text-accent-hover">
                        {item.title}
                      </h2>
                      <p className="mt-2.5 max-w-2xl text-caption text-ink-3">
                        {item.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-body text-ink-3 transition-colors duration-150 ease-hover group-hover:text-ink">
                        Read more
                        <span
                          aria-hidden
 className="transition-transform duration-150 ease-out-soft group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </div>
                  </a>
                </Reveal>
              );
            })}
          </ul>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
            <p className="text-body text-ink-3">Follow us on LinkedIn for real-time updates.</p>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
 className="inline-flex items-center gap-2 rounded-full border border-tint-30 px-5 py-2.5 text-body text-ink transition-colors duration-150 hover:border-accent-hover hover:text-accent-hover"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.86-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </Container>
      </Section>
    </>
  );
}
