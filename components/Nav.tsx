import Link from "next/link";
import { site } from "@/lib/site";
import { DispersionMark } from "./DispersionMark";
import { CONTAINER } from "./ui/Section";

export function Nav() {
  return (
    <header className="border-b border-hairline">
      <div className={`${CONTAINER} flex items-center justify-between py-5`}>
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-[15px] tracking-tight text-paper"
        >
          <DispersionMark />
          {site.name}
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-center gap-6 font-mono text-[12px] uppercase tracking-wider text-muted"
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
