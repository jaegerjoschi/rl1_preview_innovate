import BackButton from "../../../components/ui/BackButton";
import { site } from "@/app/lib/site";
import { updates } from "@/app/data/updates";

/* Texte kommen aus updates.ts, damit Übersicht und Artikel nicht
   auseinanderlaufen — hier wird nichts neu formuliert. */
const item = updates.find((u) => u.slug === "rl1-launch")!;

export const metadata = {
  /*
    `absolute` umgeht das title.template des Root-Layouts. Die volle
    Schlagzeile plus Zusatz ergab 116 Zeichen — Google schneidet bei rund
    60 ab, der Markenname wäre also doppelt UND unsichtbar gewesen.
    Die Kurzfassung trägt "RL1" ohnehin im Satz.
  */
  title: { absolute: item.bannerTitle! },
  description: item.bannerDescription,
  alternates: { canonical: "/resources/news/rl1-launch" },
};

/* Die Übersicht unter /resources/news gibt eine ItemList mit
   NewsArticle-Einträgen aus. Auf der Artikelseite selbst fehlte das
   Gegenstück — also genau dort, wo der Text steht. Ohne datePublished
   und publisher ordnen Google News und KI-Systeme das Dokument nicht als
   datierte Primärquelle ein, sondern bestenfalls als Seite mit Datum
   im Fließtext. */
const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: item.title,
  datePublished: item.date,
  description: item.excerpt,
  inLanguage: site.locale,
  url: `${site.url}/resources/news/rl1-launch/`,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${site.url}/resources/news/rl1-launch/`,
  },
  publisher: {
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/rl1-logo/rl1-logo-light.svg`,
  },
  about: { "@type": "Organization", name: site.name, url: site.url },
};

