/**
 * GENERATED — do not edit. Run `node scripts/generate-palette.mjs`.
 *
 * Literal hex resolved from @ruskel/tokens@0.7.0, luminous exposure.
 * The DOM consumes the tokens as CSS variables; this exists only for the
 * places that cannot — satori (opengraph-image routes) and SVG presentation
 * attributes. See the script header.
 */
export const palette = {
  ink: "#0B0A08",
  surface: "#161512",
  surfaceRaised: "#201E1A",
  hairline: "#262522",

  paper: "#EDEAE3",
  prose: "#DAD7D0",
  muted: "#8F8C84",
  faint: "#737068",
  /** Non-text only: the dispersion mark's incoming beam. */
  ray: "#8F8C84",

  /** Marks — fills, dots, rays. Seen, not read. */
  interface: "#D4A720",
  systems: "#26C678",
  compute: "#1A8FF9",
  intelligence: "#9354F9",

  /** Text ring — coloured type only. Constrained to AA on ink. */
  interfaceText: "#B59029",
  systemsText: "#2DA868",
  computeText: "#3F98F5",
  intelligenceText: "#A580F5",

  critical: "#F92040",
  warning: "#FB661B",

  /**
   * Syntax colours. shiki needs a real theme with literal hex — its
   * `css-variables` theme was dropped from the bundle — so these are resolved
   * here rather than referenced as variables. See components/Mdx.tsx.
   */
  code: {
    text: "#DAD7D0",
    comment: "#737068",
    keyword: "#A174FA",
    string: "#26C678",
    number: "#D4A720",
    function: "#1A8FF9",
    type: "#24BDD3",
    special: "#DB4AFA",
    punctuation: "#8F8C84",
  },
} as const;
