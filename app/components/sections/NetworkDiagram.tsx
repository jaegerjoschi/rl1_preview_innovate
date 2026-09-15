"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { Container, Section } from "@/app/components/ui/primitives";
import { Button } from "@/app/components/ui/Button";
import { Icon } from "@/app/components/ui/icons";
import { participants, type Participant } from "@/app/data/participants";
import { basePath, asset } from "@/app/lib/basePath";

/**
 * „Everyone who runs RL1, in one place." — die Nabe in der Mitte, die
 * Rollen ringsherum, verbunden durch laufende Datenströme.
 *
 * Runde 6 — zweiter Neubau:
 *
 * 1. **Eurosystem entfällt.** Es war nie eine der drei tragenden Rollen
 *    (Mitglieder, Validatoren, Beobachter), sondern stand als viertes
 *    Feld nur wegen der Symmetrie im 2×2-Raster daneben. Mit drei
 *    Rollen ist ein Dreieck um die Nabe die naheliegende Form.
 * 2. **Mobil/Tablet wird ein echtes Dreieck, keine Kette mehr.** Runde 5
 *    hatte hier eine senkrechte Kette gebaut — sicher lauffähig, aber
 *    inhaltlich irreführend: RL1 ist ein Netzwerk, keine Pipeline. Jetzt
 *    steht dieselbe Nabe-und-drei-Knoten-Geometrie wie am Desktop, nur
 *    in einem quadratischen Feld statt eines Kreuzes: die drei Linien
 *    sind dieselbe `FlowLineH`-Komponente (Balken + laufender Punkt),
 *    nur GEDREHT (`rotate()`) statt horizontal — dieselbe
 *    `flow-ball--h`-Animation (`left: 0% → 100%`) läuft unverändert auf
 *    einer gedrehten Linie mit, kein zweiter Mechanismus für
 *    Diagonalen. Unter dem Dreieck stehen die drei vollständigen Panels
 *    mit den echten Logo-Listen (das Dreieck selbst ist rein
 *    dekorativ/`aria-hidden`, die Panels tragen den eigentlichen
 *    Inhalt für Screenreader).
 * 3. **Am Desktop bleibt das Kreuz** (Members—Nabe—Validators oben,
 *    Observers darunter, jetzt mittig statt in einem 2-Spalten-Raster
 *    mit dem entfallenen Eurosystem). Die waagerechten Linien berühren
 *    seit Runde 5 sauber (gapless Flex-Zeile statt Grid-mit-gap); die
 *    senkrechte zur unteren Reihe ist jetzt ohne Polsterung ein
 *    normaler Flex-Nachbar von Reihe und Panel — dieselbe Technik, mit
 *    der die mobile Kette in Runde 5 schon lückenlos verband. Die
 *    Panels selbst unterscheiden sich in der Höhe (12 Mitglieder gegen
 *    9 Validatoren gegen 5 Beobachter) — eine Verbindung, die exakt am
 *    Nabenrand verankert bliebe, müsste diese Höhen kennen und würde
 *    bei jeder Änderung der Teilnehmerliste wieder falsch; die
 *    einfache, lückenlose Nachbarschaft bleibt dagegen immer korrekt.
 *
 * `.flow-ball` wandert per CSS-Keyframe von 0% auf 100% der jeweiligen
 * Linie — in Prozent, nicht in Pixeln, damit er unabhängig von der
 * tatsächlichen (bzw. gedrehten) Länge exakt von einem Ende zum anderen
 * läuft.
 */

const ROLE_COLOR = {
  members: "var(--color-role-members)",
  validators: "var(--color-role-validators)",
  observers: "var(--color-role-observers)",
} as const;

