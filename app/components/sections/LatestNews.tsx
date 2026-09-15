import Link from "next/link";

import { Container, Section } from "@/app/components/ui/primitives";
import { Reveal } from "@/app/components/motion/Reveal";
import { updates } from "@/app/data/updates";
import { formatDate } from "@/app/lib/format";

/**
 * "Latest News" — drei Karten. Die ersten zwei führen zu den Meldungen,
 * die dritte ist der Weg ins Archiv.
 */
export default function LatestNews() {
  const [a, b] = updates;

  return (
    // Runde 10: minHeight="none" statt des geerbten Defaults "screen" —
    // drei Karten brauchen keine volle Bildschirmhöhe.
    <Section id="news" label="Latest news" size="tight" minHeight="none">
      <Container>
        <h2 className="text-h2 text-ink">Latest news</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[a, b].map((item, i) => (
            <Reveal as="article" key={item.slug} delayIndex={i}>
              <NewsCard
                href={item.url ?? `/resources/news`}
                meta={`${item.category} · ${formatDate(item.date)}`}
                title={item.title}
              />
            </Reveal>
          ))}

          <Reveal as="article" delayIndex={2}>
            <NewsCard href="/resources/news" meta="Archive" title="See all news →" />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function NewsCard({
  href,
  meta,
  title,
}: {
  href: string;
  meta: string;
  title: string;
}) {
  const isExternal = /^https?:/.test(href);
  const className =
    "flex h-full flex-col gap-2.5 rounded-md bg-accent-tint p-block " +
    "transition-colors duration-150 ease-hover hover:bg-accent-tint-hover";
  const body = (
    <>
      <span className="text-body text-ink-3">{meta}</span>
      <span className="text-h3 text-ink">{title}</span>
    </>
  );

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <Link href={href} className={className}>
      {body}
    </Link>
  );
}
