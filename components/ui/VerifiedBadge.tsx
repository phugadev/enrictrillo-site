/**
 * A small verified-style badge next to the name in the hero — the same
 * "this is really me" signal noechague-site.vercel.app carries next to its
 * own name, in this site's own compute blue rather than a platform's blue.
 * Purely decorative (the name text itself already carries the meaning), so
 * it's hidden from assistive tech.
 */

/*
  The outer edge is a twelve-lobed scallop rather than a plain circle: each
  lobe is one quadratic arc between two notch points on the inner radius
  (7.7), with the control point placed so the curve's midpoint lands exactly
  on the outer radius (9.6). Even lobe count keeps it symmetric about both
  axes, so the badge sits level next to the name at any size. Generated
  geometry, inlined — there is nothing to recompute at runtime.
*/
const SCALLOP =
  "M17.70 10.00Q21.36 13.04 16.67 13.85Q18.32 18.32 13.85 16.67Q13.04 21.36 10.00 17.70Q6.96 21.36 6.15 16.67Q1.68 18.32 3.33 13.85Q-1.36 13.04 2.30 10.00Q-1.36 6.96 3.33 6.15Q1.68 1.68 6.15 3.33Q6.96 -1.36 10.00 2.30Q13.04 -1.36 13.85 3.33Q18.32 1.68 16.67 6.15Q21.36 6.96 17.70 10.00Z";

export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path d={SCALLOP} className="fill-compute" />
      {/*
        The tick is stroked by class, not by a stroke= attribute: presentation
        attributes do not resolve var(), so the old `stroke="var(--c-paper)"`
        was never applying. Ink is the system's foreground on any mark.
      */}
      <path
        d="M6.3 10.2l2.3 2.3L13.7 7.4"
        fill="none"
        className="stroke-ink"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
