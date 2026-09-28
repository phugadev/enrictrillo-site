import fs from "fs";
import path from "path";
import minima from "@/styles/minima-palette.json";
import type { Topic } from "./site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const SERIF = "Instrument Serif";
const SANS = "Inter";

/**
 * Font files for `ImageResponse`. Satori (which backs next/og) has no notion
 * of the page's @font-face rules, so the card's two faces are committed under
 * assets/fonts/: Instrument Serif for the title, as on the article headline,
 * and Inter for the grey line, as in the post header.
 *
 * Committed rather than fetched at request time: these routes are fully
 * static, so a fetch would only run during `next build`, and making the build
 * depend on fonts.gstatic.com for two files that don't change is a cost with
 * no matching benefit. ttf, not woff2: Satori only takes ttf/otf/woff.
 */
let ogFontsCache: { name: string; data: Buffer; weight: 400; style: "normal" }[] | null = null;

export function ogFonts() {
  if (ogFontsCache) return ogFontsCache;

  const dir = path.join(process.cwd(), "assets/fonts");
  ogFontsCache = [
    { name: SERIF, data: fs.readFileSync(path.join(dir, "InstrumentSerif-Regular.ttf")), weight: 400, style: "normal" },
    { name: SANS, data: fs.readFileSync(path.join(dir, "Inter-Regular.ttf")), weight: 400, style: "normal" },
  ];
  return ogFontsCache;
}

/** The light ground, as the site opens by default. */
const light = minima.light;
const DOT: Record<Topic, string> = {
  frontend: light["amber-solid"],
  backend: light["green-solid"],
  infrastructure: light["blue-solid"],
  ai: light["purple-solid"],
};

/**
 * Shared OG card, said the way a post header says it: one grey line placing
 * the page (a topic dot where there is one), the title in the serif, and the
 * name and address in grey. No spectrum bar, mono label or rule — the quiet
 * redesign (#79) removed those from the site, and the card now matches it.
 *
 * Kept to plain flex/colour CSS — Satori only supports a subset of CSS, and
 * every element with more than one child needs an explicit `display: flex`.
 */
export function OgCard({
  title,
  eyebrow,
  topic,
  footer,
}: {
  title: string;
  eyebrow: string;
  topic?: Topic;
  footer: string;
}) {
  const grey = light["subtle-foreground"];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: light["background"],
        padding: 80,
        fontFamily: SANS,
        fontSize: 30,
        color: grey,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {topic && <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: DOT[topic] }} />}
        <div style={{ display: "flex" }}>{eyebrow}</div>
      </div>

      <div
        style={{
          display: "flex",
          fontFamily: SERIF,
          fontSize: title.length > 60 ? 76 : 92,
          lineHeight: 1.08,
          letterSpacing: -0.5,
          color: light["foreground"],
          maxWidth: 1000,
          textWrap: "balance",
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>{footer}</div>
        <div style={{ display: "flex" }}>enrictrillo.com</div>
      </div>
    </div>
  );
}
