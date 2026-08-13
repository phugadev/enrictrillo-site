import { site } from "@/lib/site";
import { CONTAINER } from "./ui/Section";

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
 * Shares `CONTAINER` with the nav and every section below it, so its content
 * lines up with the rest of the page instead of centring on the full
 * viewport width — it used to be the one element on the page not honouring
 * that column. `py-4` (up from `py-[9px]`) gives it room to breathe under
 * the nav's own hairline, rather than reading as glued to it.
 *
 * Hides itself when `site.availability.open` is false, same discipline as
 * `Availability`, `Now` and `Credentials`.
 */
export function AvailabilityBar() {
  const { open, label } = site.availability;
  if (!open) return null;

  return (
    <div className="w-full">
      <div className={`${CONTAINER} flex items-center justify-center gap-2.5 py-4 text-center`}>
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
