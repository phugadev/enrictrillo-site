import type { Config } from "tailwindcss";

/**
 * The site is dark-only, so `prose` and `prose-invert` have to resolve to the
 * same palette. The typography plugin emits `.prose-invert` after `.prose` at
 * equal specificity, so customising `DEFAULT` alone silently loses every value
 * the moment `prose-invert` is applied — body copy fell back to the plugin's
 * cool grey and prose links rendered white instead of the amber accent.
 * Spreading one object into both modifiers keeps them from diverging again.
 */
const proseColors = {
  "--tw-prose-body": "#D8D5CC",
  "--tw-prose-headings": "#EDEAE2",
  "--tw-prose-links": "#E3A24C",
  "--tw-prose-bold": "#EDEAE2",
  "--tw-prose-quotes": "#D8D5CC",
  "--tw-prose-quote-borders": "#26282E",
  "--tw-prose-code": "#EDEAE2",
  "--tw-prose-pre-bg": "#141519",
  "--tw-prose-hr": "#26282E",
};

const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./content/**/*.mdx"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0C0E",
        surface: "#141519",
        "surface-2": "#1B1D22",
        hairline: "#26282E",
        paper: "#EDEAE2",
        muted: "#93959C", // 6.54:1 on ink — AA
        // Was #5A5C63 at 2.93:1, which failed AA at every size while carrying
        // all dates, labels and the post readout. #7A7C85 is 4.71:1 and still
        // reads clearly below `muted`.
        faint: "#7A7C85",
        interface: "#E3A24C", // 590nm
        systems: "#5FBF86",  // 520nm
        compute: "#4C93E0",  // 470nm
        intelligence: "#9C7BE6", // 405nm
      },
      fontFamily: {
        display: ["var(--font-display)"],
        // Body shares the display face site-wide — one less family to load.
        body: ["var(--font-display)"],
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
  plugins: [require("@tailwindcss/typography")],
};

export default config;
