/**
 * DESIGN TRIAL — see PR description. Easy to revert: drop the import and
 * <GrainOverlay /> line in PageShell.tsx and delete this file.
 *
 * A near-invisible noise texture over the page's flat `ink` background. At
 * 100% flat black, the large empty stretches this site relies on for
 * whitespace read slightly like a flat PNG rather than something crafted —
 * a few percent of grain is the cheapest fix for that, and it's purely a
 * background layer: fixed to the viewport (so it never needs to be as tall
 * as the page), `-z-10` so it sits behind every unpositioned element
 * regardless of DOM order, and `pointer-events-none` so it never intercepts
 * a click. No JS — the texture is a self-contained inline SVG filter, no
 * image request.
 */
const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 opacity-[0.035]"
      style={{ backgroundImage: `url("${NOISE_SVG}")` }}
    />
  );
}
