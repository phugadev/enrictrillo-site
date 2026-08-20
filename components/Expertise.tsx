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
      <ul className="flex flex-wrap gap-2">
        {expertise.map((item) => {
          const Icon = icons[item.label];
          const tooltipId = `expertise-${slugify(item.label)}-tooltip`;

          return (
            <li key={item.label} className="relative">
              <div
                tabIndex={0}
                aria-describedby={tooltipId}
                className="group inline-flex cursor-help items-center gap-2 rounded border border-hairline py-1 pl-1 pr-3 font-mono text-[11px] text-muted outline-none transition-colors focus-visible:border-faint"
              >
                {Icon ? (
                  <span className="rsk-tile rsk-tile--sm">
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                  </span>
                ) : null}
                <span>{item.label}</span>

                <div
                  id={tooltipId}
                  role="tooltip"
                  className="pointer-events-none invisible absolute bottom-full left-0 z-10 mb-2 w-max max-w-[16rem] rounded-lg bg-surface-2 px-4 py-3 text-[11px] leading-relaxed text-paper opacity-0 transition-all duration-150 ease-out group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100 sm:max-w-xs"
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
