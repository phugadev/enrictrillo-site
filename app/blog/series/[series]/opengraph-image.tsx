import { ImageResponse } from "next/og";
import { OgCard, ogContentType, ogFonts, ogSize } from "@/lib/og";
import { getAllSeries, getSeriesBySlug, type PostMeta } from "@/lib/posts";
import { site, type Topic } from "@/lib/site";

/**
 * A constant `alt`, not generateImageMetadata.
 *
 * Deriving the alt per item is possible and nicer, but on a dynamic route it
 * makes the card's URL `.../opengraph-image/<id>` while generateStaticParams
 * still only produces the slug — so the card never prerenders and every social
 * URL 404s. A generic alt on a working card beats a per-post alt on a broken
 * one; the card's own title carries the specifics for anyone who can see it.
 */
export const alt = "A series of posts by Enric Trillo";
export const size = ogSize;
export const contentType = ogContentType;

/**
 * Mirrors generateStaticParams in ./page.tsx. Without this file the series
 * pages emitted twitter:card=summary_large_image with no image at all —
 * declaring `openGraph` in the page's generateMetadata suppresses the root
 * app/opengraph-image that would otherwise cascade down.
 */
export function generateStaticParams() {
  return getAllSeries().map((s) => ({ series: s.slug }));
}

/**
 * A series usually sits in one band, but nothing enforces that, so light the
 * band most of its posts belong to rather than assuming the newest post speaks
 * for the set.
 */
function dominantTopic(posts: PostMeta[]): Topic | undefined {
  const tally = new Map<Topic, number>();
  for (const post of posts) tally.set(post.topic, (tally.get(post.topic) ?? 0) + 1);

  let best: Topic | undefined;
  let bestCount = 0;
  for (const [topic, count] of tally) {
    if (count > bestCount) {
      best = topic;
      bestCount = count;
    }
  }
  return best;
}

export default async function Image({ params }: { params: Promise<{ series: string }> }) {
  const { series } = await params;
  const found = getSeriesBySlug(series);

  // An unknown slug 404s at the page; the card falls back rather than throwing
  // inside a metadata route.
  if (!found) {
    return new ImageResponse(
      <OgCard eyebrow="Series" title="Writing" footer={site.name} />,
      { ...size, fonts: ogFonts() },
    );
  }

  const count = found.posts.length;

  return new ImageResponse(
    (
      <OgCard
        eyebrow="Series"
        title={found.name}
        topic={dominantTopic(found.posts)}
        footer={`${site.name} · ${count} ${count === 1 ? "post" : "posts"}`}
      />
    ),
    { ...size, fonts: ogFonts() },
  );
}
