import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/components/layout";
import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { TopicLinks } from "@/components/TopicLinks";
import { TopicDot } from "@/components/ui/TopicDot";
import { getPostsByTopic } from "@/lib/posts";
import { site, topics, type Topic } from "@/lib/site";

/** Only groups that actually have posts get a page. */
export async function generateStaticParams() {
  return getPostsByTopic().map((group) => ({ topic: group.topic }));
}

function findTopic(slug: string) {
  return getPostsByTopic().find((b) => b.topic === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const group = findTopic(topic);
  if (!group) return {};

  const wl = topics[group.topic];
  const description = `${wl.description} — ${group.posts.length} ${
    group.posts.length === 1 ? "post" : "posts"
  }.`;

  return {
    title: `${wl.label} — ${site.name}`,
    description,
    alternates: { canonical: `/blog/topic/${group.topic}` },
    // No `images` here on purpose — the co-located opengraph-image.tsx supplies
    // the card (and the twitter:image with it). siteName is restated because a
    // child openGraph block replaces the root layout's rather than merging.
    openGraph: {
      type: "website",
      title: wl.label,
      description,
      url: `/blog/topic/${group.topic}`,
      siteName: site.name,
    },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const group = findTopic(topic);
  if (!group) notFound();

  const wl = topics[group.topic];

  return (
    <PageShell back={{ href: "/blog", label: "Writing" }}>
      <PageHeader
        variant="quiet"
        size="narrow"
        className="pt-stack"
        title={
          <span className="flex items-center gap-2">
            <TopicDot topic={group.topic as Topic} />
            {wl.label}
          </span>
        }
        lead={`${wl.description}.`}
      />
      <Container size="narrow">
        <ul>
          {group.posts.map((post) => (
            <PostCard key={post.slug} post={post} showTopic={false} excerpt />
          ))}
        </ul>
        <div className="mt-stack">
          <TopicLinks active={group.topic as Topic} />
        </div>
      </Container>
    </PageShell>
  );
}
