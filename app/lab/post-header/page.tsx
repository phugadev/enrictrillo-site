import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Instrument_Serif } from "next/font/google";
import { PageShell } from "@/components/PageShell";
import { PostHeader } from "@/components/PostHeader";
import { Mdx } from "@/components/Mdx";
import { CONTAINER } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Hatch } from "@/components/ui/Hatch";
import { Zigzag } from "@/components/ui/Zigzag";
import {
  PostHeaderB,
  PostHeaderC,
  PostHeaderD,
  type SeriesPosition,
} from "@/components/lab/PostHeaderVariants";
import { getAllSeries, getPostBySlug, seriesSlug } from "@/lib/posts";
import { site } from "@/lib/site";

/**
 * SCRATCH ROUTE. Four candidate post headers side by side on one real post, so
 * the choice is made by looking rather than by describing. Same method that
 * settled the selected-work section: build all of them, put them on a lab
 * page, pick one, wire the winner in, delete the rest.
 *
 * Nothing here is imported by a shipping page. When a variant wins it moves
 * into components/ proper and this whole directory goes with the losers.
 *
 * The post pages are untouched by this branch — PostHeader.tsx is imported
 * below as variant A precisely so the baseline is the live component and not a
 * copy of it that can drift while the comparison is open.
 */

/**
 * Which post everything is rendered on. The Watchman ingest post is the useful
 * specimen: it is in a series (so the series treatments in B/C/D have real
 * data rather than a placeholder), it has a long title that wraps to two
 * lines at the measure, and it is in the systems band — a mid-spectrum colour
 * rather than one of the two extremes, which is the honest test of the band
 * treatments.
 */
const SPECIMEN = "watchman-ingest-at-forty-thousand-events-a-second";

/**
 * Same face and the same gate as app/blog/[slug]/layout.tsx. Without both, the
 * `font-serif` in every headline below resolves to the sans (that is what the
 * gate is *for* — see the note at the top of app/globals.css) and all four
 * variants would be judged in the wrong voice.
 */
const authored = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

/**
 * Kept out of search. app/sitemap.ts is an explicit list rather than a crawl,
 * so /lab is already absent from it by construction and no change is needed
 * there; robots.txt allows everything by design, so the exclusion has to be
 * declared here. Stricter than app/not-found.tsx, which is `follow: true`: a
 * 404 is a page a real reader lands on and should be helped out of, whereas
 * this is scratch work with a shelf life measured in days, and there is no
 * reason for a crawler to walk out of it into the rest of the site.
 */
export const metadata: Metadata = {
  title: `Lab — post header — ${site.name}`,
  robots: { index: false, follow: false },
};

/**
 * The first few paragraphs of the real post, stopping at its first heading.
 *
 * The headers are being judged for how they hand a reader over to the writing,
 * which cannot be seen with nothing underneath them — a header floating on an
 * empty page always looks fine. Sliced rather than excerpted by hand so it
 * stays the actual post if the post is edited.
 */
function opening(content: string): string {
  const firstHeading = content.indexOf("\n## ");
  return (firstHeading === -1 ? content : content.slice(0, firstHeading)).trim();
}

/** The specimen's place in its series, counted the way a reader counts: oldest is 1. */
function seriesPosition(series: string | undefined, slug: string): SeriesPosition | undefined {
  if (!series) return undefined;
  const found = getAllSeries().find((s) => s.slug === seriesSlug(series));
  if (!found) return undefined;

  // getAllSeries returns newest first; a series is read in the order it was
  // written, so reverse before counting.
  const chronological = [...found.posts].reverse();
  const index = chronological.findIndex((p) => p.slug === slug);
  if (index === -1) return undefined;

  return { name: found.name, slug: found.slug, index: index + 1, total: chronological.length };
}

/**
 * One variant: its letter, its name, the header, the opening of the post, and
 * the argument it is making. The note goes *after* the specimen deliberately —
 * reading the claim first tells you what to see, which is exactly what a
 * comparison is supposed to stop you doing.
 */
function Variant({
  letter,
  name,
  note,
  header,
  body,
}: {
  letter: string;
  name: string;
  note: string;
  header: React.ReactNode;
  body: string;
}) {
  return (
    <section className="border-t border-hairline pt-10">
      <div className="mb-10 flex items-baseline gap-3">
        <span className="font-mono text-[12px] font-medium uppercase tracking-wider text-paper">
          {letter}
        </span>
        <span className="font-mono text-[12px] uppercase tracking-wider text-faint">{name}</span>
      </div>

      {header}

      <article className="prose prose-invert mt-10 font-reading text-[18px] leading-[1.75]">
        <Mdx source={body} />
      </article>

      {/* The argument, in the margin voice — mono, quiet, clearly not part of
          the specimen it is describing. */}
      <p className="mt-10 border-l border-hairline pl-4 font-mono text-[12px] leading-relaxed text-muted">
        {note}
      </p>
    </section>
  );
}

