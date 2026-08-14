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

/** Ascending nm, left to right — the way a spectrometer readout is drawn. */
const ascendingWavelengths = [...wavelengthOrder].reverse();

/**
 * The site's one gradient — the full spectrum, ascending nm left to right.
 * Shared by `Spectrometer` (where it originated) and `ScrollProgress`, so
 * both instruments are drawn from the same calibration instead of two
 * hand-tuned copies drifting apart.
 *
 * Each band peaks at the CENTRE of its column, not at the edges — see the
 * note that used to live on this in Spectrometer.tsx. On an element whose
 * job is to read as a calibrated instrument, the calibration being visibly
 * off is the worst possible detail to get wrong.
 */
export const bandGradient = `linear-gradient(90deg, ${ascendingWavelengths
  .map((w, i) => `${wavelengths[w].hex} ${((i + 0.5) / ascendingWavelengths.length) * 100}%`)
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
 * The toolkit, filed by band.
 *
 * This is the section that makes the wavelength taxonomy mean something on the
 * homepage — without it the spectrometer is a legend for a system the reader
 * never sees applied. Every entry here restates a claim the tagline and About
 * copy already make; don't add a technology here that isn't true elsewhere on
 * the page.
 */
export const toolkit: Record<Wavelength, string[]> = {
  interface: ["TypeScript", "React", "Next.js", "Tailwind"],
  systems: ["Node", "Python", "PostgreSQL", "REST APIs"],
  compute: ["Azure", "Vercel", "Docker", "CI/CD"],
  intelligence: ["LLM APIs", "Agents & tool use", "RAG", "Evals"],
};

/**
 * Present tense — what's true this month. Kept as data so it can be edited
 * without touching a component, and the section hides itself while the array
 * is empty rather than showing a stale or invented status.
 */
export const now: string[] = ["Building depth in Azure, with AWS returning to the toolkit down the line."];

/**
 * Domain-level capability areas, not specific technologies — see `toolkit`
 * for the stack. Each one carries a short description, surfaced as a
 * hover/focus tooltip by `components/Expertise.tsx` (a CSS-only tooltip, not
 * the native `title` attribute — see that file for why). That component
 * hides itself while this array is empty, so clearing it is a one-line
 * revert.
 */
export const expertise: { label: string; description: string }[] = [
  { label: "Product Engineering", description: "Owning a feature from product decision through to what ships." },
  { label: "UX/UI Design", description: "Interface and interaction decisions made in code, not handed off." },
  { label: "System Design", description: "Architecture and data decisions that hold up under real load." },
  { label: "Cloud Infra", description: "Deploys, CI/CD and infra-as-code — Azure-first." },
  { label: "Applied AI", description: "LLM APIs and agentic workflows wired into production systems." },
];

/**
 * Diligence facts for the About section — the concrete details a contract
 * decision-maker actually checks before booking a call: sectors delivered
 * in, typical team size, how fast you could start. Empty by default rather
 * than guessed; `components/About.tsx` hides the whole row while this is
 * empty, same discipline as `now` and `credentials`. Deliberately excludes
 * years of experience — the hero states that already.
 */
export const aboutFacts: { label: string; value: string }[] = [
  { label: "Sectors", value: "Fintech, e-commerce, dev tools" },
  { label: "Team size", value: "2–8 engineers" },
  { label: "Notice period", value: "2 weeks" },
];

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
  /**
   * Slug of a matching content/work/<slug>.mdx case study. Optional — most
   * projects won't have one. ProjectRow verifies the slug actually resolves
   * (via getCaseStudyBySlug) rather than trusting the string, so a stale
   * value pointing at deleted content fails loudly instead of rendering a
   * dead link.
   */
  caseStudySlug?: string;
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
    caseStudySlug: "watchman",
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
