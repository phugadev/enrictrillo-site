import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

const FIGURE = "my-8";
const CAPTION = "mt-3 text-center font-mono text-[12px] not-italic text-faint";
const FRAME = "rounded-lg border border-hairline";

/** Prose column width, so the browser can pick a sensible source. */
const SIZES = "(max-width: 768px) 100vw, 672px";

/**
 * Plain markdown images — `![alt](/shot.png "Optional caption")`. The markdown
 * title becomes the caption. Dimensions aren't knowable from markdown, so this
 * stays a lazy <img> rather than next/image; reach for <Figure> when you want
 * optimisation. rehype-unwrap-images strips the wrapping <p> first, so the
 * <figure> isn't nested inside a paragraph (invalid HTML, and a hydration
 * mismatch).
 */
function MdxImage({ src, alt, title }: ComponentPropsWithoutRef<"img">) {
  if (typeof src !== "string") return null;

  return (
    <figure className={FIGURE}>
      <img
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
        className={`${FRAME} mx-auto h-auto max-w-full`}
      />
      {title && <figcaption className={CAPTION}>{title}</figcaption>}
    </figure>
  );
}

/**
 * Optimised image for when you know the dimensions:
 *
 *   <Figure src="/shots/watchman.png" alt="…" width={1600} height={900}
 *           caption="Alert pipeline at 200ms." />
 */
export function Figure({
  src,
  alt,
  width,
  height,
  caption,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number | string;
  height: number | string;
  caption?: string;
  priority?: boolean;
}) {
  return (
    <figure className={FIGURE}>
      <Image
        src={src}
        alt={alt}
        width={Number(width)}
        height={Number(height)}
        priority={priority}
        sizes={SIZES}
        className={`${FRAME} h-auto w-full`}
      />
      {caption && <figcaption className={CAPTION}>{caption}</figcaption>}
    </figure>
  );
}

type CompareItem = {
  /** The snippet to display, mono-styled — a short line or two, not a paragraph. */
  code: string;
  /** Small chip under the snippet naming its source or scenario, e.g. "button.md". */
  label: string;
  outcome: "good" | "bad";
};

const PANEL = "flex flex-col gap-4 rounded-lg border border-hairline bg-surface p-5";
const CHIP = "inline-flex w-fit items-center rounded-full border border-hairline px-2.5 py-1 font-mono text-[11px] text-faint";

/**
 * A "wrong way / right way" pair of panels for the rare post making a single,
 * concrete before/after point — e.g. a prompt with no context next to the
 * same prompt with it, and what each one produces. Each panel is a mono
 * snippet styled the same as inline `code` elsewhere in prose, a small chip
 * naming where it came from, and a status mark for whether it worked.
 *
 * This is a bespoke, opt-in illustration, not a replacement for fenced code
 * blocks — reach for it only when a post is actually contrasting two inputs,
 * not as a general restyle. Designed for two items side by side (stacking on
 * mobile); more will still lay out but get cramped past three.
 *
 *   <Compare
 *     items={[
 *       { code: 'Use variant="danger".', label: "No context", outcome: "bad" },
 *       { code: 'emphasis="high", per button.md.', label: "button.md", outcome: "good" },
 *     ]}
 *   />
 */
export function Compare({ items }: { items: CompareItem[] }) {
  return (
    <div className="my-8 flex flex-col gap-4 sm:grid sm:grid-cols-2">
      {items.map((item, i) => (
        <div key={i} className={PANEL}>
          <code className="block whitespace-pre-wrap text-[13px] leading-relaxed">{item.code}</code>
          <span className={CHIP}>{item.label}</span>
          <p className="mt-auto flex items-center gap-2 pt-1 font-mono text-[11px] uppercase tracking-wider">
            <span
              aria-hidden="true"
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                item.outcome === "good" ? "border-systems text-systems" : "border-hairline text-faint"
              }`}
            >
              {item.outcome === "good" ? "✓" : "✕"}
            </span>
            <span className={item.outcome === "good" ? "text-systems" : "text-faint"}>
              {item.outcome === "good" ? "Works" : "Doesn't work"}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

export const mdxComponents = { img: MdxImage, Figure, Compare };
