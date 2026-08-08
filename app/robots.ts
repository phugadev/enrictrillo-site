import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Everything is open, including to AI crawlers — being findable when someone
 * asks an assistant about Enric is the point. /llms.txt is the curated
 * markdown map those readers should prefer over scraping HTML.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
