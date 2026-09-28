import type { ReactNode } from "react";

/**
 * A plate: cells side by side in one tray (see .tray in app/globals.css), for
 * comparing things a reader should see at once — two approaches, a before and
 * an after. Cells share one stage, divided by hairlines rather than gaps, so
 * they read as one object.
 */
export function Plate({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="my-stack">
      <div className="tray">
        <div className="tray__stage grid divide-y divide-border sm:auto-cols-fr sm:grid-flow-col sm:divide-x sm:divide-y-0">
          {children}
        </div>
      </div>
      {caption ? (
        <figcaption className="figure mt-inset text-center type-caption-sm text-faint">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/**
 * One cell: the specimen on the stage, and a strip along its foot giving the
 * verdict — a mark, and what happened. The strip is the same across cells, so
 * the eye compares outcomes along one line.
 */
export function Cell({
  children,
  verdict,
  label,
}: {
  children: ReactNode;
  verdict?: "yes" | "no";
  label?: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-1 items-center justify-center p-stack">{children}</div>
      {verdict || label ? (
        <div className="flex items-center justify-center gap-inset border-t border-border bg-gray-tint px-gutter py-inset type-caption text-muted-foreground">
          {verdict ? (
            <span
              aria-hidden="true"
              className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                verdict === "yes" ? "bg-green-solid text-green-on-solid" : "bg-gray-fill-hover text-subtle-foreground"
              }`}
            >
              <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {verdict === "yes" ? <path d="m20 6-11 11-5-5" /> : <path d="M18 6 6 18M6 6l12 12" />}
              </svg>
            </span>
          ) : null}
          {label}
        </div>
      ) : null}
    </div>
  );
}
