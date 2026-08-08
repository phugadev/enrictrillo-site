import Link from "next/link";
import { getPostsByWavelength } from "@/lib/posts";
import { wavelengthOrder, wavelengths, type Wavelength } from "@/lib/site";

/**
 * Band filters, built as links to real pages rather than client-side toggles.
 * That keeps every filtered view shareable, linkable, indexable and free of
 * client JS — a JS toggle loses its state on reload and can't be sent to
 * anyone.
 *
 * `active` is undefined on /blog (the unfiltered view).
 */
export function WavelengthChips({ active }: { active?: Wavelength }) {
  const counts = new Map(getPostsByWavelength().map((b) => [b.wavelength, b.posts.length]));

  return (
    <nav aria-label="Filter writing by wavelength" className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        aria-current={active ? undefined : "page"}
        className={`rounded-full border px-3.5 py-2 font-mono text-[12px] transition-colors ${
          active
            ? "border-hairline text-muted hover:border-muted hover:text-paper"
            : "border-paper bg-paper text-ink"
        }`}
      >
        All
      </Link>

      {wavelengthOrder.map((wavelength) => {
        const wl = wavelengths[wavelength];
        const count = counts.get(wavelength) ?? 0;
        const isActive = active === wavelength;

        const inner = (
          <>
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: isActive ? "#0B0C0E" : wl.hex }}
              aria-hidden="true"
            />
            {wl.label}
            <span className={isActive ? "opacity-70" : "text-faint"}>{count}</span>
          </>
        );

        // Empty bands have no page to link to.
        if (count === 0) {
          return (
            <span
              key={wavelength}
              className="inline-flex cursor-default items-center gap-2 rounded-full border border-hairline px-3.5 py-2 font-mono text-[12px] text-faint opacity-60"
            >
              {inner}
            </span>
          );
        }

        return (
          <Link
            key={wavelength}
            href={`/blog/wavelength/${wavelength}`}
            aria-current={isActive ? "page" : undefined}
            className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 font-mono text-[12px] transition-colors"
            style={
              isActive
                ? { backgroundColor: wl.hex, borderColor: wl.hex, color: "#0B0C0E" }
                : { borderColor: "#26282E" }
            }
          >
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
