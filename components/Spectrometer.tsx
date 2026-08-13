import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { wavelengthOrder, wavelengths, type Wavelength } from "@/lib/site";
import { CONTAINER } from "./ui/Section";

/** Ascending nm, left to right — the way a spectrometer readout is drawn. */
const ASCENDING = [...wavelengthOrder].reverse();

const BAND_GRADIENT = `linear-gradient(90deg, ${ASCENDING.map(
  (w, i) => `${wavelengths[w].hex} ${(i / (ASCENDING.length - 1)) * 100}%`,
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
    <div className="relative h-16 overflow-hidden border-t border-hairline">
      <div className="absolute inset-0 opacity-[0.14]" style={{ background: BAND_GRADIENT }} />
      <div className="animate-scan absolute inset-y-0 w-px bg-paper/50" aria-hidden="true" />

      <div className={`${CONTAINER} relative h-full`}>
        <ul className="flex h-full items-end justify-between pb-2.5">
          {ASCENDING.map((wavelength, i) => {
            const wl = wavelengths[wavelength];
            const hasPosts = (counts[wavelength] ?? 0) > 0;
            const last = i === ASCENDING.length - 1;

            const body = (
              <>
                <span
                  className="block h-2.5 w-px bg-hairline"
                  aria-hidden="true"
                />
                <span className="mt-1.5 block font-mono text-[10.5px] tracking-wide">
                  <span className="text-muted">{wl.nm}nm</span>{" "}
                  <span className="hidden text-faint sm:inline">{wl.label}</span>
                </span>
              </>
            );

            return (
              <li key={wavelength} className={last ? "text-right" : ""}>
                {hasPosts ? (
                  <Link
                    href={`/blog/wavelength/${wavelength}`}
                    className="group block"
                    aria-label={`${wl.label} — ${wl.nm}nm`}
                  >
                    <span className="block opacity-80 transition-opacity group-hover:opacity-100">
                      {body}
                    </span>
                  </Link>
                ) : (
                  <span className="block opacity-60">{body}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
