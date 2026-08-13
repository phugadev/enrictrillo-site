import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
// DESIGN TRIAL — see PR description. Revert by dropping this import and the
// <AvailabilityBar /> line below.
import { AvailabilityBar } from "./AvailabilityBar";

/**
 * Every page's outer frame: skip link, nav, main landmark, footer. Pages pass
 * their own `mainClassName` because the homepage lays out full-width bands
 * while the blog pages use a single centred column.
 */
export function PageShell({
  children,
  mainClassName,
}: {
  children: ReactNode;
  mainClassName?: string;
}) {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:border focus:border-hairline focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-[12px] focus:text-paper"
      >
        Skip to content
      </a>
      <Nav />
      <AvailabilityBar />
      <main id="content" className={mainClassName}>
        {children}
      </main>
      <Footer />
    </>
  );
}
