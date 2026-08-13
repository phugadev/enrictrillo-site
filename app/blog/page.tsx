import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { SeriesChips } from "@/components/SeriesChips";
import { WavelengthChips } from "@/components/WavelengthChips";
import { CONTAINER } from "@/components/ui/Section";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

const description =
  "Build logs, architecture notes and infrastructure/AI engineering write-ups, filed by wavelength.";

export const metadata: Metadata = {
  title: `Writing — ${site.name}`,
  description,
  alternates: { canonical: "/blog" },
  /**
   * Without this block the page inherits the root layout's openGraph wholesale
   * — the homepage title *and* og:url=https://enrictrillo.com, so sharing the
   * writing index linked back to the homepage.
   *
   * `images` has to be explicit: declaring openGraph here suppresses the
   * file-based card that would otherwise cascade down from app/opengraph-image
   * (the band pages proved it — they declared openGraph and emitted no image at
   * all). /blog/[slug] gets away with omitting it only because it has a
   * co-located opengraph-image.tsx, which wins over the declaration.
   */
  openGraph: {
    type: "website",
    title: `Writing — ${site.name}`,
    description,
    url: "/blog",
    siteName: site.name,
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — ${site.role}` },
    ],
  },
};

/**
 * A flat, newest-first list. Band grouping used to live here as sections, but
 * with real /blog/wavelength/<band> pages it would print every post twice on
 * one screen. This page answers "what's new"; the band pages answer
 * "what about X".
 */
export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <PageShell mainClassName={`${CONTAINER} py-16`}>
      <h1 className="font-display text-[32px] font-medium tracking-tight text-paper">Writing</h1>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
        Build logs, architecture notes and engineering write-ups — filed by wavelength, the same
        taxonomy the work is organised by.
      </p>

      {posts.length === 0 ? (
        <p className="mt-14 font-mono text-[13px] text-faint">Nothing published yet.</p>
      ) : (
        <>
          <div className="mt-8">
            <WavelengthChips />
          </div>

          <div className="mt-5">
            <SeriesChips />
          </div>

          <div className="mt-12 divide-y divide-hairline">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}
