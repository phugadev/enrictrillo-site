import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { DispersionMark } from "@/components/DispersionMark";
import { Availability } from "@/components/Availability";
import { Credentials } from "@/components/Credentials";
import { Spectrometer } from "@/components/Spectrometer";
import { CONTAINER, Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SmartLink } from "@/components/ui/SmartLink";
import { WavelengthDot } from "@/components/ui/WavelengthDot";
import { site, projects } from "@/lib/site";
import { getAllPosts } from "@/lib/posts";

const LATEST_COUNT = 3;

export default function Home() {
  const posts = getAllPosts().slice(0, LATEST_COUNT);

  return (
    <PageShell>
      {/* Hero */}
      <section className={`${CONTAINER} pb-14 pt-16 sm:pt-20`}>
        <SectionLabel as="p" className="mb-5">
          {site.role} — {site.location}
        </SectionLabel>
        <h1 className="font-display text-[40px] font-medium leading-[1.15] tracking-tight text-paper sm:text-[52px]">
          Production software,
          <br />
          end to end.
        </h1>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
          Nine years building and shipping on TypeScript, Next.js and Python — with AWS and AI as
          part of the toolkit, not a separate department. I take features from product decision to
          production rather than handing them across three teams.
        </p>

        {/* Availability lives in the sticky nav and the footer — a third
            statement here made it read as filler rather than signal. */}
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
      </section>

      {/* Signature strip and the site's legend, before any coloured dot appears */}
      <Spectrometer />

      <Section id="work">
        <SectionLabel>Selected work</SectionLabel>
        <div className="mt-6 divide-y divide-hairline">
          {projects.map((project) => (
            <SmartLink key={project.name} href={project.href} className="group block py-5">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <WavelengthDot wavelength={project.wavelength} />
                    <h3 className="font-display text-[17px] text-paper">{project.name}</h3>
                  </div>
                  <p className="mt-1.5 max-w-md text-[14px] leading-relaxed text-muted">
                    {project.description}
                  </p>
                  {project.stack && (
                    <p className="mt-2.5 font-mono text-[11px] tracking-wide text-faint">
                      {project.stack.join(" · ")}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-right font-mono text-[11px] uppercase tracking-wider text-faint">
                  <span className="block text-muted">{project.status}</span>
                  <span className="block">{project.year}</span>
                </span>
              </div>
            </SmartLink>
          ))}
        </div>
      </Section>

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
              <PostCard key={post.slug} post={post} />
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
              and Node behind it, AWS underneath, and AI work layered through the middle — part of
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
