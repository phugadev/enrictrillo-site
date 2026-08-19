/**
 * Resolve @ruskel/tokens into literal hex.
 *
 * The site consumes the design system as CSS custom properties everywhere it
 * can. Two places it can't:
 *
 *   - satori (the five opengraph-image routes) renders outside a browser, so
 *     `var(--rsk-…)` never resolves and comes out transparent.
 *   - SVG *presentation attributes* (`stroke="…"`, `fill="…"`) don't accept
 *     var() either — only the style property does.
 *
 * Hand-maintaining a second copy of the palette for those cases is how the two
 * drift apart. Instead this reads the installed package and computes the hex,
 * so the literals are always downstream of the tokens. Re-run after bumping
 * @ruskel/tokens:
 *
 *   node scripts/generate-palette.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const TOKENS = require.resolve("@ruskel/tokens/tokens.css");
const css = readFileSync(TOKENS, "utf8");

// ── OKLCH → sRGB ──────────────────────────────────────────────────────────
const toSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

function oklchToHex(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const rgb = [
     4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.max(0, Math.min(255, Math.round(toSrgb(v) * 255))));
  return "#" + rgb.map((v) => v.toString(16).padStart(2, "0").toUpperCase()).join("");
}

// ── parse the stylesheet ──────────────────────────────────────────────────
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "");

/** Every `--rsk-h-*: <deg>` and the neutral ramp live in :root. */
function block(selector) {
  const re = new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\n\\}`);
  const m = strip(css).match(re);
  if (!m) throw new Error(`could not find ${selector} in ${TOKENS}`);
  return m[1];
}

const root = block(":root");
const hues = Object.fromEntries(
  [...root.matchAll(/--rsk-h-([\w-]+):\s*([\d.]+)/g)].map((m) => [m[1], Number(m[2])])
);

/** Resolve `oklch(L C var(--rsk-h-x))` declarations within a block. */
function resolve(body) {
  const out = {};
  for (const m of body.matchAll(
    /--rsk-([\w-]+):\s*oklch\(([\d.]+)\s+([\d.]+)\s+(?:var\(--rsk-h-([\w-]+)\)|([\d.]+))\)/g
  )) {
    const [, name, L, C, hueRef, hueLit] = m;
    const h = hueRef !== undefined ? hues[hueRef] : Number(hueLit);
    if (h === undefined) continue;
    out[name] = oklchToHex(Number(L), Number(C), h);
  }
  return out;
}

// The site is dark-only, so it runs the luminous exposure.
const neutrals = resolve(root);
const luminous = { ...neutrals, ...resolve(block('\\[data-exposure="luminous"\\]')) };

/**
 * Aliases follow `--rsk-x: var(--rsk-y)` chains. Two passes, because the
 * shared `[data-exposure]` block (selection, syntax colours) aliases onto the
 * per-exposure text ring, which itself aliases onto the neutral ramp.
 */
const aliasSources = [
  block('\\[data-exposure="luminous"\\]'),
  // The bare [data-exposure] block holds the exposure-agnostic aliases —
  // --rsk-code-* among them — so it has to be read too or they resolve to
  // nothing and the shiki theme silently loses its colours.
  strip(css).match(/\[data-exposure\]\s*\{([\s\S]*?)\n\}/g)?.join("\n") ?? "",
].join("\n");

for (let pass = 0; pass < 3; pass++) {
  for (const m of aliasSources.matchAll(/--rsk-([\w-]+):\s*var\(--rsk-([\w-]+)\)/g)) {
    if (luminous[m[2]] && !luminous[m[1]]) luminous[m[1]] = luminous[m[2]];
  }
}

const pick = (k) => {
  const v = luminous[k];
  if (!v) throw new Error(`token --rsk-${k} not found or unresolvable`);
  return v;
};

// @ruskel/tokens <=0.1.0 does not expose ./package.json through "exports",
// so read it off the resolved stylesheet path instead of importing it.
const version = JSON.parse(
  readFileSync(new URL("../package.json", pathToFileURL(TOKENS)), "utf8")
).version;
const out = `/**
 * GENERATED — do not edit. Run \`node scripts/generate-palette.mjs\`.
 *
 * Literal hex resolved from @ruskel/tokens@${version}, luminous exposure.
 * The DOM consumes the tokens as CSS variables; this exists only for the
 * places that cannot — satori (opengraph-image routes) and SVG presentation
 * attributes. See the script header.
 */
export const palette = {
  ink: "${pick("ground")}",
  surface: "${pick("surface")}",
  surfaceRaised: "${pick("surface-2")}",
  hairline: "${pick("rule")}",

  paper: "${pick("text")}",
  prose: "${pick("text-prose")}",
  muted: "${pick("text-muted")}",
  faint: "${pick("text-faint")}",
  /** Non-text only: the dispersion mark's incoming beam. */
  ray: "${pick("n-08")}",

  /** Marks — fills, dots, rays. Seen, not read. */
  interface: "${pick("mark-590")}",
  systems: "${pick("mark-520")}",
  compute: "${pick("mark-470")}",
  intelligence: "${pick("mark-405")}",

  /** Text ring — coloured type only. Constrained to AA on ink. */
  interfaceText: "${pick("text-590")}",
  systemsText: "${pick("text-520")}",
  computeText: "${pick("text-470")}",
  intelligenceText: "${pick("text-405")}",

  critical: "${pick("mark-700")}",
  warning: "${pick("mark-620")}",

  /**
   * Syntax colours. shiki needs a real theme with literal hex — its
   * \`css-variables\` theme was dropped from the bundle — so these are resolved
   * here rather than referenced as variables. See components/Mdx.tsx.
   */
  code: {
    text: "${pick("code-text")}",
    comment: "${pick("code-comment")}",
    keyword: "${pick("code-keyword")}",
    string: "${pick("code-string")}",
    number: "${pick("code-number")}",
    function: "${pick("code-function")}",
    punctuation: "${pick("code-punctuation")}",
  },
} as const;
`;
writeFileSync("lib/palette.ts", out);
console.log(`lib/palette.ts ← @ruskel/tokens@${version}`);
for (const k of ["ground", "text", "mark-590", "mark-520", "mark-470", "mark-405", "text-590"])
  console.log(`  --rsk-${k.padEnd(10)} ${luminous[k]}`);
