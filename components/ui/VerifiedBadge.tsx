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
      <path
        d="M6 10.2l2.4 2.4L14 7"
        fill="none"
        stroke="var(--c-paper)"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
