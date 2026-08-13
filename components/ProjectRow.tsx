import Link from "next/link";
import type { CSSProperties } from "react";
import { wavelengths, type Project } from "@/lib/site";
import { getCaseStudyBySlug } from "@/lib/work";
import { SmartLink } from "./ui/SmartLink";
import { WavelengthDot } from "./ui/WavelengthDot";

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
  Shipped: "bg-systems/15 text-systems",
  "In build": "bg-compute/15 text-compute",
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
 * A project in Selected work — the section carrying the most persuasive
 * weight on the page, so it gets more presence than a plain text row: each
 * project sits in its own raised `bg-surface` panel (the same treatment
 * MdxComponents already uses for callouts) rather than blending into the
 * hairline-divided rows used everywhere else on the homepage. Stack chips
 * reuse Toolkit's exact chip styling — same hover-to-band-colour behaviour —
 * so Work and Toolkit read as two views of one system instead of two
 * unrelated components.
 *
 * The name is plain text and the chips carry every destination — see the
 * original note this replaced: linking the name too would mean two tab stops
 * on the same URL while a project has one link, and an arbitrary choice of
 * target once it has three. A case study, when one exists, is the strongest
 * piece of proof here, so it's the one bordered pill (echoing the hero's
 * email CTA) rather than an underlined text link like the rest.
 */
export function ProjectRow({ project }: { project: Project }) {
  const links = LINK_ORDER.filter(({ key }) => project.links?.[key]);
  const caseStudyHref = resolveCaseStudyHref(project);
  const wl = wavelengths[project.wavelength];

  return (
    <li className="rounded-xl bg-surface p-6">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <WavelengthDot wavelength={project.wavelength} />
          <h3 className="font-display text-[20px] text-paper">{project.name}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STATUS_STYLE[project.status]}`}
          >
            {project.status}
          </span>
          <span className="font-mono text-[11px] text-faint">{project.year}</span>
        </div>
      </div>

      <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-muted">{project.description}</p>

      {project.stack && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-hairline px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-[var(--chip)] hover:text-[var(--chip)]"
              style={{ "--chip": wl.hex } as CSSProperties}
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {project.metrics?.length ? (
        <p className="mt-4 font-mono text-[12px] text-muted">
          {project.metrics.map((metric, i) => (
            <span key={metric}>
              {i > 0 ? <span className="text-faint">  ·  </span> : null}
              <Metric text={metric} hex={wl.hex} />
            </span>
          ))}
        </p>
      ) : null}

      {(links.length > 0 || caseStudyHref) && (
        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-hairline pt-5">
          {caseStudyHref && (
            <Link
              href={caseStudyHref}
              className="rounded-full border border-hairline px-4 py-2 font-mono text-[12px] text-paper transition-colors hover:border-paper"
            >
              Case study →
            </Link>
          )}
          {links.map(({ key, label }) => (
            <SmartLink
              key={key}
              href={project.links![key]!}
              // "Live" repeated down the list is ambiguous out of context, so
              // the accessible name carries the project too.
              className="font-mono text-[12px] text-faint underline decoration-hairline underline-offset-4 transition-colors hover:text-paper hover:decoration-muted"
            >
              <span aria-hidden="true">{label} ↗</span>
              <span className="sr-only">{`${label} — ${project.name}`}</span>
            </SmartLink>
          ))}
        </div>
      )}
    </li>
  );
}
