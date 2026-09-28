import { ImageResponse } from "next/og";
import { OgCard, ogContentType, ogFonts, ogSize } from "@/lib/og";
import { getPostsByTopic } from "@/lib/posts";
import { site, topics } from "@/lib/site";

/**
 * A constant `alt`, not generateImageMetadata.
 *
 * Deriving the alt per item is possible and nicer, but on a dynamic route it
 * makes the card's URL `.../opengraph-image/<id>` while generateStaticParams
 * still only produces the slug — so the card never prerenders and every social
 * URL 404s. A generic alt on a working card beats a per-post alt on a broken
 * one; the card's own title carries the specifics for anyone who can see it.
 */
export const alt = "Writing by topic — Enric Trillo";
export const size = ogSize;
export const contentType = ogContentType;

/**
 * Mirrors generateStaticParams in ./page.tsx — only groups that actually have
 * posts get a page, so only those get a card, and it's rendered at build time
 * rather than on every social fetch.
 *
 * Without this file the group pages emitted twitter:card=summary_large_image and
 * no image at all: declaring `openGraph` in the page's generateMetadata
 * suppresses the root app/opengraph-image that would otherwise cascade down.
 */
export function generateStaticParams() {
  return getPostsByTopic().map((group) => ({ topic: group.topic }));
}

function findTopic(slug: string) {
  return getPostsByTopic().find((b) => b.topic === slug);
}

export default async function Image({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const group = findTopic(topic);

  // An unknown group 404s at the page; the card just falls back to the neutral
  // spectrum rather than throwing inside a metadata route.
  if (!group) {
    const fallback = <OgCard eyebrow="Topic" title="Writing" footer={site.name} />;
    return new ImageResponse(fallback, { ...size, fonts: ogFonts() });
  }

  const wl = topics[group.topic];
  const count = group.posts.length;

  return new ImageResponse(
    (
      <OgCard
        eyebrow="Writing"
        title={wl.label}
        topic={group.topic}
        footer={`${site.name} · ${count} ${count === 1 ? "post" : "posts"}`}
      />
    ),
    { ...size, fonts: ogFonts() },
  );
}
