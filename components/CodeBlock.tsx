"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";

/**
 * Overrides MDX's default `<pre>` for fenced code blocks so every one gets
 * a copy button. Reads text from the rendered `<code>` element at click
 * time rather than the MDX source string, so it copies exactly what's on
 * screen instead of a second, hand-maintained copy of the same content.
 *
 * The button sits inside the `<pre>` itself, not a wrapping div — `pre`
 * already carries the block's border/radius from globals.css, and a
 * wrapper would need to duplicate that just to host `position: relative`.
 */
export function CodeBlock({ children, className = "", ...rest }: ComponentPropsWithoutRef<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const code = preRef.current?.querySelector("code")?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard permission denied — nothing sensible to show short of a
      // second UI for a failure mode that's rare and not actionable here.
    }
  };

  return (
    <pre {...rest} ref={preRef} className={`group/code relative ${className}`}>
      {children}
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2.5 top-2.5 rounded-md border border-hairline bg-surface-2 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-faint opacity-0 transition-opacity hover:text-paper focus-visible:opacity-100 group-hover/code:opacity-100"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </pre>
  );
}
