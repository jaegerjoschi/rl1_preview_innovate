import { cn } from "@/app/lib/cn";

/**
 * Ein Formularfeld: Label, Eingabe (input | textarea | select), Fehler.
 * aria-invalid / aria-describedby / Fehlerfokus sind hier verdrahtet —
 * bewusst EINE Stelle für den Eingabestil.
 */
export function Field({
  id,
  name,
  label,
  error,
  as = "input",
  type = "text",
  optional,
  required,
  autoComplete,
  rows = 5,
  children,
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  as?: "input" | "textarea" | "select";
  type?: string;
  optional?: boolean;
  /** Steuert zugleich, ob der Haken nach dem Verlassen erscheinen kann. */
  required?: boolean;
  autoComplete?: string;
  rows?: number;
  children?: React.ReactNode;
}) {
  const errorId = `${id}-error`;
  const shared = cn(
    // text-input statt text-body: fest bei 16px, nicht die schrumpfende
    // Lesestufe — sonst zoomt iOS Safari beim Fokussieren die Seite hinein.
    "peer w-full rounded-sm border bg-tint-05 px-4 py-3 text-input text-ink",
    "placeholder:text-ink-3 transition-colors duration-150 ease-hover",
    // Hover: bisher gab es keinen. Die Transition lag schon da.
    "hover:border-tint-50 hover:bg-tint-10",
    "focus:border-accent-hover focus:outline-none",
    error ? "border-danger" : "border-tint-30",
  );

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-caption text-ink-3">
        {label}
        {optional && <span className="text-ink-3"> · optional</span>}
      </label>

      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(shared, "resize-y")}
        />
      ) : as === "select" ? (
        <select
          id={id}
          name={name}
          defaultValue=""
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={shared}
        >
          {children}
        </select>
      ) : (
        /*
          Bestätigung erst NACH der Eingabe, nicht beim Tippen — das ist
          der Konsens der Form-UX-Forschung (Baymard, NN/g): ein Feld,
          das schon während der Eingabe rot oder grün blinkt, stört mehr
          als es hilft.

          Genau dafür gibt es `:user-valid`. Der Zustand greift erst,
          wenn das Feld berührt und wieder verlassen wurde, und nur bei
          Feldern mit einer Bedingung (required, type="email").
          Optionale Felder leuchten deshalb nie auf — was richtig ist.
        */
        <span className="relative block">
          <input
            id={id}
            name={name}
            type={type}
            required={required}
            autoComplete={autoComplete}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={cn(shared, "pr-11")}
          />
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2",
              "text-body text-success opacity-0 transition-opacity duration-150 ease-hover",
              "peer-[:user-valid]:opacity-100",
            )}
          >
            ✓
          </span>
        </span>
      )}

      {error && (
        <p id={errorId} className="text-caption text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
