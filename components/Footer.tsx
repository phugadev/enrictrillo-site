import { site } from "@/lib/site";
import { Availability } from "./Availability";
import { LiveClock } from "./LiveClock";
import { PAGE } from "./layout";
import { SmartLink } from "./ui/SmartLink";
import { cn } from "@/lib/cn";
import { buttonVariants } from "./ui/button";

const LINKS = [
  { label: "GitHub", href: site.social.github },
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "RSS", href: "/feed.xml" },
];

/**
 * Every page ends on the one thing a visitor might want to do next. The
 * closing panel sits on the raised surface so it reads as an object rather
 * than as more page, and the colophon under it stays quiet.
 */
export function Footer() {
  return (
    <footer className="mt-section border-t border-border">
      <div className={`${PAGE} py-section`}>
        <div className="flex flex-col gap-stack rounded-panel border border-border bg-card p-stack shadow-raised sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <Availability />
            <p className="mt-gutter text-balance type-title text-foreground">
              Have something that needs to reach production?
            </p>
            <p className="mt-inset type-body text-muted-foreground">
              {site.availability.detail}. Replies within a working day.
            </p>
          </div>
          <a href={`mailto:${site.email}`} className={cn(buttonVariants({ size: "lg" }), "shrink-0")}>
            {site.email}
          </a>
        </div>

        <div className="figure mt-stack flex flex-col gap-inset type-caption-sm text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}, {site.company} · {site.location} · <LiveClock />
          </p>
          <ul className="flex gap-gutter">
            {LINKS.map((link) => (
              <li key={link.label}>
                <SmartLink href={link.href} className="transition-colors duration-quick hover:text-foreground">
                  {link.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
