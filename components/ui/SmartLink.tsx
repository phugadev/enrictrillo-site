import Link from "next/link";
import type { ReactNode } from "react";

const isAbsolute = (href: string) => /^https?:\/\//.test(href);
const isAnchorOrProtocol = (href: string) => href.startsWith("#") || href.startsWith("mailto:");

/**
 * Picks the right element for a href that isn't known at author time — e.g.
 * `projects[].href` in lib/site.ts, which may be an internal route or an
 * external URL. Internal routes get next/link (client nav + prefetch),
 * absolute URLs get a new tab with rel="noreferrer", and same-page anchors and
 * mailto: stay plain anchors.
 */
export function SmartLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (isAbsolute(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  if (isAnchorOrProtocol(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
