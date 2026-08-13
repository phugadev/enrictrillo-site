import type { PostMeta } from "./posts";
import { site, wavelengths } from "./site";

/**
 * JSON-LD. The main search query for a contractor is their own name, and
 * schema.org is what feeds knowledge panels and gives assistants clean entity
 * data instead of them inferring it from prose. Same job as /llms.txt, in the
 * format crawlers already parse.
 */
export function personSchema() {
  const [city, country] = site.location.split(",").map((s) => s.trim());

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: site.role,
    description: site.tagline,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressCountry: country === "UK" ? "GB" : country,
    },
    worksFor: { "@type": "Organization", name: site.company },
    knowsAbout: [
      "TypeScript",
      "Next.js",
      "React",
      "Python",
      "Node.js",
      "Azure",
      "Cloud infrastructure",
      "AI engineering",
      ...Object.values(wavelengths).map((wl) => wl.description),
    ],
    sameAs: [site.social.github, site.social.linkedin],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    description: site.tagline,
    inLanguage: "en-GB",
    publisher: { "@id": `${site.url}/#person` },
  };
}

export function blogPostingSchema(meta: PostMeta) {
  const url = `${site.url}/blog/${meta.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.excerpt,
    datePublished: meta.date,
    dateModified: meta.date,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${url}/opengraph-image`,
    author: { "@id": `${site.url}/#person` },
    publisher: { "@id": `${site.url}/#person` },
    isPartOf: { "@id": `${site.url}/#website` },
    articleSection: wavelengths[meta.wavelength].label,
    ...(meta.series ? { about: meta.series } : {}),
  };
}

/** Renders a JSON-LD block. Data is ours, so there's no injection surface. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
