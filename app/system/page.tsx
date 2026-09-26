import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { PageShell } from "@/components/PageShell";
import { Eyebrow, PageHeader, Section } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import { SmartLink } from "@/components/ui/SmartLink";
import { contrast } from "@/lib/system";
import { band } from "@/lib/bands";
import { site, wavelengthOrder, wavelengths } from "@/lib/site";

const SOURCE = "https://github.com/phugadev/minima";

const description =
  "Minima — the design system this site is built on, shown with its own tokens. Every figure on this page is computed at build time from the installed theme.";

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
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — ${site.role}` }],
  },
};

const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const ROLES: Record<number, string> = {
  1: "bg",
  2: "bg-subtle",
  3: "fill",
  4: "fill-hover",
  5: "fill-active",
  6: "border",
  7: "border-strong",
  8: "solid",
  9: "text",
  10: "text-strong",
};
const BAND_HUE = { interface: "amber", systems: "green", compute: "blue", intelligence: "purple" } as const;

const TEXT_LEVELS = [
  { name: "foreground", token: "--foreground", className: "text-foreground", job: "Headings, the thing itself" },
  { name: "muted", token: "--muted-foreground", className: "text-muted-foreground", job: "Paragraphs" },
  { name: "subtle", token: "--subtle-foreground", className: "text-subtle-foreground", job: "Metadata, secondary lines" },
  { name: "faint", token: "--gray-solid", className: "text-faint", job: "This site only — quietest tier" },
];

const TYPE = [
  { name: "display", className: "type-display", sample: "Production software" },
  { name: "title", className: "type-title", sample: "Production software, end to end" },
  { name: "heading", className: "type-heading", sample: "A heading inside a page" },
  { name: "subheading", className: "type-subheading", sample: "A subheading, or a list title" },
  { name: "lead", className: "type-lead", sample: "The paragraph that opens a page and says why it exists." },
  { name: "body", className: "type-body", sample: "Body text for interface copy, at fourteen pixels." },
  { name: "caption", className: "type-caption", sample: "A caption under something it describes." },
  { name: "label", className: "signal type-label", sample: "Signal · scanned" },
  { name: "label-sm", className: "signal type-label-sm", sample: "Signal · scanned" },
  { name: "label-xs", className: "signal type-label-xs", sample: "Signal · scanned" },
];

const SPACE = [
  { name: "inset", token: "--spacing-inset", job: "Inside a control" },
  { name: "gutter", token: "--spacing-gutter", job: "Between things in a group" },
  { name: "stack", token: "--spacing-stack", job: "Between groups" },
  { name: "section", token: "--spacing-section", job: "Between regions of a page" },
];

const SURFACES = [
  { name: "canvas", className: "bg-background", shadow: "" },
  { name: "raised", className: "bg-surface-raised", shadow: "shadow-raised" },
  { name: "overlay", className: "bg-surface-overlay", shadow: "shadow-overlay" },
  { name: "modal", className: "bg-surface-modal", shadow: "shadow-modal" },
];

function Swatch({ token, label }: { token: string; label?: string }) {
  return (
    <div className="min-w-0">
      <div
        className="h-10 rounded-control-sm border border-border"
        style={{ background: `var(${token})` } as CSSProperties}
      />
      {label && <p className="figure mt-1 truncate type-caption-sm text-faint">{label}</p>}
    </div>
  );
}

function Ramp({ hue, name, tintClass }: { hue: string; name: ReactNode; tintClass?: string }) {
  return (
    <div className="grid gap-inset sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-start">
      <p className={`signal pt-2.5 type-label-sm ${tintClass ?? "text-subtle-foreground"}`}>{name}</p>
      <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
        {STEPS.map((step) => (
          <Swatch key={step} token={`--${hue}-${step}`} label={String(step)} />
        ))}
      </div>
    </div>
  );
}

const ratio = (n: number) => `${n.toFixed(2)}:1`;

export default function SystemPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow={<Eyebrow wavelength="interface">System · Minima</Eyebrow>}
        title="The system this site is built on."
        lead={
          <>
            Minima is a Tailwind v4 theme: neutral carries the structure, and colour is spent on
            state, identity and data. This page is drawn with its own tokens, and every figure on it
            is computed from the installed theme at build time.
          </>
        }
      >
        <SmartLink
          href={SOURCE}
          className="signal type-label-sm text-subtle-foreground underline decoration-faint underline-offset-4 transition-colors duration-quick hover:text-foreground"
        >
          github.com/phugadev/minima ↗
        </SmartLink>
      </PageHeader>

      <Section label="Text" aside="Contrast on the canvas">
        <ul className="divide-y divide-border rounded-panel border border-border bg-card">
          {TEXT_LEVELS.map((level) => (
            <li key={level.name} className="grid gap-inset p-gutter sm:grid-cols-[minmax(0,1fr)_12rem_6rem] sm:items-center">
              <p className={`type-heading ${level.className}`}>The quick brown fox</p>
              <p className="type-caption text-subtle-foreground">
                <span className="figure text-foreground">{level.name}</span> · {level.job}
              </p>
              <p className="figure type-caption text-foreground sm:text-right">
                {ratio(contrast(level.token, "--background"))}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Colour" aside="Ten steps, named by role">
        <div className="space-y-stack">
          <Ramp hue="gray" name="Gray" />
          {wavelengthOrder.map((w) => (
            <Ramp
              key={w}
              hue={BAND_HUE[w]}
              name={`${wavelengths[w].label} · ${BAND_HUE[w]}`}
              tintClass={band[w].tint}
            />
          ))}
        </div>
        <dl className="figure mt-stack grid grid-cols-2 gap-x-gutter gap-y-1 type-caption-sm sm:grid-cols-5">
          {STEPS.map((step) => (
            <div key={step} className="flex gap-inset">
              <dt className="w-5 text-faint">{step}</dt>
              <dd className="text-subtle-foreground">{ROLES[step]}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-stack max-w-prose type-body text-subtle-foreground">
          The four bands this site files its work under are four of Minima&rsquo;s hue ramps, used by
          role — the mark for dots and rules, the text step for coloured type, the fill and border
          for a tinted chip. Nothing asks for a step number.
        </p>
      </Section>

      <Section label="Type" aside="Three registers">
        <ul className="divide-y divide-border">
          {TYPE.map((t) => (
            <li key={t.name} className="grid gap-inset py-gutter sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-baseline">
              <p className="figure type-caption-sm text-faint">type-{t.name}</p>
              <p className={`truncate text-foreground ${t.className}`}>{t.sample}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Space" aside="Each rung twice the one below">
        <ul className="space-y-gutter">
          {SPACE.map((s) => (
            <li key={s.name} className="grid items-center gap-inset sm:grid-cols-[8rem_minmax(0,1fr)_14rem]">
              <p className="figure type-caption-sm text-faint">{s.name}</p>
              <div className="h-3 rounded-full bg-interface" style={{ width: `var(${s.token})` } as CSSProperties} />
              <p className="type-caption text-subtle-foreground">{s.job}</p>
            </li>
          ))}
        </ul>
        <p className="mt-stack max-w-prose type-body text-subtle-foreground">
          This site runs Minima&rsquo;s comfortable density — 10, 20, 40, 80 — the ladder meant for a page
          that is read rather than operated.
        </p>
      </Section>

      <Section label="Depth" aside="Shadow in light, surface in dark">
        <div className="grid gap-gutter rounded-panel border border-border bg-background p-gutter sm:grid-cols-4 sm:p-stack">
          {SURFACES.map((s) => (
            <div key={s.name} className={`h-28 rounded-panel border border-border p-gutter ${s.className} ${s.shadow}`}>
              <p className="signal type-label-xs text-subtle-foreground">{s.name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Components" aside="From the registry">
        <div className="grid gap-gutter lg:grid-cols-2">
          <div className="rounded-panel border border-border bg-card p-stack">
            <p className="signal type-label-sm text-faint">Button</p>
            <div className="mt-gutter flex flex-wrap items-center gap-inset">
              <Button>Default</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="mt-inset flex flex-wrap items-center gap-inset">
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
          <div className="rounded-panel border border-border bg-card p-stack">
            <p className="signal type-label-sm text-faint">Status</p>
            <div className="mt-gutter flex flex-wrap gap-inset">
              <Status tone="neutral" dot>Neutral</Status>
              <Status tone="info" dot>In build</Status>
              <Status tone="success" dot>Shipped</Status>
              <Status tone="warning" dot>Degraded</Status>
              <Status tone="danger" dot>Down</Status>
            </div>
            <p className="mt-gutter type-caption text-subtle-foreground">
              A tone is a state, never a category — which is why the bands are not tones.
            </p>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
