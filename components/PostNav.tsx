import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { WavelengthDot } from "./ui/WavelengthDot";

function NavLink({ post, side }: { post: PostMeta; side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col gap-inset rounded-panel border border-border bg-card p-gutter shadow-raised transition-colors duration-quick hover:border-gray-border-strong ${
        isLeft ? "" : "sm:items-end sm:text-right"
      }`}
    >
      <span className="signal type-label-sm text-faint">{isLeft ? "← Older" : "Newer →"}</span>
      <span className="flex items-center gap-inset">
        <WavelengthDot wavelength={post.wavelength} />
        <span className="text-balance type-subheading text-muted-foreground transition-colors duration-quick group-hover:text-foreground">
          {post.title}
        </span>
      </span>
    </Link>
  );
}

export function PostNav({ newer, older }: { newer?: PostMeta; older?: PostMeta }) {
  if (!newer && !older) return null;
  return (
    <nav aria-label="More writing" className="mt-section grid gap-gutter sm:grid-cols-2">
      {/* Placeholder keeps `newer` in the right column when there is no older post. */}
      {older ? <NavLink post={older} side="left" /> : <span className="hidden sm:block" />}
      {newer && <NavLink post={newer} side="right" />}
    </nav>
  );
}
