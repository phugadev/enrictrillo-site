"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * "Press E to copy my email." The key works anywhere on the page except while
 * the reader is typing, and never with a modifier held — E on its own is the
 * shortcut; ⌘E and friends belong to the browser.
 *
 * The hint is also a button, so touch readers have the same action, and on a
 * device with no hover it says "Tap" rather than naming a key they do not
 * have. Confirmation is a status message, announced to screen readers.
 */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard blocked (an insecure origin, a denied permission): fall
      // back to what the address was always for.
      window.location.href = `mailto:${email}`;
    }
  }, [email]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "e" || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable='true']")) return;
      void copy();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [copy]);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <>
      <button
        type="button"
        onClick={() => void copy()}
        className="cursor-pointer text-muted-foreground underline decoration-subtle-foreground/40 decoration-dotted underline-offset-4 transition-colors duration-quick hover:text-foreground"
      >
        <span className="[@media(hover:none)]:hidden">
          Press{" "}
          <kbd className="figure rounded-mark border border-border bg-card px-1 py-px type-caption-sm text-foreground no-underline">
            E
          </kbd>{" "}
          to copy my email
        </span>
        <span className="hidden [@media(hover:none)]:inline">Tap to copy my email</span>
      </button>
      <span
        role="status"
        className={`pointer-events-none fixed inset-x-0 bottom-stack z-50 mx-auto w-fit rounded-full bg-primary px-3 py-1.5 type-caption text-primary-foreground shadow-overlay transition-[opacity,translate] duration-base ease-out ${
          copied ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {copied ? `Copied ${email}` : ""}
      </span>
    </>
  );
}
