export type NavItem = {
  label: string;
  href: string;
  /**
   * Runde 5: der Oberpunkt öffnet nur noch das Aufklappmenü und führt
   * selbst nirgends hin — „nur ausklappbar, nicht anklickbar" (Header.tsx
   * rendert ihn dafür als <button>, nicht als <Link>, und lässt im
   * Mobilpanel den Link weg). `href` bleibt trotzdem gesetzt: Footer und
   * Sitemap verlinken den Oberpunkt weiterhin ganz normal, nur der Header
   * behandelt ihn anders.
   */
  expandOnly?: boolean;
  /**
   * Runde 8: nur im Mobilpanel zeigen. Die Kopfnavigation am Desktop hat
   * rechts schon den „Become a member"-Button, der auf dieselbe Seite
   * führt — ein zweiter Punkt daneben wäre doppelt. Mobil steht der
   * Button dagegen ganz unten im Panel, dort ist der eigene Punkt der
   * kurze Weg. Footer und Sitemap bleiben unberührt.
   */
  mobileOnly?: boolean;
  children?: { label: string; href: string; description?: string }[];
};

/** Eine Quelle für Kopf- und Fußnavigation sowie die Sitemap. */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  // Runde 11: „About us" statt „About RL1" (Header, Mobilpanel und
  // Footer lesen alle dieses eine Label).
  { label: "About us", href: "/about" },
  {
    label: "News & Resources",
    href: "/resources",
    expandOnly: true,
    children: [
      { label: "News", href: "/resources/news", description: "Announcements and press releases" },
      { label: "Resources", href: "/resources", description: "Board material, logos and key facts" },
    ],
  },
  // Runde 7 (Korrektur): eigener Oberpunkt, kein Kind von "News &
  // Resources" mehr — soll mobil auch stehen, wenn das Aufklappmenü
  // zugeklappt ist, nicht erst nach dem Öffnen sichtbar werden.
  // Runde 8: nur mobil (siehe mobileOnly oben).
  { label: "Contact", href: "/join", mobileOnly: true },
];

export const legalNav = [
  { label: "Imprint", href: "/imprint" },
  { label: "Privacy", href: "/privacy" },
];

/** Alle Routen, die in die Sitemap gehören. */
export const sitemapRoutes = [
  "/",
  "/about",
  "/resources",
  "/resources/news",
  "/join",
  "/imprint",
  "/privacy",
] as const;
