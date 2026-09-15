import type { MetadataRoute } from "next";

import { site } from "@/app/lib/site";

/**
 * Wird beim Build zu /robots.txt — heute liefert die Adresse einen 404.
 *
 * Die KI-Crawler sind bewusst erlaubt: RL1 soll auftauchen, wenn jemand
 * ChatGPT, Claude oder Perplexity nach europäischer DLT-Infrastruktur fragt.
 * Wer das nicht will, trägt sie hier als Disallow ein — es ist eine
 * Entscheidung, keine Voreinstellung.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Namentlich erlaubt, damit die Absicht im Code dokumentiert ist
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
