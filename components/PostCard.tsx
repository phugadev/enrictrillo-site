import Link from "next/link";
import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import type { PostMeta } from "@/lib/posts";
import { WavelengthDot } from "./ui/WavelengthDot";

/** How long a post keeps the "New" pill on the homepage teaser. */
const NEW_WINDOW_DAYS = 21;

function isRecent(iso: string): boolean {
  const ageMs = Date.now() - parseDate(iso).getTime();
  return ageMs < NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * The dotted leader between a row's title and its date — the device a
 * contents page or an index uses to carry the eye across a gap that would
 * otherwise be dead space. Lifted from desengs.com, where it is what makes
 * a wide list read as one horizontal line per item rather than as two
 * columns that happen to share a row.
 *
 * Empty and aria-hidden: it is a ruled line, not content. It sits on the
 * baseline for free — an empty inline-level flex item in a baseline row
 * aligns its bottom margin edge to the baseline, which is exactly where the
 * bottom border lands.
 */
function Leader() {
  return (
    <span
      aria-hidden="true"
      className="min-w-[1.5rem] flex-1 border-b border-dotted border-hairline-strong"
    />
  );
}

/**
 * A post in a list. Two shapes, and the difference is who is reading.
 *
 * `compact` (the homepage teaser) is band dot, title, leader and date —
 * nothing else. A reader
 * on the homepage has not decided to read anything yet — the list is an
 * activity signal, proof the work is ongoing, and an excerpt there competes
 * with the section that is actually meant to convert them.
 *
 * The full shape (/blog, band and series pages) keeps the excerpt, because a
 * reader who has arrived there is choosing *which* post, and these excerpts
 * make a claim rather than summarising — "the best feature I shipped this
 * year was one that sends fewer notifications" is the argument, and it is
 * what makes someone pick that post over the one above it. Sites that list
 * titles alone get away with it because their titles are reference labels
 * ("The Popover API"); these are argument titles, and an argument title
 * without its claim is just a headline.
 *
 * What the full shape dropped: the old metadata line ran wavelength · date ·
 * reading time · series as four mono fragments above the title, and it did
 * not parse at a glance — four values of equal weight, none of them the
 * thing you were scanning for. The band is now the coloured dot, the series
 * sits next to the date, and reading time is gone. It was never a reason to
 * click or not click.
 */
export function PostCard({
  post,
  showWavelength = true,
  as: Heading = "h2",
  compact = false,
}: {
  post: PostMeta;
  showWavelength?: boolean;
  /**
   * Defaults to h2 because on /blog and the band and series pages the card
   * title is the first thing under the page h1. The homepage passes h3, where
   * the "Latest writing" SectionLabel is already an h2.
   */
  as?: "h2" | "h3";
  /**
   * Single-line row (band dot + title + dotted leader + date) with the
   * excerpt and metadata line dropped. The leading mark used to be a framed
   * tile of four bars standing in for a page of text; it is now the same
   * 6px band dot the toolkit rows and the full card use, so one mark means
   * "this thing carries a wavelength" everywhere on the site instead of two
   * marks meaning it in two idioms. Hover does nothing to the row itself — no lift,
   * no background, no arrow appearing. The list handles it: `.rsk-focuslist`
   * dims every row you are not pointing at, which says "this one" by taking
   * attention off the others rather than by decorating the one under the
   * cursor. Three separate hover affordances on one row was two too many. Used on the homepage teaser, where
   * the excerpt is more of an activity signal than something a reader needs
   * to decide whether to click — unlike /blog and the wavelength/series
   * pages, which keep the full treatment. Picks up a "New" pill for posts
   * published within the last three weeks.
   */
  compact?: boolean;
}) {
  if (compact) {
    return (
      <Link href={`/blog/${post.slug}`} className="group flex items-baseline gap-3 py-2.5">
        <WavelengthDot wavelength={post.wavelength} className="translate-y-[-1px]" />
        <Heading className="flex min-w-0 items-baseline gap-2 font-display text-[16px] leading-snug text-paper">
          <span className="truncate">{post.title}</span>
          {isRecent(post.date) && (
            <span className="shrink-0 rounded-full bg-compute/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-compute-tint">
              New
            </span>
          )}
        </Heading>
        <Leader />
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-faint">
          {format(parseDate(post.date), "d MMM yyyy")}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group -mx-3 block rounded px-3 py-5 transition-colors hover:bg-surface"
    >
      <div className="flex items-baseline gap-3">
        <Heading className="flex min-w-0 items-baseline gap-3 font-display text-[17px] leading-snug text-paper transition-colors group-hover:text-white">
          {/* Hidden on the band pages: every post there is the same band,
              so the dot would repeat one colour down the page and mean
              nothing. */}
          {showWavelength && (
            <WavelengthDot wavelength={post.wavelength} className="translate-y-[-3px]" />
          )}
          <span>{post.title}</span>
        </Heading>
        <Leader />
        <span className="flex shrink-0 items-baseline gap-3 font-mono text-[11px] uppercase tracking-wider text-faint">
          {post.series && <span className="hidden sm:inline">{post.series}</span>}
          <span>{format(parseDate(post.date), "d MMM yyyy")}</span>
        </span>
      </div>
      <p
        className={`mt-1.5 max-w-prose text-[14px] leading-relaxed text-muted ${
          showWavelength ? "pl-[18px]" : ""
        }`}
      >
        {post.excerpt}
      </p>
    </Link>
  );
}
