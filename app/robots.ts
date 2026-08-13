import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Everything is open, including to AI crawlers — being findable when someone
 * asks an assistant about Enric is the point. /llms.txt is the curated
 * markdown map those readers should prefer over scraping HTML.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    // /llms.txt is discovered through the <link rel="alternate" type="text/plain">
    // in the root layout, not from here. robots.txt has no field for "prefer
    // this representation", and a second Allow line naming a path that
    // `allow: "/"` already covers is noise in a file crawlers parse literally.
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    // `Host:` removed — Yandex-only, ignored by Google and Bing, and the
    // canonical host is already stated by metadataBase and rel=canonical.
  };
}
