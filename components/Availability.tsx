import { site } from "@/lib/site";

/**
 * Quiet availability signal. Renders nothing when `site.availability.open`
 * is false, so closing the door is a one-line change in lib/site.ts.
 *
 * `pill` is the nav variant — bordered, short label, survives a narrow
 * viewport. `inline` is the footer variant with the full claim.
 */
export function Availability({
  variant = "inline",
  showDetail = false,
}: {
  variant?: "inline" | "pill";
  showDetail?: boolean;
}) {
  const { open, short, label, detail } = site.availability;
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
        className="inline-flex items-center gap-2 rounded-full border border-hairline px-2.5 py-1.5 font-mono text-[11px] text-muted sm:px-3"
        title={label}
      >
        {dot}
        {/* Label drops on mobile so the nav links still fit; the pulsing dot
            keeps the signal and the accessible name carries the full claim. */}
        <span className="hidden sm:inline">{short}</span>
        <span className="sr-only sm:hidden">{label}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[12px] text-muted">
      {dot}
      <span>{label}</span>
      {showDetail && <span className="text-faint">{detail}</span>}
    </span>
  );
}
