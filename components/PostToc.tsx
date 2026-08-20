"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/headings";
import { wavelengths, type Wavelength } from "@/lib/site";

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
 */
function useActiveHeading(headings: Heading[]): [string | null, (id: string) => void] {
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
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [key]);

  return [activeId, setActiveId];
}

/** Collapsed / active line lengths, in px, per heading level. */
const LINE = {
  2: { rest: 20, active: 28, indent: "" },
  3: { rest: 12, active: 20, indent: "ml-2" },
} as const;

/**
 * The margin table of contents: one short horizontal line per h2/h3, stacked in
 * the empty right-hand margin beside the post, expanding to real labels on
 * hover or keyboard focus.
 *
 * Why the right margin: the article column is `max-w-2xl` left-aligned inside a
 * `max-w-3xl` container, so the slack is on that side. At 1280px (Tailwind's
 * `xl`) there are 328px between the column's right edge and the viewport, and
 * the expanded panel needs 296px of that. Below `xl` it does not render at all
 * — no accordion, no drawer, no mobile fallback. A ToC that has to be opened is
 * a different feature from one you glance at, and the post already has a
 * scroll-progress bar and an end-of-post nav.
 *
 * The whole panel is 36px wide until it is hovered or something inside it takes
 * focus, so there is no invisible 272px click target sitting in the margin
 * waiting to swallow a stray click. Reveal is opacity plus a small slide;
 * globals.css already zeroes every transition under prefers-reduced-motion, and
 * `motion-reduce:transition-none` states it locally too.
 */
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

  const accent = wavelengths[wavelength].hex;

  return (
    <nav aria-label="On this page" className="absolute left-full top-0 hidden h-full xl:block">
      <div className="group sticky top-28 ml-6 w-9 transition-[width] duration-200 ease-out hover:w-[17rem] focus-within:w-[17rem] motion-reduce:transition-none">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-7 left-10 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-faint opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
        >
          On this page
        </span>

        <ul className="flex flex-col">
          {headings.map((heading) => {
            const active = heading.id === activeId;
            const line = LINE[heading.depth];

            return (
              <li key={heading.id} className={line.indent}>
                <a
                  href={`#${heading.id}`}
                  aria-current={active ? "true" : undefined}
                  // The observer will agree a moment later, once the smooth
                  // scroll finishes. Marking it now means the line you clicked
                  // lights up on the click rather than at the end of the glide.
                  onClick={() => setActiveId(heading.id)}
                  className="relative flex h-6 items-center rounded-sm outline-none transition-[height] duration-200 ease-out group-hover:h-12 group-focus-within:h-12 focus-visible:ring-1 focus-visible:ring-hairline-strong motion-reduce:transition-none"
                >
                  <span
                    aria-hidden="true"
                    className={`h-px shrink-0 transition-all duration-200 ease-out motion-reduce:transition-none ${
                      active ? "" : "bg-hairline-strong group-hover:bg-muted"
                    }`}
                    style={{
                      width: active ? line.active : line.rest,
                      ...(active ? { backgroundColor: accent, height: 2 } : null),
                    }}
                  />
                  <span
                    className={`pointer-events-none absolute left-10 top-1/2 w-56 -translate-y-1/2 translate-x-[-4px] font-mono text-[11px] leading-[1.35] opacity-0 transition-[opacity,transform] duration-200 ease-out [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 motion-reduce:transition-none ${
                      active ? "text-paper" : "text-muted"
                    }`}
                  >
                    {heading.text}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
