/**
 * Resolve Minima's dark tokens into literal hex, for the two places that
 * cannot read a CSS variable:
 *
 *   - satori (the opengraph-image routes) renders outside a browser, so a
 *     var() never resolves and comes out transparent.
 *   - SVG presentation attributes (`stroke="…"`, `fill="…"`) do not accept
 *     var() — only the style property does.
 *
 * Hand-keeping a second copy of the palette is how the two drift. This reads
 * the installed theme, applies the dark blocks over :root the way the cascade
 * does, follows each var() chain to a literal, and converts it. Re-run after
 * re-adding the theme from the registry:
 *
 *   node scripts/generate-palette.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const css = readFileSync(new URL("../styles/minima.css", import.meta.url), "utf8");

/* Declarations from every block whose selector matches, in source order —
   later wins, which is the cascade for blocks of equal-or-rising specificity
   on the same element. :root first, then the dark overrides. */
function collect(test) {
  const vars = {};
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].trim().split("\n").pop().trim();
    if (!test(selector)) continue;
    for (const d of m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars[d[1]] = d[2].trim();
  }
  return vars;
}
const isRoot = (s) => /^(:root)+(\[data-theme="minima"\])?$/.test(s);
const isDark = (s) => /^(:root)*(\[data-theme="minima"\])?\.dark$/.test(s);
const vars = { ...collect(isRoot), ...collect(isDark) };

function resolve(name, seen = new Set()) {
  if (seen.has(name)) throw new Error(`cycle at ${name}`);
  seen.add(name);
  const value = vars[name];
  if (value === undefined) throw new Error(`styles/minima.css — ${name} is not declared`);
  const ref = value.match(/^var\((--[\w-]+)\)$/);
  return ref ? resolve(ref[1], seen) : value;
}

// ── OKLCH → sRGB hex ──────────────────────────────────────────────────────
const toSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
function oklchToHex(value) {
  const m = value.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)(?:\s+([\d.]+))?/);
  if (!m) throw new Error(`not an oklch literal: ${value}`);
  const L = m[2] ? Number(m[1]) / 100 : Number(m[1]);
  const C = Number(m[3]);
  const h = (Number(m[4] ?? 0) * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  return (
    "#" +
    rgb
      .map((c) => Math.round(Math.min(1, Math.max(0, toSrgb(c))) * 255))
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}
const hex = (name) => oklchToHex(resolve(name));

const palette = {
  ink: hex("--background"),
  surface: hex("--surface"),
  surfaceRaised: hex("--surface-raised"),
  hairline: hex("--gray-border"),

  paper: hex("--foreground"),
  prose: hex("--gray-reading"),
  muted: hex("--muted-foreground"),
  subtle: hex("--subtle-foreground"),
  faint: hex("--gray-solid"),
  ray: hex("--gray-solid"),

  interface: hex("--amber-mark"),
  systems: hex("--green-mark"),
  compute: hex("--blue-mark"),
  intelligence: hex("--purple-mark"),

  interfaceText: hex("--amber-text"),
  systemsText: hex("--green-text"),
  computeText: hex("--blue-text"),
  intelligenceText: hex("--purple-text"),

  critical: hex("--red-mark"),
  warning: hex("--orange-mark"),
};

const body = Object.entries(palette)
  .map(([k, v]) => `  ${k}: "${v}",`)
  .join("\n");

writeFileSync(
  new URL("../lib/palette.ts", import.meta.url),
  `/**
 * GENERATED — do not edit. Run \`node scripts/generate-palette.mjs\`.
 *
 * Literal hex resolved from styles/minima.css, dark mode. The DOM reads the
 * tokens as CSS variables; this exists only for satori (opengraph-image
 * routes) and SVG presentation attributes, which cannot.
 */
export const palette = {
${body}
} as const;
`,
);
console.log(`wrote lib/palette.ts — ${Object.keys(palette).length} colours`);
