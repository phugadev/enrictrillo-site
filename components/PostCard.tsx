import Link from "next/link";
import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import type { PostMeta } from "@/lib/posts";
import { wavelengths } from "@/lib/site";
import { WavelengthSpine } from "./ui/WavelengthSpine";

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
   * Tighter row (py-5, matching ProjectRow's rhythm) with the excerpt
   * paragraph omitted. Used on the homepage teaser, where the excerpt is
   * more of an activity signal than something a reader needs to decide
   * whether to click — unlike /blog and the wavelength/series pages, which
   * keep the full treatment.
   */
  compact?: boolean;
}) {
  const wl = wavelengths[post.wavelength];
  return (
    <Link href={`/blog/${post.slug}`} className={`group flex gap-4 ${compact ? "py-5" : "py-6"}`}>
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
        {!compact && (
          <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{post.excerpt}</p>
        )}
      </div>
    </Link>
  );
}
