import Link from "next/link";
import { Section } from "./ui/Section";
import { SectionLabel } from "./ui/SectionLabel";
import { WavelengthDot } from "./ui/WavelengthDot";
import { wavelengthOrder, wavelengths } from "@/lib/site";

/**
 * Legend for the four-band taxonomy. Without it the coloured dots on Work and
 * the post cards are decoration — this is what makes the system legible.
 * Each row links to its band on the blog index, so it's navigation too.
 */
export function WavelengthKey() {
  return (
    <Section>
      <SectionLabel>Spectrum</SectionLabel>
      <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-muted">
        Work and writing are both filed by wavelength — one band per kind of engineering.
      </p>
      <ul className="mt-6 grid gap-x-8 gap-y-1 sm:grid-cols-2">
        {wavelengthOrder.map((wavelength) => {
          const wl = wavelengths[wavelength];
          return (
            <li key={wavelength}>
              <Link
                href={`/blog#${wavelength}`}
                className="group flex items-baseline gap-3 py-2.5"
              >
                <WavelengthDot wavelength={wavelength} className="translate-y-[-2px]" />
                <span className="w-[3.5rem] shrink-0 font-mono text-[11px] uppercase tracking-wider text-faint">
                  {wl.nm}nm
                </span>
                <span className="min-w-0">
                  <span
                    className="font-mono text-[11px] uppercase tracking-wider"
                    style={{ color: wl.hex }}
                  >
                    {wl.label}
                  </span>
                  <span className="ml-2 text-[14px] text-muted transition-colors group-hover:text-paper">
                    {wl.description}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
