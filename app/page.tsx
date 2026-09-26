import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { About } from "@/components/About";
import { Availability } from "@/components/Availability";
import { Credentials } from "@/components/Credentials";
import { Expertise } from "@/components/Expertise";
import { Now } from "@/components/Now";
import { ProjectCard } from "@/components/ProjectCard";
import { Spectrometer } from "@/components/Spectrometer";
import { Toolkit } from "@/components/Toolkit";
import { PAGE, Section } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Reveal } from "@/components/ui/Reveal";
import { bandGradient, site, projects } from "@/lib/site";
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

  /* Only the newest post can wear the pill, and only inside the window —
     three posts in a fortnight should not all light up. */
  const newestIsRecent =
    posts.length > 0 &&
    Date.now() - parseDate(posts[0].date).getTime() < NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  return (
    <PageShell>
      {/* Hero. The spectrum sits behind it once, blurred to a glow — the only
          place the full gradient appears at size. */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-80 max-w-4xl opacity-20 blur-3xl"
          style={{ background: bandGradient }}
        />
        <div className={`${PAGE} pt-section pb-stack sm:pt-[calc(var(--spacing-section)*1.5)]`}>
          <div className="animate-fade-up">
            <Availability />
          </div>

          <div className="mt-stack flex animate-fade-up items-center gap-gutter [animation-delay:60ms]">
            <Avatar size={56} />
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 type-subheading text-foreground">
                {site.name}
                <VerifiedBadge className="size-4" />
              </p>
              <p className="signal mt-1 type-label-sm text-subtle-foreground">
                {site.role} · {site.location}
              </p>
            </div>
          </div>

          <h1 className="mt-stack max-w-3xl animate-fade-up text-balance type-title text-foreground [animation-delay:120ms] sm:type-display">
            Production software, end to end.
          </h1>
          <p className="mt-gutter max-w-2xl animate-fade-up text-pretty type-lead text-muted-foreground [animation-delay:180ms]">
            Nine years building and shipping on TypeScript, Next.js and Python — with Azure and AI
            as part of the toolkit, not a separate department. I take features from product
            decision to production across the full stack, with no handoffs between specialists
            along the way.
          </p>

          <div className="mt-stack flex animate-fade-up flex-wrap items-center gap-inset [animation-delay:240ms]">
            <a href={`mailto:${site.email}`} className={buttonVariants({ size: "lg" })}>
              Email me
            </a>
            <Link href="#work" className={buttonVariants({ variant: "outline", size: "lg" })}>
              See the work
            </Link>
            <Link href="/blog" className={buttonVariants({ variant: "ghost", size: "lg" })}>
              Read the writing →
            </Link>
          </div>
        </div>

        <div className={`${PAGE} animate-fade-up pb-section [animation-delay:300ms]`}>
          <Expertise />
        </div>
      </section>

      {/* The legend, before the first coloured dot it explains. */}
      <div className={PAGE}>
        <Spectrometer />
      </div>

      <Reveal>
        <Section id="work" label="Selected work" aside={`${projects.length} projects`}>
          <ul className="space-y-gutter">
            {projects.map((project, i) => (
              <ProjectCard key={project.name} project={project} index={i} />
            ))}
          </ul>
        </Section>
      </Reveal>

      <Reveal>
        <Toolkit />
      </Reveal>

      {posts.length > 0 && (
        <Reveal>
          <Section
            label="Latest writing"
            aside={
              <Link href="/blog" className="transition-colors duration-quick hover:text-foreground">
                All posts →
              </Link>
            }
          >
            <div className="focuslist divide-y divide-border">
              {posts.map((post, i) => (
                <PostCard key={post.slug} post={post} as="h3" compact flagNew={i === 0 && newestIsRecent} />
              ))}
            </div>
          </Section>
        </Reveal>
      )}

      <Reveal>
        <Now />
      </Reveal>

      <Reveal>
        <Credentials />
      </Reveal>

      <Reveal>
        <About />
      </Reveal>
    </PageShell>
  );
}
