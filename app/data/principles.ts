/**
 * "Designed from day one for the realities of institutional finance" —
 * sechs nummerierte Karten auf /about.
 */
export type Principle = { n: string; body: string; icon: string };

export const principles: Principle[] = [
  { n: "01", icon: "signal", body: "RL1 is live today, settling transactions on battle-tested infrastructure, not a whitepaper." },
  { n: "02", icon: "plug", body: "EVM-compatible, so your tools already work with the standard your developers already use." },
  { n: "03", icon: "institution", body: "Compatible with the Eurosystem, integrated with Pontes and Appia." },
  { n: "04", icon: "brackets", body: "Integration via standard APIs, without a proprietary SDK or custom middleware." },
  { n: "05", icon: "shield", body: "Keep the key management and custody providers your risk team has already approved." },
  { n: "06", icon: "vote", body: "Every member has one vote in a European non-profit cooperative, regardless of company size." },
];
