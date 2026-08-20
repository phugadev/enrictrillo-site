import Link from "next/link";
import type { ReactNode } from "react";
import { wavelengths, type Project } from "@/lib/site";
import { Hatch } from "@/components/ui/Hatch";
import { SmartLink } from "@/components/ui/SmartLink";

/**
 * Scratch — variants of Selected work, for comparison at /lab/work.
 * Not part of the site. Delete this file and app/lab/ once a call is made.
 */

const STATUS_STYLE: Record<Project["status"], string> = {
  Shipped: "bg-systems/15 text-systems-tint",
  "In build": "bg-compute/15 text-compute-tint",
  Archived: "bg-hairline/60 text-faint",
};

const LINK_ORDER = [
  { key: "live", label: "Live" },
  { key: "repo", label: "GitHub" },
  { key: "npm", label: "npm" },
] as const;

function LinkList({ project }: { project: Project }) {
  return (
    <>
      {LINK_ORDER.filter(({ key }) => project.links?.[key]).map(({ key, label }) => (
        <SmartLink
          key={key}
          href={project.links![key]!}
          className="font-mono text-[11px] text-faint underline decoration-hairline underline-offset-4 transition-colors hover:text-paper hover:decoration-muted"
        >
          <span aria-hidden="true">{label} ↗</span>
          <span className="sr-only">{`${label} — ${project.name}`}</span>
        </SmartLink>
      ))}
    </>
  );
}

function CaseStudyLink({ project }: { project: Project }) {
  if (!project.caseStudySlug) return null;
  return (
    <Link
      href={`/work/${project.caseStudySlug}`}
      className="rounded border border-hairline px-3 py-1.5 font-mono text-[11px] text-paper transition-colors hover:border-paper"
    >
      Case study →
    </Link>
  );
}

/* ─── B · Instrument spec plate ─────────────────────────────────────────── */

function SpecField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 py-1">
      <dt className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-wider text-faint">
        {label}
      </dt>
      <dd className="min-w-0 font-mono text-[11px] text-muted">{children}</dd>
    </div>
  );
}

export function SpecPlate({ project }: { project: Project }) {
  const wl = wavelengths[project.wavelength];

  return (
    <li className="overflow-hidden rounded-lg border border-hairline bg-surface">
      <div className="flex items-baseline justify-between gap-4 px-5 py-3">
        <h3 className="font-mono text-[13px] uppercase tracking-wider text-paper">
          {project.name}
        </h3>
        <span className="font-mono text-[11px] text-faint">{project.year}</span>
      </div>

      <Hatch />

      <dl className="px-5 py-4">
        <SpecField label="Band">
          <span style={{ color: wl.hex }}>
            {wl.nm}nm {wl.label}
          </span>
        </SpecField>
        <SpecField label="Status">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_STYLE[project.status]}`}
          >
            {project.status}
          </span>
        </SpecField>
        <SpecField label="Stack">{project.stack?.join(" · ") ?? "—"}</SpecField>
      </dl>

      <div className="border-t border-hairline px-5 py-4">
        <p className="text-[14px] leading-relaxed text-muted">{project.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <CaseStudyLink project={project} />
          <LinkList project={project} />
        </div>
      </div>
    </li>
  );
}

/* ─── C · Lead project, then thin rows ──────────────────────────────────── */

export function LeadProject({ project }: { project: Project }) {
  const wl = wavelengths[project.wavelength];

  return (
    <div className="relative overflow-hidden rounded-lg bg-surface p-6">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: wl.hex }}
      />
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: wl.hex }}>
          {wl.nm}nm {wl.label}
        </span>
        <span className="font-mono text-[11px] text-faint">{project.year}</span>
      </div>

      <h3 className="mt-3 font-display text-[28px] leading-tight text-paper">{project.name}</h3>
      <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-muted">{project.description}</p>

      {project.stack && (
        <p className="mt-3 font-mono text-[11px] text-faint">{project.stack.join(" · ")}</p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <span
          className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STATUS_STYLE[project.status]}`}
        >
          {project.status}
        </span>
        <CaseStudyLink project={project} />
        <LinkList project={project} />
      </div>
    </div>
  );
}

export function ThinRow({ project }: { project: Project }) {
  const wl = wavelengths[project.wavelength];

  return (
    <li className="border-b border-hairline">
      <div className="group -mx-3 flex items-baseline gap-4 rounded px-3 py-3.5 transition-colors hover:bg-surface">
        <span className="w-10 shrink-0 font-mono text-[11px] uppercase tracking-wider text-faint">
          {project.year}
        </span>
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 translate-y-[-2px] rounded-full"
          style={{ backgroundColor: wl.hex }}
        />
        <span className="min-w-0 flex-1 text-[15px] text-muted">
          <span className="mr-2 font-display text-[16px] text-paper">{project.name}</span>
          {project.description}
        </span>
        <span className="shrink-0">
          <LinkList project={project} />
        </span>
      </div>
    </li>
  );
}
