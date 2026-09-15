# Regulated Layer One — Website

Die Website von [rl1.network](https://rl1.network). Next.js 16 (App Router), React 19,
TypeScript, Tailwind v4. Wird als **statische Seite** gebaut und ausgeliefert.

```bash
pnpm install
pnpm dev      # Entwicklung auf http://localhost:3000
pnpm build    # erzeugt out/ — genau das geht auf den Webserver
```

---

## Wie das Design-System funktioniert

**Alle** Farben, Schriftgrößen, Abstände und Radien stehen im `@theme`-Block in
[`app/globals.css`](app/globals.css). Aus jedem Wert dort erzeugt Tailwind automatisch
Klassen:

| Token in `@theme` | erzeugt |
|---|---|
| `--color-accent` | `bg-accent`, `text-accent`, `border-accent` |
| `--text-h2` | `text-h2` (inkl. Zeilenhöhe und Laufweite) |
| `--radius-md` | `rounded-md` |
| `--spacing-section` | `py-section` |

Drei Regeln halten das System ehrlich — die dritte erzwingt der Prebuild:

1. Nur `@theme` enthält Literale (Hex, px-Größen, Radien, Bezier-Kurven).
2. `@layer components` darf Struktur enthalten, aber jeder **Wert** ist `var(--token)`.
3. TSX nutzt nur generierte Utilities. `text-[32px]`, `bg-[#1b1b1b]` sind verboten —
   `node scripts/check-tokens.mjs` (läuft als `prebuild`) bricht sonst ab.

`@theme static` statt `@theme`, sonst entfernt Tailwind Token, die nur aus
`@layer components` gelesen werden (die Verläufe, die Dauern).

Ausführlich: [`DESIGN.md`](DESIGN.md). Ausgeliefert wird nur, was benutzt wird —
aktuell ~10 KB CSS gzip.

### Bausteine

- [`app/components/ui/primitives.tsx`](app/components/ui/primitives.tsx) — `Container`,
  `Section`, `PageHero`, `SectionHeader`. Jede Sektion setzt sich hieraus zusammen,
  damit der vertikale Rhythmus über die ganze Seite gleich bleibt.
- [`app/components/ui/Button.tsx`](app/components/ui/Button.tsx) — die einzige
  Button-Familie (`primary` / `inverse` / `ghost` / `quiet`). Auch der Formular-
  Submit und die Ressourcen-Pills laufen darüber.
- [`app/lib/fonts.ts`](app/lib/fonts.ts) — Inter als einzige Familie. Schriftwechsel
  berührt nur diese Datei und `--font-sans` in `globals.css`.

---

## Bewegung

- **Scrollen bleibt nativ.** Lenis (weiches Scrollen) lief hier zeitweise und wurde
  wieder ausgebaut — es fängt das native Scrollen ab und interpoliert die Position,
  am Trackpad fühlt sich das träge an.
- **Einblendungen**: [`Reveal.tsx`](app/components/motion/Reveal.tsx) —
  IntersectionObserver + zwei CSS-Klassen (~1 KB).
- **Scroll-gekoppelte Effekte** laufen über eine eigene ~2-KB-Engine
  ([`useScrollProgress.ts`](app/components/motion/useScrollProgress.ts)): eine
  rAF-Schleife, ein IntersectionObserver, ruht wenn nichts sichtbar ist. Keine
  Animations-Library. `MotionRoot` (im Layout) setzt `scroll-ready` und registriert
  jedes `[data-scrub]`. Effekte: Wort-für-Wort-Opacity (`ScrollText`, Split zur
  Build-Zeit), gepinnte 3-Frame-Story (`position: sticky`), Parallax-Kacheln,
  Metallkarten-Neigung, Count-up.
- **Grundregel**: nur `transform` und `opacity`. Ausnahme: `Accordion` nutzt
  `grid-template-rows: 0fr → 1fr`.

> **Wichtig:** Grundzustand ist *sichtbar*. Versteckt wird erst, wenn `reveal-ready`
> bzw. `scroll-ready` gesetzt ist. Ohne JS, gedrosselter Tab oder stummer Observer:
> Endzustand, nie eine leere Seite. Zusätzliche Timer (2,5 s bzw. 4 s) fangen alles
> ab, was der Observer übersieht.

`prefers-reduced-motion: reduce` schaltet Einblendungen und alle Scroll-Effekte ab.

---

## Bilder

Beim statischen Export gibt es keine Bildoptimierung zur Laufzeit — die Dateien gehen
so raus, wie sie im Repo liegen. Deshalb nach jedem Einpflegen neuer Bilder:

```bash
node scripts/optimize-images.mjs        # verkleinert auf Anzeigegröße × 2
node scripts/optimize-images.mjs --dry  # nur anzeigen, nichts ändern
```

Das Skript übernimmt ein Ergebnis nur, wenn es mindestens 10 % kleiner wird — sonst
bleibt das Original. Neu-Kodieren macht bereits optimierte Dateien sonst größer.

---

## SEO und Sichtbarkeit in KI-Antworten

| Datei | Zweck |
|---|---|
| [`app/robots.ts`](app/robots.ts) | wird zu `/robots.txt`. KI-Crawler sind bewusst **erlaubt** — hier umstellbar. |
| [`app/sitemap.ts`](app/sitemap.ts) | wird zu `/sitemap.xml`, speist sich aus `app/lib/nav.ts` und den News-Daten. |
| [`public/llms.txt`](public/llms.txt) | erklärt KI-Systemen in kurzen Sätzen, was RL1 ist. |
| [`app/lib/site.ts`](app/lib/site.ts) | Domain, Name, Beschreibung, JSON-LD — eine Quelle für alles. |

Neue Route? Dann in `sitemapRoutes` in [`app/lib/nav.ts`](app/lib/nav.ts) eintragen,
sonst fehlt sie in der Sitemap.

Pro Seite genau **ein** `<h1>` — das kommt aus `PageHero` bzw. dem Hero.

---

## Sicherheit

- Die Content-Security-Policy steht als Meta-Tag in
  [`app/layout.tsx`](app/layout.tsx) — so ist sie mit der Seite versioniert und kann
  beim Deployen nicht vergessen werden.
- Die übrigen Header (HSTS, X-Content-Type-Options, Referrer-Policy, X-Frame-Options,
  Permissions-Policy) gehören an den Webserver:
  [`deploy/security-headers.conf`](deploy/security-headers.conf).
- **Keine Aufrufe an Dritte**: Schriften werden zur Build-Zeit selbst gehostet, die
  Weltgeometrie für den Globe liegt unter `public/`. Keine Tracker, keine Cookies.
  Das deckt sich mit dem, was die Datenschutzerklärung zusichert.

---

## Join-Seite: Formular anschließen

Das Anfrageformular auf `/join` ist die Hauptfunktion der Seite. Es ist vollständig gebaut —
Prüfung der Eingaben, Erfolgs- und Fehlerzustand, Barrierefreiheit, Spam-Schutz über ein
verstecktes Feld. **Es fehlt nur das Ziel:** eine Zeile in
[`app/lib/enquiry.ts`](app/lib/enquiry.ts).

Solange `endpointUrl` leer ist, sendet das Formular nicht und sagt das offen. Es täuscht
unter keinen Umständen einen Erfolg vor — eine verlorene Anfrage wäre hier der teuerste
Fehler.

### Was am Endpunkt ankommt

Ein `POST` mit `Content-Type: application/json` und diesem Rumpf:

```json
{
  "name": "…", "institution": "…", "category": "Membership",
  "email": "…", "phone": "…", "message": "…",
  "submittedAt": "2026-09-02T12:00:00.000Z", "source": "join-page"
}
```

Mehr muss die Gegenstelle nicht wissen. Naheliegend, weil es wie die Terminbuchung im
eigenen Microsoft-Tenant bleibt: ein Power-Automate-Flow mit dem Auslöser *Wenn eine
HTTP-Anfrage eingeht* → *E-Mail senden*. Alternativ eine Azure Function.

### Beim Anschließen nicht vergessen

1. Den Host des Endpunkts in `connect-src` der CSP eintragen
   ([`app/layout.tsx`](app/layout.tsx)) — sonst blockiert der Browser die Anfrage.
2. Prüfen, dass die Gegenstelle **CORS** erlaubt. Sonst geht die Mail zwar raus, die Antwort
   erreicht den Browser aber nicht, und der Absender sieht fälschlich einen Fehler.
3. Einmal echt absenden und prüfen, dass die Mail ankommt.

---

## Join-Seite: Terminbuchung einrichten

`/join` ist die Seite, die Institute zu Mitgliedern konvertieren soll. Der Hauptweg ist die
direkte Terminbuchung — wer im selben Schritt buchen kann, konvertiert nach Benchmark rund
doppelt so gut wie jemand, der auf einen Rückruf wartet.

Angaben und Termin sind derselbe Schritt: Microsoft Bookings fragt nach der Zeitauswahl
Name, E-Mail und die Angaben aus `bookingQuestions` ab, einschließlich der Nachricht.
Alles läuft im **eigenen Microsoft-365-Tenant** — die Daten liegen in eurem
Exchange-Postfach, kein externer Dienst verarbeitet Interessentendaten, und die Seite
braucht weiterhin keinen Server.

**Solange nichts eingetragen ist, zeigt die Seite einen markierten Platzhalter — keinen
leeren Rahmen.** Beide URLs stehen an einer Stelle: [`app/lib/booking.ts`](app/lib/booking.ts).

### Was die IT anlegen muss

1. **Bookings-Kalender** anlegen; Ansprechperson als Staff hinzufügen. Diese muss in Outlook
   ihren Kalender freigeben (*Share → Calendar → My Organization → „Can view when I'm busy"*),
   sonst kann Bookings keine freien Zeiten ermitteln.
2. **Dienste** anlegen — z. B. Mitgliedschaft, Technische Anbindung, Partnerschaft. Je Dienst
   das Teams-Meeting aktivieren. Die Dienstauswahl ersetzt ein „Anliegen"-Dropdown im
   Formular: Jede Anfrage landet dadurch direkt bei der richtigen Person.
3. **Custom Questions** je Dienst anlegen — exakt die Liste in `bookingQuestions` in
   [`app/lib/booking.ts`](app/lib/booking.ts). Sie wird auf der Seite angezeigt, solange
   nichts verbunden ist, und dient so zugleich als Vorlage.
4. **DSGVO-Einwilligung**: Feld *Customer data usage consent* auf der Bookings-Seite
   aktivieren und den Text setzen. Zeitpunkt der Einwilligung wird protokolliert.
5. **Bestätigungsmail** um den Hinweis auf die Mitgliedsunterlagen ergänzen.
6. **URL** aus dem Reiter *Bookings page* nach `booking.bookingUrl` übertragen,
   Ansprechperson nach `contactPerson`.

### Zwei Fallstricke

- **Die CSP muss den Zielhost der Weiterleitung kennen.** Eine Adresse unter
  `outlook.office365.com` leitet auf `bookings.cloud.microsoft` weiter — Microsoft zieht
  seine Dienste auf `cloud.microsoft` um. Fehlt der Zielhost in `frame-src`
  ([`app/layout.tsx`](app/layout.tsx)), bleibt der Rahmen leer, ohne sichtbaren Fehler.
  Beide Domänenfamilien sind eingetragen; bei einer weiteren Umstellung hier nachziehen.
- **Eingebettete Fremdseiten können scheitern** — an blockierten Drittanbieter-Cookies oder
  an Tenant-Einstellungen. Deshalb steht der direkte Buchungslink **immer** sichtbar unter
  dem Rahmen, nicht erst als Notlösung.

Voraussetzung: Bookings ist in M365 E1/E3/E5 und Business Standard/Premium enthalten, aber
**nicht** in föderierten oder hybriden Umgebungen verfügbar.

---

## `_archive/`

Aufwendig gebaute Komponenten aus früheren Ausbaustufen (ASAP-Diagramm, Europa-Karte,
Kostenrechner, Markt-Chart, Storyline-Navigation …). Sie sind vom Build und von
TypeScript ausgenommen (`tsconfig.json` → `exclude`) und werden **nicht** ausgeliefert.
Aufbewahrt, damit sie später gezielt zurückkommen können, statt neu erfunden zu werden.

---

## Deployment

`pnpm build` erzeugt `out/`. Dieser Ordner ist die Seite — er wird von einem normalen
Webserver ausgeliefert, es läuft kein Node-Prozess. `out/` gehört **nicht** ins Git.

Für den Containerbetrieb liegt ein [`Dockerfile`](Dockerfile) bei, das baut und das
Ergebnis mit nginx ausliefert (Konfiguration in [`deploy/`](deploy/)).
