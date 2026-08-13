import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { CaseStudyHeader } from "@/components/CaseStudyHeader";
import { Mdx } from "@/components/Mdx";
import { CONTAINER } from "@/components/ui/Section";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/work";
import { site } from "@/lib/site";

/**
 * Published case studies only — mirrors app/blog/[slug]/page.tsx. Drafts
 * previously prerendered and shipped as unlisted-but-reachable pages; that
 * mistake isn't worth repeating here.
 */
export async function generateStaticParams() {
  return getAllCaseStudies().map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { meta } = getCaseStudyBySlug(slug);
    return {
      title: `${meta.title} — ${site.name}`,
      description: meta.excerpt,
      alternates: { canonical: `/work/${slug}` },
      openGraph: {
        type: "article",
        title: meta.title,
        description: meta.excerpt,
        url: `/work/${slug}`,
      },
      twitter: { card: "summary_large_image", title: meta.title, description: meta.excerpt },
    };
  } catch {
    return {};
  }
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let meta, content;
  try {
    ({ meta, content } = getCaseStudyBySlug(slug));
  } catch {
    notFound();
  }

  // Drafts stay previewable while you're writing, but never resolve in production.
  if (meta.draft && process.env.NODE_ENV === "production") notFound();

  return (
    // Same CONTAINER-then-max-w-2xl split as /blog/[slug] — the column lines
    // up with Nav and Footer on both edges, while the reading measure inside
    // stays narrower than the site's usual card width.
    <PageShell mainClassName={`${CONTAINER} py-16`}>
      <div className="max-w-2xl">
        <CaseStudyHeader meta={meta} />

        <article className="prose prose-invert mt-10 font-reading text-[18px] leading-[1.75]">
          <Mdx source={content} />
        </article>
      </div>
    </PageShell>
  );
}
