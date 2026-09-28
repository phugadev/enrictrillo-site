import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { ScrollProgress } from "./ScrollProgress";
import { COLUMN, PAGE } from "./layout";

/**
 * Every page: one narrow column and a one-line footer. There is no nav bar —
 * the home page is the navigation — so every other page carries a single
 * quiet link back to where it came from.
 *
 * `reading` adds the thin progress line along the top, for long articles.
 * `wide` lets a page that needs the room (the specimen, an article with its
 * contents rail) lay out its own columns instead of taking the narrow one.
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
        <nav aria-label="Back" className={`${wide ? PAGE : COLUMN} pt-section`}>
          <Link
            href={back.href}
            className="type-body text-subtle-foreground transition-colors duration-quick hover:text-foreground"
          >
            ← {back.label}
          </Link>
        </nav>
      )}
      <main id="content" className={wide ? "" : `${COLUMN} ${back ? "pt-stack" : "pt-section"}`}>
        {children}
      </main>
      <Footer />
    </>
  );
}