/** Logo mit kleinem Namen darunter — ohne Kasten.
 *  Runde 6: Logo größer (h-8 → h-12), Name kleiner (text-micro →
 *  text-nano, die bewusste 11px-Ausnahme für dieses Datenbild).
 *  Runde 7: wieder kleiner (h-12 → h-9, mehr pro Zeile), und die
 *  Deckkraft sitzt jetzt nur noch auf dem Bild statt pauschal auf dem
 *  ganzen Eintrag (inkl. Name) — dieselbe Abstufung wie in TrustStrip.tsx
 *  (opacity-90 bei echter Monoversion, opacity-70+grayscale im Fallback),
 *  sichtbar kräftiger als die vorherigen pauschalen 50%. */
function Mark({ p }: { p: Participant }) {
  return (
    <li className="flex w-20 flex-col items-center gap-1.5 text-center">
      <span className="flex h-9 items-center">
        <Image
          src={asset(p.logoMono ?? p.logo!)}
          alt=""
          width={200}
          height={96}
          loading="lazy"
          className={
            p.logoMono
              ? "h-9 w-auto object-contain opacity-90"
              : "h-9 w-auto object-contain opacity-70 grayscale"
          }
        />
      </span>
      <span className="text-nano leading-tight text-ink-2">{p.name}</span>
    </li>
  );
}

function Panel({
  label,
  sub,
  icon,
  color,
  marks,
  className,
}: {
  label: string;
  sub: string;
  icon: string;
  color: string;
  marks: Participant[];
  className?: string;
}) {
  return (
    <div
      style={{ "--role": color } as React.CSSProperties}
      className={
        "rounded-md border border-hairline bg-tint-05 p-4 md:p-6 " +
        "[border-color:color-mix(in_srgb,var(--role)_28%,transparent)] " +
        (className ?? "")
      }
    >
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-tint-30 bg-tint-10 [border-color:color-mix(in_srgb,var(--role)_45%,transparent)]">
          <Icon name={icon} size={18} className="text-ink" />
        </span>
        <span>
          <span className="block text-body text-ink">{label}</span>
          <span className="block text-micro" style={{ color }}>
            {sub}
          </span>
        </span>
      </div>

      {/* Runde 6: justify-center statt justify-start — die Logos
          standen linksbündig, sollen mittig in der Fläche stehen. */}
      <ul className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-5">
        {marks.map((p) => (
          <Mark key={p.name} p={p} />
        ))}
      </ul>
    </div>
  );
}

/** Die Nabe mit den zwei atmenden Ringen. `compact` = die Fassung fürs
 *  mobile/Tablet-Dreieck. Runde 6: beide Logos größer (w-16 → w-24,
 *  w-10 → w-14). */
function Hub({ compact }: { compact?: boolean }) {
  return (
    <span
      className={
        "relative flex shrink-0 items-center justify-center " +
        (compact ? "size-20" : "size-32")
      }
    >
      <span
        aria-hidden
        className="hub-ring absolute inset-0 rounded-full border border-tint-30"
      />
      <span
        aria-hidden
        className={
          "hub-ring hub-ring--wide absolute rounded-full border border-hairline " +
          (compact ? "-inset-2.5" : "-inset-4")
        }
      />
      <span
        className={
          "flex items-center justify-center rounded-full border border-tint-30 bg-tint-05 " +
          (compact ? "size-16" : "size-28")
        }
      >
        <Image
          src={`${basePath}/rl1-logo/rl1-logo-light.svg`}
          alt="Regulated Layer One"
          width={126}
          height={44}
          className={compact ? "w-14" : "w-24"}
        />
      </span>
    </span>
  );
}

/**
 * Waagerechte Verbindung — Desktop-Kreuz UND (gedreht per `rotate`)
 * jede der drei Linien im mobilen/Tablet-Dreieck. `flex-1` füllt am
 * Desktop die Restbreite zwischen Nabe und Panel; im Dreieck ist die
 * Linie stattdessen absolut positioniert mit fester Breite/Rotation
 * (siehe `style`), `flex-1` bleibt dabei einfach ungenutzt.
 *
 * Runde 6: trägt jetzt `flow-line--h` (vorher fehlte die Klasse —
 * ohne sie hatte die Linie keine explizite Höhe und rendere de facto
 * unsichtbar bei 0px).
 */
