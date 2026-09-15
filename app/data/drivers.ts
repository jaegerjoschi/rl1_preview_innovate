/**
 * „What drives Regulated Layer One?" — die sechs Karten der
 * Carousel-Sektion auf der Startseite.
 */
export type Driver = {
  id: string;
  title: string;
  body: string;
};

export const drivers: Driver[] = [
  {
    id: "trust",
    title: "Trust",
    body: "A governance model built on transparency, accountability, and the collective mandate of a European cooperative. Shared rules for a shared infrastructure.",
  },
  {
    id: "neutrality",
    title: "Neutrality",
    body: "No single entity controls the network. Decision-making is distributed across members, ensuring fair access and equal treatment for every participant.",
  },
  {
    id: "autonomy",
    title: "Autonomy",
    body: "Members retain sovereignty over their data and operations. The network enables interoperability without demanding dependence on any central operator.",
  },
  {
    id: "interoperability",
    title: "Interoperability",
    body: "Open standards and seamless connectivity across networks and infrastructures, enabling integration without dependence on any single operator.",
  },
  {
    id: "cooperation",
    title: "Cooperation",
    body: "Operated as a shared SCE utility for the collective economic interest of its members.",
  },
  {
    id: "compliance",
    title: "Compliance & Security",
    body: "Regulatory conformity, resilience and information security as core principles.",
  },
];
