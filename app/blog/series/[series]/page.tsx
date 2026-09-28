import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/components/layout";
import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
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
    <PageShell back={{ href: "/blog", label: "Writing" }}>
      <PageHeader
        variant="quiet"
        size="narrow"
        className="pt-stack"
        title={found.name}
        lead={found.posts.length === 1 ? "1 post in this series." : `${found.posts.length} posts in this series, newest first.`}
      />
      <Container size="narrow">
        <ul>
          {found.posts.map((post) => (
            <PostCard key={post.slug} post={post} excerpt />
          ))}
        </ul>
      </Container>
    </PageShell>
  );
}
