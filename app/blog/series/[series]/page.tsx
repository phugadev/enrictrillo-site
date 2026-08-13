import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { CONTAINER } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getAllSeries, getSeriesBySlug } from "@/lib/posts";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  return getAllSeries().map((s) => ({ series: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ series: string }>;
}): Promise<Metadata> {
  const { series } = await params;
  const found = getSeriesBySlug(series);
  if (!found) return {};

  const description = `Every post in the ${found.name} series — ${found.posts.length} so far.`;
  return {
    title: `${found.name} — ${site.name}`,
    description,
    alternates: { canonical: `/blog/series/${found.slug}` },
    // The card itself comes from the co-located opengraph-image.tsx; siteName is
    // restated because a child openGraph block replaces the root layout's.
    openGraph: {
      type: "website",
      title: found.name,
      description,
      url: `/blog/series/${found.slug}`,
      siteName: site.name,
    },
  };
}

export default async function SeriesPage({ params }: { params: Promise<{ series: string }> }) {
  const { series } = await params;
  const found = getSeriesBySlug(series);
  if (!found) notFound();

  return (
    <PageShell mainClassName={`${CONTAINER} py-16`}>
      <SectionLabel as="p">Series</SectionLabel>
      <h1 className="mt-3 font-display text-[32px] font-medium tracking-tight text-paper">
        {found.name}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        {found.posts.length} {found.posts.length === 1 ? "post" : "posts"} in this series, newest
        first.
      </p>

      <div className="mt-12 divide-y divide-hairline">
        {found.posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <Link
        href="/blog"
        className="mt-12 inline-block font-mono text-[12px] text-muted transition-colors hover:text-paper"
      >
        ← All writing
      </Link>
    </PageShell>
  );
}
