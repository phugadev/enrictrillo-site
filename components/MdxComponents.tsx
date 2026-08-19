import Image from "next/image";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { wavelengths, type Wavelength } from "@/lib/site";
import { CodeBlock } from "./CodeBlock";
import { Diagram } from "./Diagram";
import { InfoIcon, SuccessIcon, TipIcon, WarningIcon } from "./ui/CalloutIcons";

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
                item.outcome === "good" ? "border-systems text-systems-tint" : "border-hairline text-faint"
              }`}
            >
              {item.outcome === "good" ? "✓" : "✕"}
            </span>
            <span className={item.outcome === "good" ? "text-systems-tint" : "text-faint"}>
              {item.outcome === "good" ? "Works" : "Doesn't work"}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

type CalloutVariant = "info" | "warning" | "success" | "tip";

/**
 * A one-to-one mapping onto the site's four wavelength bands rather than a
 * separate red/amber/green severity palette — "info" is `compute`-blue,
 * "warning" is `interface`-amber, and so on. No new colours enter the
 * system; a callout's accent is legible the same way a project's band tag
 * already is.
 */
const CALLOUT_VARIANTS: Record<CalloutVariant, { wavelength: Wavelength; label: string; Icon: typeof InfoIcon }> = {
  info: { wavelength: "compute", label: "Info", Icon: InfoIcon },
  warning: { wavelength: "interface", label: "Warning", Icon: WarningIcon },
  success: { wavelength: "systems", label: "Success", Icon: SuccessIcon },
  tip: { wavelength: "intelligence", label: "Tip", Icon: TipIcon },
};

/**
 * A callout/admonition for prose — the info/danger/tip variants from
 * blog.maximeheckel.com's posts, recoloured onto this site's own four
 * bands instead of importing a new severity palette.
 *
 *   <Callout variant="warning">
 *     Batching trades latency for throughput — don't reach for it on a
 *     path that needs a same-request answer.
 *   </Callout>
 */
export function Callout({ variant = "info", children }: { variant?: CalloutVariant; children: ReactNode }) {
  const { wavelength, label, Icon } = CALLOUT_VARIANTS[variant];
  const hex = wavelengths[wavelength].hex;

  return (
    <div
      className="not-prose my-8 flex gap-3 rounded-lg border p-4"
      style={{ borderColor: `${hex}40`, backgroundColor: `${hex}0d` }}
    >
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border"
        style={{ borderColor: `${hex}40`, backgroundColor: `${hex}14`, color: hex }}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 [&_p]:m-0 [&_p+p]:mt-2">
        <p className="font-mono text-[11px] font-medium uppercase tracking-wider" style={{ color: hex }}>
          {label}
        </p>
        <div className="mt-1 text-[15px] leading-relaxed text-prose">{children}</div>
      </div>
    </div>
  );
}

export const mdxComponents = { img: MdxImage, Figure, Compare, Callout, Diagram, pre: CodeBlock };
