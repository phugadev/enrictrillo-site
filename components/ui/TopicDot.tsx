import type { Topic } from "@/lib/site";
import { topicColor } from "@/lib/topics";

/** A band as a mark: seen, not read. Always beside a label that names it. */
export function TopicDot({
  topic,
  className = "",
}: {
  topic: Topic;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block size-1.5 shrink-0 rounded-full ${topicColor[topic].dot} ${className}`}
    />
  );
}
