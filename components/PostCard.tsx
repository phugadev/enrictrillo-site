import Link from "next/link";
import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import type { PostMeta } from "@/lib/posts";
import { wavelengths } from "@/lib/site";
import { WavelengthSpine } from "./ui/WavelengthSpine";

/**
 * `showWavelength` is off in grouped views (the blog index), where the band
 * heading directly above already names the wavelength.
 */
export function PostCard({
  post,
  showWavelength = true,
}: {
  post: PostMeta;
  showWavelength?: boolean;
}) {
  const wl = wavelengths[post.wavelength];
  return (
    <Link href={`/blog/${post.slug}`} className="group flex gap-4 py-6">
      <WavelengthSpine wavelength={post.wavelength} />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-faint">
          {showWavelength && <span style={{ color: wl.hex }}>{wl.label}</span>}
          <span>{format(parseDate(post.date), "d MMM yyyy")}</span>
          <span>{post.readingTime}</span>
          {post.series && <span className="truncate">{post.series}</span>}
        </div>
        <h3 className="font-display text-[19px] leading-snug text-paper transition-colors group-hover:text-white">
          {post.title}
        </h3>
        <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{post.excerpt}</p>
      </div>
    </Link>
  );
}
