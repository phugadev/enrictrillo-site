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
 * Tailwind v3 cannot apply an alpha modifier to a plain `var()` colour, and
 * the `<alpha-value>` placeholder needs channel-triplet variables — which
 * OKLCH tokens are not. `color-mix` covers both cases from one definition, so
 * `bg-ink` and `bg-ink/85` both keep working.
 */
const token = (name: string) =>
  // Tailwind resolves colour *functions* at build time, but its `Config` type
  // models colours as strings only, so the cast is required. It is a gap in
  // the types, not a lie about the value.
  ((({ opacityValue }: { opacityValue?: string }) =>
    opacityValue === undefined
      ? `var(--rsk-${name})`
      : `color-mix(in oklab, var(--rsk-${name}) calc(${opacityValue} * 100%), transparent)`) as unknown as string);

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
  "--tw-prose-links": "var(--rsk-text-590)",
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
        ink: token("ground"),
        surface: token("surface"),
        "surface-2": token("surface-2"),
        hairline: token("rule"),
        "hairline-strong": token("rule-strong"),

        paper: token("text"),
        prose: token("text-prose"),
        muted: token("text-muted"),
        faint: token("text-faint"),
        ray: token("n-08"),

        interface: band("590"),
        systems: band("520"),
        compute: band("470"),
        intelligence: band("405"),

        critical: band("700"),
        warning: band("620"),
      },
      fontFamily: {
        display: ["var(--font-display)"],
        // Inter, not Space Grotesk — see the note in app/layout.tsx.
        body: ["var(--font-body)"],
        // Long-form only. Loaded by app/blog/[slug]/layout.tsx, not the root.
        reading: ["var(--font-reading)"],
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
