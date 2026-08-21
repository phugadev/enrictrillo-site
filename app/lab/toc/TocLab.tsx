"use client";

import { useState, type ReactNode } from "react";
import type { Heading } from "@/lib/headings";
import type { Wavelength } from "@/lib/site";
import { TocRail, RAIL, RAIL_OUTER, useActiveHeading } from "@/components/PostToc";
import { VariantBlock, VariantTicks, type VariantProps } from "./variants";

/**
 * The lab's switcher and the two ways of looking at a rail.
 *
 * A margin rail cannot literally be shown side by side in its own layout —
 * there is one margin and three candidates for it — so this page does both
 * things instead: a static row where the three are next to each other at the
 * same width with the same item marked (which answers "which reads better"),
 * and the real post underneath with one variant live in the real margin (which
 * answers "does it hold up while you scroll, and does it stay off the prose").
 */

type VariantId = "spine" | "block" | "ticks";

const VARIANTS: {
  id: VariantId;
  name: string;
  note: string;
  Component: (props: VariantProps) => ReactNode;
}[] = [
  {
    id: "spine",
    name: "C — spine",
    note: "Recommended. A continuous hairline with the band colour marking your section, like ScrollProgress.",
    Component: TocRail,
  },
  {
    id: "block",
    name: "A — block",
    note: "Closest to the noechague reference: the current section is a filled panel with an accent edge.",
    Component: VariantBlock,
  },
  {
    id: "ticks",
    name: "B — ticks",
    note: "The old line vocabulary kept, but the labels are permanent instead of arriving on hover.",
    Component: VariantTicks,
  },
];

/** The three rails at rest, out of the margin, with one item pinned active. */
export function TocComparison({
  headings,
  wavelength,
}: {
  headings: Heading[];
  wavelength: Wavelength;
}) {
  // A mid-list h2 rather than the first item, so the indent, the marker and the
  // items above and below it are all visible at once.
  const pinned = headings[3]?.id ?? headings[0].id;

  return (
    <div className="flex flex-wrap gap-10">
      {VARIANTS.map(({ id, name, note, Component }) => (
        <div key={id} className="w-60">
          <p className="mb-1 font-mono text-[11px] text-paper">{name}</p>
          <p className="mb-5 font-mono text-[11px] leading-[1.5] text-faint">{note}</p>
          <Component headings={headings} wavelength={wavelength} activeId={pinned} />
        </div>
      ))}
    </div>
  );
}

/**
 * The real post, with one variant live in the real margin.
 *
 * `children` is the server-rendered MDX handed down whole — the lab must run
 * against the actual article, at the actual measure, or the geometry it is
 * being used to check is not the geometry that ships.
 */
export function TocLive({
  headings,
  wavelength,
  children,
}: {
  headings: Heading[];
  wavelength: Wavelength;
  children: ReactNode;
}) {
  const [variant, setVariant] = useState<VariantId>("spine");
  const [activeId, setActiveId] = useActiveHeading(headings);
  const Component = VARIANTS.find((v) => v.id === variant)!.Component;

  return (
    <>
      {/* Pills, because these are tokens rather than structure. Sticky under
          the nav so you can swap variants without scrolling back up — the
          whole point is to judge them mid-post. */}
      <div className="sticky top-16 z-30 mb-8 flex gap-2 bg-ink/90 py-3 backdrop-blur">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setVariant(v.id)}
            aria-pressed={variant === v.id}
            className={`rounded-pill border px-3 py-1 font-mono text-[11px] transition-colors motion-reduce:transition-none ${
              variant === v.id
                ? "border-hairline-strong bg-surface text-paper"
                : "border-hairline text-muted hover:text-paper"
            }`}
          >
            {v.name}
          </button>
        ))}
      </div>

      <div className="relative max-w-2xl">
        {/* Deliberately not <PostToc>: the lab needs to swap the presentation
            while keeping one reading position, so it owns the hook and passes
            the answer in. PostToc is what the real page renders. */}
        <nav aria-label="On this page" className={RAIL_OUTER}>
          <div className={RAIL}>
            <Component
              headings={headings}
              wavelength={wavelength}
              activeId={activeId}
              onSelect={setActiveId}
            />
          </div>
        </nav>
        {children}
      </div>
    </>
  );
}
