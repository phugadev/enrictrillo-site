"use client";

import {
  Children,
  isValidElement,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

/** Clipboard icon. Inline SVG on currentColor, not a glyph — an emoji renders
 *  in the platform's own colour and weight and ignores the exposure. */
function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

function CopyButton({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const code = target.current?.querySelector("code")?.textContent ?? "";
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
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy code"}
      data-copied={copied || undefined}
      className="rsk-codeframe__copy"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

/**
 * Renders fenced code blocks as `.rsk-codeframe` from @ruskel/ui: a framed
 * block whose header names the file or language and hosts the copy control.
 *
 * This intercepts the `figure` rather than the `pre` because that is where
 * rehype-pretty-code puts the title — as a *sibling* of the pre, not inside
 * it. Overriding `pre` alone can only ever see the language attribute, so
 * the filename would be stranded in a second bar above the frame.
 *
 * Any other <figure> in MDX passes straight through; only rehype's own
 * blocks are reframed, so the custom <Figure> component is untouched.
 */
export function CodeBlock({ children, ...rest }: ComponentPropsWithoutRef<"figure">) {
  // The ref sits on the figure rather than a wrapper around the pre. A wrapper
  // would break `.rsk-codeframe > pre`, which is what zeroes the margin the
  // typography plugin puts on every pre — leaving a 27px band inside the frame.
  const frameRef = useRef<HTMLElement>(null);
  const isCodeFigure = "data-rehype-pretty-code-figure" in rest;

  if (!isCodeFigure) return <figure {...rest}>{children}</figure>;

  // rehype emits [title?, pre]. Pull the title out so it can move into the
  // header instead of stacking as its own bar.
  let title: ReactNode = null;
  const rest_children: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      const props = child.props as Record<string, unknown>;
      if ("data-rehype-pretty-code-title" in props) {
        title = props.children as ReactNode;
        return;
      }
      // Fall back to the language when the fence carries no title.
      if (!title && typeof props["data-language"] === "string") {
        title = props["data-language"] as string;
      }
    }
    rest_children.push(child);
  });

  return (
    <figure {...rest} ref={frameRef} className="rsk-codeframe">
      <div className="rsk-codeframe__head">
        <span className="rsk-codeframe__name">{title ?? "code"}</span>
        <CopyButton target={frameRef} />
      </div>
      {rest_children}
    </figure>
  );
}