function FlowLineH({
  color,
  className,
  style,
}: {
  color: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={"flow-line flow-line--h relative " + (className ?? "flex-1")}
      style={{ "--flow-color": color, ...style } as React.CSSProperties}
    >
      <span className="flow-ball flow-ball--h" style={{ "--flow-color": color } as React.CSSProperties} />
    </span>
  );
}

/** Senkrechte Verbindung — der Desktop-Steg zur unteren Reihe. */
function FlowLineV({ color, className }: { color: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={"flow-line flow-line--v relative " + (className ?? "h-10")}
      style={{ "--flow-color": color } as React.CSSProperties}
    >
      <span className="flow-ball flow-ball--v" style={{ "--flow-color": color } as React.CSSProperties} />
    </span>
  );
}

/** Kompakter Knoten im mobilen/Tablet-Dreieck: nur Icon, Label,
 *  Anzahl — die echten Logos stehen in den Panels darunter.
 *
 * Runde 7: Icon und Beschriftung positionieren sich jetzt UNABHÄNGIG
 * voneinander relativ zu `position` — vorher lag `translate(-50%,-50%)`
 * auf dem äußeren Wrapper um Icon+Label+Anzahl als Flex-Spalte, wodurch
 * sich die Mitte des GANZEN Blocks auf die Zielkoordinate zentrierte,
 * nicht die Mitte des Icons. Die Linien (TRIANGLE_LINES) zielen aber
 * exakt auf `position` — das Icon saß dadurch sichtbar oberhalb des
 * Punktes, an dem die Linie tatsächlich endet (Screenshot-Befund). Der
 * äußere `div` ist jetzt nur noch ein größenloser Anker an `position`;
 * das Icon zentriert sich für sich allein darauf, die Beschriftung hängt
 * unabhängig davon darunter. */
function TriangleNode({
  label,
  sub,
  icon,
  color,
  position,
}: {
  label: string;
  sub: string;
  icon: string;
  color: string;
  position: React.CSSProperties;
}) {
  return (
    <div className="absolute" style={position}>
      <span
        className="absolute left-0 top-0 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-sm border border-tint-30 bg-tint-10"
        style={{ borderColor: `color-mix(in srgb, ${color} 45%, transparent)` }}
      >
        <Icon name={icon} size={18} className="text-ink" />
      </span>
      {/* 1.375rem = halbe Iconhöhe (size-9 = 2.25rem) + kleiner Abstand,
          vorher derselbe Abstand über gap-1 in der gemeinsamen Spalte. */}
      <span className="absolute left-0 top-[1.375rem] flex w-20 -translate-x-1/2 flex-col items-center gap-1 text-center">
        <span className="text-micro leading-tight text-ink">{label}</span>
        <span className="text-micro leading-tight" style={{ color }}>
          {sub}
        </span>
      </span>
    </div>
  );
}

/**
 * Die drei Linien im Dreieck, aus Nabe-Zentrum (50%, 50%) zu je einem
 * Knoten. Länge und Winkel sind aus den Knotenpositionen (unten)
 * vorausberechnet — beide Achsen laufen in Prozent EINES quadratischen
 * Feldes (`aspect-square`), Winkel bleiben deshalb unabhängig von der
 * tatsächlichen Pixelgröße konstant.
 */
const TRIANGLE_LINES = [
  { color: ROLE_COLOR.members, length: 36, angle: -90 }, // hoch, zum oberen Knoten
  { color: ROLE_COLOR.validators, length: 48.2, angle: 131.6 }, // unten links
  { color: ROLE_COLOR.observers, length: 48.2, angle: 48.4 }, // unten rechts
];

