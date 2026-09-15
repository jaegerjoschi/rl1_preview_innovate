/**
 * Terminbuchung über Microsoft 365.
 *
 * Warum so: Bei Bookings liegen alle Angaben inklusive der Formularantworten
 * im Exchange-Postfach des eigenen Tenants. Kein externer Auftragsverarbeiter
 * bekommt Interessentendaten zu sehen — gegenüber einer Bank das entscheidende
 * Argument. Jeder Termin erzeugt automatisch einen Teams-Link im Outlook-
 * Kalender der Ansprechperson, und die Seite braucht dafür keinen Server.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * EINRICHTUNG (durch die IT, siehe README-Abschnitt „Join")
 *   1. Bookings-Kalender anlegen, Ansprechperson als Staff hinterlegen
 *   2. Dienste anlegen, je mit Teams-Meeting und den Custom Questions
 *   3. URL aus dem Reiter „Bookings page" → hier eintragen
 *
 * Solange `bookingUrl` leer ist, zeigt die Seite einen klar markierten
 * Platzhalter statt eines kaputten iFrames.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const booking = {
  /** Öffentliche Bookings-Seite, z. B. https://outlook.office365.com/book/RL1@… */
  bookingUrl: "",

  /** Dauer, die auf der Seite angekündigt wird — muss zum Dienst passen */
  meetingMinutes: 30,
} as const;

/**
 * Ansprechperson neben dem Buchungsblock.
 *
 * Ein Gesicht mit Namen und Rolle ist an dieser Stelle kein Schmuck: Wer über
 * eine Mitgliedschaft in dieser Größenordnung entscheidet, will wissen, mit
 * wem er spricht, bevor er einen Termin einträgt.
 */
export const contactPerson = {
  name: "",
  role: "",
  /** Pfad unter /public, z. B. "/board/henning-vollbehr.jpg" */
  photo: "",
  /** Ein Satz dazu, warum das Gespräch mit dieser Person weiterhilft */
  intro: "",
} as const;

export const isBookingConfigured = () => booking.bookingUrl.length > 0;
export const isContactConfigured = () => contactPerson.name.length > 0;
