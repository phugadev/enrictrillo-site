import type { CaseStudyMeta } from "@/lib/work";
import { site, wavelengths } from "@/lib/site";
import { SmartLink } from "./ui/SmartLink";

/**
 * Instrument-readout header for a case study, mirroring PostHeader's mono
 * label/value grid — same dispersion metaphor, different fields. A post reads
 * as an entry in a log (From/Date/Wavelength/Read); a case study reads as a
 * specimen on the bench (Wavelength/Year/Stack/Links).
 */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-faint">{label}</dt>
      <dd className="text-muted">{children}</dd>
    </>
  );
}

const LINK_ORDER = [
  { key: "live", label: "Live" },
  { key: "repo", label: "GitHub" },
  { key: "npm", label: "npm" },
] as const;

export function CaseStudyHeader({ meta }: { meta: CaseStudyMeta }) {
  const wl = wavelengths[meta.wavelength];
  const links = LINK_ORDER.filter(({ key }) => meta.links?.[key]);

  return (
    <header>
      <dl className="grid grid-cols-[6.5rem_1fr] gap-y-1.5 font-mono text-[11px] uppercase tracking-wider">
        <Row label="From">{site.name}</Row>
        <Row label="Wavelength">
          <span style={{ color: wl.hex }}>
            {wl.nm}nm · {wl.label}
          </span>
        </Row>
        <Row label="Year">{meta.year}</Row>
        {meta.stack && <Row label="Stack">{meta.stack.join(" · ")}</Row>}
        {links.length > 0 && (
          <Row label="Links">
            <span className="flex flex-wrap gap-4 normal-case tracking-normal">
              {links.map(({ key, label }) => (
                <SmartLink
                  key={key}
                  href={meta.links![key]!}
                  className="text-muted underline decoration-hairline underline-offset-4 transition-colors hover:text-paper hover:decoration-muted"
                >
                  {label} ↗
                </SmartLink>
              ))}
            </span>
          </Row>
        )}
      </dl>

      <hr className="mt-5 border-hairline" />

      <h1 className="mt-8 font-display text-[32px] font-medium leading-tight tracking-tight text-paper sm:text-[38px]">
        {meta.title}
      </h1>
    </header>
  );
}
