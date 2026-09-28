import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { ScrollProgress } from "./ScrollProgress";
import { containerVariants } from "./layout";

/**
 * Every page: an optional link back, the page, a one-line footer. There is no
 * nav bar — the home page is the navigation. The shell is not a column: each
 * region brings its own Minima container (narrow for reading, page-width for
 * the specimen), the way Minima's layout primitives are built to be used.
 *
 * `reading` adds the thin progress line along the top, for long articles.
 * `wide` puts the back link on the page-width column, for pages laid out wide.
 */
export function PageShell({
  children,
  back,
  reading = false,
  wide = false,
}: {
  children: ReactNode;
  back?: { href: string; label: string };
  reading?: boolean;
  wide?: boolean;
}) {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-gutter focus:top-gutter focus:z-50 focus:rounded-control-md focus:border focus:border-border focus:bg-surface-overlay focus:px-gutter focus:py-inset focus:type-caption focus:text-foreground focus:shadow-overlay"
      >
        Skip to content
      </a>
      {reading && <ScrollProgress />}
      {back && (
        <nav
          aria-label="Back"
          className={`${containerVariants({ size: wide ? "page" : "narrow" })} pt-section`}
        >
          <Link
            href={back.href}
            className="type-body text-subtle-foreground transition-colors duration-quick hover:text-foreground"
          >
            ← {back.label}
          </Link>
        </nav>
      )}
      <main id="content">{children}</main>
      <Footer />
    </>
  );
}
