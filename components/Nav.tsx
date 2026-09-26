import Link from "next/link";
import { site } from "@/lib/site";
import { DispersionMark } from "./DispersionMark";
import { NavLinks } from "./NavLinks";
import { PAGE } from "./layout";

export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
      <div className={`${PAGE} flex h-16 items-center justify-between gap-gutter`}>
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 type-subheading text-foreground"
        >
          <DispersionMark />
          {site.name}
        </Link>
        <NavLinks items={site.nav} email={site.email} />
      </div>
    </header>
  );
}
