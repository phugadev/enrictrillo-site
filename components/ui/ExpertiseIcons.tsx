/**
 * Small hand-drawn line-art icons for the Expertise pills, matching the
 * stroke weight and single-colour idiom of `DispersionMark` — thin
 * `currentColor` strokes, no fills, no icon-library dependency.
 */

type IconProps = { className?: string };

const shared = {
  viewBox: "0 0 20 20",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

/** Two overlapping rounded panes — a product surface shipping. */
export function ProductEngineeringIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <rect x="3" y="3" width="11" height="9" rx="1.5" />
      <rect x="6" y="8" width="11" height="9" rx="1.5" />
    </svg>
  );
}

/** Three nodes connected by thin lines — architecture and connections. */
export function SystemDesignIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <line x1="5" y1="15" x2="10" y2="5" />
      <line x1="15" y1="15" x2="10" y2="5" />
      <line x1="5" y1="15" x2="15" y2="15" />
      <circle cx="10" cy="5" r="1.6" />
      <circle cx="5" cy="15" r="1.6" />
      <circle cx="15" cy="15" r="1.6" />
    </svg>
  );
}

/** A minimal cloud outline built from overlapping arcs. */
export function CloudIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M5.5 15a3 3 0 0 1-.5-5.96 3.5 3.5 0 0 1 6.7-1.7A3 3 0 0 1 16 9.5a2.75 2.75 0 0 1-.5 5.5h-10Z" />
    </svg>
  );
}

/** A four-point sparkle — two crossed elongated diamonds. */
export function SparkleIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M10 2.5c0 3.5 1 5.5 4.5 6.5-3.5 1-4.5 3-4.5 6.5 0-3.5-1-5.5-4.5-6.5C9 8 10 6 10 2.5Z" />
    </svg>
  );
}
