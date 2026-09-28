# enrictrillo.com — v6

Next.js 15, TypeScript and Tailwind v4, on the
[Minima](https://github.com/phugadev/minima) design system. Built to do one
job: make a contract decision-maker conclude, quickly, that I ship production
software end to end. One narrow column, a person rather than a pitch.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run typecheck` runs `tsc` on its own.

> Don't run `npm run build` while `next dev` is running — they share `.next`
> and the dev server starts throwing odd runtime errors. `rm -rf .next` if you
> hit that.

## Writing a post

Fastest path — scaffold it:

```bash
npm run new-post
```

It asks for a title, a topic, an excerpt and an optional series, suggests a
slug, and writes `content/posts/<slug>.mdx` with today's date and
`draft: true`. It won't overwrite an existing post. Leave the excerpt blank and
it writes a `TODO` placeholder, which passes validation — **replace it before
you publish**, because the excerpt is the line under the headline and under
the title on every writing list.

Or write the file by hand in `content/posts/`:

```mdx
---
title: "Structured output is a schema problem, not a prompt problem"
excerpt: "The claim behind the title, in one sentence."
date: "2026-08-06"
topic: "ai"            # frontend | backend | infrastructure | ai
series: "Watchman"     # optional — the project or thread this belongs to
draft: true            # remove, or set false, to publish
---

Your content in Markdown.
```

Then `git push`; Vercel deploys it.

**Topics** file a post and give it its colour — the dot beside it in lists and
the share image. Same four as the projects on the home page:

- **Frontend** (amber) — product thinking and interfaces
- **Backend** (green) — architecture, services and data
- **Infrastructure** (blue) — deploys, hosting and hardware
- **AI** (purple) — models, agents and evals

File a post by what it is *about*, not what it mentions. A topic gets a page
at `/blog/topic/<topic>` once it has a published post.

**Excerpts** matter more than they look. Titles here state a position, and the
excerpt carries the claim behind it: it's the standfirst under the headline, the
line under the title on `/blog` and the topic and series pages, and the meta
description. The home page list shows titles only.

**Series** is optional. It shows in the post header as "Watchman, 2 of 5",
links to `/blog/series/<slug>`, and — when a project's `caseStudySlug` matches
the series slug — lists the posts under that case study as its build log.
Series pages are generated; there's nothing to register. The `/blog` filter
line only lists a series once it has two published posts.

**Drafts** (`draft: true`) render at `/blog/<slug>` under `npm run dev` and are
excluded from the production build entirely — 404, not just unlisted.

### What Markdown gives you

GitHub-flavoured Markdown — tables, task lists, strikethrough, footnotes —
plus smart punctuation: straight quotes come out curly and `--` becomes an en
dash. Code is left alone. `---` renders as a short centred zigzag, the
author's pause, rather than a full-width rule.

Every figure — code, tables, images, callouts, comparisons, diagrams — sits in
the same frame: a tray with a 4px inset around a bordered stage (`.tray` and
`.tray__stage` in `app/globals.css`). Figures stay the width of the reading
column, so they never run under the contents rail beside it. Wide tables and
long code lines scroll inside the stage.

**Code blocks** get syntax highlighting in both modes, a copy button, and line
numbers on anything over one line (never copied with the code). A `title` puts
a filename on the tray; `{…}` highlights lines — `{2}`, or `{3,12-13}`
for several:

````mdx
```ts title="lib/ingest/batcher.ts" {2}
export function flush(batch: Event[]) {
  if (batch.length === 0) return;
  return db.insert(batch);
}
```
````

Only give a block a title when it's an excerpt from a real file — a snippet
that just illustrates something doesn't need one.

**Images** go in `public/`. Either Markdown, lazy-loaded, with the title as the
caption:

```mdx
![Alt text](/shots/watchman.png "Optional caption")
```

or `<Figure>`, when you know the dimensions and want `next/image` to optimise
it — prefer this for anything large:

```mdx
<Figure src="/shots/watchman.png" alt="Alert pipeline"
        width={1600} height={900} caption="Sub-second alerting." />
```

### Components for posts

Available in any `.mdx` without importing (`components/MdxComponents.tsx`):

```mdx
<Callout variant="warning">
  Batching trades latency for throughput.
</Callout>
```

`variant` is `info`, `warning`, `success` or `tip`. The colour is on the icon
and label only.

```mdx
<Compare
  items={[
    { code: "redis.get → db → redis.set", label: "Read-through cache", outcome: "bad", verdict: "Stale for up to 30s" },
    { code: "db (indexed)", label: "Just the query", outcome: "good", verdict: "Always current" },
  ]}
  caption="Two milliseconds slower at the median, and never wrong."
/>
```

A before/after pair: each snippet as a small card with its source beneath, and
a verdict strip under each. `verdict` defaults to "Works" / "Doesn't work";
override it when the contrast is a trade-off rather than a failure. Built on
`Plate` and `Cell`, which are also available for layouts `Compare` doesn't
cover.

```mdx
<Diagram
  nodes={[
    { label: "Probes", topic: "backend" },
    { label: "Batcher", topic: "infrastructure", note: "5k events / flush" },
    { label: "Postgres", topic: "ai" },
  ]}
  edges={[undefined, "flush every 200ms"]}
/>
```

A left-to-right pipeline (top-to-bottom on a phone). `edges[i]` labels the
arrow after node `i`.

### Validation

Frontmatter is validated on read (`lib/posts.ts`), drafts included, so a
mistake names its file instead of failing somewhere downstream:

```
content/posts/my-post.mdx — unknown topic "backnd" — must be one of:
frontend, backend, infrastructure, ai.
```

Old key and topic names fail with the rename to make — `wavelength` → `topic`,
`log` → `series`, `systems` → `backend`, and so on.

## Case studies

Longer write-ups on a project live in `content/work/<slug>.mdx` and render at
`/work/<slug>`. Same components as posts. Frontmatter:

```mdx
---
title: "Watchman: a system health monitor built for the 3am page"
excerpt: "One sentence on what it is and why."
topic: "backend"
year: "2026"
stack: ["TypeScript", "Next.js", "PostgreSQL"]   # optional
links: { repo: "https://github.com/phugadev/watchman" }   # optional: live, repo, npm
draft: true
---
```

Validated like posts (`lib/work.ts`), and drafts behave the same way. To link
one from the home page, set `caseStudySlug` on the project in `lib/site.ts` —
the build fails if the file doesn't exist, rather than shipping a dead link.

## Editing site copy

Everything outside posts and case studies lives in `lib/site.ts`:

- **`site`** — name, role, company, email, URL and socials. The home page's
  opening paragraph is built from these.
- **`site.availability`** — the "I work remotely, on … contracts, and can
  start with …" sentence. Set `open: false` and it disappears from the page,
  and `/llms.txt` says you're not taking new contracts.
- **`now`** — the "Right now I'm …" line. Only the first entry is shown; the
  line hides while the array is empty.
- **`projects`** — the Work list, in order. A row reads "**Name** — summary",
  with the year (or "Building" when `status` is `"In build"`). The row links to
  the first that exists of: its case study (`caseStudySlug`), a `specimen` route
  on this site (`/system` for Minima), then `links.live`, `repo`, `npm`.
  `description`, `stack` and `metrics` feed `/llms.txt` rather than the page —
  **only put a figure in `metrics` you've just verified**.
- **`credentials`** — earned only, never pending. Currently listed in
  `/llms.txt` only.

## Generated routes

These need no maintenance — they read from `lib/site.ts` and `content/posts/`:

- `/feed.xml` — RSS
- `/sitemap.xml`, `/robots.txt`
- `/opengraph-image` and one per post/band/series — social cards on the
  light ground (`lib/og.tsx`): a grey line with the topic dot, the title in
  Instrument Serif as on the article headline, and the name in Inter. Satori
  (which renders these) has no idea what CSS the site loads, so the two
  faces are committed as static `.ttf` files under `assets/fonts/` rather
  than fetched at build time — these routes are fully static, so a network
  fetch here would only ever run during `next build`, for two files that
  never change.
- `/llms.txt` — a curated markdown map of the site for language models
  (the llmstxt.org convention), generated from the same data as everything
  else so it can't go stale. This is what an assistant should find when
  someone asks it about you, instead of scraping the DOM.

## A note on MDX

Rendering goes through `@mdx-js/mdx`'s `evaluate` in `components/Mdx.tsx`, not
`next-mdx-remote`. That package resolves its JSX runtime through a bundled
`.cjs` shim which sidesteps Next's React aliasing and hands MDX a different
React instance than the RSC renderer — every post page 500s in dev with
`Cannot read properties of undefined (reading 'stack')` while production builds
render fine. Importing the runtime directly keeps it on one React instance.

`components/Mdx.tsx` also holds the site's two rehype steps: wrapping tables in
their tray, and marking multi-line code blocks for line numbers.

## Deploy

Vercel, zero config. Every PR gets a preview deployment and a `verify` check
in GitHub Actions (`npm ci`, typecheck, build); merge to `main` to ship.

## Structure

```
app/
  layout.tsx               — fonts, metadata, <Analytics />
  globals.css              — the site's layer on Minima: faint text, prose
                             colour, the tray, code frames, focus lists
  page.tsx                 — home: greeting, intro, Work, Writing
  blog/page.tsx            — writing index, newest first
  blog/[slug]/             — post page, and the layout that loads the serif
  blog/topic/[topic]/      — one page per topic
  blog/series/[series]/    — one page per series
  work/page.tsx            — case study index
  work/[slug]/             — case study, with its series listed beneath
  system/page.tsx          — Minima specimen: the design system, running
  not-found.tsx
  feed.xml/, llms.txt/     — RSS and the language-model site map
  sitemap.ts, robots.ts
  opengraph-image.tsx      — site share image (and one per post, topic,
                             series and case study, beside each page)
  icon.svg                 — favicon; favicon.ico and apple-icon.png are
                             rendered from it
content/
  posts/                   — posts, one .mdx each
  work/                    — case studies
public/                    — headshot and post images
assets/fonts/              — .ttf files for the share images
styles/                    — Minima's theme and palette, installed from its
                             registry; never edited here
lib/
  site.ts                  — site copy, projects, topics
  topics.ts                — each topic's Minima hue, as class names
  palette.ts               — Minima colours as hex, for share images and SVG
  posts.ts, work.ts        — read, validate and group content
  headings.ts              — the contents rail's headings
  dates.ts                 — timezone-safe YYYY-MM-DD parsing
  og.tsx                   — the shared share-image card
  schema.tsx               — JSON-LD (Person, WebSite, BlogPosting)
  system.ts                — data for /system
components/
  PageShell.tsx            — back link, <main>, footer; every page uses it
  layout.tsx               — Container, Section, PageHeader (Minima's) and
                             the site's topic-coloured Eyebrow
  Footer.tsx, LiveClock.tsx
  Greeting.tsx, CopyEmail.tsx, Avatar.tsx
  ProjectRow.tsx           — a row in Work
  PostCard.tsx             — a row in any writing list
  PostHeader.tsx           — series or topic, date, headline, standfirst
  PostToc.tsx              — the contents rail beside a post (1280px+)
  PostNav.tsx              — older/newer, or back to the list
  ScrollProgress.tsx       — the reading line along the top of a post
  TopicLinks.tsx, SeriesChips.tsx — the filters under /blog
  CaseStudyHeader.tsx
  Mdx.tsx, MdxComponents.tsx, CodeBlock.tsx, Diagram.tsx
  ui/                      — Minima's button, status and layout; the site's
                             Plate, TopicDot, SmartLink, Zigzag and icons
scripts/new-post.mjs       — the post scaffold
```

## Conventions

- **Every page wraps in `PageShell`.** Pass `back` for the link at the top and
  `reading` for the progress line on long articles. There's no nav bar — the
  home page is the navigation.
- **Lay pages out with Minima's primitives** from `components/layout.tsx`:
  `Container` (`size="narrow"` is the reading column), `Section`,
  `PageHeader`. Don't hand-roll widths or vertical rhythm.
- **Colour comes from Minima, by role.** Use the semantic classes —
  `text-foreground`, `text-muted-foreground`, `text-subtle-foreground`,
  `text-faint`, `bg-card`, `border-border` — never a hex or a raw scale step.
  Text sits on three tiers: foreground for what the eye should land on
  (headlines, headings, names, links), muted for reading, subtle for labels
  and dates, with faint below that for captions. A topic's colour comes from
  `lib/topics.ts`. The only hex values in the codebase are where CSS can't
  reach: `lib/palette.ts` (read from Minima's palette JSON), the share images,
  and `icon.svg`.
- **Don't edit `styles/`.** It's Minima, installed from its registry. Site
  decisions go in `app/globals.css`, which says why for each one.
- **Use `SmartLink` for any href that might be external** — it picks
  `next/link` or `<a target="_blank" rel="noreferrer">`.
- **Format dates with `parseDate` from `lib/dates.ts`, never `new Date(iso)`.**
  A date-only string parses as UTC midnight, so a US-region build renders every
  date a day early. Machine-readable output (RSS `pubDate`,
  `<time dateTime>`) deliberately stays on the raw value.
- **Default to server components.** The client ones each need the browser:
  `<Analytics />`, `LiveClock`, `Greeting` (the visitor's time of day),
  `CopyEmail` (the E key), `CodeBlock` (copy), `PostToc` (the active heading),
  `ScrollProgress`, and Minima's `button` and `status`. Keep new work on the
  server unless it genuinely needs interaction.

## Analytics

Vercel Analytics, in `app/layout.tsx`. Cookieless, so no consent banner, and it
no-ops in local dev — numbers only come from the deployment.

## Fonts

Three faces, one per voice (the reasoning is in the comment at the top of
`app/layout.tsx`):

- **Inter** (`font-sans`) — the system speaking: nav, labels, headings and
  body. Loaded in the root layout at **400 and 500**, upright only. 500 is the
  real medium cut behind `font-medium` (list titles, project names, table
  headers).
- **IBM Plex Mono** (`font-mono`) — the machine stating: figures, states,
  captions and code. Root layout, **400 and 500**. Plex isn't variable, so any
  new weight has to be listed.
- **Instrument Serif** (`font-serif`) — a person speaking: the article
  headline and nothing else. Loaded by `app/blog/[slug]/layout.tsx`, so **only
  post pages fetch it**, and exposed there through `[data-voice="author"]` in
  `app/globals.css`. It's high-contrast and loses its footing under about 24px,
  which is why body copy stays on the sans. A page outside `app/blog/[slug]/`
  that wants the serif has to load its own instance — elsewhere `font-serif`
  falls back to the system serif stack.

Minima ships no typeface of its own; it reads Tailwind's `--font-sans` and
`--font-mono`, which `app/globals.css` points at the two `next/font` variables.

**Known gap: prose bold and italics are synthesised.** Minima sets `<strong>`
in prose at 600, and nothing loads an italic Inter, so the browser thickens the
500 cut and slants the upright one. It reads acceptably at body size. For real
cuts, add `"600"` to the Inter `weight` array and `style: ["normal",
"italic"]` in `app/layout.tsx` — each costs a font file on every page.

The social cards can't use `next/font` (Satori doesn't read the page's CSS), so
Instrument Serif and Inter are also committed as `.ttf` files under
`assets/fonts/` — see [Generated routes](#generated-routes).
