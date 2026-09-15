/**
 * Die vier Story-Sektionen der Startseite.
 *
 * `lead` und `rest` markieren, wo die Aussage kippt — im Entwurf ist der
 * vordere Teil weiß und der hintere halbtransparent. Beim Scrollen läuft
 * der GANZE Satz Wort für Wort hoch; der Entwurfszustand ist die
 * Momentaufnahme bei rund halbem Fortschritt.
 *
 * `image` ist heute ein Standbild. Kommt später ein Scroll-Video, wird
 * daraus ein <video> mit an --p gekoppelter currentTime — die Datenform
 * ändert sich dafür nicht.
 */
export type StoryFrame = {
  id: string;
  eyebrow: string;
  lead: string;
  rest: string;
  image: string;
};

export const storyFrames: StoryFrame[] = [
  {
    id: "fragmentation",
    eyebrow: "Fragmentation holds capital markets back",
    lead: "A blockchain only works if enough people use it. For years, European banks have each independently set up their own pilot projects, and none of them has grown large enough to make a difference. RL1",
    rest: "unlocks a shared, cross-bank infrastructure under the supervision of regulatory authorities with uniform standards.",
    image: "/story/frame-1.jpg",
  },
  {
    id: "live-and-running",
    eyebrow: "RL1 is live and running",
    lead: "RL1 runs on infrastructure with a live production track record, more than 50 transactions",
    rest: "worth over 700 million euros processed over three years before the cooperative took it over. It processes real transactions today.",
    image: "/story/frame-2.jpg",
  },
  {
    id: "members-shape-next",
    eyebrow: "Members shape what comes next",
    lead: "Because RL1 is owned by its members, they decide what the future of the European digital capital market will look like. One",
    rest: "member, one vote.",
    image: "/story/frame-3.jpg",
  },
  {
    id: "nonprofit",
    eyebrow: "Nonprofit and democratized",
    lead: "RL1 isn't owned by a vendor with shareholders to answer to. It's a non-profit",
    rest: "cooperative based in Luxembourg. No lock-in to one provider's roadmap or pricing.",
    image: "/story/frame-4.jpg",
  },
];
