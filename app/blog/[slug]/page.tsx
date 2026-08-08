import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { PostHeader } from "@/components/PostHeader";
import { Mdx } from "@/components/Mdx";
import { PostNav } from "@/components/PostNav";
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

  return (
    <PageShell mainClassName="mx-auto max-w-2xl px-6 py-16">
      <PostHeader meta={meta} />

      <article className="prose prose-invert mt-10 font-reading text-[18px] leading-[1.75]">
        <Mdx source={content} />
      </article>

      <PostNav newer={newer} older={older} />
    </PageShell>
  );
}
