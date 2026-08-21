import { site } from "@/lib/site";

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
 * Dimensions are set both ways so the row can't shift while it decodes.
 */
export function Avatar({ size = 56 }: { size?: number }) {
  return (
    <img
      src="/headshot.jpg"
      alt={`${site.name}, ${site.role}`}
      width={size}
      height={size}
      decoding="async"
      className="inline-block shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}
