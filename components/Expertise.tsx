import type { ComponentType } from "react";
import { SectionLabel } from "./ui/SectionLabel";
import { expertise } from "@/lib/site";
import {
  CloudIcon,
  ProductEngineeringIcon,
  SparkleIcon,
  SystemDesignIcon,
  UxUiIcon,
} from "./ui/ExpertiseIcons";

/**
 * Domain-level capability areas as a row of fit-width chips, each carrying
 * a small line-art icon and a CSS-only tooltip for its description — no
 * native `title` attribute, since the OS-enforced hover delay on those
 * can't be styled and reads as unstyled browser chrome next to everything
 * else on this site. The tooltip is a `group-hover` / `group-focus-within`
 * reveal so it's reachable by keyboard too, and the description is still
 * wired to the row via `aria-describedby` for screen readers.
 *
 * `cursor-help` on the chip signals there's more to read before a reader
 * has hovered, rather than only after. The tooltip opens upward — the
 * hero's copy and CTAs sit directly below this block, so opening down
 * would cover them.
 *
 * The tooltip is positioned against the `ul`, not against its own chip, and
 * that is the fix for a real bug. Anchored to the chip, a `w-max` tooltip
 * opening from a chip near the right edge ran past the viewport — and an
 * `invisible` element still counts toward `scrollWidth`, so the whole
 * homepage scrolled sideways with nothing visible out there to explain it.
 * Anchoring to the row makes overflow impossible at every width, because
 * the row itself cannot overflow. (A breakpoint-split version of this —
 * chip-anchored from `sm` up — was tried first and still overflowed at
 * 640px, where the container is narrow but the chips are not.)
 *
 * The cost is that the tooltip sits at the row's left edge rather than
 * under the chip you're pointing at. That reads as a description slot for
 * the row, which is a fair trade for a page that doesn't drift sideways on
 * a phone.
 *
 * Hides itself while `expertise` is empty, same discipline as `Now` and
 * `Credentials`.
 */
const icons: Record<string, ComponentType<{ className?: string }>> = {
  "Product Engineering": ProductEngineeringIcon,
  "UX/UI Design": UxUiIcon,
  "System Design": SystemDesignIcon,
  "Cloud Infra": CloudIcon,
  "Applied AI": SparkleIcon,
};

const slugify = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function Expertise() {
  if (expertise.length === 0) return null;

  return (
    <div className="mt-6">
      <SectionLabel as="p" className="mb-3">
        Expertise
      </SectionLabel>
      {/* The tooltips' positioning ancestor — not the individual chips. See
          the note above the component for why. */}
      <ul className="relative flex flex-wrap gap-2">
        {expertise.map((item) => {
          const Icon = icons[item.label];
          const tooltipId = `expertise-${slugify(item.label)}-tooltip`;

          return (
            <li key={item.label}>
              <div
                tabIndex={0}
                aria-describedby={tooltipId}
                className="group inline-flex cursor-help items-center gap-2 rounded-pill border border-hairline px-3 py-1.5 font-mono text-[11px] text-muted outline-none transition-colors focus-visible:border-faint"
              >
                {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 text-faint" /> : null}
                <span>{item.label}</span>

                <div
                  id={tooltipId}
                  role="tooltip"
                  className="pointer-events-none invisible absolute inset-x-0 bottom-full z-10 mb-2 rounded-lg bg-surface-2 px-4 py-3 text-[11px] leading-relaxed text-paper opacity-0 transition-all duration-150 ease-out group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100 sm:right-auto sm:w-max sm:max-w-xs"
                >
                  {item.description}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
