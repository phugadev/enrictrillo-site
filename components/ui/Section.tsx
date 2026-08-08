import type { ReactNode } from "react";

/** Shared measure for every page — keeps the homepage and blog aligned. */
export const CONTAINER = "mx-auto max-w-3xl px-6";

/**
 * A hairline-separated band with the standard container inside it. Used for
 * every section below the homepage hero.
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
    <section id={id} className={`border-t border-hairline ${className}`}>
      <div className={`${CONTAINER} py-14`}>{children}</div>
    </section>
  );
}
