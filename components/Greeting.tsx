"use client";

import { useEffect, useState } from "react";

/** The reader's time of day, by their own clock. */
function greetingFor(hour: number) {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  if (hour >= 18 && hour < 23) return "Good evening";
  return "Up late?";
}

/**
 * A greeting in the reader's time of day. It can only be known in the
 * browser, so the server renders an empty line of the same height and the
 * greeting fades in once — no hydration mismatch, and no text that changes
 * after it has been read.
 */
export function Greeting() {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => setText(greetingFor(new Date().getHours())), []);

  return (
    <p
      className={`type-body text-subtle-foreground transition-opacity duration-base ${text ? "opacity-100" : "opacity-0"}`}
    >
      {text ?? " "}
    </p>
  );
}
