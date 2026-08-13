import Link from "next/link";
import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import { seriesSlug, type PostMeta } from "@/lib/posts";
import { site, wavelengths } from "@/lib/site";

/**
 * Instrument-readout header: a fixed mono label column with aligned values,
 * closed by a hairline rule. Every field is real frontmatter — the readout
 * reinforces the dispersion/wavelength metaphor rather than dressing the post
 * up as something it isn't.
 */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-faint">{label}</dt>
      <dd className="text-muted">{children}</dd>
    </>
  );
}

export function PostHeader({ meta }: { meta: PostMeta }) {
  const wl = wavelengths[meta.wavelength];
  const read = meta.readingTime.replace(/\s*read$/i, "");
  // "London, UK" → "London"; the country is redundant next to the name here.
  const city = site.location.split(",")[0].trim();

  return (
    <header>
      <dl className="grid grid-cols-[6.5rem_1fr] gap-y-1.5 font-mono text-[11px] uppercase tracking-wider">
        <Row label="From">
          {site.name} · {city}
        </Row>
        <Row label="Date">
          <time dateTime={meta.date}>{format(parseDate(meta.date), "EEE, dd MMM yyyy")}</time>
        </Row>
        <Row label="Wavelength">
          <span style={{ color: wl.hex }}>
            {wl.nm}nm · {wl.label}
          </span>
        </Row>
        {meta.series && (
          <Row label="Series">
            <Link
              href={`/blog/series/${seriesSlug(meta.series)}`}
              className="underline decoration-hairline underline-offset-4 transition-colors hover:text-paper hover:decoration-muted"
            >
              {meta.series}
            </Link>
          </Row>
        )}
        <Row label="Read">{read}</Row>
      </dl>

      <hr className="mt-5 border-hairline" />

      <h1 className="mt-8 font-display text-[32px] font-medium leading-tight tracking-tight text-paper sm:text-[38px]">
        {meta.title}
      </h1>
    </header>
  );
}
