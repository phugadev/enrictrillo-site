import type { ReactNode } from "react";
import { wavelengths, type Project } from "@/lib/site";
import { getCaseStudyBySlug } from "@/lib/work";
import { Hatch } from "./ui/Hatch";
import { SmartLink } from "./ui/SmartLink";

/**
 * Resolves `project.caseStudySlug` to a route, or `undefined` when the
 * project doesn't have one. A slug that's set but doesn't match a file under
 * content/work/ is a content bug, not a normal "no case study yet" state —
 * it throws (naming the project) rather than silently falling through to a
 * dead link, matching lib/posts.ts and lib/work.ts's "fail loudly, name the
 * file" convention. A case study that exists but is a draft still resolves
 * in dev (so it's previewable) but disappears in production, exactly like
 * the draft itself does on /work/[slug].
 */
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

/** Matches a "before → after" metric, e.g. "0 → 40k users". */
const DELTA_PATTERN = /^(.+?)\s*→\s*(.+)$/;

/**
 * Renders a metric string as plain text, unless it's a "before → after"
 * delta — then the arrow picks up the project's own band colour so the
 * before/after shape reads at a glance instead of blending into the rest of
 * the line.
 */
function Metric({ text, hex }: { text: string; hex: string }) {
  const match = text.match(DELTA_PATTERN);
  if (!match) return <>{text}</>;
  const [, before, after] = match;
  return (
    <>
      {before}
      <span className="mx-1 font-medium" style={{ color: hex }}>
        →
      </span>
      {after}
    </>
  );
}

/**
 * Same "Shipped is green" association `Availability`'s pulsing dot and
 * `AvailabilityBar`'s "Open" pill already carry — a shipped project reads as
 * the same kind of good news. `In build` borrows the compute blue used for
 * the "New" pill on Latest writing (something in motion), and `Archived`
 * stays neutral — it isn't a claim worth colouring.
 *
 * A dot and a word rather than a filled pill: at this size the pill was the
 * loudest thing in the entry, and the status is the least important claim in
 * it.
 */
const STATUS_DOT: Record<Project["status"], string> = {
  Shipped: "bg-systems",
  "In build": "bg-compute",
  Archived: "bg-faint",
};

/**
 * Destinations, in a fixed order so every entry reads the same way down the
 * page: the thing you can use, then the source, then the thing you can
 * install. `Source` rather than `GitHub` — the label names what it is in the
 * site's own vocabulary, and the address underneath already says where it
 * lives.
 */
const ENDPOINT_ORDER = [
  { key: "live", label: "Live" },
  { key: "repo", label: "Source" },
  { key: "npm", label: "Package" },
] as const;

/** github.com/phugadev/watchman — the address, minus the ceremony. */
function address(href: string) {
  return href
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

/**
 * One destination. Not a button: a labelled endpoint with its actual address
 * beneath it, the way documentation lists one. A row of identical bordered
 * pills reading "Live" and "GitHub" is the single most template-looking
 * thing a portfolio can do, and the address is genuine information — it
 * tells a reader whether they're about to land on a repo, a registry or a
 * running service before they click.
 */
function Endpoint({
  label,
  href,
  sub,
  arrow = "↗",
  emphasis = false,
}: {
  label: string;
  href: string;
  sub: string;
  arrow?: string;
  emphasis?: boolean;
}) {
  return (
    <SmartLink
      href={href}
      className={`group/ep block min-w-[13rem] max-w-full border-t pt-2 transition-colors hover:border-paper ${
        emphasis ? "border-paper/40" : "border-hairline"
      }`}
    >
      <span className="block font-mono text-[11px] uppercase tracking-wider text-paper">
        {label} <span aria-hidden="true">{arrow}</span>
      </span>
      <span className="mt-0.5 block truncate font-mono text-[10px] text-faint transition-colors group-hover/ep:text-muted">
        {sub}
      </span>
    </SmartLink>
  );
}

function MetaLine({ children }: { children: ReactNode }) {
  return <p className="mt-3 font-mono text-[11px] text-faint">{children}</p>;
}

/**
 * A project in Selected work, as an entry in a catalogue of engineering
 * artifacts rather than a card in a gallery.
 *
 * The hatch is the load-bearing element: everything above it describes the
 * artifact, everything below it is how you reach it, and the same rule falls
 * in the same place in every entry. That repetition is what makes the
 * section read as one system instead of as n unrelated components — which
 * matters more here than on any other part of the page, since this is the
 * section doing the persuading.
 *
 * No card, no panel, no border box. An earlier version of this section put
 * each project in a raised `bg-surface` panel; boxes made the projects read
 * as separate things sitting next to each other. Entries are separated by a
 * hairline and whitespace instead, and every entry gets identical treatment
 * — the content creates the hierarchy, not the frame.
 *
 * Deliberately absent: a project-visual slot (the projects that exist have
 * no image worth showing, and a placeholder box would be worse than none)
 * and a project-type line (that taxonomy isn't in lib/site.ts, and isn't
 * ours to invent).
 */
export function ProjectEntry({ project, index }: { project: Project; index: number }) {
  const wl = wavelengths[project.wavelength];
  const caseStudyHref = resolveCaseStudyHref(project);
  const endpoints = ENDPOINT_ORDER.filter(({ key }) => project.links?.[key]);

  return (
    <li className="py-10 first:pt-0 last:pb-0">
      <div className="flex gap-5 sm:gap-8">
        {/* Catalogue numbering — an index, not a PROJECT_ID. */}
        <span aria-hidden="true" className="w-6 shrink-0 pt-1 font-mono text-[11px] text-faint">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-display text-[22px] leading-tight text-paper">{project.name}</h3>
            <span
              className="font-mono text-[11px] uppercase tracking-wider"
              style={{ color: wl.hex }}
            >
              {wl.nm}nm {wl.label}
            </span>
          </div>

          <p className="mt-1.5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-faint">
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[project.status]}`}
              />
              {project.status}
            </span>
            <span>{project.year}</span>
          </p>

          <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-muted">
            {project.description}
          </p>

          {project.stack && <MetaLine>{project.stack.join(" · ")}</MetaLine>}

          {project.metrics?.length ? (
            <MetaLine>
              {project.metrics.map((metric, i) => (
                <span key={metric}>
                  {i > 0 ? <span className="mx-2">·</span> : null}
                  <Metric text={metric} hex={wl.hex} />
                </span>
              ))}
            </MetaLine>
          ) : null}

          <Hatch className="my-6" />

          {/* Flex-wrap rather than a fixed grid: a third of the measure is
              too narrow for an npm address, and a grid leaves empty columns
              on entries with a single endpoint. */}
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {caseStudyHref && (
              <Endpoint
                label="Case study"
                href={caseStudyHref}
                sub={caseStudyHref}
                arrow="→"
                emphasis
              />
            )}
            {endpoints.map(({ key, label }) => {
              const href = project.links![key]!;
              return <Endpoint key={key} label={label} href={href} sub={address(href)} />;
            })}
          </div>
        </div>
      </div>
    </li>
  );
}
