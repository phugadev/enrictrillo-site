import type { CaseStudyMeta } from "@/lib/work";
import { site, wavelengths } from "@/lib/site";
import { band } from "@/lib/bands";
import { Eyebrow } from "./layout";
import { SmartLink } from "./ui/SmartLink";

const LINK_ORDER = [
  { key: "live", label: "Live" },
  { key: "repo", label: "GitHub" },
  { key: "npm", label: "npm" },
] as const;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-gutter px-gutter py-inset sm:block sm:py-gutter">
      <dt className="signal type-label-xs text-faint">{label}</dt>
      <dd className="text-right type-body text-foreground sm:mt-1 sm:text-left">{children}</dd>
    </div>
  );
}

export function CaseStudyHeader({ meta }: { meta: CaseStudyMeta }) {
  const wl = wavelengths[meta.wavelength];
  const links = LINK_ORDER.filter(({ key }) => meta.links?.[key]);

  return (
    <header>
      <Eyebrow wavelength={meta.wavelength}>
        Case study · {wl.nm}nm {wl.label}
      </Eyebrow>
      <h1 className="mt-gutter text-balance type-title text-foreground sm:type-display">{meta.title}</h1>
      {meta.excerpt && (
        <p className="mt-gutter max-w-prose text-pretty type-lead text-muted-foreground">{meta.excerpt}</p>
      )}

      <dl className="mt-stack grid divide-y divide-border rounded-panel border border-border bg-card shadow-raised sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        <Row label="From">{site.name}</Row>
        <Row label="Year">
          <span className="figure">{meta.year}</span>
        </Row>
        <Row label="Band">
          <span className={band[meta.wavelength].tint}>{wl.label}</span>
        </Row>
        <Row label="Links">
          {links.length > 0 ? (
            <span className="flex flex-wrap justify-end gap-x-gutter sm:justify-start">
              {links.map(({ key, label }) => (
                <SmartLink
                  key={key}
                  href={meta.links![key]!}
                  className="underline decoration-faint decoration-1 underline-offset-4 transition-colors duration-quick hover:decoration-interface"
                >
                  {label} ↗
                </SmartLink>
              ))}
            </span>
          ) : (
            <span className="text-faint">—</span>
          )}
        </Row>
      </dl>
      {meta.stack && (
        <ul className="mt-gutter flex flex-wrap gap-1.5" aria-label="Stack">
          {meta.stack.map((item) => (
            <li key={item} className="figure rounded-chip border border-border px-2 py-0.5 type-caption-sm text-subtle-foreground">
              {item}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
