import Image from "next/image";
import { cn } from "@/app/lib/cn";
import { asset } from "@/app/lib/basePath";

/**
 * Rundes Porträt mit feinem Rand und dem Periwinkle-Schein aus dem
 * Entwurf (--shadow-glow). Fällt auf Initialen zurück, wenn kein Bild da
 * ist — nie ein gebrochenes Bildsymbol.
 */
export function Portrait({
  src,
  name,
  size = 120,
  className,
}: {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-tint-30 bg-bg-2 text-ink-3 shadow-glow",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={asset(src)} alt={name} width={size} height={size} className="h-full w-full object-cover" />
      ) : (
        <span className="text-lead">{initials}</span>
      )}
    </span>
  );
}
