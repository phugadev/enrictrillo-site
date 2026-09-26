import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { ScrollProgress } from "./ScrollProgress";

/**
 * Every page: skip link, the sticky nav, the page, the footer. `reading`
 * adds the thin spectrum progress bar along the top, for articles, below the
 * width where the margin table of contents takes over that job.
 */
export function PageShell({
  children,
  mainClassName = "",
  reading = false,
}: {
  children: ReactNode;
  mainClassName?: string;
  reading?: boolean;
}) {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-gutter focus:top-gutter focus:z-50 focus:rounded-control-md focus:border focus:border-border focus:bg-surface-overlay focus:px-gutter focus:py-inset focus:type-caption focus:text-foreground focus:shadow-overlay"
      >
        Skip to content
      </a>
      {reading && <ScrollProgress className="xl:hidden" />}
      <Nav />
      <main id="content" className={mainClassName}>
        {children}
      </main>
      <Footer />
    </>
  );
}
