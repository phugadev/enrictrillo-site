import Link from "next/link";
import { site } from "@/lib/site";
import { Availability } from "./Availability";
import { DispersionMark } from "./DispersionMark";
import { CONTAINER } from "./ui/Section";

/**
 * Sticky so the availability pill stays visible through the scroll — it's the
 * one piece of information a contract decision-maker needs at any point on
 * the page. Translucent with a blur so the hairline doesn't stack over content.
 *
 * Two rows below `sm`. Measured at 375/390/414px: the logo plus the three nav
 * links plus the pill's full "Available" label doesn't fit on one line until
 * ~410px wide, and squeezing every gap down to fit at 375 left zero margin
 * (it ate straight into the container's side padding) — too fragile to ship.
 * So on mobile the pill rides the top row with the logo (where a
 * decision-maker's eye lands first) and the nav links wrap to a second row;
 * at `sm` and up it collapses back to the original single row. The `contents`
 * trick below lets the nav links and the pill behave as independent flex
 * items of the outer row on mobile (so the pill can peel off to sit by the
 * logo) while re-grouping into one flex unit at `sm+` — no client JS.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-hairline bg-ink/85 backdrop-blur-md">
      <div
        className={`${CONTAINER} flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-4`}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 font-display text-[15px] tracking-tight text-paper"
        >
          <DispersionMark />
          {site.name}
        </Link>

        <div className="contents sm:flex sm:items-center sm:gap-6">
          <nav
            aria-label="Primary"
            className="order-3 flex basis-full items-center gap-3.5 font-mono text-[11px] uppercase tracking-wider text-muted sm:order-none sm:basis-auto sm:gap-6 sm:text-[12px]"
          >
            {site.nav.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-paper">
                {item.label}
              </Link>
            ))}
          </nav>
          <span className="order-2 sm:order-none">
            <Availability variant="pill" />
          </span>
        </div>
      </div>
    </header>
  );
}
