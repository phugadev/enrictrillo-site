import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { isValidDate } from "./dates";
import type { Wavelength } from "./site";
import { wavelengths, wavelengthOrder } from "./site";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

const VALID_WAVELENGTHS = Object.keys(wavelengths) as Wavelength[];

export type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  wavelength: Wavelength;
  readingTime: string;
  /** Optional run of posts this belongs to — a project or a cert study thread. */
  series?: string;
  draft?: boolean;
};

/** URL-safe form of a series name: "AWS SAA-C03" → "aws-saa-c03". */
export function seriesSlug(series: string): string {
  return series
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fail(file: string, message: string): never {
  throw new Error(`content/posts/${file} — ${message}`);
}

/**
 * Frontmatter is hand-written, so it's validated rather than trusted. Without
 * this, a typo like `wavelength: "sytems"` surfaces much later as
 * "Cannot read properties of undefined (reading 'hex')" with nothing pointing
 * at the file that caused it. Drafts are validated too, so problems show up
 * while writing instead of on the deploy that publishes them.
 */
function parseMeta(slug: string, data: Record<string, unknown>, readingTimeText: string): PostMeta {
  const file = `${slug}.mdx`;

  if (data.log !== undefined) {
    fail(file, "`log` was renamed to `series` — update the frontmatter key.");
  }

  if (data.wavelength === "cloud") {
    fail(file, 'the "cloud" wavelength was renamed to "compute" — update the frontmatter.');
  }

  if (typeof data.title !== "string" || data.title.trim() === "") {
    fail(file, "`title` is required and must be a non-empty string.");
  }

  if (typeof data.excerpt !== "string" || data.excerpt.trim() === "") {
    fail(file, "`excerpt` is required and must be a non-empty string.");
  }

  // Unquoted YAML dates (date: 2026-08-07) parse to a Date; quoted ones stay
  // strings. Strings are held to strict YYYY-MM-DD rather than anything
  // `new Date()` happens to accept — "August 7 2026" used to pass here and
  // then land verbatim in <time dateTime="…">, which isn't a valid datetime.
  let date: string;
  if (data.date instanceof Date && !Number.isNaN(data.date.getTime())) {
    date = data.date.toISOString().slice(0, 10);
  } else if (typeof data.date === "string" && isValidDate(data.date.trim())) {
    date = data.date.trim();
  } else {
    fail(file, `\`date\` must be an ISO date like "2026-08-07" (got ${JSON.stringify(data.date)}).`);
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

  if (data.series !== undefined && (typeof data.series !== "string" || data.series.trim() === "")) {
    fail(file, "`series` must be a non-empty string when present.");
  }

  if (data.draft !== undefined && typeof data.draft !== "boolean") {
    fail(file, "`draft` must be true or false when present.");
  }

  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    date,
    wavelength: data.wavelength as Wavelength,
    readingTime: readingTimeText,
    series: (data.series as string | undefined)?.trim(),
    draft: (data.draft as boolean | undefined) ?? false,
  };
}

function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): { meta: PostMeta; content: string } {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return { meta: parseMeta(slug, data, stats.text), content };
}

/**
 * Build-time memo. getAllPosts is called by the homepage, the blog index, the
 * chips, the spectrometer, the sitemap, the feed and /llms.txt — plus once per
 * post for adjacency, and again beneath getPostsByWavelength and getAllSeries.
 * Each call otherwise re-reads and re-parses every file on disk.
 *
 * Production only: .mdx files aren't modules, so nothing invalidates this when
 * you edit a post with `next dev` running, and a cached list would serve stale
 * titles until you restarted the server.
 */
let publishedPosts: PostMeta[] | null = null;

export function getAllPosts(): PostMeta[] {
  if (publishedPosts) return publishedPosts;

  const posts = getAllSlugs()
    .map((slug) => getPostBySlug(slug).meta)
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  if (process.env.NODE_ENV === "production") publishedPosts = posts;
  return posts;
}

/**
 * The posts either side of `slug` in date order, for the end-of-post nav.
 * Returns an empty object for a draft being previewed in dev, since drafts
 * aren't part of the published sequence.
 */
export function getAdjacentPosts(slug: string): { newer?: PostMeta; older?: PostMeta } {
  const posts = getAllPosts(); // newest first
  const i = posts.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return { newer: posts[i - 1], older: posts[i + 1] };
}

/**
 * Posts bucketed by wavelength, in spectrum order, newest first within each
 * band. Empty bands are dropped so the blog index never shows a bare heading.
 */
export function getPostsByWavelength(): { wavelength: Wavelength; posts: PostMeta[] }[] {
  const posts = getAllPosts();
  return wavelengthOrder
    .map((wavelength) => ({
      wavelength,
      posts: posts.filter((p) => p.wavelength === wavelength),
    }))
    .filter((band) => band.posts.length > 0);
}

/** Every series that has at least one published post, newest activity first. */
export function getAllSeries(): { name: string; slug: string; posts: PostMeta[] }[] {
  const bySlug = new Map<string, { name: string; slug: string; posts: PostMeta[] }>();

  for (const post of getAllPosts()) {
    if (!post.series) continue;
    const slug = seriesSlug(post.series);
    const existing = bySlug.get(slug);
    if (existing) existing.posts.push(post);
    else bySlug.set(slug, { name: post.series, slug, posts: [post] });
  }

  return [...bySlug.values()];
}

export function getSeriesBySlug(slug: string) {
  return getAllSeries().find((s) => s.slug === slug);
}
