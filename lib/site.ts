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
   * Availability is deliberately a small, quiet signal rather than a page —
   * a status line in the hero and footer. Flip `open` to false and both
   * disappear without touching any component.
   */
  availability: {
    open: true,
    /** Nav pill — has to survive a narrow viewport. */
    short: "Available",
    label: "Available for Outside IR35 & C2C contracts",
    detail: "UK-based · Remote",
  },

  social: {
    github: "https://github.com/phugadev",
    linkedin: "https://linkedin.com/in/enrictrillo",
  },

  nav: [
    { label: "Work", href: "/#work" },
    { label: "Writing", href: "/blog" },
    { label: "About", href: "/#about" },
  ],
};

export type Wavelength = "interface" | "systems" | "compute" | "intelligence";

export const wavelengths: Record<
  Wavelength,
  { label: string; nm: number; hex: string; description: string }
> = {
  interface: {
    label: "Interface",
    nm: 590,
    hex: palette.interface,
    description: "Product thinking and frontend",
  },
  systems: {
    label: "Systems",
    nm: 520,
    hex: palette.systems,
    description: "Architecture, backend and data",
  },
  // "Compute" rather than "Cloud": the band is where code runs, which includes
  // self-hosting, local-first and hardware — not just a vendor's platform.
  compute: {
    label: "Compute",
    nm: 470,
    hex: palette.compute,
    description: "Infrastructure, deploys and hardware",
  },
  intelligence: {
    label: "Intelligence",
    nm: 405,
    hex: palette.intelligence,
    description: "Models, agents and AI engineering",
  },
};

/** Display order for grouped views — long wavelength to short, like a real spectrum. */
export const wavelengthOrder: Wavelength[] = ["interface", "systems", "compute", "intelligence"];

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

export type Project = {
  name: string;
  description: string;
  /** Omit rather than guess — the stack line is hidden when this is absent. */
  stack?: string[];
  wavelength: Wavelength;
  status: "Shipped" | "In build" | "Archived";
  year: string;
  links?: ProjectLinks;
  /**
   * Hard numbers — stars, installs, users. This is the line that actually
   * persuades, and it is also the easiest thing on the site to disprove, so
   * only ever put a figure here you have just verified. Omit otherwise.
   */
  metrics?: string[];
};

export const projects: Project[] = [
  {
    name: "Watchman",
    description: "Real-time system health monitor.",
    // TODO(rico): add the stack once you confirm it — omitted rather than
    // guessed. Less urgent now the repo is linked and readable.
    wavelength: "systems",
    status: "Shipped",
    year: "2026",
    links: { repo: "https://github.com/phugadev/watchman" },
  },
  {
    name: "supasteeltokens",
    description:
      "npm package for token encryption, rebuilt from scratch in v2.0.0 around proper AES-256-GCM.",
    stack: ["TypeScript", "Node", "npm"],
    wavelength: "compute",
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
  wavelength: Wavelength;
  href?: string; // verification / badge link
};

export const credentials: Credential[] = [];
