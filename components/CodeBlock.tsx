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

function CopyButton({
  target,
  floating,
}: {
  target: React.RefObject<HTMLElement | null>;
  /** True in the headerless case, where the button has no bar to sit in and
   *  parks itself over the top-right corner of the block instead. */
  floating?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // textContent, deliberately. The line numbers are ::before generated
    // content, which is not in the DOM and therefore not in textContent — so
    // the clipboard gets the code and nothing else, with no stripping pass to
    // keep in sync with the gutter's formatting.
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
      data-floating={floating || undefined}
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
    }
    rest_children.push(child);
  });

  // THE HEADER TRIGGER: an explicit `title=` on the fence, nothing else.
  //
  // The header used to fall back to the language name, so every block wore a
  // bar reading BASH or TS. That bar was 32px of chrome carrying information
  // the reader already has — the syntax colouring, the prompt, the `SELECT`
  // are all louder about what language this is than a label in 11px caps —
  // and it made a two-line snippet look like a file the reader was supposed
  // to go and find. A header is a *filename slot*: it exists to say "this is
  // lib/ingest/batcher.ts", which is a claim about the codebase that the code
  // itself cannot make.
  //
  // The rejected alternative was a length threshold (header over N lines).
  // That ties a semantic decision — is this an excerpt from a real file, or a
  // free-standing illustration — to a number that has nothing to do with it,
  // and it means adding two lines to a snippet silently grows a title bar.
  // Author intent is the better signal, and it is already expressible in the
  // fence.
  //
  // In the headerless case the copy button does not disappear: it moves onto
  // the block itself (see .rsk-codeframe__copy[data-floating] in globals.css),
  // stays in the tab order, and stays visible where hover does not exist.
  const hasHeader = title !== null;

  return (
    <figure {...rest} ref={frameRef} className="rsk-codeframe" data-headless={!hasHeader || undefined}>
      {hasHeader ? (
        <div className="rsk-codeframe__head">
          <span className="rsk-codeframe__name">{title}</span>
          <CopyButton target={frameRef} />
        </div>
      ) : (
        <CopyButton target={frameRef} floating />
      )}
      {rest_children}
    </figure>
  );
}
