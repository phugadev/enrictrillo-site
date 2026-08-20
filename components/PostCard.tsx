import Link from "next/link";
import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import type { PostMeta } from "@/lib/posts";
import { PostPreviewMark } from "./ui/PostPreviewMark";
import { WavelengthDot } from "./ui/WavelengthDot";

/** How long a post keeps the "New" pill on the homepage teaser. */
const NEW_WINDOW_DAYS = 21;

function isRecent(iso: string): boolean {
  const ageMs = Date.now() - parseDate(iso).getTime();
  return ageMs < NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * A post in a list. Two shapes, and the difference is who is reading.
 *
 * `compact` (the homepage teaser) is title and date, nothing else. A reader
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
   * Single-line row (preview mark + title + date) with the excerpt and
   * metadata line dropped. Hover does nothing to the row itself — no lift,
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
      <Link
        href={`/blog/${post.slug}`}
        className="group flex items-center justify-between gap-6 py-3"
      >
        <span className="flex min-w-0 items-center gap-3">
          <PostPreviewMark wavelength={post.wavelength} />
          <Heading className="flex min-w-0 items-center gap-2 font-display text-[16px] leading-snug text-paper">
            <span className="truncate">{post.title}</span>
            {isRecent(post.date) && (
              <span className="shrink-0 rounded-full bg-compute/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-compute-tint">
                New
              </span>
            )}
          </Heading>
        </span>
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
      <div className="flex items-baseline justify-between gap-6">
        <Heading className="flex min-w-0 items-baseline gap-3 font-display text-[17px] leading-snug text-paper transition-colors group-hover:text-white">
          {/* Hidden on the band pages: every post there is the same band,
              so the dot would repeat one colour down the page and mean
              nothing. */}
          {showWavelength && (
            <WavelengthDot wavelength={post.wavelength} className="translate-y-[-3px]" />
          )}
          <span>{post.title}</span>
        </Heading>
        <span className="flex shrink-0 items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-faint">
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
