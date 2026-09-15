/**
 * "What makes RL1 special" — vier Merkmale, eine Quelle für alle drei
 * Darstellungsvarianten (Accordion / Tabelle / Scroll-Aufbau).
 *
 * `metric` speist die Zahl, die in der Tabellen-Variante beim Scrollen
 * hochzählt. `metricPrefix`/`metricSuffix` rahmen sie.
 */
export type SpecialItem = {
  id: string;
  title: string;
  body: string;
  metric?: number;
  metricPrefix?: string;
  metricSuffix?: string;
  metricLabel?: string;
};

export const specialItems: SpecialItem[] = [
  {
    id: "live",
    title: "Live and running",
    body: "RL1 runs on infrastructure with a live production track record, more than 50 transactions worth over 700 million euros in three years of live production before the cooperative took it over.",
    metric: 700,
    metricPrefix: "€",
    metricSuffix: "M+",
    metricLabel: "settled in live production",
  },
  {
    id: "power-to-member",
    title: "Power to the member",
    body: "Only the members decide what the future of European digital capital markets will look like. Each member has one vote in determining the roadmap, the standards, and the next steps for development.",
    metric: 1,
    metricSuffix: " vote",
    metricLabel: "per member, regardless of size",
  },
  {
    id: "nonprofit",
    title: "Nonprofit and democratized",
    body: "RL1 isn't owned by a vendor with shareholders to answer to. It's a non-profit cooperative based in Luxembourg. No lock-in to one provider's roadmap or pricing.",
    metric: 0,
    metricSuffix: "",
    metricLabel: "external shareholders",
  },
  {
    id: "open-standards",
    title: "Open standards, connected to the Eurosystem",
    body: "Built on the EVM, the institutional DeFi standard. Connected to the ECB's Pontes and Appia settlement work. Your team is familiar with the tools, and no infrastructure rebuild is required.",
    metricLabel: "EVM-compatible from day one",
  },
];
