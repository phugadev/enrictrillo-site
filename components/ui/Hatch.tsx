/**
 * A section break with more weight than a rule and less than a heading —
 * a 315° diagonal derived from the rule token, so it flips with the exposure.
 * From @ruskel/ui.
 */
export function Hatch({ tall = false, className = "" }: { tall?: boolean; className?: string }) {
  return (
    <div
      role="separator"
      className={`rsk-hatch${tall ? " rsk-hatch--tall" : ""} ${className}`.trim()}
    />
  );
}
