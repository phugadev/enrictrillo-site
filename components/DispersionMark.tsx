/**
 * The site's signature element, carried over from the previous build but
 * scaled down from a hero-level HUD motif to a quiet brand mark: a single
 * ray entering from the left and splitting into the four wavelength
 * accents used throughout the site (interface / systems / compute / intelligence).
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
      <line x1="1" y1="12" x2="10" y2="12" stroke="#8A8D93" strokeWidth="1.4" />
      <line x1="10" y1="12" x2="22" y2="4" stroke="#E3A24C" strokeWidth="1.4" />
      <line x1="10" y1="12" x2="23" y2="9" stroke="#5FBF86" strokeWidth="1.4" />
      <line x1="10" y1="12" x2="23" y2="16" stroke="#4C93E0" strokeWidth="1.4" />
      <line x1="10" y1="12" x2="22" y2="21" stroke="#9C7BE6" strokeWidth="1.4" />
      <circle cx="10" cy="12" r="1.4" fill="#EDEAE2" />
    </svg>
  );
}

/** A thin vertical spine used beside post titles/cards, colored by wavelength. */
export function WavelengthSpine({ hex }: { hex: string }) {
  return <span aria-hidden="true" className="inline-block w-[3px] self-stretch rounded-full" style={{ backgroundColor: hex }} />;
}
