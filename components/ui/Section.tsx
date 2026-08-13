import type { ReactNode } from "react";

/** Shared measure for every page — keeps the homepage and blog aligned. */
export const CONTAINER = "mx-auto max-w-3xl px-6";

/**
 * A section of the page, separated from the one above by a hairline.
 *
 * The rule sits *inside* the container rather than on the <section> itself.
 * Full-bleed rules cut the whole viewport in half at every section boundary,
 * which read as page-long dividers and made the page feel like stacked slabs
 * rather than one column of content. Contained, they read as typographic
 * separators.
 */
export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={className}>
      <div className={CONTAINER}>
        <div className="border-t border-hairline py-14">{children}</div>
      </div>
    </section>
  );
}
