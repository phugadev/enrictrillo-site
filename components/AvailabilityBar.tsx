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
 * The pill is an inline token *inside* the sentence rather than a flex
 * sibling beside it. As siblings, the paragraph took all the width the pill
 * left over and centred its text within that box, so once the label wrapped
 * (below ~400px) the two halves drifted apart: pill pinned hard left, text
 * floating in the middle with a dead gap between them, and the pill centred
 * against the middle of a two-line block instead of sitting on the first
 * line. Inline, the pill wraps with the words, `text-center` centres the
 * whole signal as one object at every width, and baseline alignment keeps
 * "OPEN" sitting on the same line as the text it qualifies.
 *
 * Hides itself when `site.availability.open` is false, same discipline as
 * `Availability`, `Now` and `Credentials`.
 */
export function AvailabilityBar() {
  const { open, label } = site.availability;
  if (!open) return null;

  return (
    <div className="w-full">
      {/* balance: on mobile, where this wraps to two lines, the default
          greedy wrap left a lone orphaned word centred on its own line. */}
      <p
        className={`${CONTAINER} py-4 text-center font-mono text-[12px] leading-[1.7] text-muted [text-wrap:balance]`}
      >
        <span className="mr-2 inline-block rounded-full bg-systems px-1.5 py-0.5 text-[10px] font-medium uppercase leading-[1.5] tracking-wider text-ink">
          Open
        </span>
        {label}
      </p>
    </div>
  );
}
