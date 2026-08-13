import Link from "next/link";
import { site } from "@/lib/site";
import { DispersionMark } from "./DispersionMark";
import { CONTAINER } from "./ui/Section";

/**
 * Sticky so the nav stays reachable through the scroll. Translucent with a
 * blur so the hairline doesn't stack over content.
 *
 * No availability marker here — `AvailabilityBar` right below it already
 * carries the full sentence once, near the top, and the footer restates it
 * at the close of the page. A third copy riding the nav on every scroll
 * position was one mention too many for a single claim.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-20 bg-ink/85 backdrop-blur-md">
      <div
        className={`${CONTAINER} flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-hairline py-4`}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 font-display text-[15px] tracking-tight text-paper"
        >
          <DispersionMark />
          {site.name}
        </Link>

        <nav
          aria-label="Primary"
          className="flex items-center gap-3.5 font-mono text-[11px] uppercase tracking-wider text-muted sm:gap-6 sm:text-[12px]"
        >
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-paper">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
