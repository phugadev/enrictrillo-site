import fs from "fs";
import path from "path";
import { palette } from "./palette";
import { wavelengthOrder, wavelengths, type Wavelength } from "./site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const OG_FONT_FAMILY = "Space Grotesk";

/**
 * Font weights for `ImageResponse`. Satori (which backs next/og) has no
 * notion of the page's @font-face rules — without this, every OG card fell
 * back to its own generic sans, a typeface that appears nowhere else on the
 * site, right next to the h1 it's supposed to be advertising.
 *
 * Weight files are committed under assets/fonts/ rather than fetched from
 * Google Fonts at request time: these routes are fully static
 * (generateStaticParams covers every post/band/series), so a network fetch
 * here would only ever run during `next build` — but making the build depend
 * on fonts.gstatic.com being reachable, for two files that don't change, is a
 * cost with no matching benefit. woff, not woff2 or the variable font next/
 * font/google loads for the page itself: Satori's font shaper only takes
 * ttf/otf/woff.
 */
let ogFontsCache: { name: string; data: Buffer; weight: 400 | 500; style: "normal" }[] | null = null;

export function ogFonts() {
  if (ogFontsCache) return ogFontsCache;

  const dir = path.join(process.cwd(), "assets/fonts");
  ogFontsCache = [
    { name: OG_FONT_FAMILY, data: fs.readFileSync(path.join(dir, "SpaceGrotesk-Regular.woff")), weight: 400, style: "normal" },
    { name: OG_FONT_FAMILY, data: fs.readFileSync(path.join(dir, "SpaceGrotesk-Medium.woff")), weight: 500, style: "normal" },
  ];
  return ogFontsCache;
}

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
  const accent = wavelength ? wavelengths[wavelength].hex : palette.paper;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: palette.ink,
        padding: 72,
        fontFamily: OG_FONT_FAMILY,
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
          fontWeight: 500,
          lineHeight: 1.15,
          color: palette.paper,
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
          color: palette.muted,
          borderTop: `1px solid ${palette.hairline}`,
          paddingTop: 28,
        }}
      >
        <div style={{ display: "flex" }}>{footer}</div>
        <div style={{ display: "flex" }}>enrictrillo.com</div>
      </div>
    </div>
  );
}
