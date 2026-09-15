"use client";

import { Button } from "@/app/components/ui/Button";

/**
 * Zurück-Navigation für die Rechts- und Presseseiten. Dünner Wrapper um
 * die gemeinsame `Button`-Komponente — damit dieselbe Geometrie und
 * dieselbe Farbe gilt wie bei jedem anderen Button der Seite.
 *
 * Runde 11: Flatbutton statt Outline (Wunsch des Auftraggebers). Der
 * Pfeil kommt aus der Variante selbst und zeigt hier nach LINKS
 * (`arrow="left"`); das frühere „←" im Text ist damit entfallen — ein
 * Schriftzeichen, das je nach Schnitt anders steht als die gezeichneten
 * Icons daneben.
 *
 * Ohne `href`: echtes Browser-"Zurück" (Imprint, Privacy).
 * Mit `href`: ein echter Link — für die News-Artikelseiten, die IMMER zur
 * Nachrichtenübersicht führen sollen, nicht irgendwohin zurück in der
 * Browser-History und nicht zur Startseite. Jede künftige Artikelseite
 * ruft dasselbe Muster auf.
 */
export default function BackButton({
  href,
  label = "Back",
}: {
  href?: string;
  label?: string;
}) {
  if (href) {
    return (
      <Button href={href} variant="flat" size="sm" arrow="left">
        {label}
      </Button>
    );
  }

  return (
    <Button
      variant="flat"
      size="sm"
      arrow="left"
      onClick={() => window.history.back()}
    >
      {label}
    </Button>
  );
}
