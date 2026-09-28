import Link from "next/link";
import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import { getAllSeries, seriesSlug, type PostMeta } from "@/lib/posts";
import { topics } from "@/lib/site";
import { TopicDot } from "@/components/ui/TopicDot";

/** Where this post sits in its series, oldest first. */
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
 * The post header, said quietly: one grey line placing the post — its series
 * and position, or its band — with the date, then the
 * headline in the serif, the one place a person rather than the system speaks.
 */
export function PostHeader({ meta }: { meta: PostMeta }) {
  const wl = topics[meta.topic];
  const series = seriesPosition(meta);

  return (
    <header>
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 type-body text-subtle-foreground">
        <TopicDot topic={meta.topic} />
        {series ? (
          <Link href={`/blog/series/${series.slug}`} className="transition-colors duration-quick hover:text-foreground">
            {series.name}, {series.index} of {series.total}
          </Link>
        ) : (
          <Link href={`/blog/topic/${meta.topic}`} className="transition-colors duration-quick hover:text-foreground">
            {wl.label}
          </Link>
        )}
        <span aria-hidden="true">·</span>
        <time dateTime={meta.date}>{format(parseDate(meta.date), "d MMMM yyyy")}</time>
      </p>
      <h1 className="mt-gutter text-balance font-serif text-[2.25rem] leading-[1.1] tracking-[-0.01em] text-foreground">
        {meta.title}
      </h1>
      {/* The excerpt as the standfirst: the title states a position, this is
          the claim behind it — the same line the writing list shows. */}
      <p className="mt-gutter max-w-prose text-pretty type-lead text-muted-foreground">{meta.excerpt}</p>
    </header>
  );
}
