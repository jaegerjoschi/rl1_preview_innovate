/**
 * "Take it to your board" — die Zeilen der Ressourcen-Seite.
 *
 * Typisiert so, dass eine Zeile ohne `file` NICHT `available` sein kann:
 * kein Download-Button ohne Datei.
 *
 * Runde 11: die vier Platzhalter-Zeilen („Coming soon") sind entfallen.
 * Es stehen nur noch die beiden Dokumente hier, die es wirklich gibt —
 * beide liegen unter public/downloads/ und laden direkt herunter.
 */
type Available = {
  id: string;
  title: string;
  description: string;
  status: "available";
  file: string;
};
type ComingSoon = {
  id: string;
  title: string;
  description: string;
  status: "coming-soon";
  file?: never;
};
export type ResourceRow = Available | ComingSoon;

export const resources: ResourceRow[] = [
  {
    id: "at-a-glance",
    title: "RL1 at a Glance",
    description: "The one-page membership kit, for circulating internally.",
    status: "available",
    file: "/downloads/rl1-at-a-glance.pdf",
  },
  {
    id: "the-rl1-network",
    title: "The RL1 Network",
    description:
      "The full deck: Europe's core utility for the digital financial market, the regulatory momentum behind it and how the cooperative is built.",
    status: "available",
    file: "/downloads/the-rl1-network.pdf",
  },
];
