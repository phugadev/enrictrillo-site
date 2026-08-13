import { palette } from "@/lib/palette";
import { wavelengthOrder, wavelengths } from "@/lib/site";

/** Where each refracted ray lands, in spectrum order — long wavelength first. */
const RAY_ENDS = [
  { x: 22, y: 4 },
  { x: 23, y: 9 },
  { x: 23, y: 16 },
  { x: 22, y: 21 },
];

/**
 * The site's signature element, carried over from the previous build but
 * scaled down from a hero-level HUD motif to a quiet brand mark: a single
 * ray entering from the left and splitting into the four wavelength
 * accents used throughout the site (interface / systems / compute / intelligence).
 *
 * The rays are mapped from `wavelengthOrder` rather than written out, so the
 * mark can't drift out of order or out of colour with the rest of the site.
 */
export function DispersionMark({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <line x1="1" y1="12" x2="10" y2="12" stroke={palette.ray} strokeWidth="1.4" />
      {wavelengthOrder.map((wavelength, i) => (
        <line
          key={wavelength}
          x1="10"
          y1="12"
          x2={RAY_ENDS[i].x}
          y2={RAY_ENDS[i].y}
          stroke={wavelengths[wavelength].hex}
          strokeWidth="1.4"
        />
      ))}
      <circle cx="10" cy="12" r="1.4" fill={palette.paper} />
    </svg>
  );
}
