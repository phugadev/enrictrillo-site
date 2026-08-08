import Link from "next/link";
import { site } from "@/lib/site";
import { Availability } from "./Availability";
import { DispersionMark } from "./DispersionMark";
import { CONTAINER } from "./ui/Section";

/**
 * Sticky so the availability pill stays visible through the scroll — it's the
 * one piece of information a contract decision-maker needs at any point on
 * the page. Translucent with a blur so the hairline doesn't stack over content.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-hairline bg-ink/85 backdrop-blur-md">
      <div className={`${CONTAINER} flex items-center justify-between gap-4 py-4`}>
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
          <Availability variant="pill" />
        </nav>
      </div>
    </header>
  );
}
