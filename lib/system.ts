import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Reads the installed theme at build time, so every number the /system page
 * prints is computed from the file that styles the page — not typed in beside
 * it. Dark mode only, because the site is.
 */
const css = readFileSync(join(process.cwd(), "styles/minima.css"), "utf8");

function collect(test: (selector: string) => boolean) {
  const vars: Record<string, string> = {};
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].trim().split("\n").pop()!.trim();
    if (!test(selector)) continue;
    for (const d of m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars[d[1]] = d[2].trim();
  }
  return vars;
}
const vars = {
  ...collect((s) => /^(:root)+(\[data-theme="minima"\])?$/.test(s)),
  ...collect((s) => /^(:root)*(\[data-theme="minima"\])?\.dark$/.test(s)),
};

/** A token's literal value, following var() chains. */
export function resolve(name: string, seen = new Set<string>()): string {
  if (seen.has(name)) throw new Error(`styles/minima.css — cycle at ${name}`);
  seen.add(name);
  const value = vars[name];
  if (value === undefined) throw new Error(`styles/minima.css — ${name} is not declared`);
  const ref = value.match(/^var\((--[\w-]+)\)$/);
  return ref ? resolve(ref[1], seen) : value;
}

function luminance(value: string): number {
  const m = value.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)(?:\s+([\d.]+))?/);
  if (!m) throw new Error(`not an oklch literal: ${value}`);
  const L = m[2] ? Number(m[1]) / 100 : Number(m[1]);
  const C = Number(m[3]);
  const h = (Number(m[4] ?? 0) * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s,
  ].map((c) => Math.min(1, Math.max(0, c)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

/** WCAG contrast of two tokens, as the page renders them. */
export function contrast(fg: string, bg: string): number {
  const [hi, lo] = [luminance(resolve(fg)), luminance(resolve(bg))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
