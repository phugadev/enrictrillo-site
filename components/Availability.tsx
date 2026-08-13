import { site } from "@/lib/site";

/**
 * Quiet availability signal — the footer variant, with the full claim.
 * Renders nothing when `site.availability.open` is false, so closing the
 * door is a one-line change in lib/site.ts.
 *
 * The only other place this claim appears is `AvailabilityBar`, rendered
 * once near the top (PageShell.tsx). A third copy riding the sticky nav
 * used to exist here too — dropped as one mention too many for a single
 * claim repeated at every scroll position.
 *
 * `site.availability.detail` isn't rendered here by design — that would be
 * a third statement of the same claim on one scroll. It reaches readers
 * through /llms.txt instead.
 */
export function Availability() {
  const { open, label } = site.availability;
  if (!open) return null;

  return (
    <span className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[12px] text-muted">
      <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-systems opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-systems" />
      </span>
      <span>{label}</span>
    </span>
  );
}
