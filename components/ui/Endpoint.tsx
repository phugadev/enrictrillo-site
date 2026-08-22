import { SmartLink } from "./SmartLink";

/** Strips the scheme and any trailing slash — an address, not a URL. */
export function address(href: string) {
  return href
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

/**
 * One destination. Not a button: a labelled endpoint with its actual address
 * beneath it, the way documentation lists one. A row of identical bordered
 * pills reading "Live" and "GitHub" is the single most template-looking thing
 * a portfolio can do, and the address is genuine information — it tells a
 * reader whether they're about to land on a repo, a registry or a page.
 *
 * Lifted out of ProjectEntry when /system needed the same idiom for the
 * package and the source. It was always a general rule about how this site
 * points at things, not a detail of how a project entry is laid out.
 */
export function Endpoint({
  label,
  href,
  sub,
  arrow = "↗",
  emphasis = false,
}: {
  label: string;
  href: string;
  sub: string;
  arrow?: string;
  emphasis?: boolean;
}) {
  return (
    <SmartLink
      href={href}
      className={`group/ep block min-w-[13rem] max-w-full border-t pt-2 transition-colors hover:border-paper ${
        emphasis ? "border-paper/40" : "border-hairline"
      }`}
    >
      <span className="block font-mono text-[11px] uppercase tracking-wider text-paper">
        {label} <span aria-hidden="true">{arrow}</span>
      </span>
      <span className="mt-0.5 block truncate font-mono text-[10px] text-faint transition-colors group-hover/ep:text-muted">
        {sub}
      </span>
    </SmartLink>
  );
}
