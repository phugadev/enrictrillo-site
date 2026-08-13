import type { Project } from "@/lib/site";
import { SmartLink } from "./ui/SmartLink";
import { WavelengthDot } from "./ui/WavelengthDot";

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
 * A row in Selected work.
 *
 * The row is deliberately not one big link any more. It used to be, which
 * forced every project to have exactly one destination — Watchman pointed at
 * /blog because it had nowhere better to go.
 *
 * The name is plain text and the chips carry every destination. Linking the
 * name as well would mean two tab stops on the same URL while a project has
 * one link, and an arbitrary choice of target once it has three.
 */
export function ProjectRow({ project }: { project: Project }) {
  const links = LINK_ORDER.filter(({ key }) => project.links?.[key]);

  return (
    <li className="py-5">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <WavelengthDot wavelength={project.wavelength} />
            <h3 className="font-display text-[17px] text-paper">{project.name}</h3>
          </div>

          <p className="mt-1.5 max-w-md text-[14px] leading-relaxed text-muted">
            {project.description}
          </p>

          {project.stack && (
            <p className="mt-2.5 font-mono text-[11px] tracking-wide text-faint">
              {project.stack.join(" · ")}
            </p>
          )}
        </div>

        <span className="shrink-0 text-right font-mono text-[11px] uppercase tracking-wider text-faint">
          <span className="block text-muted">{project.status}</span>
          <span className="block">{project.year}</span>
        </span>
      </div>

      {(project.metrics?.length || links.length > 0) && (
        // Left-aligned with the description rather than justified apart: a
        // project with links but no metrics would otherwise strand a single
        // chip against the right edge with a void beside it.
        <div className="mt-3.5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px]">
          {/* Numbers lead — they're the part that actually persuades. */}
          {project.metrics?.length ? <p className="text-muted">{project.metrics.join("  ·  ")}</p> : null}

          <div className="flex flex-wrap gap-4">
            {links.map(({ key, label }) => (
              <SmartLink
                key={key}
                href={project.links![key]!}
                // "Live" repeated down the list is ambiguous out of context, so
                // the accessible name carries the project too.
                className="text-faint underline decoration-hairline underline-offset-4 transition-colors hover:text-paper hover:decoration-muted"
              >
                <span aria-hidden="true">{label} ↗</span>
                <span className="sr-only">{`${label} — ${project.name}`}</span>
              </SmartLink>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}
