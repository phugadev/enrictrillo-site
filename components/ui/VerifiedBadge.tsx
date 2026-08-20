/**
 * A small verified-style badge next to the name in the hero — the same
 * "this is really me" signal noechague-site.vercel.app carries next to its
 * own name, in this site's own compute blue rather than a platform's blue.
 * Purely decorative (the name text itself already carries the meaning), so
 * it's hidden from assistive tech.
 */

/*
  The mark is a single evenodd path in two subpaths. The first is the
  scalloped outer edge: twelve lobes drawn as alternating arcs, the wider
  4.62-radius arcs at the points and the tighter 3.84-radius arcs across the
  notches, which gives the edge its starburst rhythm rather than the even
  flower a uniform radius produces. The second subpath is the tick, and
  because the fill rule is evenodd it knocks out of the fill instead of
  being stroked on top — so the tick is the background showing through and
  stays crisp at 16px, with no stroke weight to tune per size.
*/
const BADGE =
  "M12.00 1.00A4.62 4.62 0 0 1 14.58 3.22A3.84 3.84 0 0 1 17.95 2.75A4.62 4.62 0 0 1 18.92 6.01A3.84 3.84 0 0 1 22.01 7.43A4.62 4.62 0 0 1 21.06 10.70A3.84 3.84 0 0 1 22.89 13.57A4.62 4.62 0 0 1 20.32 15.80A3.84 3.84 0 0 1 20.31 19.20A4.62 4.62 0 0 1 16.95 19.70A3.84 3.84 0 0 1 15.10 22.55A4.62 4.62 0 0 1 12.00 21.15A3.84 3.84 0 0 1 8.90 22.55A4.62 4.62 0 0 1 7.05 19.70A3.84 3.84 0 0 1 3.69 19.20A4.62 4.62 0 0 1 3.68 15.80A3.84 3.84 0 0 1 1.11 13.57A4.62 4.62 0 0 1 2.94 10.70A3.84 3.84 0 0 1 1.99 7.43A4.62 4.62 0 0 1 5.08 6.01A3.84 3.84 0 0 1 6.05 2.75A4.62 4.62 0 0 1 9.42 3.22A3.84 3.84 0 0 1 12.00 1.00Z M10.55 16.05 L6.95 12.45 L8.6 10.8 L10.55 12.75 L15.4 7.9 L17.05 9.55 Z";

export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d={BADGE} fillRule="evenodd" className="fill-compute" />
    </svg>
  );
}
