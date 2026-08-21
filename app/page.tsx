import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { About } from "@/components/About";
import { Credentials } from "@/components/Credentials";
import { ProjectEntry } from "@/components/ProjectEntry";
import { Now } from "@/components/Now";
// DESIGN TRIAL — see PR description. Revert by dropping this import and the
// <Expertise /> line below.
import { Expertise } from "@/components/Expertise";
import { Spectrometer } from "@/components/Spectrometer";
import { Toolkit } from "@/components/Toolkit";
import { CONTAINER, Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
// DESIGN TRIAL — see PR description. Revert by dropping this import and
// unwrapping the sections below it that use <Reveal>.
import { Reveal } from "@/components/ui/Reveal";
import { site, projects } from "@/lib/site";
import { getAllPosts } from "@/lib/posts";
import { parseDate } from "@/lib/dates";

const LATEST_COUNT = 3;

/** How recent a post has to be to be worth flagging on the homepage. */
const NEW_WINDOW_DAYS = 21;

/**
 * The page is static, so `Date.now()` below is *build* time, not read time —
 * without this the pill would be frozen at whatever it was on the last
 * deploy and could sit on a post for months. Twelve hours is the cheapest
 * honest answer: two regenerations a day, each one a re-render of a page
 * that reads three files off disk. Nothing here justifies making the list
 * client-side or hydrating a date.
 */
export const revalidate = 43200;

export default function Home() {
  const posts = getAllPosts().slice(0, LATEST_COUNT);

  /**
   * Only the newest post can wear the pill, and only inside the window.
   *
   * The window alone is not enough: publish three posts in a fortnight and
   * all three light up, which tells a reader nothing except that the site
   * had a good week. Capping it at one keeps the pill meaning "start here,
   * this is the thing I just put up" — and in a quiet stretch, nobody gets
   * it, which is the honest outcome rather than a badge that is always on.
   *
   * `getAllPosts()` is already sorted newest-first, so this is one date
   * comparison per render, not a scan.
   */
  const newestIsRecent =
    posts.length > 0 &&
    Date.now() - parseDate(posts[0].date).getTime() < NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  return (
    <PageShell>
      {/* Hero */}
      <section className={`${CONTAINER} pb-12 pt-14 sm:pt-16`}>
        {/* Face first — every portfolio worth copying leads with one, and it
            costs 8 KB. Name and role sit beside it so the page introduces
            itself before the headline makes a claim. */}
        <div className="mb-8 flex animate-fade-up items-center gap-4">
          <Avatar />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 font-display text-[17px] tracking-tight text-paper">
              {site.name}
              <VerifiedBadge className="h-[18px] w-[18px]" />
            </p>
            <SectionLabel as="p" className="mt-1">
              {site.role} — {site.location}
            </SectionLabel>
          </div>
        </div>

        <h1
          className="animate-fade-up font-display text-[40px] font-medium leading-[1.15] tracking-tight text-paper sm:text-[52px]"
          style={{ animationDelay: "80ms" }}
        >
          Production software,
          <br />
          end to end.
        </h1>
        <p
          /* text-prose, not text-muted. This is a paragraph someone reads, and
             muted is the metadata grey — dates, labels, counts. Running the
             one paragraph that has to do the persuading two steps dimmer
             than any paragraph inside an article was the hierarchy
             backwards. */
          className="mt-6 max-w-xl animate-fade-up text-[17px] leading-relaxed text-prose"
          style={{ animationDelay: "160ms" }}
        >
          Nine years building and shipping on TypeScript, Next.js and Python — with Azure and AI as
          part of the toolkit, not a separate department. I take features from product decision to
          production across the full stack — no handoffs between specialists along the way.
        </p>

        {/* Availability lives in AvailabilityBar (below) and the footer —
            a third statement here made it read as filler rather than signal. */}
        <div
          className="mt-8 flex animate-fade-up flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[13px]"
          style={{ animationDelay: "240ms" }}
        >
          <a
            href={`mailto:${site.email}`}
            className="rounded border border-hairline px-5 py-2.5 text-paper transition-colors hover:border-paper"
          >
            {site.email}
          </a>
          <Link href="/blog" className="text-muted transition-colors hover:text-paper">
            Read the writing →
          </Link>
        </div>

        {/* DESIGN TRIAL — capability areas at the same altitude as the
            tagline, so it sits inside the hero rather than after it. */}
        <div className="animate-fade-up" style={{ animationDelay: "320ms" }}>
          <Expertise />
        </div>
      </section>

      {/* Signature strip and the site's legend, before any coloured dot appears */}
      <Spectrometer />

      {/* Proof leads — right after the legend that explains its colours,
          before any lower-stakes content gets in the way of it. */}
      <Reveal>
        <Section id="work">
          <div className="flex items-baseline justify-between">
            <SectionLabel>Selected work</SectionLabel>
            {/* The count, the way an instrument labels a channel — it also
                tells a reader the list is short on purpose. */}
            <span className="font-mono text-[12px] text-faint">{projects.length}</span>
          </div>
          <ul className="mt-6 divide-y divide-hairline">
            {projects.map((project, i) => (
              <ProjectEntry key={project.name} project={project} index={i} />
            ))}
          </ul>
        </Section>
      </Reveal>

      <Reveal>
        <Toolkit />
      </Reveal>

      {/* Hides itself until there's a present tense worth stating. Moved
          past the proof and capability sections — a present-tense aside is
          lower stakes than either, and sat awkwardly between the hero and
          Selected work, right where momentum toward the proof should be
          building. */}
      <Reveal>
        <Now />
      </Reveal>

      {/* Hides itself while no credentials are banked */}
      <Reveal>
        <Credentials />
      </Reveal>

      {posts.length > 0 && (
        <Reveal>
          <Section>
            <div className="flex items-center justify-between">
              <SectionLabel>Latest writing</SectionLabel>
              <Link href="/blog" className="font-mono text-[12px] text-muted hover:text-paper">
                All posts →
              </Link>
            </div>
            <div className="rsk-focuslist mt-2">
              {posts.map((post, i) => (
                <PostCard
                  key={post.slug}
                  post={post}
                  as="h3"
                  compact
                  flagNew={i === 0 && newestIsRecent}
                />
              ))}
            </div>
          </Section>
        </Reveal>
      )}

      <Reveal>
        <About />
      </Reveal>
    </PageShell>
  );
}
