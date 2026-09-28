import { site } from "@/lib/site";
import { LiveClock } from "./LiveClock";
import { Container } from "./layout";
import { SmartLink } from "./ui/SmartLink";

const LINKS = [
  { label: "GitHub", href: site.social.github },
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "RSS", href: "/feed.xml" },
];

/** One quiet line: where and when I am, and where else to find me. */
export function Footer() {
  return (
    <Container
      as="footer"
      size="narrow"
      className="flex flex-wrap items-baseline justify-between gap-x-gutter gap-y-inset py-section type-body text-subtle-foreground"
    >
      <p className="tabular-nums">
        London · <LiveClock />
      </p>
      <ul className="flex gap-gutter">
        {LINKS.map((link) => (
          <li key={link.label}>
            <SmartLink
              href={link.href}
              className="transition-colors duration-quick hover:text-foreground"
            >
              {link.label}
            </SmartLink>
          </li>
        ))}
      </ul>
    </Container>
  );
}
