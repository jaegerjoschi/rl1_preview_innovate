import type { Metadata } from "next";

import WhatMakesSpecial from "@/app/components/sections/WhatMakesSpecial";

/**
 * Interne Vorschau: die drei Darstellungen von "What makes RL1 special"
 * untereinander, damit die Entscheidung im Browser fällt. Nicht in der
 * Sitemap (siehe app/lib/nav.ts), nicht indexiert.
 */
export const metadata: Metadata = {
  title: "Preview — What makes RL1 special",
  robots: { index: false, follow: false },
};

export default function SpecialPreview() {
  return (
    <>
      <PreviewLabel>Variant A — accordion</PreviewLabel>
      <WhatMakesSpecial variant="accordion" />

      <PreviewLabel>Variant B — table with count-up</PreviewLabel>
      <WhatMakesSpecial variant="table" />

      <PreviewLabel>Variant C — scroll build</PreviewLabel>
      <WhatMakesSpecial variant="scroll" />
    </>
  );
}

function PreviewLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-y border-hairline bg-bg-2 px-6 py-4 text-micro uppercase tracking-wide text-ink-3">
      Internal preview · {children}
    </div>
  );
}
