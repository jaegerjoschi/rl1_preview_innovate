import { Container, Section } from "@/app/components/ui/primitives";
import { Reveal } from "@/app/components/motion/Reveal";
import { booking, isBookingConfigured } from "@/app/lib/booking";

/**
 * Microsoft Bookings, eingebettet — der Weg zum *bestätigten* Termin.
 *
 * Anders als MeetingPreference rät hier nichts: Bookings kennt den echten
 * Kalender der Ansprechperson, zeigt nur freie Zeiten und verschickt die
 * Teams-Einladung sofort. Der Preis dafür steht direkt daneben sichtbar —
 * die Oberfläche gehört Microsoft und liegt auf Microsofts Domain. Sie
 * lässt sich von hier aus nicht umstylen: kein CSS überquert eine
 * Cross-Origin-Grenze. In der Bookings-Verwaltung sind Logo und eine
 * Akzentfarbe einstellbar, mehr nicht.
 *
 * Die CSP erlaubt die nötigen Hosts bereits (app/layout.tsx, frame-src).
 *
 * Solange `booking.bookingUrl` leer ist, steht hier der Abdruck in
 * Originalgröße statt eines leeren Rahmens — damit vor der Entscheidung
 * sichtbar ist, wie viel helle Fläche in der dunklen Seite landet.
 */
export function BookingEmbed() {
  const configured = isBookingConfigured();

  return (
    <Section id="book" tone="off-black">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
          <div>
            {/* Runde 5: text-nowrap ab md — mit der kleineren h2-Stufe
                passt die Frage jetzt in die 22rem-Spalte. */}
            <h2 className="text-h2 text-ink md:text-nowrap">Prefer a confirmed slot?</h2>
            <p className="mt-4 text-lead text-ink-3">
              Pick a {booking.meetingMinutes}-minute time that is genuinely free. You receive
              the Microsoft Teams invitation straight away.
            </p>
          </div>

          <Reveal>
            {configured ? (
              <iframe
                src={booking.bookingUrl}
                title="Booking calendar"
                loading="lazy"
                className="h-[42rem] w-full rounded-md border border-hairline bg-white md:h-[48rem]"
              />
            ) : (
              <Footprint />
            )}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/**
 * Kein Nachbau der Microsoft-Oberfläche — nur ihr Abdruck. Fläche, Farbe
 * und Höhe stimmen, der Inhalt ist bewusst leer und als Platzhalter
 * beschriftet. Ein gezeichnetes Fake-Bookings würde die Entscheidung auf
 * einer Erfindung gründen.
 */
function Footprint() {
  return (
    <div className="flex h-[42rem] w-full items-center justify-center rounded-md border border-hairline bg-white p-8 md:h-[48rem]">
      <p className="max-w-xs text-center text-sm leading-relaxed text-neutral-500">
        Platzhalter in Originalgröße.
        <br />
        <br />
        Hier steht die Bookings-Oberfläche von Microsoft, sobald{" "}
        <code className="text-neutral-700">bookingUrl</code> in{" "}
        <code className="text-neutral-700">app/lib/booking.ts</code> gesetzt ist — hell,
        in Microsofts Layout und Typografie, von hier aus nicht umstylbar.
      </p>
    </div>
  );
}
