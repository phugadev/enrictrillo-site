import Link from "next/link";
import { Section } from "./ui/Section";
import { SectionLabel } from "./ui/SectionLabel";
import { WavelengthDot } from "./ui/WavelengthDot";
import { getAllPosts } from "@/lib/posts";
import { wavelengthOrder, wavelengths, type Wavelength } from "@/lib/site";

/**
 * Legend for the four-band taxonomy. Without it the coloured dots on Work and
 * the post cards are decoration — this is what makes the system legible.
 *
 * Bands with posts link to their section on the blog index. Bands without are
 * rendered as plain text: /blog only emits anchors for populated bands, so a
 * link would land the reader at the top of an unrelated page.
 */
export function WavelengthKey() {
  const counts = getAllPosts().reduce<Partial<Record<Wavelength, number>>>((acc, post) => {
    acc[post.wavelength] = (acc[post.wavelength] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <Section>
      <SectionLabel>Spectrum</SectionLabel>
      <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-muted">
        Work and writing are both filed by wavelength — one band per kind of engineering.
      </p>
      <ul className="mt-6 grid gap-x-8 gap-y-1 sm:grid-cols-2">
        {wavelengthOrder.map((wavelength) => {
          const wl = wavelengths[wavelength];
          const hasPosts = (counts[wavelength] ?? 0) > 0;

          const row = (
            <>
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
                <span
                  className={`ml-2 text-[14px] text-muted ${hasPosts ? "transition-colors group-hover:text-paper" : ""}`}
                >
                  {wl.description}
                </span>
              </span>
            </>
          );

          return (
            <li key={wavelength}>
              {hasPosts ? (
                <Link
                  href={`/blog#${wavelength}`}
                  className="group flex items-baseline gap-3 py-2.5"
                >
                  {row}
                </Link>
              ) : (
                <span className="flex items-baseline gap-3 py-2.5">{row}</span>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
