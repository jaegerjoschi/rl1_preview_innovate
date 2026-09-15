import Image from "next/image";
import Link from "next/link";

import { legalNav, mainNav } from "@/app/lib/nav";
import { site } from "@/app/lib/site";
import { Container } from "@/app/components/ui/primitives";
import { basePath } from "@/app/lib/basePath";

// Runde 9: eigener Satz statt site.description — der Auftraggeber wollte
// hier denselben Satz wie im Hero-Leadtext (Hero.tsx). site.description
// bleibt unverändert, sie speist zusätzlich Metadaten und JSON-LD.
const FOOTER_LEAD =
  "RL1 is a live blockchain infrastructure for regulated capital markets, " +
  "replacing fragmented solutions with a shared foundation.";

/** Die Kontaktseite. Steht im Footer unter „Connect", nicht unter
 *  „Network" — deshalb hier einmal benannt statt zweimal getippt. */
const CONTACT_HREF = "/join";

export default function Footer() {
  return (
    <footer className="border-t border-hairline">
      <Container className="py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <Image
              src={`${basePath}/rl1-logo/rl1-logo-light.svg`}
              alt="Regulated Layer One"
              width={112}
              height={38}
              loading="lazy"
            />
            <p className="mt-5 text-caption text-ink-3">{FOOTER_LEAD}</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {/* Runde 11: „Contact" steht nicht mehr unter „Network",
                sondern unter „Connect" — dorthin gehört der Kontaktweg.
                Die Spalte „Network" führt damit nur noch die inhaltlichen
                Seiten. */}
            <FooterColumn
              title="Network"
              links={mainNav
                .filter(({ href }) => href !== CONTACT_HREF)
                .map(({ label, href }) => ({ label, href }))}
            />
            <FooterColumn title="Legal" links={legalNav} />
            <FooterColumn
              title="Connect"
              links={[
                { label: "LinkedIn", href: site.linkedin, external: true },
                { label: "Contact", href: CONTACT_HREF },
              ]}
            />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-hairline pt-7 text-micro text-ink-3 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            Information on this site is for general purposes and is not legal or regulatory
            advice.
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <h2 className="text-label uppercase text-ink-3">{title}</h2>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => {
          const className =
            "inline-flex items-center text-caption text-ink-3 transition-colors duration-150 hover:text-ink pointer-coarse:min-h-11";
          // Runde 11: mailto:/tel: gehen als schlichtes <a> raus — nicht
          // durch den Next-Router (der versucht sonst zu prefetchen) und
          // ohne target="_blank", das bei einem Mailprogramm ein leeres
          // Browserfenster hinterließe.
          const isProtocolLink = /^(mailto:|tel:)/.test(link.href);

          if (link.external || isProtocolLink) {
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={className}
                  {...(isProtocolLink
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  {link.label}
                </a>
              </li>
            );
          }

          return (
            <li key={link.href}>
              <Link href={link.href} className={className}>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
