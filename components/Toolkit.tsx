import type { CSSProperties } from "react";
import { Section } from "./ui/Section";
import { SectionLabel } from "./ui/SectionLabel";
import { toolkit, wavelengthOrder, wavelengths } from "@/lib/site";

/**
 * The toolkit, laid out as four bands.
 *
 * Deliberately not a wall of logo chips: the point isn't "I have heard of
 * Docker", it's that the same four-band taxonomy the writing is filed under
 * also describes the work. Each row is a band, so the spectrometer above it
 * stops being decoration.
 */
export function Toolkit() {
  return (
    <Section>
      <SectionLabel>Toolkit</SectionLabel>

      <dl className="mt-6 space-y-5">
        {wavelengthOrder.map((wavelength) => {
          const wl = wavelengths[wavelength];
          const items = toolkit[wavelength];
          if (!items?.length) return null;

          return (
            <div
              key={wavelength}
              className="grid gap-x-6 gap-y-2 sm:grid-cols-[10rem_1fr] sm:items-baseline"
            >
              <dt className="flex items-baseline gap-2.5 font-mono text-[11px] uppercase tracking-wider">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 translate-y-[-1px] rounded-full"
                  style={{ backgroundColor: wl.hex }}
                />
                <span style={{ color: wl.hex }}>{wl.label}</span>
                <span className="text-faint">{wl.nm}nm</span>
              </dt>

              <dd className="flex flex-wrap gap-x-2 gap-y-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="cursor-default select-none rounded-full border border-hairline px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-[var(--chip)] hover:text-[var(--chip)]"
                    style={{ "--chip": wl.hex } as CSSProperties}
                  >
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          );
        })}
      </dl>
    </Section>
  );
}
