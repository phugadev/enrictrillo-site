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

/* ─── D · Catalogue entry ───────────────────────────────────────────────── */

/**
 * C's composition, B's structural language, A's content hierarchy — an entry
 * in a catalogue of engineering artifacts rather than a card in a gallery.
 *
 * The hatch does structural work here instead of decorative: everything above
 * it describes the artifact, everything below it is how you reach it. Same
 * rule in every entry, so the section reads as one system.
 *
 * Destinations are endpoints, not buttons — a label in the site's own
 * vocabulary (SOURCE, not GitHub) with its actual address underneath, the way
 * documentation lists one.
 */
const ENDPOINT_ORDER = [
  { key: "live", label: "Live" },
  { key: "repo", label: "Source" },
  { key: "npm", label: "Package" },
] as const;

/** github.com/phugadev/watchman — the address, minus the ceremony. */
function address(href: string) {
  return href.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

function Endpoint({ label, href, children }: { label: string; href: string; children?: never }) {
  return (
    <SmartLink
      href={href}
      className="group/ep block min-w-[13rem] max-w-full border-t border-hairline pt-2 transition-colors hover:border-paper"
    >
      <span className="block font-mono text-[11px] uppercase tracking-wider text-paper">
        {label} <span aria-hidden="true">↗</span>
      </span>
      <span className="mt-0.5 block truncate font-mono text-[10px] text-faint transition-colors group-hover/ep:text-muted">
        {address(href)}
      </span>
    </SmartLink>
  );
}

export function CatalogueEntry({ project, index }: { project: Project; index: number }) {
  const wl = wavelengths[project.wavelength];
  const endpoints = ENDPOINT_ORDER.filter(({ key }) => project.links?.[key]);

  return (
    <li className="py-10 first:pt-0">
      <div className="flex gap-5 sm:gap-8">
        <span className="w-6 shrink-0 pt-1 font-mono text-[11px] text-faint">
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

          <div className="mt-1.5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-faint">
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                  project.status === "Shipped"
                    ? "bg-systems"
                    : project.status === "In build"
                      ? "bg-compute"
                      : "bg-faint"
                }`}
              />
              {project.status}
            </span>
            <span>{project.year}</span>
          </div>

          <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-muted">
            {project.description}
          </p>

          {project.stack && (
            <p className="mt-3 font-mono text-[11px] text-faint">{project.stack.join(" · ")}</p>
          )}

          <Hatch className="my-6" />

          {/* Flex-wrap, not a fixed grid: a third of the measure is too
              narrow for an npm address, and a grid would also leave empty
              columns on entries with one endpoint. */}
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {project.caseStudySlug && (
              <SmartLink
                href={`/work/${project.caseStudySlug}`}
                className="group/ep block min-w-[13rem] max-w-full border-t border-paper/40 pt-2 transition-colors hover:border-paper"
              >
                <span className="block font-mono text-[11px] uppercase tracking-wider text-paper">
                  Case study <span aria-hidden="true">→</span>
                </span>
                <span className="mt-0.5 block truncate font-mono text-[10px] text-faint transition-colors group-hover/ep:text-muted">
                  /work/{project.caseStudySlug}
                </span>
              </SmartLink>
            )}
            {endpoints.map(({ key, label }) => (
              <Endpoint key={key} label={label} href={project.links![key]!} />
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}
