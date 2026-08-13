/**
 * Parses a `YYYY-MM-DD` string as local midnight.
 *
 * `new Date("2026-08-07")` matches the ECMAScript date-only form, which is
 * specified to parse as *UTC* midnight. Formatting that anywhere west of
 * Greenwich renders the previous day — a prerender in Vercel's default US
 * region would date every post and credential one day early, silently. Building
 * the Date from its parts pins it to the local calendar day instead, which is
 * what a human-readable date is supposed to mean.
 *
 * Machine-readable output (the RSS `pubDate`, `<time dateTime>`) deliberately
 * does *not* go through this — those want the raw date or a fixed UTC instant.
 */
export function parseDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** True when `iso` is a well-formed date that actually exists (rejects 2026-02-31). */
export function isValidDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const date = parseDate(iso);
  return !Number.isNaN(date.getTime()) && date.getDate() === Number(iso.slice(8, 10));
}
