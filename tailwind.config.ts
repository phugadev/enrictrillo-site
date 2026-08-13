import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { cssVars, palette } from "./lib/palette";

/**
 * The site is dark-only, so `prose` and `prose-invert` have to resolve to the
 * same palette. The typography plugin emits `.prose-invert` after `.prose` at
 * equal specificity, so customising `DEFAULT` alone silently loses every value
 * the moment `prose-invert` is applied — body copy fell back to the plugin's
 * cool grey and prose links rendered white instead of the amber accent.
 * Spreading one object into both modifiers keeps them from diverging again.
 */
const proseColors = {
  "--tw-prose-body": palette.prose,
  // The plugin defines ~15 of these and silently falls back to its own greys
  // for any you leave out. Setting only the obvious nine left table rules,
  // bullets and captions rendering in Tailwind's cool gray-500/600 — visibly
  // lighter and bluer than `hairline`, which is what every other rule on the
  // site uses. If you add a prose element, check its variable is covered here.
  "--tw-prose-lead": palette.muted,
  "--tw-prose-counters": palette.faint,
  "--tw-prose-bullets": palette.faint,
  "--tw-prose-captions": palette.faint,
  "--tw-prose-th-borders": palette.hairline,
  "--tw-prose-td-borders": palette.hairline,
  "--tw-prose-kbd": palette.paper,
  "--tw-prose-pre-code": palette.paper,
  "--tw-prose-headings": palette.paper,
  "--tw-prose-links": palette.interface,
  "--tw-prose-bold": palette.paper,
  "--tw-prose-quotes": palette.prose,
  "--tw-prose-quote-borders": palette.hairline,
  "--tw-prose-code": palette.paper,
  "--tw-prose-pre-bg": palette.surfaceRaised,
  "--tw-prose-hr": palette.hairline,
};

const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./content/**/*.mdx"],
  theme: {
    extend: {
      colors: {
        ink: palette.ink,
        surface: palette.surface,
        "surface-2": palette.surfaceRaised,
        hairline: palette.hairline,
        paper: palette.paper,
        muted: palette.muted,
        faint: palette.faint,
        interface: palette.interface,
        systems: palette.systems,
        compute: palette.compute,
        intelligence: palette.intelligence,
      },
      fontFamily: {
        display: ["var(--font-display)"],
        // Inter, not Space Grotesk — see the note in app/layout.tsx.
        body: ["var(--font-body)"],
        // Long-form only. Loaded by app/blog/[slug]/layout.tsx, not the root.
        reading: ["var(--font-reading)"],
        mono: ["var(--font-mono)"],
      },
      typography: () => ({
        DEFAULT: { css: { ...proseColors, maxWidth: "none" } },
        invert: { css: proseColors },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // Publishes the palette as :root custom properties. globals.css can't
    // import TypeScript, and this is what stops it keeping a second copy of
    // every hex — see lib/palette.ts.
    plugin(({ addBase }) => addBase({ ":root": cssVars })),
  ],
};

export default config;
