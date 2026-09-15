import type { Metadata, Viewport } from "next";
import "./globals.css";

import { bodyFont, displayFont } from "@/app/lib/fonts";
import { organizationJsonLd, site, websiteJsonLd } from "@/app/lib/site";
import { basePath } from "@/app/lib/basePath";
import FontsReady from "@/app/components/motion/FontsReady";
import MotionRoot from "@/app/components/motion/MotionRoot";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import PasswordGate from "@/app/components/ui/PasswordGate";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.metaDescription,
  applicationName: site.name,
  /*
    KEIN alternates.canonical hier.

    Next.js vererbt diesen Wert an jede Seite, die ihn nicht selbst
    überschreibt — und zwar unverändert. Ein "/" an dieser Stelle hieß
    deshalb: /imprint/, /privacy/ und die Pressemitteilung lieferten
    <link rel="canonical" href="https://rl1.network/"> aus und erklärten
    sich damit selbst zum Duplikat der Startseite. Ausgerechnet die
    Pressemitteilung ist die einzige Seite mit eigenständigem Inhalt.

    Jede Seite setzt ihren Canonical jetzt selbst. Fehlt er, erzeugt
    Next.js gar keinen — das ist harmlos, ein falscher ist es nicht.
  */
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.metaDescription,
    /*
      Ohne dieses Bild rendert jeder geteilte Link als graue Textzeile —
      `summary_large_image` unten verspricht ein Bild, das es dann nicht
      gibt. LinkedIn ist der Hauptkanal, also ist das der teuerste Ort
      für so eine Lücke.

      Die Datei entsteht aus den Assets der Seite selbst:
      `node scripts/build-og-image.mjs`. Austauschen heißt public/og/
      default.jpg ersetzen — hier muss dafür nichts geändert werden.
    */
    images: [
      {
        url: `${basePath}/og/default.jpg`,
        width: 1200,
        height: 630,
        alt: `${site.name} — one shared rail, owned by its members`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.metaDescription,
    images: [`${basePath}/og/default.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: [
      { url: `${basePath}/favicon/favicon-light.svg`, media: "(prefers-color-scheme: light)" },
      { url: `${basePath}/favicon/favicon-dark.svg`, media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={site.locale}
      className={`${displayFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Inhaltssicherheitsrichtlinie direkt in der Seite. Beim statischen
          Export gibt es keinen Server, der Header setzen könnte — diese
          Variante greift trotzdem in jedem modernen Browser.
          frame-ancestors wirkt nur als echter HTTP-Header; das steht im
          Snippet unter deploy/security-headers.conf für die IT.
        */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={[
            "default-src 'self'",
            "img-src 'self' data: blob:",
            "font-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            "script-src 'self' 'unsafe-inline'",
            // Beim Anschließen des Anfrageformulars (app/lib/enquiry.ts)
            // muss der Host des Endpunkts hier ergänzt werden, sonst
            // blockiert der Browser das Absenden.
            "connect-src 'self'",
            "media-src 'self'",
            // Bewusst eng: nur die Microsoft-365-Hosts, auf denen die
            // Terminbuchung liegt (siehe app/lib/booking.ts). Alles andere
            // bleibt weiterhin blockiert.
            //
            // Achtung, hier steckt eine Falle: Eine Bookings-Adresse unter
            // outlook.office365.com leitet auf bookings.cloud.microsoft
            // weiter — Microsoft zieht seine Dienste auf cloud.microsoft um.
            // Fehlt das Ziel der Weiterleitung, bleibt der Rahmen leer, und
            // zwar ohne sichtbaren Fehler. Beide Domänenfamilien stehen
            // deshalb hier.
            [
              "frame-src",
              "https://outlook.office.com",
              "https://outlook.office365.com",
              "https://bookings.cloud.microsoft",
            ].join(" "),
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests",
          ].join("; ")}
        />
        {/*
          Preloader — nur diese Preview-Kopie hat ihn, nicht rl1-merged.
          Das Passwort-Gate rendert beim ersten Commit null; ohne diesen
          Preloader wäre der Bildschirm bis zur Hydration schwarz. Steht
          serverseitig im statischen HTML (außerhalb des Gates), ist also
          beim allerersten Paint sichtbar, ganz ohne JS.

          Ausblenden per Klasse "app-ready" an <html> statt Entfernen aus
          dem DOM — kein Race mit der React-Hydration. Der Auslöser sitzt
          in PasswordGate.tsx, im selben Effect wie setMounted(true).

          Dreifacher Failsafe unten (Timeout, error, load+Delay): ein
          kaputtes Bundle darf den Preloader nie dauerhaft stehen lassen.
        */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              "#rl1-pre{position:fixed;inset:0;z-index:9999;background:#03040d;" +
              "display:flex;align-items:center;justify-content:center;" +
              "opacity:1;transition:opacity .45s ease}" +
              "#rl1-pre svg{width:96px;height:96px;opacity:.9;" +
              "animation:rl1pre-pulse 1.6s ease-in-out infinite}" +
              "@keyframes rl1pre-pulse{0%,100%{opacity:.35}50%{opacity:.9}}" +
              "html.app-ready #rl1-pre{opacity:0;pointer-events:none}" +
              "@media (prefers-reduced-motion:reduce){#rl1-pre svg{animation:none}}",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var r=function(){document.documentElement.classList.add("app-ready")};' +
              "setTimeout(r,6000);" +
              'addEventListener("error",r);addEventListener("unhandledrejection",r);' +
              'addEventListener("load",function(){setTimeout(r,1200)});' +
              "}catch(e){}",
          }}
        />
        {/*
          Schaltet die Einblendungen scharf — und zwar bevor das erste Bild
          gezeichnet wird, sonst blitzt der Inhalt einmal auf.

          Solange diese Klasse fehlt, ist alles sichtbar (siehe globals.css).
          Ohne JavaScript, bei gedrosseltem Hintergrund-Tab oder wenn der
          IntersectionObserver nichts liefert, sieht man also die Seite —
          nur eben ohne Animation. Das ist die richtige Richtung herum.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)' +
              'document.documentElement.classList.add("reveal-ready")}catch(e){}',
          }}
        />
        <script
          type="application/ld+json"
          // Statischer, im Code definierter Datensatz — keine Fremdeingabe.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <div id="rl1-pre" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="16" r="4" fill="#fff" />
            <circle cx="94" cy="34" r="4" fill="#fff" />
            <circle cx="104" cy="60" r="4" fill="#fff" />
            <circle cx="94" cy="86" r="4" fill="#fff" />
            <circle cx="60" cy="104" r="4" fill="#fff" />
            <circle cx="26" cy="86" r="4" fill="#fff" />
            <circle cx="16" cy="60" r="4" fill="#fff" />
            <circle cx="26" cy="34" r="4" fill="#fff" />
          </svg>
        </div>

        <FontsReady />

        <PasswordGate>
          {/*
            MotionRoot mountet erst HIER, innerhalb des Gates — sonst
            durchsucht sein einmaliger querySelectorAll("[data-scrub]")
            (siehe MotionRoot.tsx) einen leeren DOM, solange das Gate
            noch null rendert, und "scroll-ready" wird scharf geschaltet,
            ohne dass je ein Element registriert wird. Ergebnis: die
            Story-Sektion bleibt auf opacity 0 und "Our Values" bewegt
            sich nie. In rl1-merged (kein Gate) bleibt MotionRoot deshalb
            bewusst außerhalb.
          */}
          <MotionRoot />

          {/* Tastaturnutzer springen direkt zum Inhalt */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:text-accent-ink"
          >
            Skip to content
          </a>

          <Header />
          <main id="main">{children}</main>
          <Footer />
        </PasswordGate>
      </body>
    </html>
  );
}
