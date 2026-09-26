"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/headings";
import type { Wavelength } from "@/lib/site";
import { band } from "@/lib/bands";

/**
 * The reading line: the y the reader's eye is assumed to be at. Sits just under
 * the sticky nav, and a little below `scroll-padding-top` so a heading you have
 * just jumped to has already crossed it.
 */
const READING_LINE = 96;

/**
 * Which heading the reader is currently inside — the last one whose top has
 * passed the reading line.
 *
 * IntersectionObserver rather than a scroll handler, but note what it is used
 * for: the observer's root is everything *below* the reading line, so an entry
 * arrives exactly when a heading crosses it, and that is precisely when the
 * answer can change. The callback then re-measures rather than reading
 * `isIntersecting`, because "not intersecting" is ambiguous — it means both
 * "above the line" and "still below the fold".
 *
 * An earlier version used a band (line to 35% of the viewport) and picked the
 * topmost heading inside it. That reports nothing at all while you are in the
 * middle of a long section, which meant the fallback path — the one that
 * actually matters here — only ran when something happened to cross a band
 * edge, and the marker went stale on a jump. Defining "active" against a single
 * line removes the ambiguous state instead of patching around it.
 *
 * Exported so any other presentation of the reading position reuses this
 * tracking logic rather than forking it.
 */
export function useActiveHeading(
  headings: Heading[],
): [string | null, (id: string) => void] {
  const [activeId, setActiveId] = useState<string | null>(null);
  // Headings are fixed for the life of the page; the join keeps the effect from
  // re-running on every re-render the observer itself causes.
  const key = headings.map((h) => h.id).join("|");

  useEffect(() => {
    const elements = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const measure = () => {
      // The last section is unreachable by the reading line alone. A heading
      // near the end of a post may never get its top above 96px, because the
      // page simply runs out of scroll first — the footnotes, the end nav and
      // the footer are not tall enough to push it up there. The reader is
      // plainly *in* that section, looking at it, and the rail was still
      // marking the one before. Hitting the bottom of the document is the
      // honest answer to "which section am I in": the last one.
      const doc = document.documentElement;
      const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 2;
      if (atBottom) {
        setActiveId(elements[elements.length - 1].id);
        return;
      }

      let passed: string | null = null;
      for (const el of elements) {
        if (el.getBoundingClientRect().top < READING_LINE) passed = el.id;
      }
      setActiveId(passed);
    };

    const observer = new IntersectionObserver(measure, {
      rootMargin: `-${READING_LINE}px 0px 0px 0px`,
      threshold: 0,
    });
    for (const el of elements) observer.observe(el);

    // Resizing reflows the article without moving the scroll position, so no
    // heading crosses the line and the observer stays quiet.
    window.addEventListener("resize", measure);

    /*
      And a scroll listener, which the original deliberately did without.
      It is here for exactly one thing: the bottom of the document is a
      boundary no heading ever crosses, so no observer entry is ever emitted
      for it — the last few pixels of scroll are invisible to an
      IntersectionObserver watching headings. rAF-throttled, passive, and it
      does the same measure the observer does, so there is one definition of
      "active" rather than two that can disagree.
    */
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        measure();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
    };
  }, [key]);

  return [activeId, setActiveId];
}

/** The rail sticks under the nav for the length of the post, and scrolls on
    its own if a post has more headings than the viewport holds. */
export const RAIL = "sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain";

export const RAIL_LABEL =
  "type-caption [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden";

export function PostToc({
  headings,
  wavelength,
}: {
  headings: Heading[];
  wavelength: Wavelength;
}) {
  const [activeId, setActiveId] = useActiveHeading(headings);

  // A single line is not an outline, it is a stray mark in the margin. The page
  // guards this too, so the client bundle is never even reached for such a post.
  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="h-full">
      <div className={RAIL}>
        <TocRail
          headings={headings}
          wavelength={wavelength}
          activeId={activeId}
          onSelect={setActiveId}
        />
      </div>
    </nav>
  );
}

/**
 * The rail's contents, with no opinion about where the rail is — the reading
 * position is passed in rather than measured here.
 *
 * Split out so the rail can be rendered against a fixed heading — in a test
 * or a specimen — without scrolling a page to get there.
 */
export function TocRail({
  headings,
  wavelength,
  activeId,
  onSelect,
}: {
  headings: Heading[];
  wavelength: Wavelength;
  activeId: string | null;
  onSelect?: (id: string) => void;
}) {
  const mark = band[wavelength].mark;

  return (
    <>
      <p className="signal mb-gutter type-label-xs text-faint">
        On this page
      </p>

      {/* The spine. It is the `ul`'s own left border rather than a separate
          absolutely positioned element, so it can never end up a different
          height from the list it belongs to. */}
      <ul className="border-l border-border">
        {headings.map((heading) => {
          const active = heading.id === activeId;

          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={active ? "true" : undefined}
                // The observer will agree a moment later, once the smooth
                // scroll finishes. Marking it now means the item you clicked
                // lights up on the click rather than at the end of the glide.
                onClick={() => onSelect?.(heading.id)}
                className={`group relative block rounded-control-xs py-1.5 pr-1 ${
                  heading.depth === 3 ? "pl-stack" : "pl-gutter"
                }`}
              >
                {/* Pulled 1px left so the marker sits *on* the spine and covers
                    it, rather than beside it. Inset top and bottom so two
                    adjacent items would still read as separate marks. */}
                <span
                  aria-hidden="true"
                  className={`absolute -left-px top-1.5 bottom-1.5 transition-[width,background-color] duration-base ease-out ${
                    active ? `w-0.5 ${mark}` : "w-px"
                  }`}
                />
                <span
                  className={`${RAIL_LABEL} transition-colors duration-base ease-out ${
                    active ? "text-foreground" : "text-subtle-foreground group-hover:text-muted-foreground"
                  }`}
                >
                  {heading.text}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
