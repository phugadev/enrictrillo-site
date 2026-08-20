import type { Wavelength } from "@/lib/site";

/**
 * The leading mark on a Latest writing row: a framed tile holding four short
 * bars, read as a page of text seen from far enough away that the words have
 * gone and only the shape of the paragraph is left.
 *
 * It replaced a line-art page icon. The icon drew a document — frame, three
 * ruled lines — at a size where the frame inside a frame was mostly noise.
 * The bars drop the outline and keep the only part that was doing any work,
 * which also makes the mark read as a diagram rather than as clip art, the
 * same distinction `.rsk-tile` was introduced to make.
 *
 * Bar widths are deliberately uneven and end short, the way a real last line
 * of a paragraph does. They sit in the band's own colour, inherited through
 * `.rsk-tile--band`'s `currentColor`, so a list of posts carries its
 * taxonomy in the left margin without a single word of label.
 */
const BARS = [11, 22, 17, 9];

export function PostPreviewMark({
  wavelength,
  className = "",
}: {
  wavelength: Wavelength;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      data-band={wavelength}
      className={`rsk-tile rsk-tile--band ${className}`.trim()}
    >
      <span className="flex flex-col gap-[3px]">
        {BARS.map((width, i) => (
          <span
            key={i}
            className="block h-[2px] rounded-full bg-current opacity-60 transition-opacity duration-150 group-hover:opacity-100"
            style={{ width }}
          />
        ))}
      </span>
    </span>
  );
}
