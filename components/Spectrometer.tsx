import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { wavelengthOrder, wavelengths, type Wavelength } from "@/lib/site";
import { CONTAINER } from "./ui/Section";

/** Ascending nm, left to right — the way a spectrometer readout is drawn. */
const ASCENDING = [...wavelengthOrder].reverse();

/**
 * Each band peaks at the CENTRE of its column, not at the edges of the panel.
 *
 * Stops used to run 0/33/67/100% while the ticks were laid out with
 * justify-between inside padding, so the 590nm tick sat ~15% of the panel away
 * from where amber actually peaked. On an element whose entire job is to read
 * as a calibrated instrument, the calibration being visibly off is the worst
 * possible detail to get wrong. The ticks are now a 4-column grid and these
 * stops line up with those column centres.
 */
const BAND_GRADIENT = `linear-gradient(90deg, ${ASCENDING.map(
  (w, i) => `${wavelengths[w].hex} ${((i + 0.5) / ASCENDING.length) * 100}%`,
).join(", ")})`;

/**
 * The signature element, and the site's legend. Sits directly under the hero
 * so the four bands are explained before a reader meets a coloured dot
 * anywhere else.
 *
 * Ticks link to their band page, but only where posts exist — an empty band
 * stays plain text rather than promising a page with nothing on it.
 */
export function Spectrometer() {
  const counts = getAllPosts().reduce<Partial<Record<Wavelength, number>>>((acc, post) => {
    acc[post.wavelength] = (acc[post.wavelength] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className={`${CONTAINER} mb-4`}>
      {/*
        Contained rather than full-bleed. As an edge-to-edge band it split the
        page in two and read as chrome; boxed to the text column it reads as an
        instrument panel — which is what it is.

        mb-4 is deliberate: Section no longer draws a border-t rule at its own
        top edge, so the only separation between this panel and whatever
        follows is Section's py-16 top padding. That's already generous, but a
        small margin here keeps the panel from ever looking like it's flush
        against the next block even when a future non-Section component
        follows it directly.
      */}
      <div className="relative h-16 overflow-hidden rounded-lg border border-hairline">
        <div className="absolute inset-0 opacity-[0.14]" style={{ background: BAND_GRADIENT }} />
        <div className="animate-scan absolute inset-y-0 w-px bg-paper/50" aria-hidden="true" />

        <ul className="relative grid h-full grid-cols-4 items-end pb-2.5">
          {ASCENDING.map((wavelength) => {
            const wl = wavelengths[wavelength];
            const hasPosts = (counts[wavelength] ?? 0) > 0;

            const body = (
              <>
                <span
                  className="mx-auto block h-2.5 w-px bg-faint"
                  aria-hidden="true"
                />
                <span className="mt-1.5 block font-mono text-[10.5px] tracking-wide">
                  <span className="hidden text-muted sm:inline">{wl.nm}nm </span>
                  <span className="text-muted">{wl.label}</span>
                </span>
              </>
            );

            return (
              <li key={wavelength} className="text-center">
                {hasPosts ? (
                  <Link
                    href={`/blog/wavelength/${wavelength}`}
                    className="group block"
                    aria-label={`${wl.label} — ${wl.nm}nm`}
                  >
                    <span className="block transition-opacity group-hover:opacity-70">{body}</span>
                  </Link>
                ) : (
                  <span className="block opacity-70">{body}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
