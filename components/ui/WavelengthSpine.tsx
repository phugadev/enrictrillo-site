import { wavelengths, type Wavelength } from "@/lib/site";

/**
 * The thin vertical rule beside a post row, coloured by wavelength. Takes the
 * band rather than a hex so callers don't plumb colours around — same contract
 * as WavelengthDot. Decorative: the band is named in the adjacent text.
 */
export function WavelengthSpine({ wavelength }: { wavelength: Wavelength }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block w-[3px] self-stretch rounded-full"
      style={{ backgroundColor: wavelengths[wavelength].hex }}
    />
  );
}
