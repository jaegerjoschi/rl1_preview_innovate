import BackButton from "../../components/ui/BackButton";

/* Zusatz „| Regulated Layer One" kommt aus dem title.template — siehe imprint. */
export const metadata = {
  title: "Privacy",
  description:
    "How Regulated Layer One SCE handles personal data: what is processed, on what legal basis, and your rights.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <div className="legalPage">
      <div className="legalInner">
        <div className="legalHeader">
          <BackButton />
          <p className="legalEyebrow">Legal</p>
          <h1 className="legalTitle">Privacy</h1>
        </div>

        <div className="legalBody">
          {/* ── Overview ── */}
          <section className="legalSection">
            <h2 className="legalSectionTitle">Overview</h2>
            <div className="legalAbstract">
              <p className="legalText" style={{ margin: 0 }}>
                Abstract
              </p>
              <ul className="legalAbstractList">
                <li>No cookies for simple surfing</li>
                <li>
                  No integration of external analysis systems; no tracking
                  pixels
                </li>
                <li>Encrypted communication</li>
                <li>
                  Where technically feasible / possible: direct anonymization
                  of IP addresses
                </li>
              </ul>
            </div>
            <p className="legalText" style={{ marginTop: 20 }}>
              Our information on data protection explains the handling of
              personal data that (may) result from visiting this website. At the
              same time, we also use this information to provide general
              information about the processing of personal data in our company.
              Please note that this general data protection information cannot,
              of course, cover every individual case in practice. If other,
              additional data processing takes place in such situations, we will
              provide you with additional information in the specific individual
              case. Your rights explained here will of course still apply
              without restriction.
            </p>
          </section>

          {/* ── Your rights ── */}
          <section className="legalSection">
            <h2 className="legalSectionTitle">Your rights</h2>
            <p className="legalText">
              Every data subject has the right of access under Art. 15 GDPR,
              the right to rectification under Art. 16 GDPR, the right to
              erasure (&ldquo;right to be forgotten&rdquo;) under Art. 17 GDPR,
              the right to restriction of processing (blocking) under Art. 18
              GDPR, the right to object under Art. 21 GDPR and the right to
              data portability under Art. 20 GDPR if you have consented to data
              processing or have concluded a contract with us. The restrictions
              under Sections 34 and 35 BDSG apply to the right to information
              and the right to erasure. Finally, you have the right to lodge a
              complaint with the supervisory authority in accordance with Art.
              77 GDPR in conjunction with Section 19 BDSG.
            </p>
            <p className="legalText">
              If you have given us your consent to a specific processing of your
              personal data, you can revoke this consent at any time for the
              future. Whenever we process your data on the basis of a legitimate
              interest or a balancing of interests, you can object to such
              processing at any time for the future.
            </p>
          </section>

          {/* ── Revocation vs Objection ── */}
          <section className="legalSection">
            <h2 className="legalSectionTitle">
              Difference between revocation and objection
            </h2>
            <p className="legalText">
              The revocation is to be pronounced if processing is based on
              consent. This is always the case if you were expressly asked to
              give your consent before the data was collected (in particular by
              signing or clicking in the checkbox).
            </p>
            <p className="legalText">
              An objection is indicated if data processing is carried out on the
              basis of a balancing of interests. In this case, you do not have
              to sign anything and usually do not have to give your consent.
              However, the GDPR obliges every &lsquo;data processor&rsquo; to
              inform the data subjects about the processing and to state the
              legal basis; this should enable you to know whether you can
              formally object to the data processing. We also use this data
              protection notice in particular to inform you about the processing
              activities that we carry out on the basis of a balancing of
              interests.
            </p>
            <p className="legalText">
              If you are not comfortable with data processing, please simply
              contact the addresses listed in the imprint. We will then explain
              to you whether the processing can be stopped or at least
              restricted &ndash; you do not need to mention the word revocation
              or objection.
            </p>
            <p className="legalText">
              If it is not possible to stop the processing because otherwise,
              for example, tax laws would be violated or a concluded contract
              can no longer be fulfilled, we will explain this to you. If the
              processing is based on a legitimate interest, we will ask you for
              a reason why the processing should be stopped. We will then
              carefully weigh your interests against ours and inform you of the
              result.
            </p>
            <p className="legalText">
              If we contact you for sales reasons and you do not wish us to do
              so, a simple and clear indication is sufficient for a stop; a
              justification for your wish to stop it is then not required.
            </p>
            <p className="legalText">
              If, despite all explanations or due to our behavior, you have the
              impression that your rights are being denied, then a complaint to
              a data protection supervisory authority is a logical next step.
              The GDPR gives you the right to contact these authorities at any
              time.
            </p>
          </section>

          {/* ── Supervisory authority ── */}
          <section className="legalSection">
            <h2 className="legalSectionTitle">Competent supervisory authority</h2>
            <p className="legalText">
              The competent supervisory authority for us is
            </p>
            <address className="legalAddress">
              National Commission for Data Protection (CNPD)
              <br />
              15, Boulevard du Jazz
              <br />
              L-4370 Belvaux
              <br />
              Luxembourg
              <br />
              Phone: +352 26 10 60 1
            </address>
          </section>

          {/* ── Controller ── */}
          <section className="legalSection">
            <h2 className="legalSectionTitle">
              Name and address of the person responsible
            </h2>
            <p className="legalText">
              The controller within the meaning of the General Data Protection
              Regulation and other national data protection laws of the EU
              member states as well as other data protection regulations is
            </p>
            <address className="legalAddress">
              Regulated Layer One SCE, limited
              <br />
              68 Boulevard de la Pétrusse
              <br />
              Luxembourg
              <br />
              <br />
              Represented by its Managing Director
              <br />
              &middot;&nbsp; Henning Vollbehr
            </address>
          </section>

          {/* ── DPO ── */}
          <section className="legalSection">
            <h2 className="legalSectionTitle">
              Data Protection Management and Data Protection Officer (DPO)
            </h2>
            <p className="legalText">
              You can reach our data protection management via the contact
              details above or by e-mail:{" "}
              <a href="mailto:info@rl1.network" className="legalLink">
                info@rl1.network
              </a>
            </p>
          </section>

          {/* ── Legal bases ── */}
          <section className="legalSection">
            <h2 className="legalSectionTitle">
              Types of processing / legal bases
            </h2>
            <p className="legalText">
              According to the requirements of the GDPR, all processing
              activities must be assigned to a legal basis from the catalog in
              Art. 6 (1) GDPR. We will cite the exact legal basis here once if
              you wish to read it there. Otherwise, we only refer to the
              colloquial &lsquo;legal basis&rsquo; in italics and underlined in
              our data protection information without always mentioning the
              reference in the law.
            </p>
            <p className="legalText">
              The GDPR offers a total of six variants or legal bases, of which
              only four are relevant to us:
            </p>
            <ul className="legalList">
              <li>
                Processing of data on the basis of consent; Art. 6 (1) a.
              </li>
              <li>
                Processing necessary for the preparation or performance of a
                contract; Art. 6 (1) b.
              </li>
              <li>
                Processing necessary to comply with a mandatory law or
                regulation; Art. 6 (1) c.
              </li>
              <li>
                Processing necessary for the purposes of the legitimate
                interests pursued; Art. 6 (1) f; also referred to as balancing
                of interests.
              </li>
            </ul>
          </section>

          {/* ── Recipients ── */}
          <section className="legalSection">
            <h2 className="legalSectionTitle">Recipients of your data</h2>

            <h3 className="legalSubTitle">Third party</h3>
            <p className="legalText">
              If we pass on your data to third parties, we will explain this in
              the context of the respective processing or in the following here
              in the data protection information in each case and tell you the
              reason / purpose, the recipient and the legal basis for the
              transfer. If data is transferred to third parties, they are then
              responsible to you for the processing that takes place there.
            </p>

            <h3 className="legalSubTitle">Processor</h3>
            <p className="legalText">
              Processors are service providers who assist us with data
              processing on our behalf. Such processors may not process the
              data for their own purposes, i.e. only and exclusively in
              accordance with our instructions. Processors may not evaluate the
              data on their own authority or even transfer it to third parties.
              Processors are closely bound to us by contracts, are carefully
              selected and monitored by us accordingly. As we retain sovereignty
              over your data in the case of processors, we remain the
              controller in accordance with the rules of the GDPR and therefore
              also your point of contact. For this reason, we do not publish a
              complete list of processors here.
            </p>

            <h3 className="legalSubTitle">Processing outside the EU and EWR</h3>
            <p className="legalText">
              Some of the service providers we use provide their services from
              countries outside the EU or the EEA. In the case of the USA, we
              prefer partners who are certified in accordance with the rules of
              the Data Privacy Framework (DPF) and for whom an adequacy decision
              by the EU Commission therefore applies. Irrespective of this, we
              generally regulate the transfer of data to so-called third
              countries with the help of the binding agreement of the EU
              standard contractual clauses for third countries with our
              partners. We also apply this procedure if data is processed in the
              EU, but maintenance work may be carried out from outside the
              EU/EEA.
            </p>
          </section>

          {/* ── Website visits ── */}
          <section className="legalSection">
            <h2 className="legalSectionTitle">Visit our website</h2>
            <p className="legalText">
              When you access our website, some technical data is always
              automatically collected and processed &ndash; otherwise our web
              server would not be able to present you with a page on your
              smartphone or PC. This information includes, for example, the type
              of web browser, the operating system used, the domain name of your
              internet service provider and your IP address (your personal
              address on the internet, so to speak). This means that all this
              information is personally identifiable (to you). However, this
              data processing is necessary because without the IP address, the
              web server would not know where to deliver the requested website.
            </p>
            <p className="legalText">
              In addition to the actual page structure, the data from the page
              request is also processed for the following purposes and is
              required for this:
            </p>
            <ul className="legalList">
              <li>Ensuring a smooth connection to the website,</li>
              <li>Ensuring the smooth use of our website,</li>
              <li>Evaluating system security and stability and</li>
              <li>to optimize our website.</li>
            </ul>
            <p className="legalText">
              Important: We do not use your data from the page view to draw
              conclusions about your person. We do not have a cookie banner
              because we do not set cookies.
            </p>
            <p className="legalText">
              All of the processing activities mentioned are carried out in the
              legitimate interest of operating the website securely and
              efficiently.
            </p>
            <p className="legalText">
              The IP addresses and thus the personal reference of the above data
              are anonymized or deleted after seven days at the latest, unless
              they are the subject of an investigation into misuse.
            </p>
          </section>

          {/* ── Admin access ── */}
          <section className="legalSection">
            <h2 className="legalSectionTitle">
              Access to administrative access, protection against misuse
            </h2>
            <p className="legalText">
              Attempts to log in to our administration accesses are not logged
              anonymously. We store and process data from such and other
              attempts at misuse in order to prevent a possible attack, for
              example by blocking access, or to assist law enforcement
              authorities in investigating the matter, as hacking websites is
              illegal (even attempts to do so).
            </p>
            <p className="legalText">
              We generally store such log files for at least four months, as
              cyber attacks are often long-term in nature. We base the maximum
              storage period on the requirements that the BDSG prescribes for
              operators of state web servers in Germany (the BDSG and the GDPR
              do not provide any specific requirements for private web servers).
              § Section 76 (4) BDSG: &ldquo;The log data shall be deleted at
              the end of the year following its generation.&rdquo;
            </p>
            <p className="legalText">
              All of the aforementioned processing activities are carried out on
              the basis of a balancing of interests, i.e. the legitimate
              interest in operating a secure website and in the legal
              prosecution of persons who wish to harm our customers or us.
            </p>
          </section>

          {/* ── Contact form ── */}
          <section className="legalSection">
            <h2 className="legalSectionTitle">Contact form</h2>
            <p className="legalText">
              We occasionally activate a contact form on our website. If you
              send us inquiries via the contact form, your details from the
              inquiry form, including the contact details you provide there,
              will be forwarded to our employees by e-mail and stored for the
              purpose of answering / processing. In addition, the data is
              created as with every visit to a website, as we have already
              explained above.
            </p>
            <p className="legalText">
              In principle, sending e-mails always involves the risk of third
              parties gaining knowledge of the communication (confidentiality),
              the message being falsified (integrity) or the message being
              delivered with a delay or lost completely (availability) due to
              faults in an integrated technical component. The contact form is
              therefore only suitable for time-critical, binding and/or
              confidential messages to a very limited extent and is not
              recommended. For such matters, we recommend direct contact or a
              phone call.
            </p>
            <p className="legalText">
              The presentation of the legal basis for data processing and
              explanation of the storage periods required by the GDPR is
              somewhat complicated for a contact form. To keep it short: We
              want to make it as easy as possible for interested parties to
              contact us and are certainly pursuing a legitimate interest for
              both sides. If individuals use the contact form to conclude a
              contract with us, we would base the data required for this on the
              legal basis of a contract. In the case of individuals who do not
              wish to conclude a contract with us themselves, but do so for
              their employer, for example, the legitimate interest remains. In
              detail, this results in different rules for asserting your data
              protection rights, but this should not play a role for you and us
              in everyday life. As I said: If you are not comfortable with us
              processing your data, please contact us (regardless of the
              underlying &lsquo;legal basis&rsquo;).
            </p>
            <p className="legalText">
              The details on processing the data of interested parties and
              contractual partners apply regardless of the form of
              communication; we therefore present this in detail in a separate
              section below.
            </p>
          </section>

          {/* ── Customer data ── */}
          <section className="legalSection">
            <h2 className="legalSectionTitle">
              Handling the data of our customers, interested parties, suppliers,
              authorities and associations
            </h2>
            <p className="legalText">
              We process data because we have to or because we want to. A
              compulsion arises if contracts or laws cannot be fulfilled without
              the processing. In all other cases, processing takes place because
              it is necessary to fulfill legitimate interests. As a rule, RL1
              does not process data on the basis of consent. Should we
              deviate from this principle, we will explain this on a
              case-by-case basis.
            </p>

            <h3 className="legalSubTitle">Legal and contractual necessity</h3>
            <p className="legalText">
              The services of RL1 are aimed exclusively at commercial
              customers. Business correspondence is subject to a retention
              obligation due to tax and commercial law regulations. This
              retention obligation is based in particular on § 257 HGB, § 147
              AO and § 14b UstG and is calculated for six or ten years. It
              begins at the end of the year in which the transaction was
              completed or a contract was fulfilled, the content of which was
              shaped by the message (i.e. the message was effectively part of
              the contract). Deletion takes place at the end of the retention
              period. The storage of data during the statutory retention period
              and the necessary disclosure to authorities (e.g. tax office
              auditors) is therefore carried out in order to comply with the
              law.
            </p>
            <p className="legalText">
              Without listing further laws that apply to us here, we will always
              transfer data to third parties (here in particular government
              agencies) if compliance with mandatory laws is not otherwise
              possible.
            </p>
            <p className="legalText">
              In addition to the fulfillment of legal requirements, we will also
              transfer data in our care to third parties if this is necessary
              for the fulfillment / execution of contracts. If the personal data
              of a contractual partner is directly affected in this case, the
              transfer is made to fulfill contractual obligations. If it
              concerns personal data, e.g. of our customers&rsquo; employees
              (the data subject within the meaning of the GDPR is not our
              contractual partner), we process this data if it is necessary to
              fulfill our contracts and / or to safeguard the legitimate
              interests of the parties involved (example: entry of sender data
              into a shipping system of a courier system; without the transfer
              of data, the shipping commissioned by the customer&rsquo;s
              employee cannot take place).
            </p>

            <h3 className="legalSubTitle">Legitimate interests</h3>
            <p className="legalText">
              We want to fulfill contracts as well/efficiently as possible. So,
              for example, we make a note of the names of contact persons or
              take notes of conversations during the initiation or execution of
              a contract. This data processing is in the (legitimate /
              justified) interest of all parties involved; surely nobody wants
              to start from the beginning again and again when continuing
              conversations, even if the contact person changes internally.
            </p>
            <p className="legalText">
              This means that we are already processing personal data beyond the
              legal basis of contract fulfillment or legal requirements. This
              demarcation is important because it results in different storage
              rules and data subject rights.
            </p>
            <p className="legalText">
              We must process the name of a contractual partner and store it
              within the scope of the statutory retention obligation. We may
              store the names and circumstances of our contact persons if this
              is necessary for legitimate purposes and does not outweigh the
              rights of the data subjects that require protection. The
              processing (collection, use, storage) is then formally carried out
              on the basis of legitimate interest.
            </p>

            <h3 className="legalSubTitle">
              Use of systems provided by RL1
            </h3>
            <p className="legalText">
              In order to provide proof (e.g. for our customers) that the
              procedure for granting initial access to our systems has been
              carried out properly, we keep records of this procedure for as
              long as the access is used (plus an additional retention period of
              three years in accordance with the statutory limitation period in
              Germany). In addition, we create automated records of every
              transaction carried out by our customers on our systems. These
              records contain all the information necessary to understand the
              transaction, clearly assign the transaction to the customer who
              carried it out, clarify any irregularities and comply with the
              laws applicable to us.
            </p>
            <p className="legalText">
              In order to be able to clarify any irregularities that may occur
              or to be able to convince auditors (from tax authorities, clients
              or us) that irregularities would be traceable, we consider the
              creation of these records to be a legitimate interest as long as
              the scope of the records is not explicitly required by law anyway.
              We retain the records to serve the legitimate interests of our
              clients and ourselves and finally to comply with German tax laws,
              resulting in a retention period of approximately 12 years (as
              explained above).
            </p>
            <p className="legalText">
              Our customers are legal entities that are legally represented by
              persons authorized by them. This means that our contractual
              partner is not an individual person, but a company (legal entity).
              We assume (but do not know in all cases) that there is a natural
              person (e.g. an employee of the customer) behind every action of
              our customers in our systems when using the services contractually
              agreed with us. As long as user IDs such as an e-mail address are
              named or clearly assigned, all data appears to be personal. Since
              we do not have a contract with the person who is (supposedly)
              behind the transaction, but with the company, the legal basis
              (GDPR) for processing any personal data is the legitimate
              interest, but not the &lsquo;contract&rsquo;, as this would
              require a direct contract with the data subject.
            </p>
            <p className="legalText">
              However, we do not know who is actually behind the transaction, as
              it is up to our customers to ensure that the use of our services
              is only in accordance with the contract concluded with us. On our
              side, we only want to be sure that our customer (company) is
              actually behind a transaction that is allegedly made on behalf of
              our customer &ndash; regardless of which person or which algorithm
              triggered the transaction in our customer&rsquo;s sphere.
            </p>

            <h3 className="legalSubTitle">Other specific processing purposes</h3>
            <p className="legalText">
              In addition to the more efficient conduct of discussions and
              negotiations and the execution of contracts, contact data is also
              processed in order to proactively approach interested companies,
              suppliers or existing and former customers for new or extended
              cooperation. In the case of existing customers, we also process
              data on our contacts as part of the collection and handling of
              feedback and criticism as part of quality management. In the case
              of our suppliers, the purpose for processing personal data is also
              the efficient control (audits) from our information security
              management.
            </p>
            <p className="legalText">
              In the event of legal disputes, we also use the data to assert,
              exercise or defend legal claims. Irrespective of this, in
              individual cases we involve experts for legal and tax issues in
              the assessment or processing of contracts, invoices etc. These
              third parties are regularly bound to confidentiality due to their
              professional position and/or by specific contracts. Furthermore,
              they do not receive data processed on behalf of the customer, but
              only the information that arises directly from contracts and
              invoices etc. (in particular contact details of the contact
              persons named there and information on the process).
            </p>
            <p className="legalText">
              All of the above processing activities are carried out in the
              legitimate or justified interest of fulfilling a contract in the
              interests of our customers. We therefore pursue legitimate
              interests on our part, but in many cases also in the interests of
              our customers and their employees. The processing of personal data
              from contacts with authorities and associations is also based on a
              balancing of interests. Here, too, we make a note of contact
              persons and the content of discussions in order to make the
              processing of transactions or technical contacts (e.g. with
              regulatory authorities) more efficient.
            </p>

            <h3 className="legalSubTitle">Origin of the data</h3>
            <p className="legalText">
              Information on individuals at interested parties, customers,
              suppliers, authorities or associations usually originates from
              direct contact or related documents (general correspondence,
              tender or contract documents; advertising letters from potential
              suppliers). Data from interested parties also comes from our
              contact form on our website or from e-mails or letters sent to
              us. If we take the initial sales initiative ourselves, we also
              take the contact data from publicly accessible sources (e.g.
              websites) or simply ask the company directly for a suitable
              contact person for us.
            </p>

            <h3 className="legalSubTitle">Storage period and deletion</h3>
            <p className="legalText">
              As mentioned above, the storage and deletion period depends
              largely on the legal basis for processing. If the data is stored
              because this is required by commercial or tax laws, for example,
              we have no room for maneuver and consistently follow the legal
              requirements: In the case of tax-relevant data, this is ten years
              starting from the end of the year in which the transaction was
              completed. This period may be extended due to ongoing tax audits
              or requirements by the authorities.
            </p>
            <p className="legalText">
              In the case of data that we process on the basis of legitimate
              interest, the law does not give us any fixed requirements. Here we
              have to define a pragmatic solution that is appropriate to the
              circumstances ourselves. At this point, &lsquo;appropriate&rsquo;
              means that we again include the legitimate interests of the data
              subjects in the consideration. For us, &lsquo;pragmatic&rsquo;
              here means that we want to delete with easy-to-handle, flat-rate
              deadlines wherever possible. If we were to carry out complex
              (case-by-case) checks before our deletion runs, this would mean a
              renewed examination of the personal data &ndash; and that would
              be the opposite of the data-saving processing required by the
              GDPR.
            </p>
            <p className="legalText">
              We are therefore generally guided by the general statutory
              limitation period. After this three-year period has expired, the
              processing purpose &ldquo;Storage and use of data for the
              assertion, exercise or defense of legal claims&rdquo; is no longer
              applicable. This period therefore also applies to data from sales
              activities that have not resulted in a contract. Such inactive
              contacts are deleted or blocked after three years. We consider a
              contact to be inactive if there has been no further communication
              between the two parties during the three-year period. A block is
              indicated if we are not yet permitted to delete the data due to
              other retention obligations, but no longer wish to use it for
              sales purposes.
            </p>
          </section>

          {/* ── Applicants ── */}
          <section className="legalSection">
            <h2 className="legalSectionTitle">
              Applicants for an open position
            </h2>

            <h3 className="legalSubTitle">Data security</h3>
            <p className="legalText">
              When sending application documents, we offer the option of
              agreeing a password to encrypt the documents.
            </p>
            <p className="legalText">
              The application documents are stored in an area to which only the
              employees dealing with applications have access, in addition to
              technical administrators who are under a special obligation to
              maintain confidentiality.
            </p>

            <h3 className="legalSubTitle">Storage duration</h3>
            <p className="legalText">
              <strong>During the application process:</strong> An application
              can only be processed in a fair and structured manner if the
              decision-makers have access to the necessary information. The
              information is ultimately stored with the aim of concluding an
              employment contract. In addition to the legal basis from the
              GDPR, Section 26 of the BDSG is also relevant here.
            </p>
            <p className="legalText">
              <strong>An employment relationship is established:</strong> The
              documents provided will become part of the personnel file; we will
              provide information on the scope, purpose and legal basis of
              further processing as well as on the possible disclosure of data
              to third parties in connection with the conclusion of the
              employment contract.
            </p>
            <p className="legalText">
              <strong>No employment relationship is established:</strong> As we
              occasionally receive inquiries after applications as to why a
              rejection was made, we do not delete the information immediately
              after the application process has been completed; otherwise we
              would not be able to respond to the inquiries. Factual statements
              against the background of the General Equal Treatment Act (AGG)
              are also not possible without retaining the documents from the
              application process. By being able to provide information, we are
              pursuing our own legitimate interests and, where applicable, the
              interests of the person concerned (applicant).
            </p>
            <p className="legalText">
              As there is a time limit for responding to inquiries, we delete
              the application as soon as the legal deadlines justify this: six
              months after completion of the application process.
            </p>

            <h3 className="legalSubTitle">Which data is affected?</h3>
            <p className="legalText">
              All data that is the subject of the application and arises from
              the communication (interview content, emails) is affected by the
              storage.
            </p>
            <p className="legalText">
              We encourage all applicants to only provide us with information in
              the course of their application that is necessary for an objective
              selection. These are professionally relevant qualifications and
              experience. Information on ideological beliefs or religious
              affiliation may play a role in the course of payroll accounting
              (church tax), but is not relevant to the application. Information
              on political positions or the (non-)existence of a trade union
              affiliation may also not be the subject of a recruitment decision
              &ndash; and should therefore not be included in an application.
            </p>
            <p className="legalText">
              Convince us with a professional application in which only the
              personal information that is or may be relevant for a hiring
              decision is disclosed.
            </p>

            <h3 className="legalSubTitle">
              Data Protection Provisions about the RL1 Talent Pool
            </h3>
            <p className="legalText">
              We offer job applicants to be registered within our Talent Pool.
            </p>
            <p className="legalText">
              The RL1 Talent Pool is a candidate management system that
              is used to recruit talent. The purpose of the Talent Pool is to
              maintain contact with talented candidates and, if necessary, to
              recruit them for future employment at RL1. To this end,
              candidates are informed about open positions that might fit to
              their skills and interests. Agreeing to be registered within the
              talent pool does not cause any costs to be paid at RL1.
            </p>
            <p className="legalText">
              Though this offer is free of charge for the applicants we consider
              the agreement using the talent pool as a contract which is then
              the legal basis for processing the data. The contract can be
              cancelled by both parties at any time without giving a reason.
            </p>
            <p className="legalText">
              The processing of these personal data is required in order to
              fulfil the above mentioned purpose: First name, Last name, Date of
              birth, e-mail, address for studies: course of study, focus of
              study, (expected) end of studies, degree for career entry: date of
              planned career entry, preferred entry area, preferred location, CV
              upload.
            </p>
            <p className="legalText">
              Only selected authorized employees of the HR department have
              access to this personal data stored in the talent pools. They may
              only use the data for the purposes specified above. The personal
              data is treated as strictly confidential.
            </p>
            <p className="legalText">
              Becoming part of our talent pool is an optional offer and not a
              prerequisite for an application. A person registered in a talent
              pool can have their data stored there updated or deleted at any
              time without giving reasons. To do so, they must send a short
              message to{" "}
              <a href="mailto:recruiting@rl1.network" className="legalLink">
                recruiting@rl1.network
              </a>{" "}
              stating the personal information to be updated or cancel the
              agreement to remain in the talent pool. The data stored about the
              person concerned in the talent pool will then &ndash; depending on
              the request &ndash; be deleted or updated immediately. Data will
              also be deleted after a period of inactivity about 6 months.
            </p>

            <h3 className="legalSubTitle">
              No disclosure of data to third parties
            </h3>
            <p className="legalText">
              Information from application procedures is not passed on to third
              parties. If, in the course of an application, the expected
              individual net remuneration of the applicant is to be calculated,
              we transfer only the relevant data to a specialized service (e.g.
              tax consultant). This is done in the (legitimate) interest of
              being able to provide the most accurate information possible.
            </p>
          </section>

          {/* ── Policy changes ── */}
          <section className="legalSection">
            <h2 className="legalSectionTitle">
              Changes to our privacy policy
            </h2>
            <p className="legalText">
              We reserve the right to adapt this privacy policy so that it
              always complies with current legal requirements or to implement
              changes to our services in the privacy policy, e.g. when
              introducing new services. The new privacy policy will then apply
              to your next visit.
            </p>
          </section>

          {/* ── LinkedIn ── */}
          <section className="legalSection">
            <h2 className="legalSectionTitle">
              Data Privacy Notice for the RL1 Company Page on LinkedIn
            </h2>
            <p className="legalText" style={{ opacity: 0.5 }}>
              Content for this section is pending.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
