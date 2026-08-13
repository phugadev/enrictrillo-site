import Link from "next/link";
import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import type { PostMeta } from "@/lib/posts";
import { wavelengths } from "@/lib/site";
import { WavelengthDot } from "./ui/WavelengthDot";
import { WavelengthSpine } from "./ui/WavelengthSpine";

/** How long a post keeps the "New" pill on the homepage teaser. */
const NEW_WINDOW_DAYS = 21;

function isRecent(iso: string): boolean {
  const ageMs = Date.now() - parseDate(iso).getTime();
  return ageMs < NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * `showWavelength` is off in grouped views (the blog index), where the band
 * heading directly above already names the wavelength.
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
   * Single-line row (dot + title + date, matching Credentials' rhythm)
   * with the excerpt and metadata line dropped. Used on the homepage
   * teaser, where the excerpt is more of an activity signal than something
   * a reader needs to decide whether to click — unlike /blog and the
   * wavelength/series pages, which keep the full treatment. Picks up a
   * "New" pill for posts published within the last three weeks.
   */
  compact?: boolean;
}) {
  const wl = wavelengths[post.wavelength];

  if (compact) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group flex items-baseline justify-between gap-6 py-4"
      >
        <span className="flex min-w-0 items-baseline gap-2.5">
          <WavelengthDot wavelength={post.wavelength} className="translate-y-[-2px]" />
          <Heading className="font-display text-[16px] leading-snug text-paper transition-colors group-hover:text-white">
            {post.title}
          </Heading>
          {isRecent(post.date) && (
            <span className="shrink-0 translate-y-[-1px] rounded-full bg-hairline/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
              New
            </span>
          )}
        </span>
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-faint">
          {format(parseDate(post.date), "MMM yyyy")}
        </span>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group flex gap-4 py-6">
      <WavelengthSpine wavelength={post.wavelength} />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-faint">
          {showWavelength && <span style={{ color: wl.hex }}>{wl.label}</span>}
          <span>{format(parseDate(post.date), "d MMM yyyy")}</span>
          <span>{post.readingTime}</span>
          {post.series && <span className="truncate">{post.series}</span>}
        </div>
        <Heading className="font-display text-[19px] leading-snug text-paper transition-colors group-hover:text-white">
          {post.title}
        </Heading>
        <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{post.excerpt}</p>
      </div>
    </Link>
  );
}
