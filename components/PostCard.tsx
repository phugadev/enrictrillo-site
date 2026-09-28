import Link from "next/link";
import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import type { PostMeta } from "@/lib/posts";
import { WavelengthDot } from "./ui/WavelengthDot";

/** One post as one line: its band, its title, its date. */
export function PostCard({ post, showWavelength = true }: { post: PostMeta; showWavelength?: boolean }) {
  return (
    <li>
      <Link
        href={`/blog/${post.slug}`}
        className="group -mx-2 flex items-baseline gap-3 rounded-control-sm px-2 py-1.5 transition-colors duration-quick hover:bg-gray-tint"
      >
        {showWavelength && <WavelengthDot wavelength={post.wavelength} className="translate-y-[-2px]" />}
        <span className="min-w-0 flex-1 text-foreground">{post.title}</span>
        <time dateTime={post.date} className="shrink-0 type-body tabular-nums text-subtle-foreground">
          {format(parseDate(post.date), "MMM yyyy")}
        </time>
      </Link>
    </li>
  );
}
