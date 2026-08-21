import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { PostHeader } from "@/components/PostHeader";
import { Mdx } from "@/components/Mdx";
import { PostNav } from "@/components/PostNav";
import { PostToc } from "@/components/PostToc";
import { CONTAINER } from "@/components/ui/Section";
import { getHeadings } from "@/lib/headings";
import { JsonLd, blogPostingSchema } from "@/lib/schema";
import { getAdjacentPosts, getAllPosts, getPostBySlug } from "@/lib/posts";
import { site } from "@/lib/site";

/**
 * Published posts only. Drafts were previously prerendered and shipped — they
 * were unlisted (absent from /blog, the sitemap and the feed) but served a
 * complete page to anyone with the URL.
 */
export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { meta } = getPostBySlug(slug);
    return {
      title: `${meta.title} — ${site.name}`,
      description: meta.excerpt,
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        type: "article",
        title: meta.title,
        description: meta.excerpt,
        publishedTime: meta.date,
        url: `/blog/${slug}`,
      },
      twitter: { card: "summary_large_image", title: meta.title, description: meta.excerpt },
    };
  } catch {
    return {};
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let meta, content;
  try {
    ({ meta, content } = getPostBySlug(slug));
  } catch {
    notFound();
  }

  // Drafts stay previewable while you're writing, but never resolve in production.
  if (meta.draft && process.env.NODE_ENV === "production") notFound();

  const { newer, older } = getAdjacentPosts(slug);

  // Extracted from the MDX at build time rather than scraped out of the DOM
  // after hydration — see lib/headings.ts for why it re-runs the real pipeline.
  const headings = await getHeadings(content);

  return (
    // Post pages read narrower than CONTAINER (see the max-w-2xl below) —
    // long-form wants a tighter measure than the homepage's cards. But the
    // measure being narrower doesn't mean the page should be: this outer div
    // stays on CONTAINER so the column lines up with Nav and Footer on both
    // edges, the same way it does on every other page. A plain max-w-2xl
    // mx-auto here centers independently and drifts 48px off the chrome.
    <PageShell mainClassName={`${CONTAINER} py-16`} reading>
      {/* `relative` so the margin ToC can hang off the right edge of the
          column and stay stuck to it for the length of the post. The rail is
          absolutely positioned and a fixed width, so it reserves its own space
          in the margin without ever being part of this column's flow — the
          article's position and its alignment with Nav and Footer are the same
          with the ToC as without it, at every breakpoint. */}
      <div className="relative max-w-2xl">
        <JsonLd data={blogPostingSchema(meta)} />
        {headings.length > 1 && <PostToc headings={headings} wavelength={meta.wavelength} />}
        <PostHeader meta={meta} />

        <article className="prose prose-invert mt-10 font-reading text-[18px] leading-[1.75]">
          <Mdx source={content} />
        </article>

        <PostNav newer={newer} older={older} />
      </div>
    </PageShell>
  );
}
