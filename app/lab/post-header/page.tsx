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
  PostHeaderA,
  PostHeaderB,
  type SeriesPosition,
} from "@/components/lab/PostHeaderVariants";
import { getAllPosts, getAllSeries, getPostBySlug, seriesSlug } from "@/lib/posts";
import { site } from "@/lib/site";

/**
 * SCRATCH ROUTE. Candidate post headers side by side on one real post, so the
 * choice is made by looking rather than by describing. Same method that
 * settled the selected-work section: build all of them, put them on a lab
 * page, pick one, wire the winner in, delete the rest.
 *
 * The comparison has been through a round. C (episode frame) and D (one line,
 * then the writing) are gone as standalone variants — not because either lost
 * but because both won, and the shipped `components/PostHeader.tsx` is now the
 * hybrid of them. It is rendered first here, on the same specimen and at the
 * same measure as the rest, because the question this page still answers is
 * whether what shipped beats what didn't.
 *
 * A stays as the letterhead it was, moved into components/lab/ now that the
 * real file no longer holds it. B stays because its argument was never settled
 * — it is about the band, which the hybrid treats as a two-word label, and
 * that trade is still open.
 */

/**
 * Which post everything is rendered on. The Watchman ingest post is the useful
 * specimen: it is in a series (so the series treatments have real data rather
 * than a placeholder), it has a long title that wraps to two
 * lines at the measure, and it is in the systems band — a mid-spectrum colour
 * rather than one of the two extremes, which is the honest test of the band
 * treatments.
 */
const SPECIMEN = "watchman-ingest-at-forty-thousand-events-a-second";

/**
 * The counter-specimen is found rather than named: the newest published post
 * with no series. The hybrid's whole claim about the frame is a claim about
 * those posts, so one gets rendered rather than described — and looking it up
 * means the section cannot quietly start showing a series frame the day that
 * post joins a series.
 */
function seriesless() {
  return getAllPosts().find((p) => !p.series);
}

/**
 * Same face and the same gate as app/blog/[slug]/layout.tsx. Without both, the
 * `font-serif` in every headline below resolves to the sans (that is what the
 * gate is *for* — see the note at the top of app/globals.css) and every
 * variant would be judged in the wrong voice.
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
    // Failing loudly beats rendering headers for a post that no longer
    // exists and quietly making a design decision on stale metadata.
    notFound();
  }

  const loner = seriesless();

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
              Everything above a post headline, on one real post —{" "}
              <span className="text-paper">{meta.title}</span>. First is what
              ships: the C/D hybrid, an episode frame over a byline over the
              headline, with the break underneath. Then the letterhead it
              replaced, and B, whose argument about the band is still open.
            </p>
          </header>

          <div className="space-y-20">
            <Variant
              letter="✓"
              name="Shipped — episode frame, byline, then the writing"
              header={<PostHeader meta={meta} />}
              body={body}
              note="What ships: components/PostHeader.tsx. D's spine — one line of chrome, the headline early, the break below it — with C's episode frame restored above the byline, because 'first of three about a system I actually run' is the fact that turns a page view into a session. The frame is a MEMBERSHIP frame rather than a series frame, which is what fixes C: a post with no series fills the same strip with its band and its position among the four bands (see below), so nothing is ever absent. The byline is the author metadata A carried as a From row, set as a byline instead of a table field."
            />

            <Variant
              letter="A"
              name="Letterhead (what shipped before)"
              header={<PostHeaderA meta={meta} />}
              body={body}
              note="The previous shipping header, now living in components/lab/. Argues that a post is an entry in a log: a fixed label column, aligned values, closed by a rule. Its strength is that it is unmistakably not a template, and it reads as an instrument. Its costs are that the band is just a coloured row among five, the series is styled identically to the reading time, and the headline starts roughly 120px down — below the fold on a phone."
            />

            <Variant
              letter="B"
              name="Spectrum scale"
              header={<PostHeaderB meta={meta} series={series} />}
              body={body}
              note="Still open, which is why it survives the cull. Argues the band should be seen before it is read, and that a taxonomy only means something when you can see the options you are not in. Four ticks, ascending nm, the post's band lit — the same calibration as the Spectrometer, so the two instruments agree. The shipped header only spends that apparatus on posts with no series; B spends it on every post, and pays for it with the series."
            />
          </div>

          {/* ------------------------------------------------------------- */}

          {/* The case that killed C as a default, shown rather than argued.
              Two of the seven published posts have no series, and the whole
              claim of the hybrid is that those look deliberate rather than
              short of a row. Rendered on its own real post — different band,
              different title length — because a seriesless header faked from
              the specimen by deleting a field is not evidence. */}
          {loner && (
            <section className="mt-24 border-t border-hairline pt-10">
              <SectionLabel>Shipped · the seriesless case</SectionLabel>
              <p className="mt-4 font-reading text-[16px] leading-relaxed text-prose">
                The same component on{" "}
                <span className="text-paper">{loner.title}</span>, which belongs
                to no series. The frame stays, at the same height and in the
                same place, carrying the band and its position among the four; the band
                drops out of the byline below rather than being said twice.
              </p>
              <div className="mt-10">
                <PostHeader meta={loner} />
              </div>
            </section>
          )}

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
