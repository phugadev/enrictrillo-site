import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { PostHeader } from "@/components/PostHeader";
import { Mdx } from "@/components/Mdx";
import { PostNav } from "@/components/PostNav";
import { PostToc } from "@/components/PostToc";
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

  const hasToc = headings.length > 1;

  return (
    <PageShell reading back={{ href: "/blog", label: "Writing" }}>
      <JsonLd data={blogPostingSchema(meta)} />
      {/* The contents rail hangs in the empty margin beside the column on
          wide screens, rather than widening the page to make room for it. */}
      <div className="relative">
        <article>
          <PostHeader meta={meta} />
          <div className="prose mt-stack">
            <Mdx source={content} />
          </div>
          <PostNav newer={newer} older={older} />
        </article>
        {hasToc && (
          <aside className="absolute left-full top-0 ml-section hidden h-full w-52 xl:block">
            <PostToc headings={headings} wavelength={meta.wavelength} />
          </aside>
        )}
      </div>
    </PageShell>
  );
}
