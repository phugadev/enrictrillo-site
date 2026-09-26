import type { ReactNode } from "react";

/**
 * A plate: cells side by side on one raised panel, for comparing things a
 * reader should see at once — two approaches, a before and an after. Cells
 * are divided by hairlines rather than gaps so they read as one object.
 */
export function Plate({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="my-stack">
      <div className="grid gap-px overflow-hidden rounded-panel border border-border bg-border shadow-raised sm:auto-cols-fr sm:grid-flow-col">
        {children}
      </div>
      {caption ? (
        <figcaption className="figure mt-inset text-center type-caption-sm text-faint">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/** One cell. A verdict marks it as the approach that works, or does not. */
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
    <div className="flex flex-col gap-gutter bg-card p-gutter">
      <div className="type-body text-muted-foreground">{children}</div>
      {verdict || label ? (
        <div className="signal mt-auto flex items-center gap-inset type-label-sm text-subtle-foreground">
          {verdict ? (
            <span
              aria-hidden="true"
              className={`flex size-5 items-center justify-center rounded-full border ${
                verdict === "yes"
                  ? "border-green-border bg-green-fill text-green-text"
                  : "border-red-border bg-red-fill text-red-text"
              }`}
            >
              {verdict === "yes" ? "✓" : "✕"}
            </span>
          ) : null}
          {label}
        </div>
      ) : null}
    </div>
  );
}
