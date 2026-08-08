import { ImageResponse } from "next/og";
import { OgCard, ogContentType, ogSize } from "@/lib/og";
import { getPostBySlug } from "@/lib/posts";
import { site, wavelengths } from "@/lib/site";

export const alt = "Post preview";
export const size = ogSize;
export const contentType = ogContentType;

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
