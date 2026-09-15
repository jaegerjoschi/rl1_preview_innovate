export type BoardMember = {
  name: string;
  role: string;
  org: string;
  initials: string;
  photo?: string; // path relative to /public, e.g. "/board/jane-doe.jpg"
  institutionLogo?: string; // path relative to /public, e.g. "/logos/dz-bank.jpeg"
  chairman?: boolean; // marks the chairman of the board
};

/*
  Runde 6: Reihenfolge ist BEWUSST gesetzt (Vorsitz zuerst, dann nach
  Wunsch des Auftraggebers) — NICHT alphabetisch sortieren, das würde
  Martin Müller wieder ans Ende der Vorsitz-Position schieben.
*/
export const supervisoryBoard: BoardMember[] = [
  {
    name: "Martin Müller",
    role: "Member of the Executive Management Board",
    org: "DekaBank",
    initials: "MM",
    photo: "/board/martin-mueller.jpg",
    institutionLogo: "/logos/deka.png",
    chairman: true,
  },
  {
    name: "Matthias Bergner",
    role: "Global Head of Treasury",
    org: "DZ Bank",
    initials: "MB",
    photo: "/board/matthias-bergner.jpg",
    institutionLogo: "/logos/dz-bank.jpeg",
  },
  {
    name: "Simon Manwaring",
    role: "Head of Trading and Sales",
    org: "NatWest Markets",
    initials: "SM",
    photo: "/board/simon-manwaring.jpg",
    institutionLogo: "/logos/natwest.png",
  },
  {
    name: "Christoph Hock",
    role: "Head of Tokenization and Digital Assets",
    org: "Union Investment",
    initials: "CH",
    photo: "/board/christoph-hock.jpeg",
    institutionLogo: "/logos/union-investment.jpeg",
  },
  {
    name: "Jacco Keijzer",
    role: "Head of Global Markets",
    org: "ABN AMRO",
    initials: "JK",
    photo: "/board/jacco-keijzer.jpg",
    institutionLogo: "/logos/abn-amro.jpeg",
  },
  {
    name: "Romuald Orange",
    role: "Managing Director",
    org: "Natixis Corporate & Investment Banking",
    initials: "RO",
    photo: "/board/romuald-orange.jpg",
    institutionLogo: "/logos/natixis.jpeg",
  },
  {
    name: "Dirk Kruwinnus",
    role: "CPO",
    org: "Seturion (Boerse Stuttgart Group)",
    initials: "DK",
    photo: "/board/dirk-kruwinnus.jpeg",
    institutionLogo: "/logos/seturion.jpeg",
  },
  {
    name: "Daniel Wrobel",
    role: "Member of the Executive Management Board — Capital Markets Sales & Origination",
    org: "LBBW",
    initials: "DW",
    photo: "/board/daniel-wrobel.jpg",
    institutionLogo: "/logos/lbbw.jpg",
  },
];

export const managementBoard: BoardMember[] = [
  {
    name: "Henning Vollbehr",
    role: "Managing Director",
    org: "",
    initials: "HV",
    photo: "/board/henning-vollbehr.jpg",
  },
];
