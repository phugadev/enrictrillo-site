import fs from "fs";
import path from "path";
import { wavelengthOrder, wavelengths, type Wavelength } from "./site";

/*
  Located by path rather than by `require.resolve`.

  Two things rule the tidier version out. A literal
  `require.resolve("@ruskel/tokens/tokens.css")` is read by the bundler as an
  instruction to bundle a stylesheet as a module, which fails the build; and
  `createRequire` is not reliably available in the server bundle to resolve it
  at runtime. What is always true is that the site is rendered from its own
  project root with its dependencies installed under it, so that is what this
  uses.

  Flat node_modules, because that is what npm gives this project and what
  Vercel installs from the lockfile. If the layout ever changes — pnpm, a
  workspace — this throws by name at build rather than rendering a page of
  blanks, which is the trade the whole module is making.
*/
function ruskelFile(...segments: string[]): string {
  const file = path.join(process.cwd(), "node_modules", "@ruskel", ...segments);
  if (!fs.existsSync(file)) {
    throw new Error(
      `lib/system.ts — expected @ruskel/${segments.join("/")} at ${file}. ` +
        `The /system page reads its figures out of the installed package; it cannot fall back to hard-coded ones.`,
    );
  }
  return file;
}

const TOKENS_CSS = ruskelFile("tokens", "src", "tokens.css");
const TOKENS_PKG = ruskelFile("tokens", "package.json");
const UI_PKG = ruskelFile("ui", "package.json");

/** The version the site is actually running, not the version it remembers. */
export function ruskelVersion(): { tokens: string; ui: string } {
  const tokens = JSON.parse(fs.readFileSync(TOKENS_PKG, "utf8")) as { version: string };
  const ui = JSON.parse(fs.readFileSync(UI_PKG, "utf8")) as { version: string };
  return { tokens: tokens.version, ui: ui.version };
}

let cachedCss: string | null = null;
function tokensCss(): string {
  if (!cachedCss) cachedCss = fs.readFileSync(TOKENS_CSS, "utf8");
  return cachedCss;
}

export type Exposure = "luminous" | "editorial";

/**
 * One exposure's block, isolated.
 *
 * Both exposures declare the same token names with different values, so
 * reading the file top to bottom returns whichever came first — the exact
 * kind of plausible-but-wrong number this module exists to prevent. It also
 * matters for what the page is arguing: the interesting fact about this
 * system is that a token's contrast is not a property of the token, it is a
 * property of the token *on a ground*.
 */
function exposureBlock(exposure: Exposure): string {
  const start = tokensCss().indexOf(`[data-exposure="${exposure}"]`);
  if (start === -1) throw new Error(`@ruskel/tokens — no [data-exposure="${exposure}"] block found.`);
  const end = tokensCss().indexOf("\n}", start);
  return tokensCss().slice(start, end);
}

/**
 * The measured contrast a token carries against its own ground, as recorded
 * by the solver in the comment beside the declaration:
 *
 *   --rsk-mark-590: oklch(0.750 0.146 …);  /* #D4A721  8.81 INTERFACE *\/
 */
export function ratioOf(token: string, exposure: Exposure = "luminous"): number {
  const line = new RegExp(`--${token}:[^;]+;\\s*/\\*([^*]+)\\*/`).exec(exposureBlock(exposure));
  if (!line)
    throw new Error(`@ruskel/tokens — --${token} has no annotated value in the ${exposure} block.`);
  const ratio = /(\d+\.\d+)/.exec(line[1].replace(/#[0-9A-Fa-f]{6}/, ""));
  if (!ratio) throw new Error(`@ruskel/tokens — --${token} is annotated, but with no contrast figure.`);
  return Number(ratio[1]);
}

export type BandSpecimen = {
  wavelength: Wavelength;
  label: string;
  nm: number;
  /** Seen, not read: fills, dots, rules. Non-text contrast applies. */
  mark: { token: string; ratio: number };
  /** Read, not seen: coloured type. Constrained to AA. */
  text: { token: string; ratio: number };
};

export function bandSpecimens(): BandSpecimen[] {
  return wavelengthOrder.map((wavelength) => {
    const wl = wavelengths[wavelength];
    return {
      wavelength,
      label: wl.label,
      nm: wl.nm,
      mark: { token: `rsk-mark-${wl.nm}`, ratio: ratioOf(`rsk-mark-${wl.nm}`) },
      text: { token: `rsk-text-${wl.nm}`, ratio: ratioOf(`rsk-text-${wl.nm}`) },
    };
  });
}

/** The radius scale, read from the file so the rule and the values agree. */
export function radiusScale(): { token: string; value: string; role: string }[] {
  const read = (name: string) => {
    const m = new RegExp(`--${name}:\\s*([^;]+);`).exec(tokensCss());
    if (!m) throw new Error(`@ruskel/tokens — --${name} not found.`);
    return m[1].trim();
  };
  return [
    { token: "--radius-sm", value: read("radius-sm"), role: "Structure, small — checkboxes, cells" },
    { token: "--radius", value: read("radius"), role: "Structure — cards, inputs, buttons, frames" },
    { token: "--radius-lg", value: read("radius-lg"), role: "Structure, large — dialogs, plates" },
    { token: "--radius-pill", value: read("radius-pill"), role: "Tokens — chips, tags, dots, switches" },
  ];
}
