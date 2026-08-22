import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageShell } from "@/components/PageShell";
import { CONTAINER, Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Hatch } from "@/components/ui/Hatch";
import { Endpoint, address } from "@/components/ui/Endpoint";
import { Plate, Cell } from "@/components/ui/Plate";
import { bandSpecimens, radiusScale, ratioOf, ruskelVersion } from "@/lib/system";
import { site } from "@/lib/site";

const PACKAGE = "https://www.npmjs.com/package/@ruskel/ui";
const SOURCE = "https://github.com/phugadev/ruskel";

const description =
  "Ruskel — the design system this site is built on. One OKLCH spectrum solved against contrast windows, two exposures, and rules for when to use what.";

export const metadata: Metadata = {
  title: `System — ${site.name}`,
  description,
  alternates: { canonical: "/system" },
  openGraph: {
    type: "website",
    title: `System — ${site.name}`,
    description,
    url: "/system",
    siteName: site.name,
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — ${site.role}` },
    ],
  },
};

/** A note in the margin voice: mono, quiet, one idea. */
function Note({ children }: { children: ReactNode }) {
  return <p className="mt-3 max-w-prose font-mono text-[11px] leading-[1.7] text-faint">{children}</p>;
}

function Body({ children }: { children: ReactNode }) {
  return <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-prose">{children}</p>;
}

/**
 * The four bands, with the two values each one resolves to and the contrast
 * each was solved for. The numbers are read out of @ruskel/tokens at build
 * time (lib/system.ts) rather than typed here — a page arguing that the
 * palette is a constraint solve cannot be the one place where the figures are
 * copied by hand.
 */
function BandTable() {
  return (
    <div className="mt-8 divide-y divide-hairline border-y border-hairline">
      <div className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-2 font-mono text-[10px] uppercase tracking-wider text-faint sm:grid-cols-[7rem_1fr_auto_auto]">
        <span>Band</span>
        <span className="hidden sm:block">Text ring — read</span>
        <span className="hidden text-right sm:block">Mark</span>
        <span className="text-right">Text</span>
      </div>

      {bandSpecimens().map((band) => (
        <div
          key={band.wavelength}
          data-band={band.wavelength}
          className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-4 sm:grid-cols-[7rem_1fr_auto_auto]"
        >
          <span className="flex items-baseline gap-2.5 font-mono text-[11px] uppercase tracking-wider">
            {/* The mark, doing the only job a mark has: being seen. */}
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 translate-y-[-1px] rounded-full"
              style={{ background: "var(--rsk-mark)" }}
            />
            <span className="text-paper">{band.label}</span>
          </span>

          {/* The text ring, doing the only job it has: being read. Same hue,
              pulled back until it passes AA as type. */}
          <span className="text-[14px]" style={{ color: "var(--rsk-tint)" }}>
            {band.nm}nm — {band.text.token.replace("rsk-", "--rsk-")}
          </span>

          <span className="hidden text-right font-mono text-[11px] text-faint sm:block">
            {band.mark.ratio.toFixed(2)}:1
          </span>
          <span className="text-right font-mono text-[11px] text-faint">
            {band.text.ratio.toFixed(2)}:1
          </span>
        </div>
      ))}
    </div>
  );
}

/** The radius scale, drawn at the radius it names. */
function RadiusScale() {
  return (
    <dl className="mt-8 space-y-4">
      {radiusScale().map((step) => (
        <div key={step.token} className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="h-9 w-14 shrink-0 border border-hairline-strong bg-surface"
            style={{ borderRadius: `var(${step.token})` }}
          />
          <div className="min-w-0">
            <dt className="font-mono text-[11px] uppercase tracking-wider text-paper">
              {step.token} <span className="text-faint">{step.value}</span>
            </dt>
            <dd className="text-[13px] text-muted">{step.role}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

/**
 * Both exposures, live, side by side.
 *
 * The editorial panel is not a screenshot and not a recolour: it carries
 * `data-exposure="editorial"`, which is the same switch a consuming app
 * throws, and every value inside it re-resolves against the paper ground —
 * including the amber, which is a different amber there. That is the claim of
 * the section rendered rather than described, which is the only reason this
 * page exists rather than a paragraph saying "it supports light mode".
 */
function ExposurePair() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {(["luminous", "editorial"] as const).map((exposure) => (
        <div
          key={exposure}
          data-exposure={exposure}
          data-band="interface"
          className="rounded border border-hairline p-5"
          style={{ background: "var(--rsk-ground)" }}
        >
          <p
            className="font-mono text-[10px] uppercase tracking-wider"
            style={{ color: "var(--rsk-text-faint)" }}
          >
            {exposure} — {exposure === "luminous" ? "paper on ink" : "ink on paper"}
          </p>

          <p className="mt-3 text-[15px] font-medium" style={{ color: "var(--rsk-text)" }}>
            The same amber, re-solved.
          </p>
          <p className="mt-1 text-[13px] leading-relaxed" style={{ color: "var(--rsk-text-prose)" }}>
            Hue angle is identical across both. Only the intensity moves, which is what
            actually changes when pigment goes onto a lit surface.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-1.5 w-16 rounded-full"
              style={{ background: "var(--rsk-mark)" }}
            />
            <span className="font-mono text-[11px]" style={{ color: "var(--rsk-tint)" }}>
              590nm
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Health is form. The only hue in this row is the one reserved for alarm. */
function HealthRow() {
  const states: { label: string; className: string; style?: Record<string, string> }[] = [
    { label: "Fine", className: "border border-hairline-strong" },
    { label: "Watch", className: "border-[3px] border-paper" },
    { label: "Critical", className: "border-[3px] border-critical bg-critical" },
  ];

  return (
    <div className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
      {states.map((state) => (
        <div key={state.label} className="flex items-center gap-3">
          <span aria-hidden="true" className={`block h-4 w-4 rounded-full ${state.className}`} />
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            {state.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * SPECIMEN SHEET, not documentation.
 *
 * The distinction is deliberate and it is the whole brief: a documentation
 * site wants completeness, and a reader who has never heard of this arrives
 * wanting to know whether the person who built it has judgement. So this page
 * argues four decisions and shows what each one rejected, rather than
 * cataloguing every token. The catalogue is the source; it is one click away
 * and it is not the interesting half.
 *
 * Every specimen on the page is live. Nothing here is an image of the system,
 * because the page is already rendered by it — the reader is looking at the
 * artifact while reading the claim about it.
 */
export default function SystemPage() {
  const version = ruskelVersion();

  return (
    <PageShell>
      <section className={`${CONTAINER} pb-4 pt-14 sm:pt-16`}>
        <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
          Ruskel — tokens {version.tokens} · ui {version.ui}
        </p>

        <h1 className="mt-5 max-w-2xl font-display text-[40px] font-medium leading-[1.12] tracking-tight text-paper sm:text-[52px]">
          Components are the easy half.
        </h1>

        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-prose">
          shadcn gives you components — the foundation of a design system — but no decisions.
          Ruskel is the decisions: one spectrum solved against contrast windows rather than
          picked, two exposures, and rules that say which value belongs where. I build
          everything on it, including this page.
        </p>

        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
          <Endpoint label="Package" href={PACKAGE} sub={address(PACKAGE)} />
          <Endpoint label="Source" href={SOURCE} sub={address(SOURCE)} />
        </div>
      </section>

      <Section>
        <SectionLabel>One — a band resolves to two values</SectionLabel>
        <Body>
          Colour here has two jobs and they have different physics. A <strong>mark</strong> is
          seen — a fill, a dot, a rule — and answers to the 3:1 non-text threshold. A{" "}
          <strong>text ring</strong> value is read, and answers to AA. Push one hue to the
          chroma that makes a good mark and it fails as type; pull it back until it reads and
          it turns to mud as a fill. So each band carries both, at the same hue angle, and
          neither is ever used in the other&rsquo;s role.
        </Body>

        <BandTable />

        <Note>
          Ratios are the solver&rsquo;s own, read out of @ruskel/tokens when this page was
          built — not transcribed. They are the luminous figures, because that is the ground
          you are reading on; the same tokens re-solve on paper, which is where this rule
          bites hardest — see below.
        </Note>

      </Section>

      <Section>
        <SectionLabel>Two — radius encodes role</SectionLabel>
        <Body>
          The test is one question: <em>does it hold something, or is it a thing?</em> Anything
          that holds — a card, an input, a dialog, a code frame — is near-square. Anything that{" "}
          <em>is</em> — a chip, a tag, a status dot — is a pill. Radius stops being taste and
          starts being a property of the element, which means it can be got wrong, which means
          it can be reviewed.
        </Body>

        <RadiusScale />

        <Plate caption="The rule is only worth having because it makes the wrong version obvious.">
          <Cell verdict="no" label="Container as token, token as container">
            <span className="flex flex-wrap items-center gap-3">
              <span className="rounded-pill border border-hairline-strong bg-surface px-4 py-2 text-[13px] text-muted">
                A panel holding content
              </span>
              <span className="rounded border border-hairline px-2.5 py-1 font-mono text-[11px] text-muted">
                TypeScript
              </span>
            </span>
          </Cell>
          <Cell verdict="yes" label="Container 4px, token pill">
            <span className="flex flex-wrap items-center gap-3">
              <span className="rounded border border-hairline-strong bg-surface px-4 py-2 text-[13px] text-muted">
                A panel holding content
              </span>
              <span className="rounded-pill border border-hairline px-2.5 py-1 font-mono text-[11px] text-muted">
                TypeScript
              </span>
            </span>
          </Cell>
        </Plate>
      </Section>

      <Section>
        <SectionLabel>Three — two exposures, solved separately</SectionLabel>
        <Body>
          Editorial is ink on paper, luminous is paper on ink. The obvious approach is one
          brand ring shared by both, and it measures badly: the shared amber sat at 10.15:1 on
          ink and 1.71:1 on paper — a strong mark in one exposure and invisible in the other.
          Each exposure now solves its own ring, maximum chroma inside a contrast{" "}
          <em>window</em>, because a floor alone produced a blinding lime beside a dim indigo.
        </Body>

        <ExposurePair />

        <Note>
          Both panels are live. The right-hand one carries data-exposure=&quot;editorial&quot;
          — the same switch a consuming app throws — and every value inside it re-resolves.
        </Note>

        <Body>
          It is on paper that the two rings stop being a nicety. A mark is solved to be seen
          against its own ground, so on paper it goes dense and dark enough to register as a
          fill — and pale, low-contrast type. Here is the same sentence in the 590nm mark and
          in the 590nm text ring, both on the editorial ground:
        </Body>

        {/* The plate carries the exposure, so everything inside it — surfaces,
            rules, verdict marks, both samples — re-resolves against paper.
            Demonstrating a paper failure on an ink ground would have meant
            faking the numbers, which on this page of all pages is not
            available. */}
        <div data-exposure="editorial">
          {/* Caption deliberately outside this wrapper. Inside it, it would
              re-resolve to editorial's muted grey and then render on the ink
              page behind the plate — dark on dark. The plate paints its own
              ground; the caption does not. */}
          <Plate>
            <Cell verdict="no" label="Mark used as type">
              <span style={{ color: "var(--rsk-mark-590)" }}>
                Retrieval quality is the whole ballgame in a RAG system.
              </span>
            </Cell>
            <Cell verdict="yes" label="Text ring">
              <span style={{ color: "var(--rsk-text-590)" }}>
                Retrieval quality is the whole ballgame in a RAG system.
              </span>
            </Cell>
          </Plate>
        </div>

        <Note>
          Editorial exposure. The mark measures{" "}
          {ratioOf("rsk-mark-590", "editorial").toFixed(2)}:1 as type; the text ring measures{" "}
          {ratioOf("rsk-text-590", "editorial").toFixed(2)}:1. On ink those same two tokens
          measure {ratioOf("rsk-mark-590").toFixed(2)}:1 and {ratioOf("rsk-text-590").toFixed(2)}
          :1 — which is why one ring cannot serve both grounds.
        </Note>
      </Section>

      <Section>
        <SectionLabel>Four — success is not a colour</SectionLabel>
        <Body>
          Green-for-good spends a taxonomy colour on a status, and then the taxonomy means two
          things at once. Health is carried by <em>form</em> instead: hollow is fine, a ring is
          watch, filled is critical. Only alarm gets a hue, because alarm is the one state that
          should be able to interrupt you.
        </Body>

        <HealthRow />

        <Note>
          Which is also why this site&rsquo;s inline code is grey and its link underlines are
          grey: a band colour that appears on every noun has stopped being a taxonomy.
        </Note>
      </Section>

      <Section>
        <SectionLabel>How it is kept honest</SectionLabel>
        <Body>
          The palette is a constraint solve, not a set of picks. A Python solver re-derives
          every declared token and asserts the contrast windows, the sRGB gamut ceilings, the
          AA floor for coloured type, and the separation floor across the categorical series.
          It runs on every push, so a colour that drifts out of its window fails the build
          rather than shipping and being noticed a year later.
        </Body>

        <Hatch className="my-8" />

        <div className="flex flex-wrap gap-x-10 gap-y-4">
          <Endpoint label="Package" href={PACKAGE} sub={address(PACKAGE)} />
          <Endpoint label="Source" href={SOURCE} sub={address(SOURCE)} />
        </div>
      </Section>
    </PageShell>
  );
}
