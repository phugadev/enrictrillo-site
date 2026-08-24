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
 *   --rsk-spectrum-590-solid: oklch(0.754 0.146 …);  /* #D6A821  8.94 *\/
 *
 * Ruskel 0.9 moved these: --rsk-mark-590 still exists but is now an ALIAS
 * onto --rsk-spectrum-590-solid, so it carries no value and no annotation.
 * Read the primitive, which is where the solver writes its figures.
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
      mark: { token: `rsk-spectrum-${wl.nm}-solid`, ratio: ratioOf(`rsk-spectrum-${wl.nm}-solid`) },
      text: { token: `rsk-spectrum-${wl.nm}-text`, ratio: ratioOf(`rsk-spectrum-${wl.nm}-text`) },
    };
  });
}

/** The radius scale, read from the file so the rule and the values agree. */
export function radiusScale(): { token: string; value: string; role: string }[] {
  const read = (name: string) => {
    const m = new RegExp(`--${name}:\\s*([^;]+);`).exec(tokensCss());
    if (!m) throw new Error(`@ruskel/tokens — --${name} not found.`);
    const value = m[1].trim();
    /*
      An alias is not a value. Ruskel 0.9 made --radius-sm a pointer at
      --rsk-radius-sm, and reading the pointer put the literal string
      "var(--rsk-radius-sm)" on the page where "2px" belonged — no error, no
      blank, just a figure that was quietly wrong. Everything this module
      reads is meant to be a number the solver wrote down, so anything that
      resolves to another token is a bug in the lookup rather than content.
    */
    if (value.startsWith("var(")) {
      throw new Error(
        `@ruskel/tokens — --${name} is an alias for ${value}, not a value. ` +
          `Read the token it points at instead.`,
      );
    }
    return value;
  };
  return [
    { token: "--rsk-radius-sm", value: read("rsk-radius-sm"), role: "Structure, small — checkboxes, cells" },
    { token: "--rsk-radius", value: read("rsk-radius"), role: "Structure — cards, inputs, buttons, frames" },
    { token: "--rsk-radius-lg", value: read("rsk-radius-lg"), role: "Structure, large — dialogs, plates" },
    { token: "--rsk-radius-pill", value: read("rsk-radius-pill"), role: "Tokens — chips, tags, dots, switches" },
  ];
}
