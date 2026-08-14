import { wavelengths, type Wavelength } from "@/lib/site";
import { ArticleIcon } from "./ArticleIcon";

/**
 * A small icon in a padded, wavelength-tinted box — the "outer padded area
 * coloured by wavelength" treatment from noechague-site.vercel.app's
 * writing teaser, adapted to carry this site's own band colours instead of
 * a neutral icon. Article-only for now; generalise the icon if a second use
 * case shows up rather than guessing at a prop shape in advance.
 */
export function WavelengthIcon({
  wavelength,
  className = "",
}: {
  wavelength: Wavelength;
  className?: string;
}) {
  const hex = wavelengths[wavelength].hex;

  return (
    <span
      aria-hidden="true"
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${className}`}
      style={{ borderColor: `${hex}40`, backgroundColor: `${hex}14`, color: hex }}
    >
      <ArticleIcon className="h-4 w-4" />
    </span>
  );
}
