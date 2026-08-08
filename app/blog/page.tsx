import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { WavelengthChips } from "@/components/WavelengthChips";
import { CONTAINER } from "@/components/ui/Section";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Writing — ${site.name}`,
  description:
    "Build logs, architecture notes and infrastructure/AI engineering write-ups, filed by wavelength.",
  alternates: { canonical: "/blog" },
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

          <div className="mt-10 divide-y divide-hairline border-t border-hairline">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}
