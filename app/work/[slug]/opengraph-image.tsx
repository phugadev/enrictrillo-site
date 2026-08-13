import { ImageResponse } from "next/og";
import { OgCard, ogContentType, ogFonts, ogSize } from "@/lib/og";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/work";
import { site, wavelengths } from "@/lib/site";

/**
 * A constant `alt`, not generateImageMetadata — same reasoning as
 * app/blog/[slug]/opengraph-image.tsx. Deriving the alt per item is possible
 * and nicer, but on a dynamic route it makes the card's URL
 * `.../opengraph-image/<id>` while generateStaticParams still only produces
 * the slug — so the card never prerenders and every social URL 404s. A
 * generic alt on a working card beats a per-study alt on a broken one; the
 * card's own title carries the specifics for anyone who can see it.
 */
export const alt = "Case study by Enric Trillo";
export const size = ogSize;
export const contentType = ogContentType;

/**
 * Metadata image routes don't inherit the page's params, so without this the
 * card is rendered on demand — a Satori + resvg invocation on every social
 * fetch of a page that is itself fully static. Mirrors generateStaticParams
 * in ./page.tsx: published case studies only.
 */
export function generateStaticParams() {
  return getAllCaseStudies().map((study) => ({ slug: study.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta } = getCaseStudyBySlug(slug);
  const wl = wavelengths[meta.wavelength];

  return new ImageResponse(
    (
      <OgCard
        eyebrow={`${wl.nm}nm · ${wl.label}`}
        title={meta.title}
        wavelength={meta.wavelength}
        footer={`${site.name} · Case study · ${meta.year}`}
      />
    ),
    { ...size, fonts: ogFonts() },
  );
}
