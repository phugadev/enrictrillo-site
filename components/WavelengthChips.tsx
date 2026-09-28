import Link from "next/link";
import { getPostsByWavelength } from "@/lib/posts";
import { wavelengthOrder, wavelengths, type Wavelength } from "@/lib/site";
import { WavelengthDot } from "./ui/WavelengthDot";

/** Filter by band, as a line of quiet links. The current one is the foreground. */
export function WavelengthChips({ active }: { active?: Wavelength }) {
  const counts = new Map(getPostsByWavelength().map((b) => [b.wavelength, b.posts.length]));
  const link = (on: boolean) =>
    `inline-flex items-center gap-1.5 transition-colors duration-quick ${on ? "text-foreground" : "hover:text-foreground"}`;

  return (
    <nav aria-label="Filter writing by band" className="flex flex-wrap gap-x-gutter gap-y-1 type-body text-subtle-foreground">
      <Link href="/blog" aria-current={active ? undefined : "page"} className={link(!active)}>
        All
      </Link>
      {wavelengthOrder.map((w) => {
        const count = counts.get(w) ?? 0;
        if (count === 0) return null;
        return (
          <Link key={w} href={`/blog/wavelength/${w}`} aria-current={active === w ? "page" : undefined} className={link(active === w)}>
            <WavelengthDot wavelength={w} />
            {wavelengths[w].label}
            <span className="tabular-nums">{count}</span>
          </Link>
        );
      })}
    </nav>
  );
}
