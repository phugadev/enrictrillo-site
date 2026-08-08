import { wavelengthOrder, wavelengths, type Wavelength } from "./site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * Shared OG card. Kept to plain flex/colour CSS — Satori (which backs
 * next/og) only supports a subset of CSS, and every element with more than
 * one child needs an explicit `display: flex`.
 */
export function OgCard({
  title,
  eyebrow,
  wavelength,
  footer,
}: {
  title: string;
  eyebrow: string;
  wavelength?: Wavelength;
  footer: string;
}) {
  const accent = wavelength ? wavelengths[wavelength].hex : "#EDEAE2";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0B0C0E",
        padding: 72,
      }}
    >
      {/* Spectrum bar — the dispersion mark, flattened for a 1200px canvas */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", height: 6 }}>
          {wavelengthOrder.map((w) => (
            <div
              key={w}
              style={{
                width: 56,
                height: 6,
                backgroundColor: wavelengths[w].hex,
                opacity: wavelength && w !== wavelength ? 0.25 : 1,
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: accent,
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: title.length > 60 ? 60 : 76,
          lineHeight: 1.15,
          color: "#EDEAE2",
          letterSpacing: -1.5,
          maxWidth: 940,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 24,
          color: "#5A5C63",
          borderTop: "1px solid #26282E",
          paddingTop: 28,
        }}
      >
        <div style={{ display: "flex" }}>{footer}</div>
        <div style={{ display: "flex" }}>enrictrillo.com</div>
      </div>
    </div>
  );
}
