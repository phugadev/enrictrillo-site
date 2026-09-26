import Image from "next/image";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { Wavelength } from "@/lib/site";
import { band } from "@/lib/bands";
import { CodeBlock } from "./CodeBlock";
import { Diagram } from "./Diagram";
import { InfoIcon, SuccessIcon, TipIcon, WarningIcon } from "./ui/CalloutIcons";
import { Cell, Plate } from "./ui/Plate";
import { Zigzag } from "./ui/Zigzag";

const FIGURE = "my-stack";
const CAPTION = "figure mt-inset text-center type-caption-sm not-italic text-faint";
const FRAME = "rounded-panel border border-border";

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

const CHIP = "figure inline-flex w-fit items-center rounded-chip border border-border px-2 py-0.5 type-caption-sm text-subtle-foreground";

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
 *
 * Built on Plate (components/ui/Plate.tsx): one raised panel divided by
 * hairlines, rather than two detached cards. `Plate` and `Cell` are also
 * exported to MDX for cases the items API does not cover.
 */
export function Compare({ items, caption }: { items: CompareItem[]; caption?: string }) {
  return (
    <Plate caption={caption}>
      {items.map((item, i) => (
        <Cell
          key={i}
          verdict={item.outcome === "good" ? "yes" : "no"}
          label={item.outcome === "good" ? "Works" : "Doesn't work"}
        >
          <code className="block whitespace-pre-wrap bg-transparent p-0 font-mono type-caption leading-relaxed text-foreground">
            {item.code}
          </code>
          <span className={CHIP}>{item.label}</span>
        </Cell>
      ))}
    </Plate>
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
  const b = band[wavelength];

  return (
    <aside className={`my-stack flex gap-gutter rounded-panel border p-gutter ${b.chip}`}>
      <span
        aria-hidden="true"
        className="flex size-7 shrink-0 items-center justify-center rounded-control-sm border border-current/25 bg-background/40"
      >
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0 [&_p]:m-0 [&_p+p]:mt-inset">
        <p className="signal type-label-sm">{label}</p>
        <div className="mt-1 type-body text-muted-foreground">{children}</div>
      </div>
    </aside>
  );
}

// CodeBlock intercepts `figure`, not `pre`: rehype-pretty-code emits the
// title as a sibling of the pre, so a pre-level override can never reach it.
/**
 * `---` in a post renders as a dinkus rather than a rule.
 *
 * A full-measure horizontal line is the same mark the site uses for
 * *structure* — the hatch, the rules under section labels, the divider above
 * the end-of-post nav — and it was saying "a region of the page has ended"
 * in the middle of an argument, where nothing structural had happened at
 * all. The zigzag is short and centred on purpose: it is the author's beat,
 * not the layout's. See the rule written down in components/ui/Zigzag.tsx —
 * it must never span the column, or it becomes a saw blade doing Hatch's job
 * badly.
 */
function Break() {
  return (
    <div className="my-section flex w-full items-center justify-center text-gray-border-strong">
      <Zigzag />
    </div>
  );
}

// Non-code figures pass straight through.
export const mdxComponents = {
  img: MdxImage,
  Figure,
  Compare,
  Plate,
  Cell,
  Callout,
  Diagram,
  figure: CodeBlock,
  hr: Break,
};
