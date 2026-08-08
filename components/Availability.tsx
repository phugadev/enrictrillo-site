import { site } from "@/lib/site";

/**
 * Quiet availability signal. Renders nothing when `site.availability.open`
 * is false, so closing the door is a one-line change in lib/site.ts.
 */
export function Availability({ showDetail = false }: { showDetail?: boolean }) {
  const { open, label, detail } = site.availability;
  if (!open) return null;

  return (
    <span className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[12px] text-muted">
      <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-systems opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-systems" />
      </span>
      <span>{label}</span>
      {showDetail && <span className="text-faint">{detail}</span>}
    </span>
  );
}
