import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PostHeader } from "@/components/PostHeader";
import { Mdx } from "@/components/Mdx";
import { CONTAINER } from "@/components/ui/Section";
import { getHeadings } from "@/lib/headings";
import { getPostBySlug } from "@/lib/posts";
import { TocComparison, TocLive } from "./TocLab";

/**
 * Scratch route for deciding the margin table of contents. Not linked from
 * anywhere, not in the sitemap (app/sitemap.ts enumerates real content
 * explicitly, so nothing has to be removed there) and noindex/nofollow below —
 * app/robots.ts is a blanket `allow: "/"` on purpose, so the exclusion has to
 * be stated per page rather than in robots.txt.
 *
 * Delete this directory once the call is made. Precedent: the four Selected
 * Work variants were decided the same way.
 */
export const metadata: Metadata = {
  title: "Lab — margin ToC",
  robots: { index: false, follow: false },
};

/**
 * The longest post with the most headings, including a pair of h3s — the case
 * that actually stresses the rail. Judging a ToC on a three-heading post tells
 * you nothing.
 */
const SLUG = "watchman-ingest-at-forty-thousand-events-a-second";

export default async function TocLab() {
  const { meta, content } = getPostBySlug(SLUG);
  const headings = await getHeadings(content);

  return (
    <PageShell mainClassName="py-16">
      {/* Wider than CONTAINER on purpose: the static comparison is the one
          thing on this page that is not trying to reproduce the post layout. */}
      <div className="mx-auto mb-20 max-w-6xl px-6">
        <h1 className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
          Lab — margin table of contents
        </h1>
        <p className="mt-4 max-w-2xl font-reading text-[16px] leading-[1.7] text-prose">
          Three ways to mark where you are in a rail that is always readable and
          always in its own reserved 240px column. Same width, same type, same
          indent in all three — only the marker differs. Below, the real post
          with one of them live in the real margin.
        </p>

        <div className="mt-12">
          <TocComparison headings={headings} wavelength={meta.wavelength} />
        </div>
      </div>

      <div className={CONTAINER}>
        <TocLive headings={headings} wavelength={meta.wavelength}>
          <PostHeader meta={meta} />
          <article className="prose prose-invert mt-10 font-reading text-[18px] leading-[1.75]">
            <Mdx source={content} />
          </article>
        </TocLive>
      </div>
    </PageShell>
  );
}
