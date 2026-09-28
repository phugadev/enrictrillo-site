import Link from "next/link";
import { getAllSeries } from "@/lib/posts";

/** The series, as a line of quiet links. */
export function SeriesChips() {
  const series = getAllSeries();
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
