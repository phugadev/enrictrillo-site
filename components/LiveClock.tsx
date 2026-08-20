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
 *
 * The tick is scheduled onto the next real minute boundary rather than run
 * from a fixed interval: a plain `setInterval` is free to land anywhere
 * inside the minute, so the displayed time could sit up to a minute behind
 * the wall clock and drift further as timers slip. Re-arming from the actual
 * clock each time keeps the change visible when the minute actually turns.
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
    let id: ReturnType<typeof setTimeout>;

    const tick = () => {
      const now = new Date();
      setTime(formatter.format(now));
      // Aim just past the next minute boundary, with a floor so a timer that
      // fires a hair early can't spin.
      const untilNextMinute = 60_000 - (now.getSeconds() * 1_000 + now.getMilliseconds());
      id = setTimeout(tick, Math.max(1_000, untilNextMinute));
    };

    tick();
    return () => clearTimeout(id);
  }, []);

  if (!time) return null;

  return <span>{time}</span>;
}
