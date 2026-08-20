import type { Wavelength } from "@/lib/site";
import { ArticleIcon } from "./ArticleIcon";

/**
 * A small icon in a wavelength-tinted frame.
 *
 * Now the `.rsk-tile--band` primitive from @ruskel/ui rather than a
 * hand-rolled box. The old version built its tint by concatenating alpha onto
 * a hex string (`${hex}40`), which only worked because every band value
 * happened to be six-digit hex — the tokens are oklch now, so that would have
 * broken silently. The primitive uses color-mix against --rsk-mark instead,
 * and picks up the house 4px radius rather than the 8px it had.
 */
export function WavelengthIcon({
  wavelength,
  className = "",
}: {
  wavelength: Wavelength;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      data-band={wavelength}
      className={`rsk-tile rsk-tile--band ${className}`.trim()}
    >
      <ArticleIcon className="h-4 w-4" />
    </span>
  );
}
