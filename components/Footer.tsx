import { site } from "@/lib/site";
import { Availability } from "./Availability";
import { CONTAINER } from "./ui/Section";
import { SmartLink } from "./ui/SmartLink";

/** Order is fixed here rather than derived, so the footer reads deliberately. */
const LINKS = [
  { label: "GitHub", href: site.social.github },
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "RSS", href: "/feed.xml" },
];

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className={`${CONTAINER} py-10`}>
        <Availability />
        <div className="mt-5 flex flex-col gap-1 font-mono text-[12px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            {site.name} — {site.location} · GMT/BST
          </p>
          <div className="flex gap-5">
            {LINKS.map((link) => (
              <SmartLink
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-muted"
              >
                {link.label}
              </SmartLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
