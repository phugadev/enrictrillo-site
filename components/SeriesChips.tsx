import Link from "next/link";
import { getAllSeries } from "@/lib/posts";

/**
 * The series, as a line of quiet links. A series of one post is not yet a
 * run to browse — the post itself is already in the list above — so it is
 * listed once a second post joins it.
 */
export function SeriesChips() {
  const series = getAllSeries().filter((s) => s.posts.length > 1);
  if (series.length === 0) return null;

  return (
    <nav aria-label="Browse writing by series" className="flex flex-wrap gap-x-gutter gap-y-1 type-body text-subtle-foreground">
      <span>Series</span>
      {series.map((s) => (
        <Link key={s.slug} href={`/blog/series/${s.slug}`} className="transition-colors duration-quick hover:text-foreground">
          {s.name} <span className="tabular-nums">{s.posts.length}</span>
        </Link>
      ))}
    </nav>
  );
}
