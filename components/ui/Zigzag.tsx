/**
 * A zigzag mark — a run of 45° peaks and valleys, drawn as one continuous
 * stroke.
 *
 * TRIAL, not yet shipped. It exists to be compared against `Hatch` on
 * /lab/post-header, because the two look adjacent and are not the same thing:
 *
 *   Hatch    a *structural* break. Repeating 315° strokes derived from
 *            --rsk-rule-strong, spanning the full measure. It says "one region
 *            of the page has ended and another begins" — chrome talking about
 *            layout.
 *   Zigzag   a *prose* break. A short, centred, single stroke, the modern
 *            descendant of the dinkus (* * *). It says "the argument turns
 *            here" — the author talking about the writing.
 *
 * Which is why this deliberately does NOT span the column. A full-measure
 * zigzag stops reading as a mark and starts reading as a saw blade, and at
 * that width it competes with Hatch for the same job. Kept at its natural
 * size and centred, it can sit inside an article without claiming to be
 * structure.
 *
 * The path is generated rather than hard-coded so the segment count is a prop
 * instead of a wall of literal coordinates. Geometry matches the reference
 * exactly: 8px per half-segment, peaks at y=0.75, valleys at y=5.25, which
 * gives the 45° slope the 1.5px stroke was drawn for.
 */
export function Zigzag({
  segments = 14,
  className = "",
}: {
  /** Half-segments — 14 gives the reference's 112px width. */
  segments?: number;
  className?: string;
}) {
  const STEP = 8;
  const width = segments * STEP;

  // Even indices sit in the valley, odd on the peak. Starting low means the
  // mark opens and closes on a valley, so it reads as symmetrical.
  const points = Array.from(
    { length: segments + 1 },
    (_, i) => `${i * STEP},${i % 2 === 0 ? 5.25 : 0.75}`,
  );

  return (
    <svg
      role="separator"
      // Decorative in the accessibility tree: role="separator" already carries
      // the meaning, and there is no text here to announce.
      aria-hidden="true"
      width={width}
      height={6}
      viewBox={`0 0 ${width} 6`}
      fill="none"
      // currentColor, so the colour comes from a token utility on the caller
      // (text-hairline-strong at time of writing) rather than being baked in
      // here. Same contract as every other mark in components/ui.
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      // Miter, not round: the corners are the whole character of the mark, and
      // rounding them at 1.5px turns the zigzag into a wave.
      strokeLinejoin="miter"
      className={className}
    >
      <path d={`M${points.join(" L")}`} />
    </svg>
  );
}
