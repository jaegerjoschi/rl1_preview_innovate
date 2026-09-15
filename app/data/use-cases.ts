/**
 * Die Anwendungsfälle von RL1.
 *
 * `status` macht die KONTEXT-Auflage strukturell: bis zum SWIAT→RL1-
 * Cut-over (Anfang/Mitte Dez. 2026) trägt jede Karte einen "In progress"-
 * Marker und keine Live-Zusage. Der Schalter site.useCasesLive kippt die
 * ganze Sektion danach.
 */
export type UseCaseStatus = "live" | "in-progress" | "planned";

export type UseCase = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  status: UseCaseStatus;
  icon: string;
  /** Spannt im Bento-Raster zwei Spalten */
  wide?: boolean;
};

export const useCases: UseCase[] = [
  {
    id: "digital-bonds",
    eyebrow: "Fixed Income",
    title: "Digital Bonds",
    body: "Issue, settle and manage the full lifecycle of tokenized fixed-income instruments on a regulated network.",
    status: "in-progress",
    icon: "digital-bonds",
  },
  {
    id: "tokenized-rwa",
    eyebrow: "Asset Tokenization",
    title: "Tokenized Real-World Assets",
    body: "Bring off-chain assets on-chain with compliant, programmable ownership and transfer restrictions.",
    status: "in-progress",
    icon: "tokenized-rwa",
  },
  {
    id: "bank-money",
    eyebrow: "Monetary Infrastructure",
    title: "Central & Commercial Bank Money",
    body: "Interoperate between central bank digital currencies and commercial bank money on a single regulated ledger.",
    status: "planned",
    icon: "bank-money",
  },
  {
    id: "collateral",
    eyebrow: "Treasury",
    title: "On-chain Collateral",
    body: "Move and optimise collateral in real time across counterparties and venues without manual intervention.",
    status: "in-progress",
    icon: "collateral",
  },
  {
    id: "stablecoins",
    eyebrow: "Digital Money",
    title: "Stablecoins",
    body: "Deploy regulated, bank-issued stablecoins with native settlement finality and redemption guarantees.",
    status: "planned",
    icon: "stablecoins",
  },
  {
    id: "digital-funds",
    eyebrow: "Asset Management",
    title: "Digital Funds",
    body: "Automate subscriptions, redemptions and NAV calculations for tokenized fund shares with programmable rules.",
    status: "in-progress",
    icon: "digital-funds",
  },
  {
    id: "repo",
    eyebrow: "Secured Financing",
    title: "Repo & Securities Lending",
    body: "Execute and settle secured financing with atomic delivery-versus-payment and automated lifecycle management.",
    status: "in-progress",
    icon: "repo",
  },
  {
    id: "derivatives",
    eyebrow: "Risk Management",
    title: "Derivatives Margining",
    body: "Automate margin calls and collateral movements for derivatives positions in real time.",
    status: "planned",
    icon: "derivatives",
  },
];
