import { palette } from "./palette";

export const site = {
  name: "Enric Trillo",
  role: "Fullstack Product Engineer",
  tagline:
    "Fullstack Product Engineer shipping production software end to end — TypeScript, Next.js and Python, with cloud and AI in the toolkit.",
  location: "London, UK",
  company: "Metasyde",
  email: "hello@enrictrillo.com",
  url: "https://enrictrillo.com",

  /**
   * Availability is one sentence in the home page's closing paragraph. Flip
   * `open` to false and it disappears without touching any component.
   */
  availability: {
    open: true,
    /** How I work, as the home page says it: "I work {mode}, on {contracts}, and can start with {notice}." */
    mode: "remotely",
    contracts: "Outside IR35 and C2C contracts",
    notice: "two weeks\u2019 notice",
  },


  social: {
    github: "https://github.com/phugadev",
    linkedin: "https://linkedin.com/in/enrictrillo",
  },

};

export type Topic = "frontend" | "backend" | "infrastructure" | "ai";

export const topics: Record<
  Topic,
  { label: string; hex: string; description: string }
> = {
  frontend: {
    label: "Frontend",
    hex: palette.amber,
    description: "Product thinking and interfaces",
  },
  backend: {
    label: "Backend",
    hex: palette.green,
    description: "Architecture, services and data",
  },
  infrastructure: {
    label: "Infrastructure",
    hex: palette.blue,
    description: "Deploys, hosting and hardware",
  },
  ai: {
    label: "AI",
    hex: palette.purple,
    description: "Models, agents and evals",
  },
};

/** Display order for grouped views. */
export const topicOrder: Topic[] = ["frontend", "backend", "infrastructure", "ai"];

/** Ascending nm, left to right — the way a spectrometer readout is drawn. */
const ascendingTopics = [...topicOrder].reverse();

/**
 * The site's one gradient — the full spectrum, ascending nm left to right.
 * Used by `ScrollProgress`, so
 * both instruments are drawn from the same calibration instead of two
 * hand-tuned copies drifting apart.
 *
 * Each band peaks at the CENTRE of its column, not at the edges — see the
 * note that used to live on this in Spectrometer.tsx. On an element whose
 * job is to read as a calibrated instrument, the calibration being visibly
 * off is the worst possible detail to get wrong.
 */
export const topicGradient = `linear-gradient(90deg, ${ascendingTopics
  .map((w, i) => `${topics[w].hex} ${((i + 0.5) / ascendingTopics.length) * 100}%`)
  .join(", ")})`;

/**
 * Where a project can be inspected. Every one of these is a claim a reader can
 * check in ten seconds, so omit anything that doesn't exist — a "Live" link to
 * a dead deploy costs more credibility than no link at all.
 */
export type ProjectLinks = {
  live?: string;
  repo?: string;
  npm?: string;
};

/**
 * Present tense — what's true this month. Kept as data so it can be edited
 * without touching a component, and the section hides itself while the array
 * is empty rather than showing a stale or invented status.
 */
export const now: string[] = ["Building depth in Azure, with AWS returning to the toolkit down the line."];

export type Project = {
  name: string;
  /** One line for a list, lower case, no full stop — the row reads "Name — summary". */
  summary?: string;
  description: string;
  /** Omit rather than guess — the stack line is hidden when this is absent. */
  stack?: string[];
  topic: Topic;
  status: "Shipped" | "In build" | "Archived";
  year: string;
  links?: ProjectLinks;
  /**
   * Hard numbers — stars, installs, users. This is the line that actually
   * persuades, and it is also the easiest thing on the site to disprove, so
   * only ever put a figure here you have just verified. Omit otherwise.
   */
  metrics?: string[];
  /**
   * Slug of a matching content/work/<slug>.mdx case study. Optional — most
   * projects won't have one. ProjectEntry verifies the slug actually resolves
   * (via getCaseStudyBySlug) rather than trusting the string, so a stale
   * value pointing at deleted content fails loudly instead of rendering a
   * dead link.
   */
  caseStudySlug?: string;
  /**
   * An internal route that *is* the artifact rather than an account of it —
   * /system for Minima, which renders the site it documents. Distinct
   * from `caseStudySlug`: a case study is writing about work, a specimen is
   * the work, running. Rendered with the same emphasis as a case study
   * because both are destinations on this site rather than addresses off it.
   */
  specimen?: { label: string; href: string };
};

export const projects: Project[] = [
  {
    name: "Watchman",
    summary: "a real-time system health monitor",
    description: "Real-time system health monitor.",
    // TODO(rico): add the stack once you confirm it — omitted rather than
    // guessed. Less urgent now the repo is linked and readable.
    topic: "backend",
    status: "Shipped",
    year: "2026",
    links: { repo: "https://github.com/phugadev/watchman" },
    caseStudySlug: "watchman",
  },
  {
    name: "Minima",
    summary: "the design system this site is built on",
    description:
      "A Tailwind v4 theme for interfaces that stay out of their own way — neutral carries the structure, colour is spent on state, identity and data. Every rule ships with the runner that proves it.",
    stack: ["Tailwind v4", "OKLCH", "shadcn registry"],
    topic: "frontend",
    status: "In build",
    year: "2026",
    /* This site is Minima's first real consumer and is rendered by it, so
       /system — the live specimen — is the proof a stranger can check. */
    links: { repo: "https://github.com/phugadev/minima" },
    specimen: { label: "Specimen", href: "/system" },
  },
  {
    name: "Ruskel",
    summary: "a design system with decisions in it",
    description:
      "A design system with decisions in it, not just components — one spectrum solved against contrast windows, two exposures, and a rule for which value belongs where.",
    stack: ["CSS", "OKLCH", "shadcn", "npm"],
    topic: "frontend",
    status: "Shipped",
    year: "2026",
    links: { npm: "https://www.npmjs.com/package/@ruskel/ui", repo: "https://github.com/phugadev/ruskel" },
  },
  {
    name: "supasteeltokens",
    summary: "token encryption for Node, on AES-256-GCM",
    description:
      "npm package for token encryption, rebuilt from scratch in v2.0.0 around proper AES-256-GCM.",
    stack: ["TypeScript", "Node", "npm"],
    topic: "infrastructure",
    status: "Shipped",
    year: "2026",
    links: { npm: "https://www.npmjs.com/package/supasteeltokens" },
  },
];

/**
 * Earned credentials only — deliberately no "pending" or "in progress" entries.
 * A roadmap of unearned certs signals "still qualifying" to the people this
 * site is meant to convert. Add entries here as they're actually banked; the
 * whole section hides itself while this array is empty.
 */
export type Credential = {
  name: string;
  issuer: string;
  earned: string; // YYYY-MM
  topic: Topic;
  href?: string; // verification / badge link
};

export const credentials: Credential[] = [];
