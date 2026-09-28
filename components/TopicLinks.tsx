import Link from "next/link";
import { getPostsByTopic } from "@/lib/posts";
import { topicOrder, topics, type Topic } from "@/lib/site";
import { TopicDot } from "./ui/TopicDot";

/**
 * Filter by band, as a line of quiet links. The current one is the foreground.
 * With posts in only one band, that band *is* "All", so there is nothing to
 * filter and the line is left out.
 */
export function TopicLinks({ active }: { active?: Topic }) {
  const groups = getPostsByTopic().filter((b) => b.posts.length > 0);
  if (groups.length < 2) return null;
  const counts = new Map(groups.map((b) => [b.topic, b.posts.length]));
  const link = (on: boolean) =>
    `inline-flex items-center gap-1.5 transition-colors duration-quick ${on ? "text-foreground" : "hover:text-foreground"}`;

  return (
    <nav aria-label="Filter writing by topic" className="flex flex-wrap gap-x-gutter gap-y-1 type-body text-subtle-foreground">
      <Link href="/blog" aria-current={active ? undefined : "page"} className={link(!active)}>
        All
      </Link>
      {topicOrder.map((w) => {
        const count = counts.get(w) ?? 0;
        if (count === 0) return null;
        return (
          <Link key={w} href={`/blog/topic/${w}`} aria-current={active === w ? "page" : undefined} className={link(active === w)}>
            <TopicDot topic={w} />
            {topics[w].label}
            <span className="tabular-nums">{count}</span>
          </Link>
        );
      })}
    </nav>
  );
}
