import Link from "next/link";
import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import { getAllSeries, seriesSlug, type PostMeta } from "@/lib/posts";
import { wavelengths } from "@/lib/site";
import { WavelengthDot } from "@/components/ui/WavelengthDot";

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
 * and position, or its band — with the date and reading time, then the
 * headline in the serif, the one place a person rather than the system speaks.
 */
export function PostHeader({ meta }: { meta: PostMeta }) {
  const wl = wavelengths[meta.wavelength];
  const read = meta.readingTime.replace(/\s*read$/i, "");
  const series = seriesPosition(meta);

  return (
    <header>
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 type-body text-subtle-foreground">
        <WavelengthDot wavelength={meta.wavelength} />
        {series ? (
          <Link href={`/blog/series/${series.slug}`} className="transition-colors duration-quick hover:text-foreground">
            {series.name}, {series.index} of {series.total}
          </Link>
        ) : (
          <Link href={`/blog/wavelength/${meta.wavelength}`} className="transition-colors duration-quick hover:text-foreground">
            {wl.label}
          </Link>
        )}
        <span aria-hidden="true">·</span>
        <time dateTime={meta.date}>{format(parseDate(meta.date), "d MMMM yyyy")}</time>
        <span aria-hidden="true">·</span>
        <span>{read}</span>
      </p>
      <h1 className="mt-gutter text-balance font-serif text-[2.25rem] leading-[1.1] tracking-[-0.01em] text-foreground">
        {meta.title}
      </h1>
    </header>
  );
}
