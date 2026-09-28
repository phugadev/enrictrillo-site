import type { ComponentProps } from "react";
import type { Topic } from "@/lib/site";
import { topicColor } from "@/lib/topics";
import { cn } from "@/lib/cn";
import { Eyebrow as MinimaEyebrow } from "./ui/layout";

/**
 * The page primitives are Minima's (components/ui/layout.tsx, installed from
 * phugadev/minima/layout). They were written here first and moved upstream;
 * what stays is identity, which a design system should not carry.
 */
export { Container, Section, PageHeader, containerVariants } from "./ui/layout";

/**
 * Minima's eyebrow, optionally in a band's colour with its mark beside it.
 * The band is this site's taxonomy, so it lives here rather than as a prop on
 * the system's component.
 */
export function Eyebrow({
  topic,
  className,
  children,
  ...props
}: ComponentProps<typeof MinimaEyebrow> & { topic?: Topic }) {
  return (
    <MinimaEyebrow className={cn(topic && topicColor[topic].tint, className)} {...props}>
      {topic && (
        <span
          aria-hidden="true"
          className={`size-1.5 shrink-0 rounded-full ${topicColor[topic].dot}`}
        />
      )}
      {children}
    </MinimaEyebrow>
  );
}
