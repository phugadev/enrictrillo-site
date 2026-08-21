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
 *
 * Exported because the lab variants at /lab/toc are alternative *presentations*
 * of the same reading position — the tracking logic is settled and should not
 * be forked to try a different look.
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

/**
 * The rail's reserved geometry, in one place because three things depend on it
 * agreeing: this component, the lab variants, and the arithmetic in the comment
 * below. `ml-8` is the gutter between the prose and the rail; `w-60` (240px) is
 * the rail itself.
 *
 * At the `xl` breakpoint (1280px layout width) the container is `max-w-3xl`
 * (768px) centred, so the article column — `max-w-2xl`, 672px, left-aligned
 * inside it — runs 280→952. The rail therefore occupies 984→1224, leaving a
 * 56px gutter to the viewport edge. Nothing here can reach the prose and
 * nothing can push past the right edge into horizontal scroll, and because the
 * width is a constant rather than a hover state, that stays true in every
 * state the rail has.
 */
export const RAIL = "sticky top-28 ml-8 w-60 max-h-[calc(100vh-9rem)] overflow-y-auto overscroll-contain";

/**
 * The rail's outer positioning, shared with the lab variants.
 *
 * `absolute left-full` off the post page's `relative max-w-2xl` wrapper: the
 * rail hangs off the column's right edge and is out of flow, so the article's
 * position and its alignment with Nav and Footer are untouched at every
 * breakpoint. `h-full` gives the sticky child a containing block that lasts the
 * length of the post, so the rail travels with the reader and stops at the end.
 */
export const RAIL_OUTER = "absolute left-full top-0 hidden h-full xl:block";

/** Label type, shared by all three variants so only the marker differs. */
export const RAIL_LABEL =
  "font-mono text-[11px] leading-[1.5] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden";

/**
 * The margin table of contents: a permanently legible list of the post's h2/h3
 * headings in a reserved column to the right of the article, with the reader's
 * current section marked on a continuous hairline spine.
 *
 * WHY IT NO LONGER EXPANDS. The previous version was 36px wide at rest — one
 * short line per heading — and grew to 272px on hover, sliding the labels in
 * over whatever happened to be beside them. Two things were wrong with that.
 * The obvious one is that a panel which appears on hover *is* an overlay even
 * when it technically has room: it arrives unannounced, it is transient, and it
 * reads as covering the page rather than belonging to it. The subtler one is
 * that a ToC you cannot read without pointing at it is not a table of contents
 * — it is a scrollbar with extra steps. You could see that the post had eight
 * sections; you could not see what they were, which is the entire question a
 * ToC answers. The width is now a constant and the labels are always on.
 *
 * WHY THE RIGHT MARGIN. The reference for this rework (noechague) puts its
 * contents list on the left, and on a symmetric layout that would be the better
 * side — a left rail is read once on arrival and then ignored. This layout is
 * not symmetric. The article is `max-w-2xl` left-aligned inside a `max-w-3xl`
 * container, which means the slack the design already reserves is on the right
 * (328px at `xl`, against 280px on the left), and the container itself must
 * stay put because it is what lines the post up with Nav and Footer. Moving the
 * rail left would mean either a narrower rail or shifting the column, and the
 * column is not available. There is also a reading argument: the eye returns to
 * the left edge of the prose on every line, so a permanently visible list of
 * titles there sits directly in the return path. On the right it is out of it.
 *
 * WHY THE SPINE. The active item is marked by an accent segment on a continuous
 * 1px rule rather than by a background block or coloured text. Coloured text is
 * ruled out outright — the wavelength value here is the *mark*, and marks are
 * seen, not read (see the band note in tailwind.config.ts); the active label
 * goes to full-strength paper instead. A background block was the other
 * candidate and is variant A in the lab; the spine won because a marker sliding
 * along a track is the same instrument idiom as ScrollProgress and the
 * Spectrometer, and because it keeps the rail's silhouette a single vertical
 * line instead of a stack of boxes.
 *
 * Below `xl` it does not render at all — no accordion, no drawer, no mobile
 * fallback. A ToC that has to be opened is a different feature from one you
 * glance at, and the post already has a scroll-progress bar and an end-of-post
 * nav. The only transitions left are colour and the marker's width; globals.css
 * zeroes every transition under prefers-reduced-motion and
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

  return (
    <nav aria-label="On this page" className={RAIL_OUTER}>
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
 * Split out for one reason: /lab/toc renders this alongside two rejected
 * presentations, both live and pinned to a fixed heading, and a lab that
 * compares a *copy* of the shipped variant is comparing the wrong thing. If
 * this changes, what Enric is looking at changes with it.
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
  const accent = wavelengths[wavelength].hex;

  return (
    <>
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
        On this page
      </p>

      {/* The spine. It is the `ul`'s own left border rather than a separate
          absolutely positioned element, so it can never end up a different
          height from the list it belongs to. */}
      <ul className="border-l border-hairline">
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
                className={`group relative block rounded-sm py-[7px] pr-1 outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong ${
                  heading.depth === 3 ? "pl-7" : "pl-4"
                }`}
              >
                {/* Pulled 1px left so the marker sits *on* the spine and covers
                    it, rather than beside it. Inset top and bottom so two
                    adjacent items would still read as separate marks. */}
                <span
                  aria-hidden="true"
                  className="absolute -left-px bottom-[5px] top-[5px] w-px transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none"
                  style={active ? { backgroundColor: accent, width: 2 } : undefined}
                />
                <span
                  className={`${RAIL_LABEL} transition-colors duration-200 ease-out motion-reduce:transition-none ${
                    active ? "text-paper" : "text-muted group-hover:text-prose"
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
