import type { Wavelength } from "@/lib/site";
import { band } from "@/lib/bands";

/** A band as a mark: seen, not read. Always beside a label that names it. */
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
      className={`inline-block size-1.5 shrink-0 rounded-full ${band[wavelength].mark} ${className}`}
    />
  );
}
