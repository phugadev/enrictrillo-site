import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { Eyebrow, PAGE, PageHeader } from "@/components/layout";
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
    <PageShell>
      <PageHeader
        eyebrow={<Eyebrow>Series</Eyebrow>}
        title={found.name}
        lead={`${found.posts.length} ${found.posts.length === 1 ? "post" : "posts"} in this series, newest first.`}
      />
      <div className={PAGE}>
        <div className="focuslist divide-y divide-border border-t border-border">
          {found.posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <Link
          href="/blog"
          className="signal mt-stack inline-block type-label-sm text-subtle-foreground transition-colors duration-quick hover:text-foreground"
        >
          ← All writing
        </Link>
      </div>
    </PageShell>
  );
}
