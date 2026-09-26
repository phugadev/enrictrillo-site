import Link from "next/link";
import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import { getAllSeries, seriesSlug, type PostMeta } from "@/lib/posts";
import { site, wavelengths, wavelengthOrder, type Wavelength } from "@/lib/site";
import { band } from "@/lib/bands";

/**
 * The post header: a frame naming what the post belongs to (its series, or
 * its band) with a run showing its place, then the headline in the serif,
 * a one-line byline in the signal voice, and the excerpt as the lead.
 */

/**
 * Where a post sits in its series, as a human counts it: oldest is 1.
 *
 * Computed here rather than taken as a prop. The alternative was for
 * app/blog/[slug]/page.tsx to work it out and pass it down, which spreads one
 * component's data needs across two files and means every future caller has to
 * remember the incantation. This is a server component reading from the same
 * build-time memo the rest of the site uses, so the lookup is free.
 */
function seriesPosition(meta: PostMeta) {
  if (!meta.series) return undefined;
  const found = getAllSeries().find((s) => s.slug === seriesSlug(meta.series!));
  if (!found) return undefined;

  // getAllSeries returns newest first; a series is read in the order it was
  // written, so reverse before counting.
  const chronological = [...found.posts].reverse();
  const index = chronological.findIndex((p) => p.slug === meta.slug);
  if (index === -1) return undefined;

  return { name: found.name, slug: found.slug, index: index + 1, total: chronological.length };
}

/**
 * Band colour as *text*.
 *
 * The mark (`wavelengths[x].hex`) fails AA as type on the ink ground — the
 * tint ring exists precisely so a band can colour text. Written out rather
 * than built with a template string because Tailwind scans source for whole
 * class names and would find nothing in `text-${band}-tint`.
 */
function Sep() {
  return <span aria-hidden="true" className="text-faint">·</span>;
}

/**
 * The frame above the headline says what the post belongs to — its series,
 * or its band — with a run of segments showing where it sits: its place in
 * the series, or which of the four bands it is.
 */
function Frame({ href, name, position, run }: { href: string; name: string; position?: string; run: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-gutter rounded-panel border border-border bg-card px-gutter py-inset shadow-raised transition-colors duration-quick hover:border-gray-border-strong"
    >
      <span className="signal type-label-sm">
        <span className="text-foreground">{name}</span>
        {position && <span className="text-faint"> · {position}</span>}
      </span>
      {run}
    </Link>
  );
}

export function PostHeader({ meta }: { meta: PostMeta }) {
  const wl = wavelengths[meta.wavelength];
  const b = band[meta.wavelength];
  const read = meta.readingTime.replace(/\s*read$/i, "");
  const series = seriesPosition(meta);

  const segments = series
    ? Array.from({ length: series.total }, (_, i) => i === series.index - 1)
    : [...wavelengthOrder].reverse().map((w) => w === meta.wavelength);

  const run = (
    <span aria-hidden="true" className="flex shrink-0 items-center gap-1">
      {segments.map((lit, i) => (
        <span key={i} className={`h-0.5 w-5 rounded-full ${lit ? b.mark : "bg-gray-border-strong"}`} />
      ))}
    </span>
  );

  return (
    <header>
      {series ? (
        <Frame
          href={`/blog/series/${series.slug}`}
          name={series.name}
          position={`${series.index} of ${series.total}`}
          run={run}
        />
      ) : (
        <Frame href={`/blog/wavelength/${meta.wavelength}`} name={wl.label} run={run} />
      )}

      {/* The headline is the one place the serif speaks: a person, not the
          system. */}
      <h1 className="mt-stack text-balance font-serif text-[2.5rem] leading-[1.08] tracking-[-0.01em] text-foreground sm:text-[3.25rem]">
        {meta.title}
      </h1>

      <p className="signal mt-gutter flex flex-wrap items-center gap-x-inset gap-y-1 type-label-sm text-subtle-foreground">
        <span className="text-foreground">{site.name}</span>
        {series && (
          <>
            <Sep />
            <span className={b.tint}>{wl.label}</span>
          </>
        )}
        <Sep />
        <time dateTime={meta.date}>{format(parseDate(meta.date), "d MMM yyyy")}</time>
        <Sep />
        <span>{read}</span>
      </p>

      <p className="mt-stack max-w-prose text-pretty type-lead text-muted-foreground">{meta.excerpt}</p>
      <div className="mt-stack border-t border-border" />
    </header>
  );
}
