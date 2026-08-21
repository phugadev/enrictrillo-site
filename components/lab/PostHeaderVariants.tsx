import Link from "next/link";
import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import { type PostMeta } from "@/lib/posts";
import { wavelengths, wavelengthOrder, type Wavelength } from "@/lib/site";
import { Zigzag } from "@/components/ui/Zigzag";

/**
 * Candidate post headers B, C and D for /lab/post-header. Variant A is the
 * shipped `components/PostHeader.tsx`, imported unchanged so the comparison
 * has a real baseline rather than a re-typed approximation of one.
 *
 * These live under components/lab/ deliberately. Nothing here is wired into a
 * post page, and keeping them out of components/ proper means the folder that
 * holds the site's actual vocabulary doesn't quietly accumulate three rejected
 * spellings of the same block. When one wins it moves out and the other two
 * are deleted with this file.
 *
 * The rules they all obey, inherited from PostHeader: every field is real
 * frontmatter, nothing is invented for the sake of filling a row, and the
 * headline is the serif — which only resolves under data-voice="author" (see
 * the note at the top of app/globals.css).
 */

/**
 * Where a post sits in its series, as a human counts it: oldest is 1. The lab
 * page computes this because it has `getAllSeries()` at hand; the variants
 * stay presentational so swapping one in later is a props question, not a
 * data-fetching one.
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

/** The shared headline. Identical across B–D so the header is the only variable. */
function Headline({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-serif text-[36px] font-normal leading-[1.08] tracking-[-0.005em] text-paper sm:text-[46px]">
      {children}
    </h1>
  );
}

/** A separator dot for the dense one-line treatments. Never adjacent to a link. */
function Sep() {
  return <span className="text-faint/60">·</span>;
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

/* ------------------------------------------------------------------------ */

/**
 * VARIANT C — the post is an episode.
 *
 * Five of the seven published posts belong to a series. For those, the single
 * most useful thing the header can say is not the date and not the reading
 * time — it is "this is the first of three about a system I actually run, and
 * the other two are one click away." That is the fact that turns one page view
 * into a session, and A buries it as the fourth row of a table, styled
 * identically to the reading time.
 *
 * So the series gets a frame and a progress run: three segments, the one
 * you're reading lit in the band colour. Structure, so the frame is the 4px
 * near-square radius, not a pill — a pill here would read as a chip, i.e. a
 * filter you can toggle, which it isn't.
 *
 * The frame is a destination, not a button: the whole strip is the link, it is
 * underlined on its name, and it carries no chevron, no "View series →" affix
 * and no fill. Date and reading time survive as one quiet line beneath, which
 * is the priority order this variant is arguing for.
 *
 * Degrades honestly: with no series, the frame is simply absent and the
 * variant collapses to the quiet line plus the headline — which is variant D,
 * and is the strongest argument against C as a universal answer.
 */
export function PostHeaderC({
  meta,
  series,
}: {
  meta: PostMeta;
  series?: SeriesPosition;
}) {
  const wl = wavelengths[meta.wavelength];
  const read = meta.readingTime.replace(/\s*read$/i, "");

  return (
    <header>
      {series && (
        <Link
          href={`/blog/series/${series.slug}`}
          className="group flex items-center justify-between gap-4 rounded border border-hairline px-4 py-3 transition-colors hover:border-hairline-strong"
        >
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            <span className="text-paper underline decoration-hairline underline-offset-4 transition-colors group-hover:decoration-muted">
              {series.name}
            </span>{" "}
            <span className="text-faint">
              · {series.index} of {series.total}
            </span>
          </span>

          {/* The run. Segments rather than dots: a dot is a token (pill), a
              segment is a position on a track, and position is the thing
              being communicated. Hidden from assistive tech because the
              "1 of 3" beside it says the same in words. */}
          <span aria-hidden="true" className="flex shrink-0 items-center gap-1">
            {Array.from({ length: series.total }, (_, i) => (
              <span
                key={i}
                className={i === series.index - 1 ? "h-0.5 w-5" : "h-0.5 w-5 bg-hairline-strong"}
                style={i === series.index - 1 ? { backgroundColor: wl.hex } : undefined}
              />
            ))}
          </span>
        </Link>
      )}

      <p
        className={`flex flex-wrap items-center gap-x-2 font-mono text-[11px] uppercase tracking-wider text-faint ${
          series ? "mt-4" : ""
        }`}
      >
        <span className={BAND_TEXT[meta.wavelength]}>
          {wl.nm}nm {wl.label}
        </span>
        <Sep />
        <time dateTime={meta.date}>{format(parseDate(meta.date), "d MMM yyyy")}</time>
        <Sep />
        <span>{read}</span>
      </p>

      <div className="mt-7">
        <Headline>{meta.title}</Headline>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * VARIANT D — the headline is the writing, not the chrome.
 *
 * The argument here is about where the boundary goes. A draws its rule
 * *between* the metadata and the headline, which files the headline with the
 * article — correct — but then spends five labelled rows and about 120px of
 * vertical space before the reader reaches a single word the post is actually
 * about. On a phone the headline starts below the fold.
 *
 * D spends one line. Dot, band, date, minutes, series: everything A's table
 * carries, in the order a reader would ask for it, with no labels because
 * "4 Mar 2026" has never needed to be told it is a date. Then the headline,
 * immediately.
 *
 * The break then goes *below* the headline, as a centred zigzag, marking the
 * seam between the title and the body rather than between the chrome and the
 * title. That is the second claim: the rule in A is separating two things that
 * belong together.
 *
 * Cost, stated plainly: "From: Enric Trillo · London" disappears. A is a
 * letterhead and this is not — the byline moves to the footer's job. Worth
 * trialling because on a personal site under one person's name, a From line on
 * every post is restating the domain.
 */
export function PostHeaderD({
  meta,
  series,
}: {
  meta: PostMeta;
  series?: SeriesPosition;
}) {
  const wl = wavelengths[meta.wavelength];
  const read = meta.readingTime.replace(/\s*read$/i, "");

  return (
    <header>
      <p className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] uppercase tracking-wider text-muted">
        {/* The mark as a fill, at 6px — the one place the vivid band colour is
            allowed, and enough to carry the taxonomy without a nm figure. */}
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: wl.hex }}
        />
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
              {series.name}, {series.index} of {series.total}
            </Link>
          </>
        )}
      </p>

      <div className="mt-5">
        <Headline>{meta.title}</Headline>
      </div>

      <div className="mt-8 flex justify-center text-hairline-strong">
        <Zigzag />
      </div>
    </header>
  );
}
