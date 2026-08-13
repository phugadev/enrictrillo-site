import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { DispersionMark } from "@/components/DispersionMark";
import { Credentials } from "@/components/Credentials";
import { ProjectRow } from "@/components/ProjectRow";
import { Now } from "@/components/Now";
// DESIGN TRIAL — see PR description. Revert by dropping this import and the
// <Expertise /> line below.
import { Expertise } from "@/components/Expertise";
import { Spectrometer } from "@/components/Spectrometer";
import { Toolkit } from "@/components/Toolkit";
import { CONTAINER, Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { site, projects } from "@/lib/site";
import { getAllPosts } from "@/lib/posts";

const LATEST_COUNT = 3;

export default function Home() {
  const posts = getAllPosts().slice(0, LATEST_COUNT);

  return (
    <PageShell>
      {/* Hero */}
      <section className={`${CONTAINER} pb-12 pt-14 sm:pt-16`}>
        {/* Face first — every portfolio worth copying leads with one, and it
            costs 8 KB. Name and role sit beside it so the page introduces
            itself before the headline makes a claim. */}
        <div className="mb-8 flex items-center gap-4">
          <Avatar />
          <div className="min-w-0">
            <p className="font-display text-[17px] tracking-tight text-paper">{site.name}</p>
            <SectionLabel as="p" className="mt-1">
              {site.role} — {site.location}
            </SectionLabel>
          </div>
        </div>

        <h1 className="font-display text-[40px] font-medium leading-[1.15] tracking-tight text-paper sm:text-[52px]">
          Production software,
          <br />
          end to end.
        </h1>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
          Nine years building and shipping on TypeScript, Next.js and Python — with Azure and AI as
          part of the toolkit, not a separate department. I take features from product decision to
          production across the full stack — no handoffs between specialists along the way.
        </p>

        {/* Availability lives in AvailabilityBar (below) and the footer —
            a third statement here made it read as filler rather than signal. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[13px]">
          <a
            href={`mailto:${site.email}`}
            className="rounded-full border border-hairline px-5 py-2.5 text-paper transition-colors hover:border-paper"
          >
            {site.email}
          </a>
          <Link href="/blog" className="text-muted transition-colors hover:text-paper">
            Read the writing →
          </Link>
        </div>

        {/* DESIGN TRIAL — capability areas at the same altitude as the
            tagline, so it sits inside the hero rather than after it. */}
        <Expertise />
      </section>

      {/* Signature strip and the site's legend, before any coloured dot appears */}
      <Spectrometer />

      {/* Hides itself until there's a present tense worth stating */}
      <Now />

      <Section id="work">
        <SectionLabel>Selected work</SectionLabel>
        <ul className="mt-6 space-y-4">
          {projects.map((project) => (
            <ProjectRow key={project.name} project={project} />
          ))}
        </ul>
      </Section>

      <Toolkit />

      {/* Hides itself while no credentials are banked */}
      <Credentials />

      {posts.length > 0 && (
        <Section>
          <div className="flex items-center justify-between">
            <SectionLabel>Latest writing</SectionLabel>
            <Link href="/blog" className="font-mono text-[12px] text-muted hover:text-paper">
              All posts →
            </Link>
          </div>
          <div className="mt-2 divide-y divide-hairline">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} as="h3" compact />
            ))}
          </div>
        </Section>
      )}

      <Section id="about">
        <SectionLabel>About</SectionLabel>
        <div className="mt-6 flex items-start gap-4">
          <DispersionMark size={22} />
          <div className="max-w-xl space-y-4 text-[16px] leading-relaxed text-muted">
            <p>
              I'm {site.name}, a {site.role.toLowerCase()} based in {site.location}, working through{" "}
              {site.company}.
            </p>
            <p>
              I build and ship production software end to end: product thinking through frontend,
              backend, cloud and AI. In practice that's TypeScript and Next.js on the front, Python
              and Node behind it, Azure underneath, and AI work layered through the middle — part of
              the toolkit rather than a separate specialism.
            </p>
            {/*
              TODO(rico): this slot wants something the availability pills don't
              already say — years contracting, sectors/domains you've delivered
              in, team sizes, notice period. Restating "Outside IR35 and C2C"
              here made it the third identical claim on one scroll.
            */}
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
