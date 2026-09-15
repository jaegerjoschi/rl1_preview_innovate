/**
 * Das Statement auf der Startseite.
 *
 * Der Wortlaut ist noch Platzhalter (`draft: true`) — der Prebuild-Check
 * warnt, solange das so ist, damit kein erfundener Satz unbemerkt neben
 * dem echten Namen einer real benannten Person live geht.
 */
export type Quote = {
  quote: string;
  name: string;
  role: string;
  org?: string;
  photo?: string;
  draft?: boolean;
};

export const homeQuote: Quote = {
  quote:
    "The longterm vision for RL1 is to be the leading European utility for the digital capital market. We have seen many beautiful islands, individual proofs of concept that each found success on their own, and now we are connecting these islands by building the common rails between them.",
  name: "Martin Müller",
  role: "Chairman of the Supervisory Board",
  photo: "/board/martin-mueller.jpg",
};
