import Link from "next/link";
import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import { seriesSlug, type PostMeta } from "@/lib/posts";
import { site, wavelengths, wavelengthOrder, type Wavelength } from "@/lib/site";

/**
 * Variant B for /lab/post-header — the one candidate still open.
 *
 * The lab page originally carried four treatments. A is the old letterhead,
 * still imported there from git history's shipped component so the comparison
 * keeps a real baseline. C and D are gone from this file: they were both
 * right about different things and have been resolved into the shipped
 * `components/PostHeader.tsx` — D's single line and late break, C's episode
 * frame — so keeping standalone copies here would leave two stale spellings
 * of a block that now exists for real.
 *
 * B is a different argument entirely and has not been ruled out, which is why
 * it survives: it says the band should be *seen* before it is read, and buys
 * that with an apparatus the shipped header spends only a few pixels on.
 *
 * The rules it obeys, inherited from PostHeader: every field is real
 * frontmatter, nothing is invented for the sake of filling a row, and the
 * headline is the serif — which only resolves under data-voice="author" (see
 * the note at the top of app/globals.css).
 */

/**
 * Where a post sits in its series, as a human counts it: oldest is 1. The lab
 * page computes this because it has `getAllSeries()` at hand, and B stays
 * presentational. The shipped header took the opposite route once it stopped
 * being a candidate — it derives this itself, so a post page doesn't have to
 * know how a series is counted.
 */
export type SeriesPosition = {
  name: string;
  slug: string;
  index: number;
  total: number;
};

/**
 * Band colour as *text*.
 *
 * The mark (`wavelengths[x].hex`, what `WavelengthDot` fills with) fails AA as
 * type on the ink ground — the tint ring exists precisely so a band can colour
 * text. These are written out rather than built with a template string because
 * Tailwind scans source for whole class names and would find nothing in
 * `text-${band}-tint`.
 */
const BAND_TEXT: Record<Wavelength, string> = {
  interface: "text-interface-tint",
  systems: "text-systems-tint",
  compute: "text-compute-tint",
  intelligence: "text-intelligence-tint",
};

/** The headline, matching the shipped one exactly so the header above it is
 *  the only variable in the comparison. */
function Headline({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-serif text-[36px] font-normal leading-[1.08] tracking-[-0.005em] text-paper sm:text-[46px]">
      {children}
    </h1>
  );
}

/** A separator dot for the dense one-line treatment. Never adjacent to a link. */
function Sep() {
  return <span className="text-faint/60">·</span>;
}

/* ------------------------------------------------------------------------ */

/**
 * VARIANT A — the letterhead. What shipped before the hybrid.
 *
 * This used to be `components/PostHeader.tsx` itself, and the lab page
 * imported it from there so the baseline could not drift. Now that the file
 * holds the hybrid, A moves in here rather than disappearing: a comparison
 * whose baseline is only describable in prose is not a comparison. It is
 * copied verbatim, down to the "London" trim, so what the page shows is what
 * actually shipped rather than a tidied memory of it.
 *
 * The argument it made: a post is an entry in a log. A fixed mono label
 * column, aligned values, closed by a hairline rule. Its strength is that it
 * is unmistakably not a template and it reads as an instrument. Its costs —
 * the ones the hybrid was built to pay off — are that the band is a coloured
 * row among five, the series is styled identically to the reading time, and
 * the headline starts roughly 120px down the page.
 */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-faint">{label}</dt>
      <dd className="text-muted">{children}</dd>
    </>
  );
}

export function PostHeaderA({ meta }: { meta: PostMeta }) {
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

      <h1 className="mt-8 font-serif text-[36px] font-normal leading-[1.08] tracking-[-0.005em] text-paper sm:text-[46px]">
        {meta.title}
      </h1>
    </header>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * VARIANT B — the spectrum, not the swatch.
 *
 * A: the band is one labelled row among five, and its colour is a decoration
 * on that row. The taxonomy is *stated*. But a reader arriving from a search
 * result has never seen the spectrometer on the homepage, so "520nm · Systems"
 * is a fact about a system they cannot see, and the colour tells them nothing
 * because there is nothing to compare it against.
 *
 * So draw the scale. Four ticks at the four bands, ascending nm left to right
 * — the same order and the same centre-of-column convention as `bandGradient`
 * and the Spectrometer, because a calibrated instrument that disagrees with
 * the site's other calibrated instrument is worse than no instrument. The
 * post's band is lit; the other three are present and dim. One glance says
 * "this is a taxonomy of four, and you are standing in the second one."
 *
 * Everything else compresses to a single mono line. Once the band has its own
 * apparatus, From/Date/Read as a labelled table is three rows of scaffolding
 * around nine words.
 */
export function PostHeaderB({
  meta,
  series,
}: {
  meta: PostMeta;
  series?: SeriesPosition;
}) {
  const wl = wavelengths[meta.wavelength];
  const read = meta.readingTime.replace(/\s*read$/i, "");
  // Ascending nm left to right, like a real spectrometer readout.
  const bands = [...wavelengthOrder].reverse();

  return (
    <header>
      <div aria-hidden="true" className="flex items-end">
        {bands.map((band) => {
          const active = band === meta.wavelength;
          const w = wavelengths[band];
          return (
            <div key={band} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className="font-mono text-[10px] uppercase tracking-wider transition-colors"
                // The inactive labels are faint, not invisible: the point of
                // the scale is that the reader can see the options they are
                // not in.
                style={active ? { color: w.hex } : undefined}
              >
                <span className={active ? "" : "text-faint/70"}>{w.nm}</span>
              </span>
              {/* Tick. Structure, so it takes the mark rather than the tint —
                  and the active one is twice the height, which is what
                  actually carries the reading at a glance. Colour alone
                  would be the only signal for a reader who can't see it. */}
              <span
                className={active ? "w-px" : "w-px bg-hairline-strong"}
                style={{
                  height: active ? 14 : 6,
                  ...(active ? { backgroundColor: w.hex } : {}),
                }}
              />
            </div>
          );
        })}
      </div>

      {/* The baseline the ticks sit on — the scale's own rule, which is also
          the boundary between chrome and writing. One line doing two jobs. */}
      <hr className="border-hairline" />

      <p className="mt-5 flex flex-wrap items-center gap-x-2 font-mono text-[11px] uppercase tracking-wider text-muted">
        <span className={BAND_TEXT[meta.wavelength]}>{wl.label}</span>
        <Sep />
        <time dateTime={meta.date}>{format(parseDate(meta.date), "d MMM yyyy")}</time>
        <Sep />
        <span>{read}</span>
        {series && (
          <>
            <Sep />
            <Link
              href={`/blog/series/${series.slug}`}
              className="underline decoration-hairline underline-offset-4 transition-colors hover:text-paper hover:decoration-muted"
            >
              {series.name} {series.index}/{series.total}
            </Link>
          </>
        )}
      </p>

      <div className="mt-6">
        <Headline>{meta.title}</Headline>
      </div>
    </header>
  );
}
