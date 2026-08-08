import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { WavelengthDot } from "./ui/WavelengthDot";

/**
 * Laid out as a timeline rather than a reading sequence: left moves back in
 * time (older), right moves forward (newer).
 */
function NavLink({ post, side }: { post: PostMeta; side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col gap-2 py-5 sm:py-6 ${isLeft ? "" : "sm:items-end sm:text-right"}`}
    >
      <span className="font-mono text-[11px] uppercase tracking-wider text-faint">
        {isLeft ? "← Older" : "Newer →"}
      </span>
      <span className="flex items-center gap-2.5">
        <WavelengthDot wavelength={post.wavelength} />
        <span className="font-display text-[16px] leading-snug text-muted transition-colors group-hover:text-paper">
          {post.title}
        </span>
      </span>
    </Link>
  );
}

export function PostNav({ newer, older }: { newer?: PostMeta; older?: PostMeta }) {
  if (!newer && !older) return null;

  return (
    <nav
      aria-label="More writing"
      className="mt-16 border-t border-hairline sm:grid sm:grid-cols-2 sm:gap-8"
    >
      {/* Placeholder keeps `newer` in the right column when there's no older post. */}
      {older ? <NavLink post={older} side="left" /> : <span className="hidden sm:block" />}
      {newer && <NavLink post={newer} side="right" />}
    </nav>
  );
}
