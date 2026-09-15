"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { mainNav } from "@/app/lib/nav";
import { cn } from "@/app/lib/cn";
import { Button } from "@/app/components/ui/Button";
import { basePath } from "@/app/lib/basePath";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();

  // Beim Seitenwechsel alles schließen
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Hintergrund nicht scrollen lassen, solange das Mobilmenü offen ist
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /*
    Öffnen und Schließen hängen ausschließlich am Wrapper — er umschließt
    Trigger und Menü, seine Grenze ist also genau die richtige.

    Vorher hing `onMouseLeave` zusätzlich am Menü. Da das Menü ein Kind des
    Wrappers ist, feuerte beim Zurückwandern vom Menü zum Trigger dessen
    Leave-Handler, während der Wrapper nie verlassen wurde — niemand konnte
    den Timer noch abbestellen. Das Menü klappte zu, obwohl der Zeiger noch
    darauf stand, und ging nicht wieder auf.
  */
  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openNow = (href: string) => {
    clearCloseTimer();
    setOpenMenu(href);
  };

  /*
    expandOnly-Punkte (Runde 5) sind ein <button>, kein <Link> mehr —
    onClick öffnet/schließt sie explizit (siehe unten). Würde der
    Fokus-Handler hier trotzdem automatisch öffnen, kollidiert das mit
    dem Klick: ein Klick fokussiert den Button ZUERST (nativ, vor dem
    eigenen click-Event), der Fokus-Handler öffnete das Menü, und der
    darauffolgende Klick-Toggle schlösse es sofort wieder — jeder
    einzelne Tap bliebe wirkungslos. Für einen Button ist das ohnehin
    nicht nötig: Enter/Space auf einem fokussierten Button öffnet ihn
    schon über den Klick-Handler, das ist das übliche Muster für ein
    Aufklappmenü.
  */
  const openOnFocus = (item: { href: string; expandOnly?: boolean }) => {
    if (item.expandOnly) return;
    openNow(item.href);
  };

  const toggle = (href: string) => {
    clearCloseTimer();
    setOpenMenu((cur) => (cur === href ? null : href));
  };

  // Kurze Nachlaufzeit, damit der diagonale Weg zum Menü verzeiht.
  const closeSoon = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 200);
  };

  useEffect(() => clearCloseTimer, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/*
        Deckend, ohne Kante und ohne backdrop-filter.

        Der Filter war nicht nur teuer (Neuberechnung bei jedem
        Scroll-Frame über den ganzen wechselnden Inhalt) — er hat das
        Mobilmenü unbenutzbar gemacht: backdrop-filter macht das
        Header-Element zum Containing Block für position: fixed, und
        `top-20 bottom-0` rechnete dadurch gegen eine 80px hohe Box
        statt gegen das Fenster. Das Panel war offen und null Pixel hoch.
        Es liegt jetzt zusätzlich AUSSERHALB des <header>, damit kein
        künftiger Filter oder Transform es wieder einsperrt.
      */}
      <header className="sticky top-0 z-50 bg-bg">
      {/*
        Runde 5: eigene Polsterung ÜBER der Zeile, statt die Zeile selbst
        höher zu machen. Ein pt auf einer h-14/h-20-Zeile mit items-center
        hätte die Mitte asymmetrisch verschoben (Padding zählt zur Höhe,
        der Innenraum für die Zentrierung schrumpft dadurch nur oben);
        eine eigene Zone davor bleibt unabhängig von der Zentrierung und
        rückt Logo und Navigation sichtbar vom oberen Fensterrand ab.
        --spacing-header/-md in globals.css rechnen genau diese Summe
        (Polsterung + Zeile) von jeder Bildschirm-Sektion ab.
      */}
      <div className="pt-2 md:pt-3">
      <div className="mx-auto flex h-14 w-full max-w-page items-center justify-between gap-6 px-6 md:h-20 md:px-10 lg:px-16">
        <Link href="/" aria-label={`${"Regulated Layer One"} — home`} className="shrink-0">
          <Image
            src={`${basePath}/rl1-logo/rl1-logo-light.svg`}
            alt="Regulated Layer One"
            width={128}
            height={44}
            priority
          />
        </Link>

        {/* ── Navigation ab Tablet — rechtsbündig neben dem CTA ── */}
        <nav aria-label="Primary" className="ml-auto hidden items-center gap-8 lg:flex">
          {/* mobileOnly-Punkte (aktuell „Contact") bleiben hier aussen vor —
              am Desktop führt der Button rechts daneben schon dorthin. */}
          {mainNav.filter((item) => !item.mobileOnly).map((item) =>
            item.children ? (
              <div
                key={item.href}
                className="relative"
                // Nur Maus: Auf Touch löst ein Tippen sonst erst das Öffnen
                // per Hover und direkt danach das Schließen per Klick aus.
                onPointerEnter={(e) => e.pointerType === "mouse" && openNow(item.href)}
                onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
                // Tastatur: öffnen, sobald der Fokus hineinwandert (außer
                // bei expandOnly-Buttons, siehe openOnFocus), schließen,
                // sobald er den Bereich wieder verlässt.
                onFocus={() => openOnFocus(item)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    setOpenMenu(null);
                  }
                }}
              >
                {/*
                  Runde 5: „nur ausklappbar, nicht anklickbar" — der
                  Oberpunkt darf selbst nirgends hinführen. Deshalb jetzt
                  ein <button> statt eines <Link>, sobald `expandOnly`
                  gesetzt ist; die Kinder darunter bleiben normale Links
                  auf News und Resources.

                  Frühere Fassungen scheiterten daran, dass Klick und
                  Fokus sich gegenseitig aufhoben: ein Klick fokussiert
                  den Button zuerst (nativ), das öffnete das Menü, und der
                  Klick selbst schloss es im selben Zug wieder — jeder Tap
                  blieb wirkungslos. `openOnFocus` überspringt deshalb das
                  automatische Öffnen bei Fokus für expandOnly-Punkte;
                  `toggle` im Klick-Handler ist die einzige Quelle, die
                  hier öffnet oder schließt. Hover (oben am Wrapper) bleibt
                  für Mausnutzer unverändert die primäre Bedienung.
                */}
                {item.expandOnly ? (
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={openMenu === item.href}
                    aria-controls={`${menuId}-${item.label}`}
                    onClick={() => toggle(item.href)}
                    className={cn(
                      "flex items-center gap-1.5 text-body transition-colors duration-150 ease-hover",
                      isActive(item.href) ? "text-ink" : "text-ink-3 hover:text-ink",
                    )}
                  >
                    {item.label}
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      aria-hidden
                      className={cn(
                        "transition-transform duration-200",
                        openMenu === item.href && "rotate-180",
                      )}
                    >
                      <path
                        d="M1 1l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    aria-expanded={openMenu === item.href}
                    aria-controls={`${menuId}-${item.label}`}
                    className={cn(
                      "flex items-center gap-1.5 text-body transition-colors duration-150 ease-hover",
                      isActive(item.href) ? "text-ink" : "text-ink-3 hover:text-ink",
                    )}
                  >
                    {item.label}
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      aria-hidden
                      className={cn(
                        "transition-transform duration-200",
                        openMenu === item.href && "rotate-180",
                      )}
                    >
                      <path
                        d="M1 1l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                )}

                {/*
                  Bleibt eingehängt und wird per data-open geschaltet —
                  sonst ließe sich das Schließen nicht animieren. `inert`
                  nimmt die Links im geschlossenen Zustand aus der
                  Tab-Reihenfolge, damit niemand blind hineinspringt.
                */}
                <div
                  id={`${menuId}-${item.label}`}
                  data-open={openMenu === item.href}
                  inert={openMenu !== item.href}
                  className="pop absolute left-0 top-full w-max pt-4"
                >
                  {/*
                    Runde 8: schwarz hinterlegt. Bis dahin stand das Menü
                    ohne eigenen Grund direkt auf dem Seiteninhalt — beim
                    Aufklappen über einem hellen Bild (Hero) lasen sich
                    die Einträge kaum noch. Weiterhin ohne Kante und
                    ohne Schatten, nur eine deckende Fläche.
                  */}
                  <ul className="flex flex-col gap-3 rounded-md bg-bg px-5 py-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block text-body text-ink-3 transition-colors duration-150 ease-hover hover:text-ink"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-body transition-colors duration-150",
                  isActive(item.href) ? "text-ink" : "text-ink-3 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden lg:block">
          {/* Runde 6: size="md" (Default) statt "sm" — „manchmal 16,
              manchmal 14px" bei „Become a member" war genau diese
              Stelle, die einzige mit einer expliziten Fremdgröße. */}
          <Button href="/join">Become a member</Button>
        </div>

        {/* ── Mobil ── */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls={`${menuId}-mobile`}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="relative ml-auto size-11 lg:hidden"
        >
          <span className="absolute left-1/2 top-1/2 block h-3.5 w-5 -translate-x-1/2 -translate-y-1/2">
            {/* Nur transform und opacity animieren — `top` würde bei jeder
                Zwischenstufe ein neues Layout erzwingen. Deshalb liegen alle
                drei Striche mittig und werden per translate versetzt. */}
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cn(
                  "absolute left-0 top-1.5 block h-px w-full bg-ink",
                  "transition-[transform,opacity] duration-200 ease-out-expo",
                  i === 0 && (mobileOpen ? "rotate-45" : "-translate-y-1.5"),
                  i === 1 && (mobileOpen ? "opacity-0" : "opacity-100"),
                  i === 2 && (mobileOpen ? "-rotate-45" : "translate-y-1.5"),
                )}
              />
            ))}
          </span>
        </button>
        </div>
      </div>
      </header>

      <div
        id={`${menuId}-mobile`}
        data-open={mobileOpen}
        inert={!mobileOpen}
        className="panel fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-bg lg:hidden"
      >
        <nav aria-label="Primary mobile" className="flex min-h-full flex-col px-6 py-6">
          {/*
            Runde 8: mobil KEIN Aufklappen mehr. „News & Resources" war
            bis dahin ein Akkordeon, seine beiden Ziele standen erst nach
            einem Tippen da. Jetzt stehen sie direkt als eigene Zeilen in
            der Liste — flach, in derselben Größe wie alles andere. Der
            Oberpunkt selbst entfällt hier: er führt nirgends hin
            (expandOnly) und wäre als toter Titel über zwei Zeilen nur
            Ballast. Am Desktop bleibt das Aufklappmenü unverändert.
          */}
          <ul className="flex flex-col">
            {mainNav.flatMap((item) =>
              item.expandOnly && item.children ? item.children : [item],
            ).map((entry) => (
              <li key={entry.href} className="border-b border-hairline py-1">
                <Link
                  href={entry.href}
                  className="block py-3.5 text-h3 text-ink"
                  onClick={() => setMobileOpen(false)}
                >
                  {entry.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Runde 6: ans Ende des Panels statt direkt unter der Liste —
              `mt-auto` am WRAPPER (nicht am Button selbst, das würde
              seine feste Höhe durcheinanderbringen) schiebt ihn an den
              unteren Rand, solange die Liste kürzer ist als das Panel;
              bei aufgeklapptem „News & Resources" rutscht er einfach
              mit nach unten. */}
          <div className="mt-auto pt-8">
            <Button href="/join" className="w-full">
              Become a member
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
