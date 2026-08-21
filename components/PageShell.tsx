import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
// DESIGN TRIAL — see PR description. Revert by dropping this import and the
// <AvailabilityBar /> line below.
import { AvailabilityBar } from "./AvailabilityBar";
// DESIGN TRIAL — see PR description. Revert by dropping this import and the
// <ScrollProgress /> line below.
import { ScrollProgress } from "./ScrollProgress";

/**
 * Every page's outer frame: skip link, nav, main landmark, footer. Pages pass
 * their own `mainClassName` because the homepage lays out full-width bands
 * while the blog pages use a single centred column.
 */
export function PageShell({
  children,
  mainClassName,
  reading = false,
}: {
  children: ReactNode;
  mainClassName?: string;
  /**
   * Draws the reading-progress bar. Off everywhere except posts.
   *
   * A progress bar answers "how much of this is left", which is only a
   * question on a page that is read start to finish. On the homepage and on
   * /blog it was measuring a scroll through a set of independent sections —
   * a number with nothing behind it. And on a post at `xl` the ToC rail now
   * marks the reader's position with the section name attached, which is the
   * same answer with more information in it, so the bar hides itself there
   * (`xl:hidden`) rather than being the second thing on screen tracking the
   * same scroll.
   */
  reading?: boolean;
}) {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:border focus:border-hairline focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-[12px] focus:text-paper"
      >
        Skip to content
      </a>
      {reading && <ScrollProgress className="xl:hidden" />}
      <Nav />
      <AvailabilityBar />
      <main id="content" className={mainClassName}>
        {children}
      </main>
      <Footer />
    </>
  );
}
