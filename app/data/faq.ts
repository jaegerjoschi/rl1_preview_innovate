/**
 * FAQ-Inhalte, getrennt nach Seite. So dürfen Startseite und Join-Seite
 * auseinanderlaufen, und jede Seite gibt ihr eigenes FAQPage-JSON-LD aus.
 *
 * Die Antworten auf der Startseite sind noch Platzhalter (siehe `draft`).
 */
export type FaqItem = {
  q: string;
  a: string;
  /** Platzhaltertext — der Prebuild-Check warnt, solange true */
  draft?: boolean;
};

export const faq: Record<"home" | "join", FaqItem[]> = {
  home: [
    {
      q: "What is RL1 exactly?",
      a: "RL1 is a live shared blockchain infrastructure that banks use to issue and settle digital bonds, funds and collateral. It is owned by the banks that use it, organised as a European cooperative.",
      draft: true,
    },
    {
      q: "Who owns RL1?",
      a: "The member institutions. RL1 is a Société Coopérative Européenne registered in Luxembourg, with no external shareholders and no profit motive. Every member has one vote.",
      draft: true,
    },
    {
      q: "Is RL1 the same as a cryptocurrency I can buy?",
      a: "No. RL1 does not issue a public token. Transactions settle in central and commercial bank money on a permissioned network operated for regulated institutions.",
      draft: true,
    },
    {
      q: "Who can join?",
      a: "Licensed banks, central banks, market infrastructure operators, custodians and regulated asset managers join as members. Technology operators and observers join on other terms.",
      draft: true,
    },
    {
      q: "How is RL1 regulated?",
      a: "RL1 is built on the EVM and connected to the Eurosystem's Pontes and Appia settlement work, under the supervision of the relevant regulatory authorities with uniform standards.",
      draft: true,
    },
    {
      q: "What does membership cost?",
      a: "Membership is a capital commitment to a cooperative you co-own, not a subscription fee. The structure and payment schedule are set out in the membership documentation.",
      draft: true,
    },
    {
      q: "Can a member leave later?",
      a: "Yes. The conditions for leaving are set out in the statutes, alongside how members are admitted and how the network is governed.",
      draft: true,
    },
  ],
  join: [
    {
      q: "Who are we looking for to join the network?",
      a: "Open to licensed banks, central banks, market infrastructure operators, custodians and regulated asset managers. Technology operators and observers join on other terms. If your institution is not listed here, the conversation is still worth having.",
    },
    {
      q: "What does membership cost?",
      a: "The financial commitment, its structure and the payment schedule are covered in the first conversation and set out in the membership documentation you receive afterwards. It is a capital commitment to a cooperative you co-own, not a subscription fee.",
    },
    {
      q: "Who decides whether we are admitted?",
      a: "The existing member institutions. RL1 is governed as a European Cooperative Society (SCE) domiciled in Luxembourg — accession is a decision of the cooperative, not of a vendor.",
    },
    {
      q: "How long does joining take?",
      a: "That depends largely on your own internal approval process. The conversation and the documentation happen quickly; the accession itself moves at the pace your institution needs.",
    },
    {
      q: "Do we have to be domiciled in the EU?",
      a: "The cooperative is built for the European financial industry, and EU domicile is the norm for members. Institutions outside the EU do participate — as validators, supporters or observers. That is exactly the kind of thing worth clarifying in a first call.",
    },
    {
      q: "Can we join as a technology provider rather than a bank?",
      a: "Yes. Alongside member institutions, the network runs with technical operators as validators, and with supporting institutions and observers. Which role fits is part of the first conversation.",
    },
    {
      q: "What happens to the information we submit?",
      a: "Scheduling runs on Microsoft Bookings within RL1's own Microsoft 365 environment. Your details are stored there and are not passed to any third-party scheduling or marketing provider. There is no tracking on this site.",
    },
  ],
};
