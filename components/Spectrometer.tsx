import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { bandGradient, wavelengthOrder, wavelengths, type Wavelength } from "@/lib/site";
import { band } from "@/lib/bands";

const ASCENDING = [...wavelengthOrder].reverse();

/**
 * The site's legend, drawn as an instrument: the four bands in ascending nm,
 * each with what it covers and how much writing sits in it. It comes before
 * any coloured dot on the page, so the colours are explained before they are
 * used. A band with posts links to them; one without says so.
 */
export function Spectrometer() {
  const counts = getAllPosts().reduce<Partial<Record<Wavelength, number>>>((acc, post) => {
    acc[post.wavelength] = (acc[post.wavelength] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="relative overflow-hidden rounded-panel border border-border bg-card shadow-raised">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-16 opacity-15" style={{ background: bandGradient }} />
      <div aria-hidden="true" className="animate-scan absolute top-0 h-16 w-px bg-foreground/40" />

      <ul className="relative grid grid-cols-2 lg:grid-cols-4">
        {ASCENDING.map((wavelength, i) => {
          const wl = wavelengths[wavelength];
          const b = band[wavelength];
          const count = counts[wavelength] ?? 0;
          const body = (
            <>
              <span aria-hidden="true" className={`block h-6 w-px ${b.mark}`} />
              <span className={`figure mt-gutter block type-caption-sm ${b.tint}`}>{wl.nm}nm</span>
              <span className="mt-1 block type-subheading text-foreground">{wl.label}</span>
              <span className="mt-1 block type-caption text-subtle-foreground">{wl.description}</span>
              <span className="signal mt-gutter block type-label-xs text-faint">
                {count > 0 ? `${count} ${count === 1 ? "post" : "posts"} →` : "No posts yet"}
              </span>
            </>
          );
          const edges = `${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} ${
            i === 2 ? "lg:border-l" : ""
          } border-border`;
          return (
            <li key={wavelength} className={edges}>
              {count > 0 ? (
                <Link
                  href={`/blog/wavelength/${wavelength}`}
                  className="block h-full p-gutter pt-stack transition-colors duration-quick hover:bg-gray-tint"
                >
                  {body}
                </Link>
              ) : (
                <div className="h-full p-gutter pt-stack">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
