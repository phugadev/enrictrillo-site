import type { Topic } from "./site";

/**
 * Each topic's colour, as Minima hue roles. Colour is the only way the topics
 * show on the page — a dot beside a project or a post — so there is no site
 * colour vocabulary: a topic simply borrows one of Minima's hues, by role.
 *
 *   dot    beside its label, so Minima's solid step (docs/colour-roles.md §1:
 *          a mark travelling with its label owes no floor of its own, and the
 *          solid keeps its hue in both modes; the bare `mark` step darkens in
 *          light to stand alone, which read muddy here)
 *   tint   coloured text — the only role allowed to colour type
 *   chip   a tinted panel: fill, border and tinted text together
 *
 * Written out literally: Tailwind only emits classes it can see in source.
 */
export const topicColor: Record<Topic, { hue: string; dot: string; tint: string; chip: string }> = {
  frontend: {
    hue: "amber",
    dot: "bg-amber-solid",
    tint: "text-amber-text",
    chip: "border-amber-border bg-amber-fill text-amber-text",
  },
  backend: {
    hue: "green",
    dot: "bg-green-solid",
    tint: "text-green-text",
    chip: "border-green-border bg-green-fill text-green-text",
  },
  infrastructure: {
    hue: "blue",
    dot: "bg-blue-solid",
    tint: "text-blue-text",
    chip: "border-blue-border bg-blue-fill text-blue-text",
  },
  ai: {
    hue: "purple",
    dot: "bg-purple-solid",
    tint: "text-purple-text",
    chip: "border-purple-border bg-purple-fill text-purple-text",
  },
};
