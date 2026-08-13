# enrictrillo.com — v6

Next.js 15 + TypeScript + Tailwind. Built to do one job: make a contract
decision-maker conclude, quickly, that I ship production software end to end.
The dispersion mark stays as a small brand signature rather than the full HUD
treatment from v5.2.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> Don't run `npm run build` while `next dev` is running — they share `.next`
> and the dev server starts throwing odd runtime errors. `rm -rf .next` if you
> hit that.

## Writing a post

Fastest path — scaffold it:

```bash
npm run new-post
```

Prompts for title, wavelength, excerpt and optional series, derives the slug, and
writes the file with today's date and `draft: true`. It won't overwrite an
existing post.

Or add the file by hand:

1. Add a new `.mdx` file to `content/posts/`, e.g. `content/posts/my-post.mdx`
2. Frontmatter at the top:

```mdx
---
title: "Your title"
excerpt: "One sentence for the index page and meta description."
date: "2026-08-06"
wavelength: "systems"   # interface | systems | compute | intelligence
series: "Watchman"      # optional — project or thread this belongs to
draft: false            # true hides it from the index/build until ready
---

Your content in Markdown. Code blocks get syntax highlighting for free.
```

3. `git push` — Vercel picks it up on the next deploy.

`wavelength` picks the accent colour and the band the post is grouped under on
`/blog` — same taxonomy as the Work section, so categorisation stays consistent
across the site:

- **Interface** (amber, 590nm) — product thinking and frontend
- **Systems** (green, 520nm) — architecture, backend and data
- **Compute** (blue, 470nm) — infrastructure, deploys and hardware
- **Intelligence** (violet, 405nm) — models, agents and AI engineering

Systems and Compute are the pair most easily confused: **Systems is how the
application is built, Compute is where it runs.** File a post by what it is
about, not what it mentions — "Blackwell's memory bandwidth and what it costs to
rent" is Compute; "what Blackwell means for running enrichment locally" is
Intelligence.

`series` is optional. It shows in the post's header readout and links to
`/blog/series/<slug>`, which collects every post in that run — use it for a
project (`"Watchman"`) or a study thread (`"AWS SAA-C03"`). Series pages are
generated automatically; there's nothing to register.

GitHub-flavoured markdown is enabled, so tables, task lists and strikethrough
all work alongside the usual headings, lists, quotes and footnotes.

Code blocks can carry a filename:

````mdx
```ts title="lib/posts.ts"
export const answer = 42;
```
````

Drafts (`draft: true`) are previewable at `/blog/<slug>` while `npm run dev` is
running, and are excluded from the production build entirely — not just hidden
from the index, but 404 in production.

### Images

Put files in `public/`, then either:

```mdx
![Alt text](/shots/watchman.png "Optional caption")
```

— lazy-loaded, framed, caption from the markdown title. Or, when you know the
dimensions and want `next/image` to optimise and generate a srcset:

```mdx
<Figure src="/shots/watchman.png" alt="Alert pipeline"
        width={1600} height={900} caption="Sub-second alerting." />
```

Prefer `<Figure>` for anything large. Both render as `<figure>/<figcaption>`.

### Validation

Frontmatter is validated on read (`lib/posts.ts`), drafts included, so mistakes
name themselves instead of failing somewhere downstream:

```
content/posts/my-post.mdx — unknown wavelength "sytems" — must be one of:
interface, systems, compute, intelligence.
```

## Editing site copy

Everything outside blog posts — name, role, tagline, projects, credentials,
availability, nav, socials — lives in `lib/site.ts`.

Two things worth knowing:

- **Availability.** `site.availability.open` toggles the status line in the hero
  and footer. Set it to `false` and both disappear; nothing else changes.
- **Credentials.** `credentials` is deliberately *earned only* — no pending or
  in-progress entries. A roadmap of unearned certs signals "still qualifying" to
  the people this site is meant to convert. The section hides itself entirely
  while the array is empty.

## Generated routes

These need no maintenance — they read from `lib/site.ts` and `content/posts/`:

