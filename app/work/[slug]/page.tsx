import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { CaseStudyHeader } from "@/components/CaseStudyHeader";
import { Mdx } from "@/components/Mdx";
import { PAGE } from "@/components/layout";
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
    <PageShell reading>
      <article className={`${PAGE} pt-section`}>
        <div className="max-w-[46rem]">
          <CaseStudyHeader meta={meta} />
          <div className="prose mt-stack">
            <Mdx source={content} />
          </div>
        </div>
      </article>
    </PageShell>
  );
}
