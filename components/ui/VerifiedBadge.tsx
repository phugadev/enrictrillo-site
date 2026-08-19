/**
 * A small verified-style badge next to the name in the hero — the same
 * "this is really me" signal noechague-site.vercel.app carries next to its
 * own name, in this site's own compute blue rather than a platform's blue.
 * Purely decorative (the name text itself already carries the meaning), so
 * it's hidden from assistive tech.
 */
export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <circle cx="10" cy="10" r="9" className="fill-compute" />
      {/*
        The tick is stroked by class, not by a stroke= attribute: presentation
        attributes do not resolve var(), so the old `stroke="var(--c-paper)"`
        was never applying. Ink is the system's foreground on any mark.
      */}
      <path
        d="M6 10.2l2.4 2.4L14 7"
        fill="none"
        className="stroke-ink"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
