import type { MetadataRoute } from "next";

import { site } from "@/app/lib/site";
import { sitemapRoutes } from "@/app/lib/nav";
import { updates } from "@/app/data/updates";

/** Wird beim Build zu /sitemap.xml — heute liefert die Adresse einen 404. */
export const dynamic = "force-static";

/** Startseite vor Unterseiten, Rechtstexte am Ende. */
const priorityFor = (route: string) => {
  if (route === "/") return 1;
  if (route === "/imprint" || route === "/privacy") return 0.3;
  return 0.8;
};

/** trailingSlash ist aktiv — die Sitemap muss dieselben URLs nennen wie die
 *  ausgelieferten Seiten, sonst meldet die Search Console Weiterleitungen. */
const canonical = (route: string) => `${site.url}${route.endsWith("/") ? route : `${route}/`}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages = sitemapRoutes.map((route) => ({
    url: canonical(route),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: priorityFor(route),
  }));

  // Artikel, die auf dieser Domain liegen (externe Meldungen gehören nicht rein)
  const articles = updates
    .filter((item) => item.url?.startsWith("/"))
    .map((item) => ({
      url: canonical(item.url!),
      lastModified: new Date(item.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));

  return [...pages, ...articles];
}
