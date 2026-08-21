import Link from "next/link";
import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import { getAllSeries, seriesSlug, type PostMeta } from "@/lib/posts";
import { site, wavelengths, wavelengthOrder, type Wavelength } from "@/lib/site";
import { Avatar } from "@/components/Avatar";
import { Zigzag } from "@/components/ui/Zigzag";

/**
 * The post header: an episode frame, a byline, the headline, then the break.
 *
 * This is the D/C hybrid settled on /lab/post-header, and the reasoning is
 * worth keeping because the two variants it resolves were arguing about
 * different things and both were right.
 *
 * What it replaced: a five-row mono label/value table (From / Date /
 * Wavelength / Series / Read) closed by a rule, with the headline underneath.
 * It read as an instrument, which was the point, but it spent about 120px
 * before the reader reached a single word the post was about — on a phone the
 * headline started below the fold — and it filed the series fourth, styled
 * identically to the reading time.
 *
 * D's claim, which stands and is the spine of this component: the chrome above
 * the headline collapses to ONE line, the headline arrives early, and the
 * break moves BELOW the headline. The old rule sat between the metadata and
 * the title, which separates two things that belong together; the seam worth
 * marking is between the title and the body. Hence the zigzag at the bottom
 * rather than a rule at the top — see components/ui/Zigzag.tsx for why that
 * mark and not Hatch.
 *
 * C's claim, folded back in: for a post inside a body of work, "first of three
 * about a system I actually run" is the single most useful thing the header
 * can say. It is what turns one page view into a session, and D had demoted it
 * to the tail of a dense line where it read as another field. So it gets a
 * frame and a progress run, above the byline.
 *
 * The objection that killed C as a default was the seriesless post: C simply
 * dropped the frame, so two of the seven published posts fell back to a header
 * that looked like something had failed to load. The fix here is that the
 * frame is not a *series* frame — it is a MEMBERSHIP frame. Every post belongs
 * to something on this site: a series if it has one, and a wavelength band
 * always. So the seriesless case fills the same frame with the band and its
 * position among the four, at the same size, in the same position, linking to
 * the same kind of destination. Nothing is missing, because the frame was never
 * promised to the series in the first place.
 *
 * The byline is the other thing D lost and Enric wanted back. It is a byline,
 * not a letterhead row: name and portrait leading one quiet line, the way a
 * byline has always been set, rather than a labelled "From" field in a
 * revived table.
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
const BAND_TEXT: Record<Wavelength, string> = {
  interface: "text-interface-tint",
  systems: "text-systems-tint",
  compute: "text-compute-tint",
  intelligence: "text-intelligence-tint",
};

/** The same four, as fills. The lit segment of the run is seen, not read, so
 *  it takes the vivid mark rather than the pulled-back tint. */
const BAND_MARK: Record<Wavelength, string> = {
  interface: "bg-interface",
  systems: "bg-systems",
  compute: "bg-compute",
  intelligence: "bg-intelligence",
};

/** A separator dot for the byline. Never adjacent to a link. */
function Sep() {
  return <span className="text-faint/60">·</span>;
}

/**
 * The membership frame. Structure, so `rounded` — the 4px near-square, not a
 * pill: a pill here would read as a chip, i.e. a filter you can toggle, which
 * it isn't. And a destination rather than a button: the whole strip is the
 * link, the name carries the underline, and there is no chevron, no fill and
 * no "View series →" affix.
 */
function Frame({
  href,
  name,
  position,
  run,
}: {
  href: string;
  name: string;
  position: string;
  run: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded border border-hairline px-4 py-2.5 transition-colors hover:border-hairline-strong"
    >
      <span className="font-mono text-[11px] uppercase tracking-wider">
        <span className="text-paper underline decoration-hairline underline-offset-4 transition-colors group-hover:decoration-muted">
          {name}
        </span>{" "}
        <span className="text-faint">· {position}</span>
      </span>
      {run}
    </Link>
  );
}

export function PostHeader({ meta }: { meta: PostMeta }) {
  const wl = wavelengths[meta.wavelength];
  const read = meta.readingTime.replace(/\s*read$/i, "");
  const series = seriesPosition(meta);

  /**
   * The run: which one of a set you are in.
   *
   * Segments rather than dots — a dot is a token (pill), a segment is a
   * position on a track, and position is the thing being communicated. Hidden
   * from assistive tech in both cases because the words beside it ("1 of 3",
   * "520nm") already say it.
   *
   * The seriesless run is the same drawing with a different set: the four
   * bands, ascending nm left to right — the same order and the same convention
   * as `bandGradient` and the Spectrometer, because a calibrated instrument
   * that disagrees with the site's other calibrated instrument is worse than
   * no instrument.
   *
   * It was briefly drawn as B's tick scale instead, ticks of two heights, so
   * that the reading wouldn't depend on colour alone. At the size the frame
   * gives it that turned into four hairline slivers in the corner that read as
   * a rendering artefact rather than an instrument — B can afford that
   * apparatus because it spends the full measure on it. Matching the segment
   * form is also the better argument: both runs say "which one of a set you
   * are in", and drawing the same statement two different ways inside the same
   * strip would be claiming they are different statements.
   */
  const segments = series
    ? Array.from({ length: series.total }, (_, i) => i === series.index - 1)
    : [...wavelengthOrder].reverse().map((band) => band === meta.wavelength);

  const run = (
    <span aria-hidden="true" className="flex shrink-0 items-center gap-1">
      {segments.map((lit, i) => (
        <span
          key={i}
          className={`h-0.5 w-5 ${lit ? BAND_MARK[meta.wavelength] : "bg-hairline-strong"}`}
        />
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
        <Frame
          href={`/blog/wavelength/${meta.wavelength}`}
          name={wl.label}
          position={`${wl.nm}nm`}
          run={run}
        />
      )}

      {/*
        The byline, and everything else, in one line — D's whole argument. No
        labels, because "4 Mar 2026" has never needed to be told it is a date.

        The name leads, which is what makes it read as a byline rather than as
        a fifth field; the portrait is the site's existing Avatar at byline
        size, and it is the reason this line cannot be mistaken for chrome. The
        band label keeps its colour but loses the 6px dot it carried in D: with
        a round portrait already at the head of the line, a second small disc
        two words later is clutter, and the vivid band colour is not lost —
        it is up in the run, at the strength it is meant to be seen at.

        When the post has no series the band is already named in the frame
        above, so it drops out of this line rather than being said twice.
      */}
      <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-muted">
        <span className="flex items-center gap-2">
          {/* The portrait is hidden from assistive tech: its alt text is the
              name and role, and the name is right beside it in real type. */}
          <span aria-hidden="true" className="flex">
            <Avatar size={18} />
          </span>
          <span className="text-paper">{site.name}</span>
        </span>
        {series && (
          <>
            <Sep />
            <span className={BAND_TEXT[meta.wavelength]}>{wl.label}</span>
          </>
        )}
        <Sep />
        <time dateTime={meta.date}>{format(parseDate(meta.date), "d MMM yyyy")}</time>
        <Sep />
        <span>{read}</span>
      </p>

      <h1 className="mt-5 font-serif text-[36px] font-normal leading-[1.08] tracking-[-0.005em] text-paper sm:text-[46px]">
        {meta.title}
      </h1>

      {/* The break, below the headline rather than above it. */}
      <div className="mt-8 flex justify-center text-hairline-strong">
        <Zigzag />
      </div>
    </header>
  );
}
