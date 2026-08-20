import Link from "next/link";
import { wavelengths, type Project } from "@/lib/site";
import { getCaseStudyBySlug } from "@/lib/work";
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
 * delta — then the arrow picks up the project's own band color so the
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
 */
const STATUS_STYLE: Record<Project["status"], string> = {
  Shipped: "bg-systems/15 text-systems-tint",
  "In build": "bg-compute/15 text-compute-tint",
  Archived: "bg-hairline/60 text-faint",
};

/**
 * Fixed order so every row reads the same way down the list: the thing you can
 * use, then the thing you can read, then the thing you can install.
 */
const LINK_ORDER = [
  { key: "live", label: "Live" },
  { key: "repo", label: "GitHub" },
  { key: "npm", label: "npm" },
] as const;

/**
 * A project in Selected work, as one line of a ledger: year in the gutter, a
 * band-coloured tick, then status, name and description running together as
 * continuous text, with the destinations parked on the right.
 *
 * This replaced a grid of raised `bg-surface` panels. The panels were the
 * wrong shape for the content — two of them read as a page with two things
 * on it, where a ruled list of two reads as the top of a list. A row also
 * costs almost nothing per project, so the section can grow to ten without
 * turning into a wall of cards, and it rhymes with `PostCard`'s compact row
 * on Latest writing: same negative-margin hover band, same mono metadata at
 * the edges. The instrument reading is the point — this is a log, not a
 * gallery.
 *
 * The name stays plain text and the right-hand links carry every
 * destination: linking the name too would mean two tab stops on the same URL
 * while a project has one link, and an arbitrary choice of target once it
 * has three. A case study, when one exists, is the strongest piece of proof
 * here, so it's the one bordered control (structure, so near-square) among
 * underlined text links.
 *
 * Stack is a plain mono line rather than the chips the panel used. At this
 * density a row of pills is louder than the project name above it, and the
 * chip treatment still earns its place in Toolkit, where the technologies
 * *are* the content rather than a footnote to it.
 */
export function ProjectRow({ project }: { project: Project }) {
  const links = LINK_ORDER.filter(({ key }) => project.links?.[key]);
  const caseStudyHref = resolveCaseStudyHref(project);
  const wl = wavelengths[project.wavelength];

  return (
    <li className="border-b border-hairline">
      <div className="group -mx-3 flex gap-4 rounded px-3 py-5 transition-colors hover:bg-surface">
        <span className="w-10 shrink-0 pt-1 font-mono text-[11px] uppercase tracking-wider text-faint">
          {project.year}
        </span>

        {/* The band tick — the row's one piece of colour, running its full
            height so the list reads as a spectrum down the left edge. */}
        <span
          aria-hidden="true"
          className="w-px shrink-0 self-stretch opacity-70 transition-opacity group-hover:opacity-100"
          style={{ backgroundColor: wl.hex }}
        />

        <div className="min-w-0 flex-1">
          {/* A div, not a p: the name is a real heading, and an h3 inside a
              p is invalid nesting the parser would break apart — a
              hydration mismatch waiting to happen. */}
          <div className="text-[15px] leading-relaxed text-muted">
            <span
              className={`mr-2.5 whitespace-nowrap rounded-full px-2 py-0.5 align-[2px] font-mono text-[10px] uppercase tracking-wider ${STATUS_STYLE[project.status]}`}
            >
              {project.status}
            </span>
            <h3 className="mr-2 inline font-display text-[16px] text-paper">{project.name}</h3>
            {project.description}
          </div>

          {(project.stack || project.metrics?.length) && (
            <p className="mt-1.5 font-mono text-[11px] text-faint">
              {project.stack?.join(" · ")}
              {project.stack && project.metrics?.length ? <span className="mx-2">|</span> : null}
              {project.metrics?.map((metric, i) => (
                <span key={metric}>
                  {i > 0 ? <span className="mx-2">·</span> : null}
                  <Metric text={metric} hex={wl.hex} />
                </span>
              ))}
            </p>
          )}

          {(links.length > 0 || caseStudyHref) && (
            <div className="mt-3 flex flex-wrap items-center gap-4 sm:hidden">
              <Destinations caseStudyHref={caseStudyHref} links={links} project={project} />
            </div>
          )}
        </div>

        {/* Right-hand rail on sm and up; the same destinations fall under the
            description on narrow screens, where a rail would squeeze the
            text to a couple of words a line. */}
        <div className="hidden shrink-0 items-start gap-4 sm:flex">
          <Destinations caseStudyHref={caseStudyHref} links={links} project={project} />
        </div>
      </div>
    </li>
  );
}

function Destinations({
  caseStudyHref,
  links,
  project,
}: {
  caseStudyHref?: string;
  links: readonly { key: "live" | "repo" | "npm"; label: string }[];
  project: Project;
}) {
  return (
    <>
      {caseStudyHref && (
        <Link
          href={caseStudyHref}
          className="rounded border border-hairline px-3 py-1.5 font-mono text-[11px] text-paper transition-colors hover:border-paper"
        >
          Case study →
        </Link>
      )}
      {links.map(({ key, label }) => (
        <SmartLink
          key={key}
          href={project.links![key]!}
          // "GitHub" repeated down the list is ambiguous out of context, so
          // the accessible name carries the project too.
          className="font-mono text-[11px] text-faint underline decoration-hairline underline-offset-4 transition-colors hover:text-paper hover:decoration-muted"
        >
          <span aria-hidden="true">{label} ↗</span>
          <span className="sr-only">{`${label} — ${project.name}`}</span>
        </SmartLink>
      ))}
    </>
  );
}
