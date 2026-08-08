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
    hex: "#E3A24C",
    description: "Product thinking and frontend",
  },
  systems: {
    label: "Systems",
    nm: 520,
    hex: "#5FBF86",
    description: "Architecture, backend and data",
  },
  // "Compute" rather than "Cloud": the band is where code runs, which includes
  // self-hosting, local-first and hardware — not just a vendor's platform.
  compute: {
    label: "Compute",
    nm: 470,
    hex: "#4C93E0",
    description: "Infrastructure, deploys and hardware",
  },
  intelligence: {
    label: "Intelligence",
    nm: 405,
    hex: "#9C7BE6",
    description: "Models, agents and AI engineering",
  },
};

/** Display order for grouped views — long wavelength to short, like a real spectrum. */
export const wavelengthOrder: Wavelength[] = ["interface", "systems", "compute", "intelligence"];

export type Project = {
  name: string;
  description: string;
  /** Omit rather than guess — the stack line is hidden when this is absent. */
  stack?: string[];
  wavelength: Wavelength;
  status: "Shipped" | "In build" | "Archived";
  year: string;
  href: string;
};

export const projects: Project[] = [
  {
    name: "Watchman",
    description: "Real-time system health monitor.",
    // TODO(rico): add the stack once you confirm it — omitted rather than guessed.
    wavelength: "systems",
    status: "Shipped",
    year: "2026",
    href: "/blog",
  },
  {
    name: "supasteeltokens",
    description:
      "npm package for token encryption, rebuilt from scratch in v2.0.0 around proper AES-256-GCM.",
    stack: ["TypeScript", "Node", "npm"],
    wavelength: "compute",
    status: "Shipped",
    year: "2026",
    href: "https://www.npmjs.com/package/supasteeltokens",
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
