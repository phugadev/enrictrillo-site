import type { Wavelength } from "./site";

/**
 * The four bands as class names, one set per role — see app/globals.css for
 * what each role means. Written out literally rather than built from a
 * template, because Tailwind only emits a utility it can see in source: a
 * `bg-${band}` string never reaches the stylesheet and renders as nothing.
 *
 *   mark    a dot, a rule, a fill — seen, not read
 *   tint    coloured text — the only role allowed to colour type
 *   chip    a tinted chip: fill, edge and tinted text together
 *   hover   a neutral element that takes the band when pointed at
 */
export const band: Record<
  Wavelength,
  { mark: string; tint: string; chip: string; border: string; hover: string; ring: string }
> = {
  interface: {
    mark: "bg-interface",
    tint: "text-interface-tint",
    chip: "border-interface-edge bg-interface-fill text-interface-tint",
    border: "border-interface",
    hover: "hover:border-interface-edge hover:text-interface-tint",
    ring: "from-interface/25",
  },
  systems: {
    mark: "bg-systems",
    tint: "text-systems-tint",
    chip: "border-systems-edge bg-systems-fill text-systems-tint",
    border: "border-systems",
    hover: "hover:border-systems-edge hover:text-systems-tint",
    ring: "from-systems/25",
  },
  compute: {
    mark: "bg-compute",
    tint: "text-compute-tint",
    chip: "border-compute-edge bg-compute-fill text-compute-tint",
    border: "border-compute",
    hover: "hover:border-compute-edge hover:text-compute-tint",
    ring: "from-compute/25",
  },
  intelligence: {
    mark: "bg-intelligence",
    tint: "text-intelligence-tint",
    chip: "border-intelligence-edge bg-intelligence-fill text-intelligence-tint",
    border: "border-intelligence",
    hover: "hover:border-intelligence-edge hover:text-intelligence-tint",
    ring: "from-intelligence/25",
  },
};