export default async function PostHeaderLab() {
  let meta, content;
  try {
    ({ meta, content } = getPostBySlug(SPECIMEN));
  } catch {
    // The slug is hard-coded, so a rename of the post is the only way here.
    // Failing loudly beats rendering four headers for a post that no longer
    // exists and quietly making a design decision on stale metadata.
    notFound();
  }

  const series = seriesPosition(meta.series, meta.slug);
  const body = opening(content);

  return (
    <div className={authored.variable} data-voice="author">
      <PageShell mainClassName={`${CONTAINER} py-16`}>
        {/* The same measure as a real post page — max-w-2xl inside CONTAINER,
            not a bare centred column. A header judged at the wrong measure is
            a header judged on the wrong line lengths. */}
        <div className="max-w-2xl">
          <header className="mb-16">
            <SectionLabel>Lab · post header</SectionLabel>
            <p className="mt-4 font-reading text-[16px] leading-relaxed text-prose">
              Four treatments of everything above a post headline, on one real
              post — <span className="text-paper">{meta.title}</span>. A is what
              ships today. B, C and D are arguments, not restyles. Pick one; the
              other three get deleted with this route.
            </p>
          </header>

          <div className="space-y-20">
            <Variant
              letter="A"
              name="Letterhead (shipping today)"
              header={<PostHeader meta={meta} />}
              body={body}
              note="Baseline — components/PostHeader.tsx, unchanged. Argues that a post is an entry in a log: a fixed label column, aligned values, closed by a rule. Its strength is that it is unmistakably not a template, and it reads as an instrument. Its costs are that the band is just a coloured row among five, the series is styled identically to the reading time, and the headline starts roughly 120px down — below the fold on a phone."
            />

            <Variant
              letter="B"
              name="Spectrum scale"
              header={<PostHeaderB meta={meta} series={series} />}
              body={body}
              note="Argues the band should be seen before it is read, and that a taxonomy only means something when you can see the options you are not in. Four ticks, ascending nm, the post's band lit — the same calibration as the Spectrometer, so the two instruments agree. Everything else collapses to one dense line, because once the band has apparatus, three labelled rows are scaffolding around nine words."
            />

            <Variant
              letter="C"
              name="Episode frame"
              header={<PostHeaderC meta={meta} series={series} />}
              body={body}
              note="Argues that for a post inside a body of work, 'first of three about a system I actually run' is the fact worth the most vertical space — it is what turns a page view into a session, and A files it fourth in a table. Frame is structure, so 4px near-square, and the whole strip is a destination rather than a button. Weakness: two of the seven published posts have no series, and for those it degrades to D."
            />

            <Variant
              letter="D"
              name="One line, then the writing"
              header={<PostHeaderD meta={meta} series={series} />}
              body={body}
              note="Argues the boundary is in the wrong place. One unlabelled line carries everything A's table does — nobody needs to be told that 4 Mar 2026 is a date — and the headline arrives immediately. The break then goes below the headline, because the headline belongs to the writing rather than to the chrome. Costs the From line: a byline on every post of a site under one name restates the domain."
            />
          </div>

          {/* ------------------------------------------------------------- */}

          <section className="mt-24 border-t border-hairline pt-10">
            <SectionLabel>Specimen · zigzag vs hatch</SectionLabel>
            <p className="mt-4 font-reading text-[16px] leading-relaxed text-prose">
              Separate question, parked here because D uses the zigzag. These
              two look adjacent and are not the same thing — the argument for
              keeping both is that they are separating different kinds of
              boundary.
            </p>

            <div className="mt-10 space-y-10">
              <figure>
                <figcaption className="font-mono text-[11px] uppercase tracking-wider text-faint">
                  Hatch — structural
                </figcaption>
                <div className="mt-4">
                  <Hatch />
                </div>
                <p className="mt-4 font-mono text-[12px] leading-relaxed text-muted">
                  Spans the measure. 315° repeat off --rsk-rule-strong. Says one
                  region of the page has ended and another begins — chrome
                  talking about layout. Already shipping.
                </p>
              </figure>

              <figure>
                <figcaption className="font-mono text-[11px] uppercase tracking-wider text-faint">
                  Zigzag — prose break
                </figcaption>
                <div className="mt-4 flex justify-center text-hairline-strong">
                  <Zigzag />
                </div>
                <p className="mt-4 font-mono text-[12px] leading-relaxed text-muted">
                  Centred at its natural 112px, not spanning. The modern dinkus:
                  says the argument turns here — the author talking about the
                  writing. Full-measure it stops being a mark and becomes a saw
                  blade, and at that width it is competing with Hatch for the
                  same job.
                </p>
              </figure>

              {/* The two at once, at the width they would actually appear, is
                  the only view that answers whether they can coexist. */}
              <figure>
                <figcaption className="font-mono text-[11px] uppercase tracking-wider text-faint">
                  Both, in sequence
                </figcaption>
                <div className="mt-4">
                  <Hatch />
                  <p className="my-6 font-reading text-[18px] leading-[1.75] text-prose">
                    A paragraph between them, so the spacing is judged with type
                    around it rather than on bare ground.
                  </p>
                  <div className="flex justify-center text-hairline-strong">
                    <Zigzag />
                  </div>
                </div>
              </figure>
            </div>
          </section>
        </div>
      </PageShell>
    </div>
  );
}
