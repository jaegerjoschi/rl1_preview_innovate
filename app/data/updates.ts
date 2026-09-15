export type NewsCategory =
  | "Network"
  | "Partnership"
  | "Milestone"
  | "Technology"
  | "Regulation";

export type NewsItem = {
  slug: string;
  title: string;
  bannerTitle?: string;
  bannerDescription?: string;
  excerpt: string;
  date: string;
  category: NewsCategory;
  url?: string;
};

export const updates: NewsItem[] = [
  {
    slug: "rl1-launch",
    title: "European Blockchain Initiative 'Regulated Layer One' Goes Live",
    bannerTitle: "RL1 Goes Live as a European Cooperative Society",
    bannerDescription:
      "Ten leading European financial institutions have founded Regulated Layer One, a neutral, compliance-optimised DLT network based in Luxembourg.",
    excerpt:
      "Regulated Layer One (RL1) is established as a European Cooperative Society (SCE) based in Luxembourg, commencing operations with ten financial institutions led by Henning Vollbehr as Managing Director. RL1 is an open, neutral, compliance-optimised and collaborative DLT network for the European financial sector, with additional participants expected to join shortly.",
    date: "2026-07-28",
    category: "Milestone",
    // Mit Slash: next.config.ts setzt trailingSlash, im Export liegt nur
    // /rl1-launch/index.html. Ohne Slash je nach Server ein zusätzlicher
    // Redirect-Hop oder ein 404 — auf dem einzigen eigenen Artikel.
    url: "/resources/news/rl1-launch/",
  },
  {
    slug: "chartered-investment-joins-rl1",
    title: "Chartered Investment Joins the RL1 Initiative",
    excerpt:
      "Chartered Investment, an infrastructure provider for innovative investment products, has joined Regulated Layer One (RL1) as a shareholding member. The company joins a growing network of European financial institutions including ABN AMRO, DekaBank, DZ BANK, KfW, LBBW, Natixis, NatWest, Börse Stuttgart (Seturion), SC Ventures, L-Bank and V-Bank. As a shareholding member, Chartered Investment will participate in the governance and development of the RL1 network, enabling tokenized investment products created on its platforms to settle and move across a shared, interoperable network — broadening distribution reach and standardizing post-trade processes for its clients.",
    date: "2026-04-30",
    category: "Partnership",
    url: "https://chartered-investment.com/en/media/news/chartered-investment-joins-the-regulated-layer-one-rl1-initiative/",
  },
  {
    slug: "kfw-issues-third-dlt-bond-on-rl1",
    title:
      "KfW Issues Third DLT-Based Bond on Regulated Layer One",
    excerpt:
      "KfW has chosen Regulated Layer One (RL1) as its infrastructure and DekaBank as its new registrar for its third DLT-based bond — marking the first-ever registry migration during a bond's lifetime. This is no longer a pilot: it is a milestone for Europe's digital capital market under real market conditions. The issuance combines the Bundesbank Trigger Solution at issuance with Eurosystem Pontes for coupon payments and redemption, demonstrating that private and public sector infrastructure work in complement. RL1 is emerging as a European Core Utility — open, regulated, cooperatively governed, and free from dependencies on non-EU infrastructures — reinforcing Europe's path toward market-driven digital capital market implementation.",
    date: "2026-04-16",
    category: "Milestone",
    url: "https://www.kfw.de/About-KfW/Newsroom/Latest-News/Pressemitteilungen-Details_890368.html",
  },
  {
    slug: "l-bank-joins-rl1",
    title: "L-Bank Joins RL1 as Potential Founding Member",
    excerpt:
      "L-Bank becomes the eleventh institution to support the founding of Regulated Layer One. The Baden-Württemberg development bank joins other members including KfW, NatWest, ABN Amro, LBBW, and DekaBank to build a sovereign European blockchain infrastructure for digital capital market transactions.",
    date: "2026-02-09",
    category: "Partnership",
    url: "https://www.l-bank.info/presse/presseinformationen/2026/pi-2026-06-rl1.html",
  },
  {
    slug: "dlt-capital-markets-rl1-initiative",
    title:
      "DLT Is Revolutionizing Capital Markets — Industry Leaders Gather for RL1",
    excerpt:
      'Legacy processes have introduced complexity, opacity, and fragmentation across markets. The "collaboration paradox" has long impeded ecosystem-wide benefits — until now. Industry leaders from across Europe gathered in Frankfurt am Main to discuss a shared DLT platform under the Regulated Layer One Initiative.',
    date: "2025-03-19",
    category: "Milestone",
    url: "https://www.linkedin.com/posts/regulated-layer-one-rl1_distributed-ledger-technology-dlt-is-revolutionizing-activity-7308776694079758337-JL1N",
  },
  {
    slug: "future-financial-industry-rl1",
    title: "The Future of the Financial Industry: Regulated Layer One",
    excerpt:
      "Isolated databases, opacity, and costly cross-border payments define today's financial infrastructure. RL1 offers a shared ledger enabling interoperability and composability of digital assets — increasing liquidity, reducing costs, and opening new business opportunities for the entire industry.",
    date: "2025-03-29",
    category: "Technology",
    url: "https://www.linkedin.com/posts/regulated-layer-one-rl1_%F0%9D%90%93%F0%9D%90%A1%F0%9D%90%9E-%F0%9D%90%85%F0%9D%90%AE%F0%9D%90%AD%F0%9D%90%AE%F0%9D%90%AB%F0%9D%90%9E-%F0%9D%90%A8%F0%9D%90%9F-%F0%9D%90%AD%F0%9D%90%A1%F0%9D%90%9E-%F0%9D%90%85%F0%9D%90%A2%F0%9D%90%A7-activity-7312836389765537793-Bxz1",
  },
  {
    slug: "rl1-transforming-financial-market-infrastructure",
    title: "How RL1 Is Transforming Tomorrow's Financial Market Infrastructure",
    excerpt:
      "RL1 pioneers a shared ledger delivering interoperability, cost reduction, increased asset liquidity, new digital business models, and enhanced risk reduction for regulated financial institutions — building the next-generation infrastructure for European capital markets.",
    date: "2025-04-03",
    category: "Technology",
    url: "https://www.linkedin.com/posts/regulated-layer-one-rl1_%F0%9D%90%87%F0%9D%90%A8%F0%9D%90%B0-%F0%9D%90%AD%F0%9D%90%A1%F0%9D%90%9E-%F0%9D%90%91%F0%9D%90%9E%F0%9D%90%A0%F0%9D%90%AE%F0%9D%90%A5%F0%9D%90%9A%F0%9D%90%AD%F0%9D%90%9E%F0%9D%90%9D-%F0%9D%90%8B%F0%9D%90%9A%F0%9D%90%B2%F0%9D%90%9E%F0%9D%90%AB-%F0%9D%90%8E%F0%9D%90%A7%F0%9D%90%9E-activity-7316077923310972928-tIbU/",
  },
  {
    slug: "sce-drives-rl1-success",
    title:
      "How the European Cooperative Society (SCE) Drives the Success of RL1",
    excerpt:
      "The SCE legal form grants each member one vote regardless of capital contribution, ensuring democratic control and liability protection. Like SWIFT before it, RL1 fosters collaboration and provides a versatile shared infrastructure developed by members, for members.",
    date: "2025-04-14",
    category: "Network",
    url: "https://www.linkedin.com/posts/regulated-layer-one-rl1_%F0%9D%90%87%F0%9D%90%A8%F0%9D%90%B0-%F0%9D%90%AD%F0%9D%90%A1%F0%9D%90%9E-%F0%9D%90%84%F0%9D%90%AE%F0%9D%90%AB%F0%9D%90%A8%F0%9D%90%A9%F0%9D%90%9E%F0%9D%90%9A%F0%9D%90%A7-%F0%9D%90%82%F0%9D%90%A8%F0%9D%90%A8%F0%9D%90%A9%F0%9D%90%9E%F0%9D%90%AB%F0%9D%90%9A%F0%9D%90%AD%F0%9D%90%A2%F0%9D%90%AF%F0%9D%90%9E-activity-7318548981754564609-M-tK/",
  },
];
