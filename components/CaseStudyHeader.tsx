import type { CaseStudyMeta } from "@/lib/work";
import { topics } from "@/lib/site";
import { SmartLink } from "./ui/SmartLink";
import { TopicDot } from "./ui/TopicDot";

const LINK_ORDER = [
  { key: "live", label: "Live" },
  { key: "repo", label: "Source" },
  { key: "npm", label: "Package" },
] as const;

/** A case study's header: where it sits and where to find it, in one grey line. */
export function CaseStudyHeader({ meta }: { meta: CaseStudyMeta }) {
  const wl = topics[meta.topic];
  const links = LINK_ORDER.filter(({ key }) => meta.links?.[key]);

  return (
    <header>
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 type-body text-subtle-foreground">
        <TopicDot topic={meta.topic} />
        <span>{wl.label}</span>
        <span aria-hidden="true">·</span>
        <span className="tabular-nums">{meta.year}</span>
        {links.map(({ key, label }) => (
          <span key={key} className="contents">
            <span aria-hidden="true">·</span>
            <SmartLink href={meta.links![key]!} className="transition-colors duration-quick hover:text-foreground">
              {label} ↗
            </SmartLink>
          </span>
        ))}
      </p>
      <h1 className="mt-gutter text-balance type-heading text-foreground">{meta.title}</h1>
      {meta.excerpt && <p className="mt-inset type-body text-muted-foreground">{meta.excerpt}</p>}
    </header>
  );
}
