import { ImageResponse } from "next/og";
import { OgCard, ogContentType, ogFonts, ogSize } from "@/lib/og";
import { getPostsByWavelength } from "@/lib/posts";
import { site, wavelengths } from "@/lib/site";

/**
 * A constant `alt`, not generateImageMetadata.
 *
 * Deriving the alt per item is possible and nicer, but on a dynamic route it
 * makes the card's URL `.../opengraph-image/<id>` while generateStaticParams
 * still only produces the slug — so the card never prerenders and every social
 * URL 404s. A generic alt on a working card beats a per-post alt on a broken
 * one; the card's own title carries the specifics for anyone who can see it.
 */
export const alt = "Writing by wavelength — Enric Trillo";
export const size = ogSize;
export const contentType = ogContentType;

/**
 * Mirrors generateStaticParams in ./page.tsx — only bands that actually have
 * posts get a page, so only those get a card, and it's rendered at build time
 * rather than on every social fetch.
 *
 * Without this file the band pages emitted twitter:card=summary_large_image and
 * no image at all: declaring `openGraph` in the page's generateMetadata
 * suppresses the root app/opengraph-image that would otherwise cascade down.
 */
export function generateStaticParams() {
  return getPostsByWavelength().map((band) => ({ wavelength: band.wavelength }));
}

function findBand(slug: string) {
  return getPostsByWavelength().find((b) => b.wavelength === slug);
}

export default async function Image({ params }: { params: Promise<{ wavelength: string }> }) {
  const { wavelength } = await params;
  const band = findBand(wavelength);

  // An unknown band 404s at the page; the card just falls back to the neutral
  // spectrum rather than throwing inside a metadata route.
  if (!band) {
    const fallback = <OgCard eyebrow="Wavelength" title="Writing" footer={site.name} />;
    return new ImageResponse(fallback, { ...size, fonts: ogFonts() });
  }

  const wl = wavelengths[band.wavelength];
  const count = band.posts.length;

  return new ImageResponse(
    (
      <OgCard
        eyebrow={`${wl.nm}nm · Wavelength`}
        title={wl.label}
        wavelength={band.wavelength}
        footer={`${site.name} · ${count} ${count === 1 ? "post" : "posts"}`}
      />
    ),
    { ...size, fonts: ogFonts() },
  );
}
