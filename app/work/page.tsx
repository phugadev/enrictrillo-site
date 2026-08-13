import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { WavelengthDot } from "@/components/ui/WavelengthDot";
import { CONTAINER } from "@/components/ui/Section";
import { getAllCaseStudies } from "@/lib/work";
import { site } from "@/lib/site";

const description = "Longer write-ups on individual projects — approach, decisions and outcomes.";

export const metadata: Metadata = {
  title: `Case studies — ${site.name}`,
  description,
  alternates: { canonical: "/work" },
  // Explicit openGraph so this index doesn't inherit the root layout's
  // homepage title/url wholesale — same reasoning as app/blog/page.tsx.
  openGraph: {
    type: "website",
    title: `Case studies — ${site.name}`,
    description,
    url: "/work",
    siteName: site.name,
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — ${site.role}` },
    ],
  },
};

/**
 * A minimal, flat list — no wavelength filtering like /blog gets. Case
 * studies will number in the single digits for a long time, so a filter chip
 * row would be overkill chrome around not much content.
 */
export default function WorkIndex() {
  const studies = getAllCaseStudies();

  return (
    <PageShell mainClassName={`${CONTAINER} py-16`}>
      <h1 className="font-display text-[32px] font-medium tracking-tight text-paper">
        Case studies
      </h1>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">{description}</p>

      {studies.length === 0 ? (
        <p className="mt-14 font-mono text-[13px] text-faint">Nothing published yet.</p>
      ) : (
        <div className="mt-12 divide-y divide-hairline">
          {studies.map((study) => (
            <Link key={study.slug} href={`/work/${study.slug}`} className="group flex gap-4 py-6">
              <span className="pt-2">
                <WavelengthDot wavelength={study.wavelength} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-faint">
                  <span>{study.year}</span>
                  {study.stack && <span className="truncate">{study.stack.join(" · ")}</span>}
                </div>
                <h2 className="font-display text-[19px] leading-snug text-paper transition-colors group-hover:text-white">
                  {study.title}
                </h2>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{study.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
