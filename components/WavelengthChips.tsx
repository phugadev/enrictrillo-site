import Link from "next/link";
import { getPostsByWavelength } from "@/lib/posts";
import { wavelengthOrder, wavelengths, type Wavelength } from "@/lib/site";
import { band } from "@/lib/bands";

const CHIP =
  "inline-flex h-control-sm items-center gap-2 rounded-chip border px-3 type-caption transition-colors duration-quick";

/** Filter by band. The active band wears its own chip colours. */
export function WavelengthChips({ active }: { active?: Wavelength }) {
  const counts = new Map(getPostsByWavelength().map((b) => [b.wavelength, b.posts.length]));

  return (
    <nav aria-label="Filter writing by wavelength" className="flex flex-wrap gap-inset">
      <Link
        href="/blog"
        aria-current={active ? undefined : "page"}
        className={`${CHIP} ${
          active
            ? "border-border text-subtle-foreground hover:text-foreground"
            : "border-transparent bg-primary text-primary-foreground"
        }`}
      >
        All
      </Link>
      {wavelengthOrder.map((wavelength) => {
        const wl = wavelengths[wavelength];
        const b = band[wavelength];
        const count = counts.get(wavelength) ?? 0;
        const isActive = active === wavelength;
        const inner = (
          <>
            <span aria-hidden="true" className={`size-1.5 rounded-full ${b.mark}`} />
            {wl.label}
            <span className="figure text-faint">{count}</span>
          </>
        );
        if (count === 0) {
          return (
            <span key={wavelength} className={`${CHIP} cursor-default border-border text-faint opacity-60`}>
              {inner}
            </span>
          );
        }
        return (
          <Link
            key={wavelength}
            href={`/blog/wavelength/${wavelength}`}
            aria-current={isActive ? "page" : undefined}
            className={`${CHIP} ${isActive ? b.chip : `border-border text-subtle-foreground ${b.hover}`}`}
          >
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