- `/feed.xml` — RSS
- `/sitemap.xml`, `/robots.txt`
- `/opengraph-image` and `/blog/<slug>/opengraph-image` — social cards,
  generated per post with the wavelength accent (`lib/og.tsx`)
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

## Deploy

Push to GitHub and import on Vercel — zero config, standard App Router project.
Point enrictrillo.com's DNS at the Vercel project once it's live.

## Structure

```
app/
  layout.tsx             — fonts, metadata
  page.tsx               — homepage (hero, work, credentials, latest posts, about)
  blog/page.tsx          — blog index, flat and newest-first
  blog/[slug]/layout.tsx — loads the reading font for post pages only
  blog/[slug]/page.tsx   — post template
  blog/series/[series]/  — auto-generated series index pages
  blog/wavelength/[…]/   — auto-generated band index pages
  feed.xml/route.ts      — RSS
  llms.txt/route.ts      — markdown site map for language models
  sitemap.ts, robots.ts
  opengraph-image.tsx    — site social card
content/posts/           — posts, one .mdx per file
lib/
  site.ts                — all site copy, projects, credentials, taxonomy
  posts.ts               — reads/parses posts, wavelength grouping
  og.tsx                 — shared OG card
components/
  PageShell.tsx          — skip link + nav + <main> + footer; every page uses it
  Nav.tsx, Footer.tsx
  PostCard.tsx           — post row on the homepage and blog index
  PostHeader.tsx         — the instrument readout above each post
  PostNav.tsx            — older/newer at the end of a post
  Mdx.tsx                — MDX rendering
  MdxComponents.tsx      — image/figure handling + <Figure>
  Spectrometer.tsx       — hero strip; the site's legend for the four bands
  WavelengthChips.tsx    — band filters, rendered as links to real pages
  Availability.tsx, Credentials.tsx, DispersionMark.tsx
  ui/
    Section.tsx          — hairline band + CONTAINER (the shared measure)
    SectionLabel.tsx     — the mono uppercase section heading
    SmartLink.tsx        — internal vs external link handling
    WavelengthDot.tsx    — the colour-coded dot
    WavelengthSpine.tsx  — the vertical rule beside a post row
```

## Conventions

A few things worth knowing before editing:

- **Pages don't render `Nav`/`Footer` themselves** — wrap in `PageShell` and pass
  `mainClassName` for the page's own layout. That's also where the skip link lives.
- **Use `SmartLink` for any href that isn't a literal internal route** — it picks
  `next/link` vs `<a target="_blank" rel="noreferrer">`. Hardcoded internal links
  can use `next/link` directly.
- **Don't hand-roll the wavelength dot or the mono section label** — `WavelengthDot`
  and `SectionLabel` exist so the sizes don't drift apart again.
- **`CONTAINER`** (`components/ui/Section.tsx`) is the one place the page measure is
  defined. `Section` applies it with the standard vertical rhythm.
- **Everything you write should be a server component.** The only client component
  in the tree is `<Analytics />` in the root layout. Nothing else here needs client
  JS; keep it that way unless a feature genuinely requires interactivity.

## Analytics

Vercel Analytics is wired up in `app/layout.tsx`. Cookieless, so no consent banner
is required, and it no-ops in local dev — numbers only come from the deployment.

It costs nothing in bundle size: the tracker is a 1.3 KB same-origin script loaded
after hydration, served from a randomised path (e.g. `/f88f10b70f57bb41/script.js`)
so ad blockers don't trivially match it. First Load JS is unchanged at 99.8 kB.

## Fonts

Two families load site-wide — Space Grotesk (`font-display`, `font-body`) and
JetBrains Mono (`font-mono`), about 64 KB.

A third, Newsreader (`font-reading`), is loaded by `app/blog/[slug]/layout.tsx`
rather than the root layout, so **only post pages fetch it**. Long-form reading
gets a real reading face with true italics; every other page stays light.

If you add a page that needs the reading face, it has to live under
`app/blog/[slug]/` or load its own instance — `font-reading` resolves to nothing
elsewhere.

All three use variable fonts (no `weight` array). Pinning weights previously left
prose headings without a real 700 cut, so the browser synthesised bold.
