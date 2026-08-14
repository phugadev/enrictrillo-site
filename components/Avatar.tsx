import { site, wavelengthOrder, wavelengths } from "@/lib/site";

/**
 * The full spectrum as a circular sweep — the same four band colours as
 * everywhere else on the site, arranged as a ring instead of a horizontal
 * strip. Closes back on its start colour so the loop has no visible seam.
 */
const ascending = [...wavelengthOrder].reverse();
const RING_GRADIENT = `conic-gradient(from 180deg, ${ascending
  .map((w) => wavelengths[w].hex)
  .join(", ")}, ${wavelengths[ascending[0]].hex})`;

/**
 * The headshot, served from public/ rather than hotlinked. The source LinkedIn
 * CDN URL is signed and carries an expiry, so linking it directly would have
 * gone 403 within weeks and left a broken portrait on the one page that most
 * needs to look composed.
 *
 * A plain <img>, not next/image. The source is a fixed 200×200 and 8.5 KB, so
 * there is no srcset worth generating and no lazy-loading worth doing — it sits
 * at the top of the homepage. Pulling next/image in for it added 5 KB of client
 * JS to a page that otherwise ships none.
 *
 * Dimensions are set both ways so the row can't shift while it decodes. The
 * spectrum ring is a plain conic-gradient behind a solid-`ink` gap — this is
 * only ever used against the page's own `ink` background (the homepage
 * hero), so that gap colour is hardcoded rather than themed.
 */
export function Avatar({ size = 56 }: { size?: number }) {
  return (
    <span className="inline-block shrink-0 rounded-full p-[2px]" style={{ background: RING_GRADIENT }}>
      <img
        src="/headshot.jpg"
        alt={`${site.name}, ${site.role}`}
        width={size}
        height={size}
        decoding="async"
        className="rounded-full border-2 border-ink object-cover"
        style={{ width: size, height: size }}
      />
    </span>
  );
}
