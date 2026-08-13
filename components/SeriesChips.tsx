import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getAllSeries } from "@/lib/posts";

/**
 * Series index for /blog, styled as the same pill idiom as WavelengthChips —
 * a second, orthogonal way to browse the post list. Unlike wavelength bands,
 * `getAllSeries()` only ever returns series that already have posts, so every
 * pill here is a valid link; there's no "empty series" state to render, and
 * no reason to reach for WavelengthChips's dimmed/unlinked branch.
 *
 * Self-hides when there are no series yet, same discipline as `Credentials`
 * and `Now`.
 */
export function SeriesChips() {
  const series = getAllSeries();
  if (series.length === 0) return null;

  return (
    <nav aria-label="Browse writing by series" className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <SectionLabel as="span" className="shrink-0">
        Series
      </SectionLabel>
      <div className="flex flex-wrap gap-2">
        {series.map((s) => (
          <Link
            key={s.slug}
            href={`/blog/series/${s.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-hairline px-3.5 py-2 font-mono text-[12px] text-muted transition-colors hover:border-muted hover:text-paper"
          >
            {s.name}
            <span className="text-faint">{s.posts.length}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
