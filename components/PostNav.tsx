import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

/** Older and newer, as two quiet lines at the foot of a post. */
export function PostNav({ newer, older }: { newer?: PostMeta; older?: PostMeta }) {
  if (!newer && !older) return null;
  const row = "group flex items-baseline gap-3 py-1.5";
  return (
    <nav aria-label="More writing" className="mt-section border-t border-border pt-stack">
      {older && (
        <Link href={`/blog/${older.slug}`} className={row}>
          <span className="w-14 shrink-0 type-body text-subtle-foreground">Older</span>
          <span className="type-body text-muted-foreground transition-colors duration-quick group-hover:text-foreground">{older.title}</span>
        </Link>
      )}
      {newer && (
        <Link href={`/blog/${newer.slug}`} className={row}>
          <span className="w-14 shrink-0 type-body text-subtle-foreground">Newer</span>
          <span className="type-body text-muted-foreground transition-colors duration-quick group-hover:text-foreground">{newer.title}</span>
        </Link>
      )}
    </nav>
  );
}
