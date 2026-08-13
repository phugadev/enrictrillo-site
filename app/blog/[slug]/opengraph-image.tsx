import { ImageResponse } from "next/og";
import { OgCard, ogContentType, ogSize } from "@/lib/og";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { site, wavelengths } from "@/lib/site";

export const alt = "Post preview";
export const size = ogSize;
export const contentType = ogContentType;

/**
 * Metadata image routes don't inherit the page's params, so without this the
 * card is rendered on demand — a Satori + resvg invocation on every social
 * fetch of a page that is itself fully static. Mirrors generateStaticParams in
 * ./page.tsx: published posts only.
 */
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta } = getPostBySlug(slug);
  const wl = wavelengths[meta.wavelength];

  return new ImageResponse(
    (
      <OgCard
        eyebrow={`${wl.nm}nm · ${wl.label}`}
        title={meta.title}
        wavelength={meta.wavelength}
        footer={`${site.name} · ${meta.readingTime}`}
      />
    ),
    size,
  );
}
