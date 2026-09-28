import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { TopicDot } from "@/components/ui/TopicDot";
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
 * A minimal, flat list — no topic filtering like /blog gets. Case
 * studies will number in the single digits for a long time, so a filter chip
 * row would be overkill chrome around not much content.
 */
export default function WorkIndex() {
  const studies = getAllCaseStudies();

  return (
    <PageShell back={{ href: "/", label: site.name }}>
      <h1 className="type-body text-foreground">Case studies</h1>
      <p className="mt-inset type-body text-muted-foreground">{description}</p>
      {studies.length === 0 ? (
        <p className="mt-stack type-body text-muted-foreground">
          The write-ups are in progress. Until they land, every project is on the{" "}
          <Link href="/" className="text-foreground underline decoration-subtle-foreground/50 decoration-dotted underline-offset-4 hover:decoration-solid">
            home page
          </Link>{" "}
          with its source linked.
        </p>
      ) : (
        <ul className="mt-stack">
          {studies.map((study) => (
            <li key={study.slug}>
              <Link
                href={`/work/${study.slug}`}
                className="group -mx-2 flex items-baseline gap-3 rounded-control-sm px-2 py-1.5 transition-colors duration-quick hover:bg-gray-tint"
              >
                <TopicDot topic={study.topic} className="translate-y-[-2px]" />
                <span className="min-w-0 flex-1 text-foreground">{study.title}</span>
                <span className="shrink-0 type-body tabular-nums text-subtle-foreground">{study.year}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
