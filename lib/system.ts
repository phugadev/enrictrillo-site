import minima from "@/styles/minima-palette.json";

export type Mode = "light" | "dark";
type Token = keyof typeof minima.light;

/* WCAG relative luminance of an opaque #rrggbb colour. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const f = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r!) + 0.7152 * f(g!) + 0.0722 * f(b!);
}

/**
 * WCAG contrast of two Minima tokens in one mode, from the palette Minima
 * resolves from the installed theme — the same file, so the /system page
 * prints what the page itself renders, in whichever mode is asked for.
 */
export function contrast(fg: Token, bg: Token, mode: Mode): number {
  const [hi, lo] = [luminance(minima[mode][fg]), luminance(minima[mode][bg])].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
