import type { CSSProperties, ReactNode } from "react";

/**
 * The small mono uppercase label that titles every section. Defaults to <h2>;
 * pass `as="p"` where the text isn't a real heading (the hero's role line).
 */
export function SectionLabel({
  as: Tag = "h2",
  children,
  className = "",
  style,
}: {
  as?: "h2" | "h3" | "p" | "span";
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Tag
      className={`font-mono text-[12px] uppercase tracking-wider text-faint ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
