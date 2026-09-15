/**
 * Das Anfrageformular auf /join — Empfänger, Datenformat, Absenden.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ANSCHLIESSEN (eine Zeile)
 *
 * Die Seite wird statisch ausgeliefert, es gibt also keinen eigenen Server,
 * der eine Mail verschicken könnte. Der Endpunkt liegt außerhalb — welcher
 * es wird, entscheidet ihr mit den Entwicklern. Das Formular ist davon
 * unabhängig: Es schickt das unten dokumentierte JSON per POST an
 * `endpointUrl`, mehr braucht die Gegenseite nicht zu wissen.
 *
 * Naheliegend, weil es im eigenen Microsoft-Tenant bleibt wie die
 * Terminbuchung: ein Power-Automate-Flow mit dem Auslöser „Wenn eine
 * HTTP-Anfrage eingeht" → „E-Mail senden". Alternativ eine Azure Function.
 *
 * Zwei Dinge beim Anschließen nicht vergessen:
 *   1. Den Host in `connect-src` der CSP eintragen (app/layout.tsx),
 *      sonst blockiert der Browser die Anfrage.
 *   2. Prüfen, dass die Gegenstelle CORS erlaubt — sonst kommt die Antwort
 *      nicht beim Browser an, obwohl die Mail rausgeht.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const enquiry = {
  /** POST-Ziel. Leer = nutzt mailto als Fallback zum Testen. */
  endpointUrl: "",

  /**
   * Empfänger, solange `endpointUrl` leer ist — dann ist der Mailto-Weg
   * nicht der Ausnahme-, sondern der Normalfall: Jede abgeschickte Anfrage
   * öffnet den Mailclient des Absenders mit dieser Adresse im An-Feld.
   * Die Adresse steht damit im Klartext auf /join und im JS-Bundle.
   *
   * Sobald `endpointUrl` gesetzt ist, wird sie wieder das, was der Name
   * sagt: der angezeigte Ausweg, wenn die Übertragung scheitert.
   */
  fallbackEmail: "hbenaoun@kpmg.com",
} as const;

export const isEnquiryConfigured = () => enquiry.endpointUrl.length > 0;

/** Auswahl im Formular. Der Wert landet unverändert in der Mail. */
export const ENQUIRY_CATEGORIES = [
  "Membership",
  "Validator / technical participation",
  "Partnership",
  "Press",
  "Other",
] as const;

export type EnquiryCategory = (typeof ENQUIRY_CATEGORIES)[number];

/** Genau das kommt am Endpunkt an — als JSON im Rumpf der POST-Anfrage. */
export type EnquiryPayload = {
  name: string;
  institution: string;
  category: EnquiryCategory | string;
  email: string;
  /** optional, kann leer sein */
  phone: string;
  message: string;
  /** Terminwunsch — optional. Bis zu drei ISO-Zeitpunkte als Präferenz,
      keine bestätigte Buchung (siehe MeetingPreference). */
  wantsMeeting: boolean;
  lengthMinutes: 30 | 60;
  timeZone: string;
  slots: string[];
  /** ISO-Zeitstempel des Absendens */
  submittedAt: string;
  /** Woher die Anfrage kam — hilft, wenn später mehrere Formulare existieren */
  source: string;
};

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "network" | "server" };

/**
 * Schickt die Anfrage ab — entweder per HTTP-Endpunkt oder per Mailto-Link.
 *
 * Gibt bewusst ein Ergebnis zurück, statt Fehler zu schlucken: Ein Formular,
 * das einen Erfolg zeigt, obwohl nichts angekommen ist, verliert genau die
 * Anfragen, für die diese Seite gebaut wurde.
 */
export async function submitEnquiry(payload: EnquiryPayload): Promise<SubmitResult> {
  // Falls kein Endpunkt konfiguriert: öffne Mailto-Link
  if (!isEnquiryConfigured()) {
    const lines = [
      `Name: ${payload.name}`,
      `Institution: ${payload.institution}`,
      `Category: ${payload.category}`,
      `Email: ${payload.email}`,
      payload.phone ? `Phone: ${payload.phone}` : "",
      `Message:\n${payload.message}`,
      "",
      `---`,
      `Submitted: ${payload.submittedAt}`,
      `Source: ${payload.source}`,
    ]
      .filter(Boolean)
      .join("\n");

    const mailto = `mailto:${enquiry.fallbackEmail}?subject=RL1%20Enquiry%20from%20${encodeURIComponent(payload.name)}&body=${encodeURIComponent(lines)}`;
    window.location.href = mailto;
    return { ok: true };
  }

  try {
    const response = await fetch(enquiry.endpointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.ok ? { ok: true } : { ok: false, reason: "server" };
  } catch {
    // Netzwerkfehler, blockiert durch CSP, oder CORS verweigert
    return { ok: false, reason: "network" };
  }
}
