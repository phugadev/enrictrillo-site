import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { SeriesChips } from "@/components/SeriesChips";
import { WavelengthChips } from "@/components/WavelengthChips";
import { Eyebrow, PAGE, PageHeader } from "@/components/layout";
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
    <PageShell>
      <PageHeader
        eyebrow={<Eyebrow>Writing{posts.length > 0 ? ` · ${posts.length} ${posts.length === 1 ? "post" : "posts"}` : ""}</Eyebrow>}
        title="Build logs and engineering notes."
        lead="Architecture notes and engineering write-ups — filed by wavelength, the same taxonomy the work is organised by."
      >
        {posts.length > 0 && (
          <div className="space-y-gutter">
            <WavelengthChips />
            <SeriesChips />
          </div>
        )}
      </PageHeader>

      <div className={PAGE}>
        {posts.length === 0 ? (
          <div className="rounded-panel border border-dashed border-gray-border-strong p-stack text-center">
            <p className="type-subheading text-foreground">The first posts are being written.</p>
            <p className="mx-auto mt-inset max-w-md type-body text-subtle-foreground">
              Build logs and architecture notes land here as they are finished. The feed will
              have them the moment they do.
            </p>
            <a
              href="/feed.xml"
              className="signal mt-gutter inline-block type-label-sm text-subtle-foreground underline decoration-faint underline-offset-4 transition-colors duration-quick hover:text-foreground"
            >
              Subscribe via RSS
            </a>
          </div>
        ) : (
          <div className="focuslist divide-y divide-border border-t border-border">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
