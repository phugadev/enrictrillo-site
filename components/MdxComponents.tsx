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
      {/* eslint-disable-next-line @next/next/no-img-element */}
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

export const mdxComponents = { img: MdxImage, Figure };