export default function RL1LaunchPressRelease() {
  return (
    <div className="legalPage">
      <script
        type="application/ld+json"
        // Statischer, im Code definierter Datensatz — keine Fremdeingabe.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="legalInner">
        <div className="legalHeader">
          <BackButton href="/resources/news" label="All news" />
          <p className="legalEyebrow">Press Release · 28 July 2026</p>
          <h1 className="legalTitle">
            European blockchain initiative &lsquo;Regulated Layer One&rsquo;
            goes live
          </h1>
        </div>

        <div className="legalBody">
          <section className="legalSection">
            <ul className="legalList">
              <li>
                Regulated Layer One (RL1) is an open, neutral,
                compliance-optimised and collaborative DLT network for the
                European financial sector
              </li>
              <li>
                RL1 is established as a European Cooperative Society (SCE) and
                commences operations with ten financial institutions; additional
                participants are expected to join shortly, with the network
                remaining open to further financial market participants
              </li>
              <li>
                Henning Vollbehr moves from SWIAT to RL1 and becomes Managing
                Director of the new SCE
              </li>
              <li>
                The founding members of pan-European blockchain initiative
                include banks from Germany, the Netherlands, France, and Spain,
                among others.
              </li>
            </ul>
          </section>

          <section className="legalSection">
            <p className="legalText">
              <strong>Frankfurt am Main/Luxembourg, 28 July 2026</strong> –
              Regulated Layer One (RL1), Europe&apos;s neutral, collaborative
              DLT network developed specifically for regulated financial
              markets, today announces the establishment of a European
              Cooperative Society (SCE) based in Luxembourg. RL1 will be led by
              Henning Vollbehr, who has been appointed Managing Director of the
              SCE. Vollbehr has before led SWIAT as Managing Director. The SCE
              brings together leading financial institutions to overcome the
              current fragmentation of blockchain networks within the regulated
              financial sector and to create a neutral, member-owned,
              pan-European DLT utility for tokenised assets, digital money and
              next-generation financial markets use cases. All RL1 members
              benefit from equal decision-making rights, influence over the
              network&apos;s further development and direct access to a
              functioning ecosystem at an institutional level.
            </p>
            <p className="legalText">
              Ten European financial institutions have agreed to establish a
              European Cooperative Society (SCE). The RL1 Cooperative will
              consist of the following institutions:
            </p>
            <ul className="legalList">
              <li>ABN AMRO</li>
              <li>Cecabank</li>
              <li>Chartered Investment</li>
              <li>Crédit Mutuel Alliance Fédérale</li>
              <li>DekaBank</li>
              <li>DZ BANK</li>
              <li>LBBW</li>
              <li>Natixis CIB</li>
              <li>SC Ventures</li>
              <li>Seturion</li>
            </ul>
            <p className="legalText">
              KfW and L-Bank, which have also been members of the initiative
              since 2025 and 2026 respectively, will continue to actively
              support RL1 in its establishment and expansion. Furthermore,
              concrete discussions are currently underway with a number of other
              renowned European banks regarding their participation in RL1
              including NatWest who has been an active participant in Phase 1 of
              the initiative.
            </p>
          </section>

          <section className="legalSection">
            <p className="legalText">
              The RL1 Network is based on SWIAT&apos;s production-grade DLT
              Network, now owned by the cooperative; it has been in production
              for three years and has since successfully completed more than 50
              transactions with a total volume of more than EUR 700m.
              SWIAT&apos;s software is fully compatible with RL1, enabling
              immediate implementation of use cases such as bond tokenization.
              SWIAT&apos;s existing application ecosystem including offerings
              and productive solutions like Bafin-supervised German electronic
              securities registries remain with SWIAT, yet will transition
              seamlessly to run on RL1. Moreover, the design and operation of
              RL1 as an open, regulated infrastructure empowers its members to
              jointly develop and scale their own digital solutions and
              transparent protocols, thereby establishing the base for common
              industry standards.
            </p>
            <p className="legalText">
              RL1 provides not only a shared infrastructure, but a joint
              governance that overcomes existing market fragmentation due to
              different DLT networks. RL1&apos;s DLT network will offer a
              reliable and long-term solution for financial institutions to
              offer DLT-based financial services in compliance with
              IT-requirements for financial institutions As a permissioned,
              interoperable network, RL1 thus connects assets, services and
              access points for regulated institutions.
            </p>
            <p className="legalText">
              Recent months have highlighted the growing need for such a shared
              infrastructure, as tokenisation has gradually progressed from
              pilot projects towards a scalable market infrastructure. The
              ECB&apos;s initiatives – including Appia and Pontes – as well as
              stablecoins, tokenised money market funds, digital bonds, smart
              derivatives, solutions for mobilising collateral and settlement
              platforms all rely on shared infrastructures that reduce
              fragmentation and enable reliable and efficient settlement.
            </p>
          </section>

          <section className="legalSection">
            <p className="legalText">
              <strong>
                Henning Vollbehr, designated Managing Director of RL1, said:
              </strong>{" "}
              &ldquo;I am delighted that the participating financial
              institutions have placed their trust in me and appointed me as
              Managing Director of the RL1 SCE. RL1 is the result of our
              collective work and the evolution of SWIAT, which I have had the
              privilege of helping to shape over the past four years. Against
              this backdrop, I am very pleased to now be able to drive forward
              the digital transformation towards a unified financial market
              infrastructure at an institutional level as well. Going forward,
              RL1 will serve as the connecting infrastructure for Europe&apos;s
              digital financial market, enabling participating institutions to
              move from isolated tokenization initiatives to an integrated,
              liquid, and scalable capital market ecosystem. I am excited about
              this opportunity and look forward to the task ahead.&rdquo;
            </p>
          </section>

          <section className="legalSection">
            <h2 className="legalSectionTitle">About RL1</h2>
            <p className="legalText">
              RL1 is a European Cooperative Society (Société Coopérative
              Européenne) domiciled in Luxembourg. It owns and operates a
              private, permissioned blockchain network built for regulated
              financial markets, providing a common infrastructure layer for
              institutional digital assets.
            </p>
            <p className="legalText">
              Anchored in Europe and open to regulated financial institutions
              worldwide, RL1 is built to carry the market beyond isolated pilots
              and towards shared, production-grade infrastructure, providing the
              platform for tokenised financial market instruments and services.
            </p>
            <p className="legalText">
              The cooperative was established by ten founding European financial
              institutions. Governance rests exclusively with its members on the
              basis of equal decision-making rights, ensuring that no single
              institution or group of node operators exercises undue control
              over the network.
            </p>
            <p className="legalText">
              By establishing a shared, trust-based foundation for tokenised
              assets, digital money and next-generation settlement, RL1 is
              positioned to become core infrastructure for the global digital
              financial markets. It aims to reduce today&apos;s fragmentation,
              connect regulated participants across jurisdictions, and set a
              common standard for institutional-grade tokenisation at
              scale.{" "}
            </p>
          </section>

          <section className="legalSection">
            <h2 className="legalSectionTitle">About SWIAT</h2>
            <p className="legalText">
              SWIAT GmbH is a 2022 founded Frankfurt-based fintech that develops
              blockchain-software. By the same token it is a tokenization
              platform for an open decentralised financial market
              infrastructure. In addition, SWIAT operates a regulated registry
              services under the German Electronic Securities Act (eWpG) for
              digital securities. By 2025, the SWIAT blockchain platform had
              onboarded over 50 participants and settled securities worth more
              than EUR 700 million, becoming the leading blockchain ecosystem
              designed to meet capital market, compliance and regulatory
              requirements. Developed for banks and financial institutions, the
              SWIAT platform enables the issuance of regulated digital assets
              with a high level of security and regulatory compliance. As an
              open platform, SWIAT aims to create a global ecosystem for the
              settlement and trading of digital assets that ensures efficiency,
              security and interoperability across all market participants.
              SWIAT shareholders are DekaBank, LBBW, SC Ventures (Standard
              Chartered Bank) and the fintech Comyno.{" "}
              <a
                href="https://www.swiat.io/"
 className="legalLink"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.swiat.io/
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
