"use client";

import { useEffect, useState } from "react";

/**
 * The site's second client component, after `<Analytics />` — worth knowing
 * before you extend this file, since everything else here is a server
 * component on purpose (see the README's "Conventions" section).
 *
 * A live clock genuinely can't be done without it: there's no way to keep a
 * number ticking on screen from a page that was rendered once, at build
 * time. It replaces a static "GMT/BST" label that was standing in for
 * exactly this — London alternates between the two, so a fixed string was
 * always going to be wrong for half the year. `Intl.DateTimeFormat` with an
 * explicit `timeZone` resolves the correct one from the real date, for any
 * visitor regardless of their own locale or timezone.
 *
 * Renders nothing until mounted, rather than guessing a time server-side and
 * correcting it after hydration — a build-time timestamp would be stale by
 * the time anyone loads the page, and swapping it out post-mount would flash.
 * A 30s poll is plenty for a display that only changes once a minute.
 */
const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZoneName: "short",
});

export function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return <span>{time}</span>;
}
