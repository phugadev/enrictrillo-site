import { wavelengths, type Wavelength } from "@/lib/site";

/**
 * The small colour-coded dot used wherever something carries a wavelength —
 * projects, credentials, post links. Decorative: the label is always adjacent
 * in text, so it's hidden from assistive tech.
 */
export function WavelengthDot({
  wavelength,
  className = "",
}: {
  wavelength: Wavelength;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`h-1.5 w-1.5 shrink-0 rounded-full ${className}`}
      style={{ backgroundColor: wavelengths[wavelength].hex }}
    />
  );
}
