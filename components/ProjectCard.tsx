import { wavelengths, type Project } from "@/lib/site";
import { band } from "@/lib/bands";
import { getCaseStudyBySlug } from "@/lib/work";
import { Eyebrow } from "./layout";
import { Status } from "./ui/status";
import { SmartLink } from "./ui/SmartLink";

/** Only link a case study that exists and is published; a typo in
    lib/site.ts fails the build rather than shipping a 404. */
function resolveCaseStudyHref(project: Project): string | undefined {
  if (!project.caseStudySlug) return undefined;
  let meta;
  try {
    ({ meta } = getCaseStudyBySlug(project.caseStudySlug));
  } catch {
    throw new Error(
      `lib/site.ts — project "${project.name}" has caseStudySlug "${project.caseStudySlug}", but content/work/${project.caseStudySlug}.mdx doesn't exist.`,
    );
  }
  if (meta.draft && process.env.NODE_ENV === "production") return undefined;
  return `/work/${project.caseStudySlug}`;
}

export function address(href: string) {
  return href.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

const TONE = { Shipped: "success", "In build": "info", Archived: "neutral" } as const;

const ENDPOINTS = [
  { key: "live", label: "Live" },
  { key: "repo", label: "Source" },
  { key: "npm", label: "Package" },
] as const;

/** "p99 480ms → 90ms": the arrow takes the band, the figures stay neutral. */
function Metric({ text, tint }: { text: string; tint: string }) {
  const match = text.match(/^(.+?)\s*→\s*(.+)$/);
  if (!match) return <>{text}</>;
  return (
    <>
      {match[1]}
      <span className={`mx-1 ${tint}`}>→</span>
      {match[2]}
    </>
  );
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const wl = wavelengths[project.wavelength];
  const b = band[project.wavelength];
  const caseStudy = resolveCaseStudyHref(project);

  const links = [
    ...(project.specimen
      ? [{ label: project.specimen.label, href: project.specimen.href, sub: project.specimen.href, primary: true }]
      : []),
    ...(caseStudy ? [{ label: "Case study", href: caseStudy, sub: caseStudy, primary: true }] : []),
    ...ENDPOINTS.filter(({ key }) => project.links?.[key]).map(({ key, label }) => ({
      label,
      href: project.links![key]!,
      sub: address(project.links![key]!),
      primary: false,
    })),
  ];

  return (
    <li>
      <article className="relative overflow-hidden rounded-panel border border-border bg-card shadow-raised">
        {/* The band, drawn once, along the top edge and fading out. */}
        <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-px bg-linear-to-r ${b.ring} via-transparent to-transparent`} />
        <div aria-hidden="true" className={`absolute left-0 top-0 h-px w-24 ${b.mark}`} />

        <div className="grid gap-stack p-gutter sm:p-stack lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-gutter gap-y-inset">
              <span className="figure type-caption-sm text-faint">{String(index + 1).padStart(2, "0")}</span>
              <Eyebrow as="span" wavelength={project.wavelength}>
                {wl.nm}nm {wl.label}
              </Eyebrow>
            </div>

            <h3 className="mt-gutter type-title text-foreground">{project.name}</h3>
            <p className="mt-inset max-w-prose text-pretty type-lead text-muted-foreground">
              {project.description}
            </p>

            {project.stack && (
              <ul className="mt-gutter flex flex-wrap gap-1.5" aria-label="Stack">
                {project.stack.map((item) => (
                  <li
                    key={item}
                    className="figure rounded-chip border border-border px-2 py-0.5 type-caption-sm text-subtle-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {project.metrics?.length ? (
              <p className="figure mt-gutter type-caption text-subtle-foreground">
                {project.metrics.map((metric, i) => (
                  <span key={metric}>
                    {i > 0 && <span className="mx-2 text-faint">·</span>}
                    <Metric text={metric} tint={b.tint} />
                  </span>
                ))}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-gutter lg:border-l lg:border-border lg:pl-stack">
            <Status tone={TONE[project.status]} dot className="self-start">
              {project.status} · {project.year}
            </Status>
            <ul className="divide-y divide-border border-y border-border">
              {links.map((link) => (
                <li key={link.label}>
                  <SmartLink
                    href={link.href}
                    className="group/link flex items-center justify-between gap-gutter py-inset"
                  >
                    <span className="min-w-0">
                      <span className="signal type-label-sm block text-foreground">{link.label}</span>
                      <span className="figure mt-0.5 block truncate type-caption-sm text-faint transition-colors duration-quick group-hover/link:text-subtle-foreground">
                        {link.sub}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`shrink-0 text-subtle-foreground transition-transform duration-quick group-hover/link:translate-x-0.5 ${
                        link.primary ? b.tint : ""
                      }`}
                    >
                      {link.primary ? "→" : "↗"}
                    </span>
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </li>
  );
}
