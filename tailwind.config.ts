import type { Config } from "tailwindcss";

/**
 * Colour comes from @ruskel/tokens, imported at the top of app/globals.css.
 * Nothing here holds a literal — the utilities point at CSS custom properties
 * so a token bump repaints the site without touching this file.
 *
 * `lib/palette.ts` still exists and still holds hex, but it is generated from
 * the same package (see scripts/generate-palette.mjs) and is only for satori
 * and SVG presentation attributes, which cannot read variables.
 */

/**
 * A plain `var()` reference. This used to be a colour *function* returning a
 * `color-mix`, because Tailwind v3 could not apply an alpha modifier to a
 * bare `var()` colour.
 *
 * v4 can, and — importantly — v4's `@config` compatibility layer does not
 * support function-based colour values at all. It does not error on them; it
 * resolves them to nothing. Every band utility (`bg-systems`, `text-compute`
 * and the rest) rendered transparent from the moment this project moved to
 * v4, while the underlying tokens stayed perfectly correct. Nothing failed
 * loudly, so nothing caught it.
 */
const token = (name: string) => `var(--rsk-${name})`;

/**
 * A band resolves to two values. `DEFAULT` is the vivid mark, for fills, dots,
 * rules and borders — things that are seen, not read. `.tint` is the text
 * ring, pulled back to pass AA, and is the only one allowed to colour type.
 * Using the mark as body text fails contrast; using the tint as a fill reads
 * as mud. See the rules in @ruskel/tokens.
 */
const band = (nm: string) => ({ DEFAULT: token(`mark-${nm}`), tint: token(`text-${nm}`) });

const proseColors = {
  "--tw-prose-body": "var(--rsk-text-prose)",
  "--tw-prose-lead": "var(--rsk-text-muted)",
  "--tw-prose-counters": "var(--rsk-text-faint)",
  "--tw-prose-bullets": "var(--rsk-text-faint)",
  "--tw-prose-captions": "var(--rsk-text-faint)",
  "--tw-prose-th-borders": "var(--rsk-rule)",
  "--tw-prose-td-borders": "var(--rsk-rule)",
  "--tw-prose-kbd": "var(--rsk-text)",
  "--tw-prose-pre-code": "var(--rsk-text)",
  "--tw-prose-headings": "var(--rsk-text)",
  // Links are body text with an amber underline, not amber text. Coloured
  // link text at AA on ink lands on a muddy gold — the text ring is pulled
  // back from the gamut ceiling precisely so it can be read, which costs it
  // the chroma that made amber worth using. Moving the signal to the
  // underline keeps full-contrast type and lets the accent sit at mark
  // strength, where it is actually vivid. See .prose a in globals.css.
  "--tw-prose-links": "var(--rsk-text)",
  "--tw-prose-bold": "var(--rsk-text)",
  "--tw-prose-quotes": "var(--rsk-text-prose)",
  "--tw-prose-quote-borders": "var(--rsk-rule)",
  "--tw-prose-code": "var(--rsk-text)",
  "--tw-prose-pre-bg": "var(--rsk-surface-2)",
  "--tw-prose-hr": "var(--rsk-rule)",
};

const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./content/**/*.mdx"],
  theme: {
    extend: {
      colors: {


        interface: band("590"),
        systems: band("520"),
        compute: band("470"),
        intelligence: band("405"),

        critical: band("700"),
        warning: band("620"),
      },
      borderRadius: {
        // Structure vs tokens — see the radius note in @ruskel/tokens.
        DEFAULT: "var(--radius)",
        sm: "var(--radius-sm)",
        lg: "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
      fontFamily: {
        // display and reading both resolve to the sans: the register model
        // gives headings and body to the same face, at different sizes.
        display: ["var(--font-body)"],
        body: ["var(--font-body)"],
        reading: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
        // The GATED token, not the face. Outside data-voice="author" this
        // resolves to the sans stack, so `font-serif` cannot put authored
        // type on an interface surface.
        serif: ["var(--rsk-font-serif)"],
      },
      typography: () => ({
        DEFAULT: { css: { ...proseColors, maxWidth: "none" } },
        invert: { css: proseColors },
      }),
    },
  },
  // The exposure is selected by `data-exposure` on <html> (see app/layout.tsx).
  // Everything below resolves against whichever exposure is active, so the
  // same utilities would work unchanged on paper if the site ever grew a
  // light mode.
  plugins: [require("@tailwindcss/typography")],
};

export default config;
