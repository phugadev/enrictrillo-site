import type { Project } from "@/lib/site";
import { getCaseStudyBySlug } from "@/lib/work";
import { TopicDot } from "./ui/TopicDot";
import { SmartLink } from "./ui/SmartLink";

/** Only link a case study that exists and is published; a typo in
    lib/site.ts fails the build rather than shipping a 404. */
function caseStudyHref(project: Project): string | undefined {
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

/** Where a row goes: the write-up if there is one, else the thing itself. */
export function projectHref(project: Project): string | undefined {
  return (
    caseStudyHref(project) ??
    project.specimen?.href ??
    project.links?.live ??
    project.links?.repo ??
    project.links?.npm
  );
}

/**
 * One project as one line: the band as a dot, the name, what it is in the
 * quiet grey, the year at the right edge. A list reads down the names and
 * down the years; nothing else competes.
 */
export function ProjectRow({ project }: { project: Project }) {
  const href = projectHref(project);
  const body = (
    <>
      <TopicDot topic={project.topic} className="translate-y-[-2px]" />
      <span className="min-w-0 flex-1 sm:truncate">
        <span className="text-foreground">{project.name}</span>
        <span className="text-subtle-foreground"> — {project.summary ?? project.description}</span>
      </span>
      <span className="shrink-0 type-body tabular-nums text-subtle-foreground">
        {project.status === "In build" ? "Building" : project.year}
      </span>
    </>
  );
  const row = "flex items-baseline gap-3 py-1.5";
  return (
    <li>
      {href ? (
        <SmartLink href={href} className={`${row} group -mx-2 rounded-control-sm px-2 transition-colors duration-quick hover:bg-gray-tint`}>
          {body}
        </SmartLink>
      ) : (
        <div className={row}>{body}</div>
      )}
    </li>
  );
}
