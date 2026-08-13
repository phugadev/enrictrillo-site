import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ProjectLinks, Wavelength } from "./site";
import { wavelengths } from "./site";

const WORK_DIR = path.join(process.cwd(), "content/work");

const VALID_WAVELENGTHS = Object.keys(wavelengths) as Wavelength[];
const VALID_LINK_KEYS = ["live", "repo", "npm"] as const;

export type CaseStudyMeta = {
  slug: string;
  title: string;
  excerpt: string;
  wavelength: Wavelength;
  year: string;
  /** Omit rather than guess — same convention as Project.stack. */
  stack?: string[];
  links?: ProjectLinks;
  draft?: boolean;
};

function fail(file: string, message: string): never {
  throw new Error(`content/work/${file} — ${message}`);
}

/**
 * Frontmatter is hand-written, so it's validated rather than trusted — same
 * rationale as lib/posts.ts's parseMeta. A typo here should fail loudly and
 * name the offending file, not surface later as an opaque runtime error.
 */
function parseMeta(slug: string, data: Record<string, unknown>): CaseStudyMeta {
  const file = `${slug}.mdx`;

  if (typeof data.title !== "string" || data.title.trim() === "") {
    fail(file, "`title` is required and must be a non-empty string.");
  }

  if (typeof data.excerpt !== "string" || data.excerpt.trim() === "") {
    fail(file, "`excerpt` is required and must be a non-empty string.");
  }

  if (
    typeof data.wavelength !== "string" ||
    !VALID_WAVELENGTHS.includes(data.wavelength as Wavelength)
  ) {
    fail(
      file,
      `unknown wavelength ${JSON.stringify(data.wavelength)} — must be one of: ${VALID_WAVELENGTHS.join(", ")}.`,
    );
  }

  if (typeof data.year !== "string" || data.year.trim() === "") {
    fail(file, "`year` is required and must be a non-empty string.");
  }

  if (data.stack != null) {
    if (
      !Array.isArray(data.stack) ||
      data.stack.some((s) => typeof s !== "string" || s.trim() === "")
    ) {
      fail(file, "`stack` must be an array of non-empty strings when present.");
    }
  }

  if (data.links != null) {
    if (typeof data.links !== "object" || Array.isArray(data.links)) {
      fail(file, "`links` must be an object with any of `live`, `repo`, `npm` when present.");
    }
    const links = data.links as Record<string, unknown>;
    for (const key of Object.keys(links)) {
      if (!VALID_LINK_KEYS.includes(key as (typeof VALID_LINK_KEYS)[number])) {
        fail(file, `unknown links key ${JSON.stringify(key)} — must be one of: ${VALID_LINK_KEYS.join(", ")}.`);
      }
      if (typeof links[key] !== "string" || (links[key] as string).trim() === "") {
        fail(file, `\`links.${key}\` must be a non-empty string when present.`);
      }
    }
  }

  if (data.draft != null && typeof data.draft !== "boolean") {
    fail(file, "`draft` must be true or false when present.");
  }

  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    wavelength: data.wavelength as Wavelength,
    year: data.year.trim(),
    stack: data.stack as string[] | undefined,
    links: data.links as ProjectLinks | undefined,
    draft: (data.draft as boolean | undefined) ?? false,
  };
}

function getAllSlugs(): string[] {
  if (!fs.existsSync(WORK_DIR)) return [];
  return fs
    .readdirSync(WORK_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getCaseStudyBySlug(slug: string): { meta: CaseStudyMeta; content: string } {
  const filePath = path.join(WORK_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return { meta: parseMeta(slug, data), content };
}

/**
 * Build-time memo, mirroring getAllPosts in lib/posts.ts — production only,
 * since .mdx files aren't modules and nothing invalidates this under `next
 * dev`.
 */
let publishedCaseStudies: CaseStudyMeta[] | null = null;

export function getAllCaseStudies(): CaseStudyMeta[] {
  if (publishedCaseStudies) return publishedCaseStudies;

  const studies = getAllSlugs()
    .map((slug) => getCaseStudyBySlug(slug).meta)
    .filter((c) => !c.draft)
    .sort((a, b) => (a.year < b.year ? 1 : -1));

  if (process.env.NODE_ENV === "production") publishedCaseStudies = studies;
  return studies;
}
