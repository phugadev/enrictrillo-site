import type { CSSProperties, ReactNode } from "react";

/**
 * The small mono uppercase label that titles every section. Defaults to <h2>;
 * pass `as="p"` where the text isn't a real heading (the hero's role line).
 *
 * It used to render in `text-faint` — the colour the site uses for
 * timestamps, addresses and other things a reader is meant to skim past. A
 * section title therefore sat *below* its own body text in the contrast
 * order, and scrolling the page gave you no landmarks: every section opened
 * with the quietest thing on it.
 *
 * It is now `text-paper` at medium weight — brighter than the prose it
 * introduces, which is the whole job of a heading. `text-muted` was tried
 * first and is exactly the body colour, so the label merely drew level with
 * the paragraph under it and still did not lead. Size carries the rest of
 * the hierarchy: at 12px mono uppercase against a 40px hero, a bright label
 * reads as an instrument caption, not as a second headline.
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
      className={`font-mono text-[12px] font-medium uppercase tracking-wider text-paper ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
