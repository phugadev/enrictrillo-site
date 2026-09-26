import Link from "next/link";
import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import type { PostMeta } from "@/lib/posts";
import { wavelengths } from "@/lib/site";
import { band } from "@/lib/bands";

/**
 * One post in a list. The date sits in its own column as a figure, so a list
 * scans down a timeline; the band is named, not just coloured, because a dot
 * alone asks the reader to remember the legend.
 *
 * `compact` drops the excerpt, for the homepage.
 */
export function PostCard({
  post,
  showWavelength = true,
  as: Heading = "h2",
  compact = false,
  flagNew = false,
}: {
  post: PostMeta;
  showWavelength?: boolean;
  as?: "h2" | "h3";
  compact?: boolean;
  flagNew?: boolean;
}) {
  const wl = wavelengths[post.wavelength];
  const b = band[post.wavelength];
  const read = post.readingTime.replace(/\s*read$/i, "");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid gap-x-stack gap-y-1 py-gutter sm:grid-cols-[7.5rem_minmax(0,1fr)]"
    >
      <time dateTime={post.date} className="figure pt-0.5 type-caption-sm text-faint">
        {format(parseDate(post.date), "d MMM yyyy")}
      </time>
      <div className="min-w-0">
        <Heading className="flex items-center gap-inset text-balance type-subheading text-foreground transition-colors duration-quick group-hover:text-foreground">
          <span className="underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-quick group-hover:decoration-subtle-foreground">
            {post.title}
          </span>
          {flagNew && (
            <span className={`signal shrink-0 rounded-chip border px-1.5 py-0.5 type-label-xs ${b.chip}`}>New</span>
          )}
        </Heading>
        {!compact && (
          <p className="mt-1 max-w-prose text-pretty type-body text-subtle-foreground">{post.excerpt}</p>
        )}
        <p className="signal mt-inset flex flex-wrap items-center gap-x-gutter gap-y-1 type-label-xs text-faint">
          {showWavelength && (
            <span className={`flex items-center gap-1.5 ${b.tint}`}>
              <span aria-hidden="true" className={`size-1.5 rounded-full ${b.mark}`} />
              {wl.label}
            </span>
          )}
          {post.series && <span>{post.series}</span>}
          <span>{read}</span>
        </p>
      </div>
    </Link>
  );
}
