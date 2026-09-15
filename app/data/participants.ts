export type Role = "member" | "validator" | "supporter";

export type Participant = {
  name: string;

  initials: string;
  logo?: string; // path relative to /public, e.g. "/logos/abn-amro.svg"
  /** Weiße, freigestellte Fassung für dunkle Flächen (Trust-Strip,
   *  Ecosystem-Kacheln). Erzeugt von scripts/build-logo-mono.mjs.
   *  Fehlt sie, fällt die Darstellung auf `logo` zurück. */
  logoMono?: string;
  url?: string; // external link for the card
  coords?: [number, number]; // [longitude, latitude] — D3 convention
  roles?: Role[];
  pendingNote?: string; // caveat shown as a card badge + footnote, e.g. "joining soon"
};

export const participants: Participant[] = [
  {
    name: "DekaBank",

    initials: "DB",
    logo: "/logos/deka.png",
    logoMono: "/logos/mono/deka.png",
    url: "https://www.dekabank.de",
    coords: [8.68, 50.11], // Frankfurt
    roles: ["member", "validator"],
  },

  {
    name: "SC Ventures",

    initials: "SC",
    logo: "/logos/sc-ventures.jpeg",
    logoMono: "/logos/mono/sc-ventures.png",
    url: "https://www.scventures.io",
    coords: [103.82, 1.35], // Singapore
    roles: ["member", "validator"],
  },
  {
    name: "LBBW",

    initials: "LB",
    logo: "/logos/lbbw.jpg",
    logoMono: "/logos/mono/lbbw.png",
    url: "https://www.lbbw.de",
    coords: [9.18, 48.78], // Stuttgart
    roles: ["member", "validator"],
  },
  {
    name: "SWIAT GmbH",

    initials: "SW",
    logo: "/logos/swiat.jpeg",
    logoMono: "/logos/mono/swiat.png",
    url: "https://www.swiat.com",
    coords: [8.68, 50.11], // Frankfurt
    roles: ["validator"],
  },
  {
    name: "Chartered Investment",

    initials: "CI",
    logo: "/logos/chartered-investment.jpeg",
    logoMono: "/logos/mono/chartered-investment.png",
    url: "https://www.chartered-investment.com",
    coords: [6.77, 51.23], // Düsseldorf
    roles: ["member"],
  },
  {
    name: "DZ BANK",

    initials: "DZ",
    logo: "/logos/dz-bank.jpeg",
    logoMono: "/logos/mono/dz-bank.png",
    url: "https://www.dzbank.com",
    coords: [8.68, 50.11], // Frankfurt
    roles: ["member"],
  },

  {
    name: "KfW",

    initials: "KfW",
    logo: "/logos/kfw.avif",
    logoMono: "/logos/mono/kfw.png",
    url: "https://www.kfw.de",
    coords: [8.68, 50.11], // Frankfurt
    roles: ["supporter"],
  },

  {
    name: "Natixis CIB",

    initials: "NX",
    logo: "/logos/natixis.jpeg",
    logoMono: "/logos/mono/natixis.png",
    url: "https://cib.natixis.com",
    coords: [2.35, 48.85], // Paris
    roles: ["member"],
  },
  {
    name: "NatWest",

    initials: "NW",
    logo: "/logos/natwest.png",
    logoMono: "/logos/mono/natwest.png",
    url: "https://www.natwest.com",
    coords: [-0.13, 51.51], // London
    roles: ["member"],
    pendingNote: "NatWest will join in the coming weeks.",
  },
  {
    name: "Seturion",

    initials: "SE",
    logo: "/logos/seturion.jpeg",
    logoMono: "/logos/mono/seturion.png",
    url: "https://www.seturion.com",
    coords: [9.18, 48.78], // Stuttgart
    roles: ["member"],
  },

  {
    name: "V-Bank",

    initials: "VB",
    logo: "/logos/v-bank.jpeg",
    logoMono: "/logos/mono/v-bank.png",
    url: "https://www.v-bank.com",
    coords: [11.58, 48.14], // Munich
    roles: ["supporter"],
  },
  {
    name: "ABN AMRO",

    initials: "AA",
    logo: "/logos/abn-amro.jpeg",
    logoMono: "/logos/mono/abn-amro.png",
    url: "https://www.abnamro.nl/en/commercialbanking/corporates-institutionals/products/finance-your-business/debt-capital-markets.html",
    coords: [4.89, 52.37], // Amsterdam
    roles: ["member"],
  },
  {
    name: "L-Bank",

    initials: "LB",
    logo: "/logos/l-bank.jpeg",
    logoMono: "/logos/mono/l-bank.png",
    url: "https://www.l-bank.com",
    coords: [8.4, 49.01], // Karlsruhe
    roles: ["supporter"],
  },
  {
    name: "Cecabank",

    initials: "CB",
    logo: "/logos/cecabank.jpeg",
    logoMono: "/logos/mono/cecabank.png",
    url: "https://www.cecabank.es",
    coords: [-3.7, 40.42], // Madrid
    roles: ["member"],
  },
  {
    name: "Crédit Mutuel Alliance Fédérale",

    initials: "CM",
    logo: "/logos/credit-mutuel.jpeg",
    logoMono: "/logos/mono/credit-mutuel.png",
    url: "https://www.creditmutuel.fr/en/alliancefederale.html",
    coords: [7.75, 48.58], // Strasbourg
    roles: ["member"],
  },
  /*
    Runde 11: IMF vorerst ausgeblendet (Wunsch des Auftraggebers,
    „erstmal von der Website nehmen") — auskommentiert statt gelöscht,
    damit der Eintrag samt Logo und Koordinaten zurückgeholt werden kann.
    Alle Zahlen auf der Seite zählen diese Liste (Trust-Strip:
    `scoped.length`, Netzwerk-Schaubild: `observers.length`), sie gehen
    damit automatisch auf 19 Institutionen und 3 Supporters.
  */
  // {
  //   name: "IMF",
  //   initials: "IMF",
  //   logo: "/logos/imf.png",
  //   logoMono: "/logos/mono/imf.png",
  //   url: "https://www.imf.org",
  //   coords: [-77.04, 38.9], // Washington, D.C.
  //   roles: ["supporter"],
  // },
  {
    name: "adesso SE",

    initials: "AD",
    logo: "/logos/adesso.jpeg",
    logoMono: "/logos/mono/adesso.png",
    url: "https://www.adesso.de",
    coords: [7.46, 51.51], // Dortmund
    roles: ["validator"],
  },
  {
    name: "NTT DATA Deutschland SE",

    initials: "ND",
    logo: "/logos/ntt-data.jpeg",
    logoMono: "/logos/mono/ntt-data.png",
    url: "https://emea.nttdata.com",
    coords: [11.58, 48.14], // Munich
    roles: ["validator"],
  },
  {
    name: "Sopra Steria SE",

    initials: "SS",
    logo: "/logos/sopra-steria.jpeg",
    logoMono: "/logos/mono/sopra-steria.png",
    url: "https://www.soprasteria.com",
    coords: [9.99, 53.55], // Hamburg
    roles: ["validator"],
  },
  {
    name: "GFT Technologies SE",

    initials: "GF",
    logo: "/logos/gft.jpeg",
    logoMono: "/logos/mono/gft.png",
    url: "https://www.gft.com",
    coords: [9.18, 48.78], // Stuttgart
    roles: ["validator"],
  },
];
