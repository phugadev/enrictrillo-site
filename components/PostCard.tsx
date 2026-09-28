import Link from "next/link";
import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import type { PostMeta } from "@/lib/posts";
import { TopicDot } from "./ui/TopicDot";

/**
 * One post as one line: its band, its title, its date. On the writing lists
 * (not the homepage) the excerpt sits beneath: the titles state a position,
 * and the excerpt carries the claim behind it.
 */
export function PostCard({
  post,
  showTopic = true,
  excerpt = false,
}: {
  post: PostMeta;
  showTopic?: boolean;
  excerpt?: boolean;
}) {
  return (
    <li>
      <Link
        href={`/blog/${post.slug}`}
        className="group -mx-2 block rounded-control-sm px-2 py-1.5 transition-colors duration-quick hover:bg-gray-tint"
      >
        <span className="flex items-baseline gap-3">
          {showTopic && <TopicDot topic={post.topic} className="translate-y-[-2px]" />}
          <span className="min-w-0 flex-1 font-medium text-foreground">{post.title}</span>
          <time dateTime={post.date} className="shrink-0 type-body tabular-nums text-subtle-foreground">
            {format(parseDate(post.date), "MMM yyyy")}
          </time>
        </span>
        {excerpt && (
          <span className={`mt-0.5 block max-w-prose text-pretty type-body text-subtle-foreground ${showTopic ? "pl-[calc(6px+0.75rem)]" : ""}`}>
            {post.excerpt}
          </span>
        )}
      </Link>
    </li>
  );
}
