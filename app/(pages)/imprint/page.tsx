import BackButton from "../../components/ui/BackButton";

/* Der Zusatz „| Regulated Layer One" steht bereits im title.template des
   Root-Layouts. Hier nur der Seitenname, sonst steht er zweimal im Titel. */
export const metadata = {
  title: "Imprint",
  description:
    "Legal notice for Regulated Layer One SCE: publisher, registered office and responsible contact.",
  alternates: { canonical: "/imprint" },
};

export default function Imprint() {
  return (
    <div className="legalPage">
      <div className="legalInner">
        <div className="legalHeader">
          <BackButton />
          <p className="legalEyebrow">Legal</p>
          <h1 className="legalTitle">Imprint</h1>
        </div>

        <div className="legalBody">
          <section className="legalSection">
            <h2 className="legalSectionTitle">Published by</h2>
            <p className="legalText">
              Regulated Layer One SCE, limited, 68 Boulevard de la Pétrusse, Luxembourg
            </p>
            <p className="legalText">
              E-Mail:{" "}
              <a href="mailto:info@rl1.network" className="legalLink">
                info@rl1.network
              </a>
            </p>
            <p className="legalText">
              Regulated Layer One SCE, limited is registered with the Registre de
              Commerce et des Sociétés (RCS) Luxembourg under No. B310349.
            </p>
            <p className="legalText">
              <strong>Managing Director:</strong>
              <br />
              Henning Vollbehr
            </p>
          </section>

          <section className="legalSection">
            <h2 className="legalSectionTitle">1. General Information</h2>
            <p className="legalText">
              Regulated Layer One SCE, limited, 68 Boulevard de la Pétrusse, Luxembourg,
              &ldquo;Regulated Layer One SCE, limited&rdquo;, has placed the information
              available on this website as a service to its clients and other interested
              persons for general information purposes only. Regulated Layer One SCE,
              limited makes no representations that any information on this site is
              appropriate for use in all locations, or that transactions, products,
              instruments or services discussed are available or appropriate for
              sale or use in all jurisdictions, or by all investors or
              counterparties.
            </p>
          </section>

          <section className="legalSection">
            <h2 className="legalSectionTitle">
              2. No offer, advice or solicitation
            </h2>
            <p className="legalText">
              Under no circumstances should any content be used or intended to
              be an offer to sell or a solicitation of any offer to buy the
              securities or any other instruments of Regulated Layer One SCE, limited or
              any other issuer. Nothing on this website is intended as advice and users
              should obtain independent financial advice that addresses their particular
              investment objectives.
            </p>
          </section>

          <section className="legalSection">
            <h2 className="legalSectionTitle">3. Disclaimer</h2>
            <p className="legalText">
              All details and information which can be found on this website have
              been checked carefully. The information contained herein has been
              obtained from, and any opinions herein are based upon, sources
              believed by Regulated Layer One SCE, limited to be reliable, but which may
              not have been independently verified, and no guarantees, representations or
              warranties are made as to its accuracy, completeness or suitability
              for any purpose. Any opinion or estimate expressed in this report
              is our current opinion as of the date of this report and is subject
              to change without notice. Certain links are provided which may lead
              to websites maintained by third parties over which we have no
              control, including sites maintained by DekaBank affiliates. To the
              extent permitted by applicable law, we take no responsibility for
              the accuracy, content or any aspect of that material and disclaim
              any liability to you for such material or for any consequence of
              your decision to use the links provided or your use of such
              material.
            </p>
          </section>

          <section className="legalSection">
            <h2 className="legalSectionTitle">4. Proprietary Rights</h2>
            <p className="legalText">
              This website is protected by copyright, database rights and other
              intellectual property rights. Regulated Layer One SCE, limited where
              appropriate retains all right, title and interest in and to the website.
              Use of the website does not confer any ownership rights in the website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
