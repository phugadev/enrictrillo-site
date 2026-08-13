import { site } from "@/lib/site";

/**
 * DESIGN TRIAL — see PR description. Easy to revert: remove the import/usage
 * in PageShell.tsx and delete this file.
 *
 * Static (non-sticky, non-dismissible) announcement bar between the nav and
 * page content, surfacing `site.availability.label` — the same claim that
 * currently only reaches readers through /llms.txt (see the comment in
 * Availability.tsx). Modelled on augustineasiuwhu.com's plain static bar:
 * small pill + one line of text, no interactivity.
 *
 * Hides itself when `site.availability.open` is false, same discipline as
 * `Availability`, `Now` and `Credentials`.
 */
export function AvailabilityBar() {
  const { open, label } = site.availability;
  if (!open) return null;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-center gap-2.5 px-6 py-[9px] text-center">
        <span className="rounded-full bg-systems px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-ink">
          Open
        </span>
        {/* balance: on mobile, where this wraps to two lines, the default
            greedy wrap left a lone orphaned word centred on its own line. */}
        <p className="font-mono text-[12px] text-muted [text-wrap:balance]">{label}</p>
      </div>
    </div>
  );
}
