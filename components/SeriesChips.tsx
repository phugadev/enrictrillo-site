import Link from "next/link";
import { getAllSeries } from "@/lib/posts";

export function SeriesChips() {
  const series = getAllSeries();
  if (series.length === 0) return null;

  return (
    <nav aria-label="Browse writing by series" className="flex flex-wrap items-center gap-inset">
      <span className="signal mr-1 type-label-sm text-faint">Series</span>
      {series.map((s) => (
        <Link
          key={s.slug}
          href={`/blog/series/${s.slug}`}
          className="inline-flex h-control-sm items-center gap-2 rounded-chip border border-border px-3 type-caption text-subtle-foreground transition-colors duration-quick hover:border-gray-border-strong hover:text-foreground"
        >
          {s.name}
          <span className="figure text-faint">{s.posts.length}</span>
        </Link>
      ))}
    </nav>
  );
}
