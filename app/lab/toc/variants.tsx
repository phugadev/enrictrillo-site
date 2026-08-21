"use client";

import type { Heading } from "@/lib/headings";
import { wavelengths, type Wavelength } from "@/lib/site";
import { RAIL_LABEL } from "@/components/PostToc";

/**
 * The two rejected ToC presentations, kept only so /lab/toc can show them
 * beside the shipped one. Nothing outside this route may import them.
 *
 * All three variants share the same geometry (a fixed 240px reserved column to
 * the right of the article — see RAIL in components/PostToc.tsx), the same type,
 * the same two-level indent and the same rule that the wavelength value is only
 * ever a *mark*, never text colour. The only thing that differs is how "you are
 * here" is drawn. That is deliberate: if the variants differed in width or type
 * as well, the comparison would not be answering one question.
 */

export type VariantProps = {
  headings: Heading[];
  wavelength: Wavelength;
  activeId: string | null;
  onSelect?: (id: string) => void;
};

function RailCaption({ children }: { children: string }) {
  return (
    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
      {children}
    </p>
  );
}

/**
 * Variant A — the block.
 *
 * Closest to the noechague reference: no rule anywhere, the current section is
 * a filled panel with an accent edge. Reads immediately, and the accent edge
 * gives the wavelength somewhere honest to sit.
 *
 * Rejected because the filled block is the loudest thing in the right margin at
 * any moment, which inverts the priority — the ToC is chrome and the prose is
 * the page — and because as you scroll a solid rectangle jumps down the margin
 * in discrete steps, which pulls the eye off the text far harder than a 2px
 * mark moving on a rule does.
 */
export function VariantBlock({ headings, wavelength, activeId, onSelect }: VariantProps) {
  const accent = wavelengths[wavelength].hex;

  return (
    <>
      <RailCaption>On this page</RailCaption>
      <ul className="flex flex-col gap-px">
        {headings.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={active ? "true" : undefined}
                onClick={() => onSelect?.(heading.id)}
                // rounded-sm, not a pill: this is structure, not a token.
                className={`group relative block rounded-sm py-[7px] pr-2 outline-none transition-colors duration-200 ease-out focus-visible:ring-1 focus-visible:ring-hairline-strong motion-reduce:transition-none ${
                  heading.depth === 3 ? "pl-7" : "pl-3"
                } ${active ? "bg-surface" : "hover:bg-surface/50"}`}
              >
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 top-0 w-0.5 rounded-sm"
                  style={active ? { backgroundColor: accent } : undefined}
                />
                <span
                  className={`${RAIL_LABEL} ${active ? "text-paper" : "text-muted group-hover:text-prose"}`}
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

/**
 * Variant B — the ticks.
 *
 * Keeps the vocabulary of the version this replaced: one short horizontal line
 * per heading, the active one longer and in the band colour. The difference is
 * that the label now sits permanently beside its tick instead of arriving on
 * hover.
 *
 * Rejected because once the label is always readable, the tick has no work
 * left to do — the length of a 12px line is not information anyone reads, and
 * eight of them stacked beside eight labels is a second, redundant list. Kept
 * in the lab because it is the most direct answer to "keep the lines, just stop
 * them overlaying" and someone should be able to see why that is not enough.
 */
export function VariantTicks({ headings, wavelength, activeId, onSelect }: VariantProps) {
  const accent = wavelengths[wavelength].hex;

  return (
    <>
      <RailCaption>On this page</RailCaption>
      <ul className="flex flex-col">
        {headings.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={active ? "true" : undefined}
                onClick={() => onSelect?.(heading.id)}
                className={`group relative block rounded-sm py-[7px] pr-1 outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong ${
                  heading.depth === 3 ? "pl-11" : "pl-8"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-[15px] h-px transition-all duration-200 ease-out motion-reduce:transition-none ${
                    heading.depth === 3 ? "left-4" : "left-0"
                  } ${active ? "" : "bg-hairline-strong group-hover:bg-muted"}`}
                  style={{
                    width: active ? 24 : heading.depth === 3 ? 10 : 16,
                    ...(active ? { backgroundColor: accent, height: 2 } : null),
                  }}
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
