import type { ReactNode } from "react";

/** Shared measure for every page — keeps the homepage and blog aligned. */
export const CONTAINER = "mx-auto max-w-3xl px-6";

/**
 * A section of the page, separated from the one above by whitespace alone.
 *
 * This used to carry a hairline rule (`border-t border-hairline`) inside the
 * container to mark the boundary. Dropped because every section boundary on
 * the page picked up a rule, including the one directly under the
 * Spectrometer's own bordered panel — two adjacent rules read as a visual
 * collision rather than a clean seam. Vertical padding alone now does the
 * separating; `py-16` is generous enough that sections still read as
 * distinct blocks without a line drawn between them.
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
        <div className="py-16">{children}</div>
      </div>
    </section>
  );
}
