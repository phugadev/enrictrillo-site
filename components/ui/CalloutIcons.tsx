/**
 * Small line-art marks for the `Callout` MDX component — same stroke
 * weight and single-colour idiom as `ExpertiseIcons`, sized for the
 * variant label rather than a pill.
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

/** A circled lowercase "i" — info. */
export function InfoIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <circle cx="10" cy="10" r="7" />
      <line x1="10" y1="9" x2="10" y2="13.5" />
      <circle cx="10" cy="6.5" r="0.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** A triangle with an exclamation mark — warning. */
export function WarningIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M10 3.5 17 15.5H3Z" />
      <line x1="10" y1="8.5" x2="10" y2="12" />
      <circle cx="10" cy="14" r="0.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** A circled checkmark — success. */
export function SuccessIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <circle cx="10" cy="10" r="7" />
      <path d="M7 10.2 9 12.2 13.2 7.8" />
    </svg>
  );
}

export { SparkleIcon as TipIcon } from "./ExpertiseIcons";
