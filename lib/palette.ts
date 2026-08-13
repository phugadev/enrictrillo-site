/**
 * Every colour the site uses, defined once.
 *
 * These values used to be re-typed across tailwind.config.ts, globals.css,
 * DispersionMark, og.tsx and WavelengthChips, so changing a single accent was
 * a five-file edit with no way to tell whether you'd caught them all.
 *
 * TypeScript consumers import `palette` directly. CSS gets at the same values
 * through the `:root` custom properties the Tailwind config publishes from
 * `cssVars` — see the plugin at the bottom of tailwind.config.ts.
 */
export const palette = {
  ink: "#0B0C0E",
  surface: "#141519",
  surfaceRaised: "#1B1D22",
  hairline: "#26282E",

  paper: "#EDEAE2",
  /** Long-form body copy — fractionally softer than `paper` over a page of text. */
  prose: "#D8D5CC",
  muted: "#93959C", // 6.54:1 on ink — AA
  faint: "#7A7C85", // 4.71:1 on ink — AA

  // Both fail AA as body text and are only ever used on non-text marks: `ray`
  // is the dispersion mark's incoming beam, `dim` the OG card's footer rule.
  ray: "#8A8D93",
  dim: "#5A5C63",

  interface: "#E3A24C", // 590nm
  systems: "#5FBF86", // 520nm
  compute: "#4C93E0", // 470nm
  intelligence: "#9C7BE6", // 405nm
} as const;

const kebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** `{ "--c-surface-raised": "#1B1D22", … }` — consumed by the Tailwind base plugin. */
export const cssVars: Record<string, string> = Object.fromEntries(
  Object.entries(palette).map(([key, value]) => [`--c-${kebab(key)}`, value]),
);
