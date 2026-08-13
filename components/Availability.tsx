import { site } from "@/lib/site";

/**
 * Quiet availability signal. Renders nothing when `site.availability.open`
 * is false, so closing the door is a one-line change in lib/site.ts.
 *
 * `pill` is the nav variant — a bare dot, no label text. `inline` is the
 * footer variant with the full claim.
 *
 * The nav is sticky and `AvailabilityBar` (rendered directly below it,
 * PageShell.tsx) isn't — so the two aren't saying the same thing twice, they
 * split one signal into two layers: the dot is the ambient, always-on-screen
 * marker ("this is still true, right now, wherever you've scrolled to"); the
 * bar is the one-time full sentence a reader sees once near the top. Putting
 * the label back on the pill would make that split redundant again, so it
 * stays dot-only at every width, not just on mobile where the crowding
 * problem originally showed up. `title` and the `sr-only` span carry the full
 * claim for anyone hovering or using assistive tech.
 *
 * `site.availability.detail` isn't rendered here by design — the footer would
 * be the third statement of the same claim on one scroll. It reaches readers
 * through /llms.txt instead.
 */
export function Availability({ variant = "inline" }: { variant?: "inline" | "pill" }) {
  const { open, label } = site.availability;
  if (!open) return null;

  const dot = (
    <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-systems opacity-60" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-systems" />
    </span>
  );

  if (variant === "pill") {
    return (
      <span
        className="inline-flex items-center rounded-full border border-hairline p-2"
        title={label}
      >
        {dot}
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[12px] text-muted">
      {dot}
      <span>{label}</span>
    </span>
  );
}
