import minima from "@/styles/minima-palette.json";

/**
 * Minima's colours as hex, for the places that cannot read a CSS variable —
 * satori (the opengraph-image routes, which render outside a browser) and SVG
 * presentation attributes. They come from styles/minima-palette.json, which
 * Minima generates from the same build as the theme and checks against it;
 * re-add it with the theme and these follow.
 *
 * Dark values: the social cards are drawn on the dark ground.
 */
const dark = minima.dark;

export const palette = {
  ink: dark["background"],
  paper: dark["foreground"],
  muted: dark["muted-foreground"],
  hairline: dark["gray-border"],
  amber: dark["amber-mark"],
  green: dark["green-mark"],
  blue: dark["blue-mark"],
  purple: dark["purple-mark"],
} as const;
