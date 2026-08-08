import type { Config } from "tailwindcss";

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
        muted: "#93959C",
        faint: "#5A5C63",
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
        DEFAULT: {
          css: {
            "--tw-prose-body": "#D8D5CC",
            "--tw-prose-headings": "#EDEAE2",
            "--tw-prose-links": "#E3A24C",
            "--tw-prose-bold": "#EDEAE2",
            "--tw-prose-quotes": "#D8D5CC",
            "--tw-prose-quote-borders": "#26282E",
            "--tw-prose-code": "#EDEAE2",
            "--tw-prose-pre-bg": "#141519",
            "--tw-prose-hr": "#26282E",
            maxWidth: "none",
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
