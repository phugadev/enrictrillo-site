import Link from "next/link";
import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import type { PostMeta } from "@/lib/posts";
import { wavelengths } from "@/lib/site";
import { WavelengthIcon } from "./ui/WavelengthIcon";
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
   * Single-line row (wavelength-tinted icon + title + date) with the
   * excerpt and metadata line dropped. Used on the homepage teaser, where
   * the excerpt is more of an activity signal than something a reader needs
   * to decide whether to click — unlike /blog and the wavelength/series
   * pages, which keep the full treatment. Picks up a "New" pill for posts
   * published within the last three weeks.
   */
  compact?: boolean;
}) {
  const wl = wavelengths[post.wavelength];

  if (compact) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group -mx-3 flex items-center justify-between gap-6 rounded-lg px-3 py-3 transition-colors hover:bg-surface"
      >
        <span className="flex min-w-0 items-center gap-3">
          <WavelengthIcon wavelength={post.wavelength} />
          <Heading className="flex min-w-0 items-center gap-2 font-display text-[16px] leading-snug text-paper transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-white">
            <span className="truncate">{post.title}</span>
            {isRecent(post.date) && (
              <span className="shrink-0 rounded-full bg-compute/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-compute-tint">
                New
              </span>
            )}
          </Heading>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-faint">
          <span className="opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
            →
          </span>
          {format(parseDate(post.date), "d MMM yyyy")}
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