export default function NetworkDiagram() {
  /*
    Runde 7: die senkrechte Linie zur unteren Reihe hängt jetzt an der
    TATSÄCHLICHEN Unterkante der Nabe, nicht mehr an der Unterkante der
    ganzen oberen Reihe. Die Reihe (`items-center`) zentriert Nabe und
    beide Panels vertikal zueinander; ihre Höhe richtet sich nach dem
    höchsten der drei — meist das Members-Panel mit den meisten Logo-
    Zeilen. Die Nabe (fest 128px) hängt dadurch oft deutlich niedriger
    als die Reihe zentriert, und der Strang (lückenlos an die REIHE
    angrenzend, Runde 6) beginnt sichtbar unterhalb der Nabe statt an
    ihr — die im Screenshot gemeldete Lücke. `--hub-drop` misst genau
    diesen Unterschied.

    Runde 8: der Strang wird damit NICHT mehr per negativem Rand nach
    oben gezogen — das verschob alles danach mit, und das untere Panel
    rutschte in die Reihe darüber (gemeldet: „Kästen überlappen"). Er
    liegt jetzt ABSOLUT in der Nabenzelle, beginnt an der Unterkante der
    Nabe (`top: 100%`) und ist `--hub-drop` + die Höhe des Stegs
    darunter lang. Der Fluss bleibt unangetastet: die Reihe behält ihre
    Höhe, der Steg darunter seine, das Panel steht wieder sauber
    darunter.
  */
  const rowRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const vconnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    const hub = hubRef.current;
    const vconn = vconnRef.current;
    if (!row || !hub || !vconn) return;

    const measure = () => {
      const drop = Math.max(row.getBoundingClientRect().bottom - hub.getBoundingClientRect().bottom, 0);
      vconn.style.setProperty("--hub-drop", `${drop}px`);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    observer.observe(hub);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const byRole = (role: "member" | "validator" | "supporter") =>
    participants
      .filter((p) => p.roles?.includes(role) && p.logo)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "en"));

  const members = byRole("member");
  const validators = byRole("validator");
  const observers = byRole("supporter");

  const stats = [
    { value: members.length, label: "Member banks" },
    { value: validators.length, label: "Validators" },
    { value: observers.length, label: "Supporters" },
    { value: "SCE", label: "Luxembourg cooperative" },
    { value: "Live", label: "Network status", live: true },
  ];

  return (
    <Section label="Everyone who runs RL1">
      <Container>
        <h2 className="text-h2 text-ink">Everyone who runs RL1, in one place.</h2>
        <p className="mt-4 max-w-2xl text-body-lg text-ink-3">
          RL1 is governed by its member banks, operated by designated validators, and observed
          by public institutions.
        </p>

        <div className="mt-12 rounded-md border border-hairline bg-bg-2 p-6 md:p-10">
          {/* ── Unter lg: das Dreieck ────────────────────────────────
              Rein dekorativ (aria-hidden) — dieselbe Information steht
              vollständig und für Screenreader zugänglich in den drei
              Panels darunter. */}
          <div className="lg:hidden">
            <div aria-hidden className="relative mx-auto aspect-square w-full max-w-xs">
              {TRIANGLE_LINES.map((line, i) => (
                <FlowLineH
                  key={i}
                  color={line.color}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    width: `${line.length}%`,
                    transform: `rotate(${line.angle}deg)`,
                    transformOrigin: "0% 50%",
                  }}
                />
              ))}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Hub compact />
              </div>
              <TriangleNode
                label="Members"
                sub={`${members.length}`}
                icon="bank-money"
                color={ROLE_COLOR.members}
                position={{ top: "14%", left: "50%" }}
              />
              <TriangleNode
                label="Validators"
                sub={`${validators.length}`}
                icon="server"
                color={ROLE_COLOR.validators}
                position={{ top: "86%", left: "18%" }}
              />
              <TriangleNode
                label="Supporters"
                sub={`${observers.length}`}
                icon="check"
                color={ROLE_COLOR.observers}
                position={{ top: "86%", left: "82%" }}
              />
            </div>

            {/* Die echten Panels mit den Logo-Listen, unter dem
                Dreieck statt in den Knoten. */}
            <div className="mt-10 flex flex-col gap-6">
              <Panel
                label="Member banks"
                sub={`${members.length} institutions`}
                icon="bank-money"
                color={ROLE_COLOR.members}
                marks={members}
              />
              <Panel
                label="Network validators"
                sub={`${validators.length} operators`}
                icon="server"
                color={ROLE_COLOR.validators}
                marks={validators}
              />
              <Panel
                label="Supporters"
                sub={`${observers.length} institutions`}
                icon="check"
                color={ROLE_COLOR.observers}
                marks={observers}
              />
            </div>
          </div>

          {/* ── Ab lg: das Kreuz ─────────────────────────────────── */}
          <div className="hidden lg:flex lg:flex-col">
            {/* Obere Reihe: Mitglieder — Nabe — Validatoren. Eine
                gapless Flex-Zeile statt Grid-mit-gap: die Linien liegen
                dadurch lückenlos zwischen Panel und Nabe. */}
            <div ref={rowRef} className="flex items-center">
              <Panel
                className="flex-[3]"
                label="Member banks"
                sub={`${members.length} institutions`}
                icon="bank-money"
                color={ROLE_COLOR.members}
                marks={members}
              />
              {/* Kein Padding hier: die Panels müssen die Flex-Zeile
                  ohne jeden Zwischenraum berühren. Der sichtbare
                  Abstand zur Nabe kommt allein aus der Länge der Linie
                  selbst. */}
              <div className="flex flex-[2] items-center">
                <FlowLineH color={ROLE_COLOR.members} />
                <div ref={hubRef} className="relative shrink-0">
                  <Hub />
                  {/* Der Steg nach unten: absolut ab Nabenunterkante, so
                      lang wie der Rest der Reihe (--hub-drop) plus die
                      2rem des Stegfelds darunter. Absolut, damit er den
                      Fluss nicht verschiebt — sonst rutscht das untere
                      Panel in die Reihe (Runde 8). */}
                  <div
                    ref={vconnRef}
                    className="absolute left-1/2 top-full flex -translate-x-1/2 justify-center"
                    style={{ height: "calc(var(--hub-drop, 0px) + 2rem)" }}
                  >
                    <FlowLineV color={ROLE_COLOR.observers} className="h-full" />
                  </div>
                </div>
                <FlowLineH color={ROLE_COLOR.validators} />
              </div>
              <Panel
                className="flex-[3]"
                label="Network validators"
                sub={`${validators.length} operators`}
                icon="server"
                color={ROLE_COLOR.validators}
                marks={validators}
              />
            </div>

            {/* Reines Abstandsfeld zwischen Reihe und unterem Panel —
                die sichtbare Linie darin liegt absolut in der Nabenzelle
                oben (Runde 8) und bringt hier keine eigene Höhe mit. */}
            <div aria-hidden className="h-8" />

            {/* Mittig statt im 2-Spalten-Raster — mit nur noch einer
                Rolle unten liest sich das als Spitze eines Dreiecks,
                nicht als Balken über die volle Breite. */}
            <Panel
              className="mx-auto w-full max-w-md"
              label="Supporters"
              sub={`${observers.length} institutions`}
              icon="check"
              color={ROLE_COLOR.observers}
              marks={observers}
            />
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-hairline pt-8 sm:grid-cols-5">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="flex items-center gap-2 text-h3 text-ink">
                  {s.live && <span className="size-2 rounded-full bg-success" />}
                  {s.value}
                </dt>
                <dd className="text-micro uppercase text-ink-3">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10">
          {/* Runde 11: Flatbutton (Pfeil kommt als SVG aus der Variante,
              nicht mehr als „→"-Schriftzeichen). */}
          <Button href="/join" variant="flat">
            Become a member
          </Button>
        </div>
      </Container>
    </Section>
  );
}
