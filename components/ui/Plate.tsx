import type { ReactNode } from "react";

/**
 * A demonstration frame, from @ruskel/ui.
 *
 * Shows two (or more) states side by side so the reader compares rather than
 * taking the claim on trust — before/after, without/with, wrong/right. Cells
 * stack below 640px; the divider follows automatically because it is drawn
 * per-cell rather than on the container.
 *
 *   <Plate caption="A harness makes the difference legible.">
 *     <Cell verdict="no" label="No baseline">…</Cell>
 *     <Cell verdict="yes" label="Reproducible">…</Cell>
 *   </Plate>
 */
export function Plate({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <div className="not-prose my-8">
      <div className="rsk-plate">{children}</div>
      {caption ? <p className="rsk-plate__caption">{caption}</p> : null}
    </div>
  );
}

/**
 * `verdict` is optional. When present it renders the status treatment — form
 * carries the meaning and the only hue is the reserved alarm, so a plate never
 * introduces a colour the rest of the system does not already use.
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
    <div className="rsk-plate__cell">
      <div className="text-[14px] leading-[1.55] text-prose">{children}</div>
      {verdict || label ? (
        <div className="rsk-plate__foot">
          {verdict ? (
            <span className="rsk-plate__verdict" data-verdict={verdict} aria-hidden="true">
              {verdict === "yes" ? "✓" : "✕"}
            </span>
          ) : null}
          {label}
        </div>
      ) : null}
    </div>
  );
}
