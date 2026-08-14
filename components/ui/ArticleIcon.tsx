type IconProps = { className?: string };

/**
 * A page with a few lines of text — the Latest writing teaser's leading
 * mark, matching the stroke weight and single-colour idiom of the
 * Expertise icons (thin `currentColor` strokes, no fills).
 */
export function ArticleIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="4" y="3" width="12" height="14" rx="1.5" />
      <line x1="7" y1="7" x2="13" y2="7" />
      <line x1="7" y1="10" x2="13" y2="10" />
      <line x1="7" y1="13" x2="10" y2="13" />
    </svg>
  );
}
