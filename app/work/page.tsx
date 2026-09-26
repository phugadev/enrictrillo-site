import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Eyebrow, PAGE, PageHeader } from "@/components/layout";
import { band } from "@/lib/bands";
import { getAllCaseStudies } from "@/lib/work";
import { site, wavelengths } from "@/lib/site";

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
    <PageShell>
      <PageHeader
        eyebrow={<Eyebrow>Case studies</Eyebrow>}
        title="How the work was done."
        lead={description}
      />
      <div className={PAGE}>
        {studies.length === 0 ? (
          <div className="rounded-panel border border-dashed border-gray-border-strong p-stack text-center">
            <p className="type-subheading text-foreground">The write-ups are in progress.</p>
            <p className="mx-auto mt-inset max-w-md type-body text-subtle-foreground">
              Until they land, every project is on the homepage with its source and packages linked.
            </p>
            <Link
              href="/#work"
              className="signal mt-gutter inline-block type-label-sm text-subtle-foreground underline decoration-faint underline-offset-4 transition-colors duration-quick hover:text-foreground"
            >
              See the selected work
            </Link>
          </div>
        ) : (
          <ul className="grid gap-gutter sm:grid-cols-2">
            {studies.map((study) => {
              const wl = wavelengths[study.wavelength];
              const b = band[study.wavelength];
              return (
                <li key={study.slug}>
                  <Link
                    href={`/work/${study.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-panel border border-border bg-card p-stack shadow-raised transition-colors duration-quick hover:border-gray-border-strong"
                  >
                    <span aria-hidden="true" className={`absolute left-0 top-0 h-px w-24 ${b.mark}`} />
                    <Eyebrow as="span" wavelength={study.wavelength}>
                      {wl.label} · {study.year}
                    </Eyebrow>
                    <h2 className="mt-gutter text-balance type-heading text-foreground">{study.title}</h2>
                    <p className="mt-inset flex-1 text-pretty type-body text-muted-foreground">{study.excerpt}</p>
                    <span className="signal mt-stack type-label-sm text-subtle-foreground transition-colors duration-quick group-hover:text-foreground">
                      Read the case study →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PageShell>
  );
}
