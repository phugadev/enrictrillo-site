import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { CONTAINER } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { WavelengthDot } from "@/components/ui/WavelengthDot";
import { getAllPosts, getPostsByWavelength } from "@/lib/posts";
import { site, wavelengths } from "@/lib/site";

const LATEST_COUNT = 5;

/**
 * The "Latest" strip exists because grouping by wavelength hides chronology.
 * That problem only exists once the grouped list is too long to scan at a
 * glance — below this many posts the strip just reprints the page directly
 * beneath itself.
 */
const LATEST_MIN_POSTS = 8;

export const metadata: Metadata = {
  title: `Writing — ${site.name}`,
  description:
    "Build logs, architecture notes and infrastructure/AI engineering write-ups, grouped by wavelength.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const bands = getPostsByWavelength();
  const posts = getAllPosts();
  const latest = posts.length >= LATEST_MIN_POSTS ? posts.slice(0, LATEST_COUNT) : [];

  return (
    <PageShell mainClassName={`${CONTAINER} py-16`}>
      <h1 className="font-display text-[32px] font-medium tracking-tight text-paper">Writing</h1>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
        Build logs, architecture notes and engineering write-ups — split into four bands, the same
        taxonomy the work is organised by.
      </p>

      {posts.length === 0 ? (
        <p className="mt-14 font-mono text-[13px] text-faint">Nothing published yet.</p>
      ) : (
        <>
          {latest.length > 0 && (
            <section className="mt-10">
              <SectionLabel>Latest</SectionLabel>
              <ul className="mt-3">
                {latest.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex items-baseline gap-3 py-2"
                    >
                      <WavelengthDot wavelength={post.wavelength} className="translate-y-[-2px]" />
                      <time
                        dateTime={post.date}
                        className="w-[3.75rem] shrink-0 font-mono text-[11px] uppercase tracking-wider text-faint"
                      >
                        {format(new Date(post.date), "d MMM")}
                      </time>
                      <span className="font-display text-[15px] leading-snug text-muted transition-colors group-hover:text-paper">
                        {post.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Anchors rather than state, so this stays a server component */}
          <nav
            aria-label="Jump to wavelength"
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-y border-hairline py-3 font-mono text-[11px] uppercase tracking-wider"
          >
            {bands.map(({ wavelength, posts }) => (
              <a
                key={wavelength}
                href={`#${wavelength}`}
                className="flex items-center gap-2 text-muted transition-colors hover:text-paper"
              >
                <WavelengthDot wavelength={wavelength} />
                {wavelengths[wavelength].label}
                <span className="text-faint">{posts.length}</span>
              </a>
            ))}
          </nav>

          <div className="mt-12 space-y-14">
            {bands.map(({ wavelength, posts }) => {
              const wl = wavelengths[wavelength];
              return (
                <section key={wavelength} id={wavelength} className="scroll-mt-24">
                  <div className="flex items-baseline gap-3">
                    <SectionLabel style={{ color: wl.hex }}>{wl.label}</SectionLabel>
                    <span className="font-mono text-[11px] tracking-wider text-faint">
                      {wl.nm}nm
                    </span>
                  </div>
                  <div className="mt-1 divide-y divide-hairline">
                    {posts.map((post) => (
                      <PostCard key={post.slug} post={post} showWavelength={false} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </PageShell>
  );
}
