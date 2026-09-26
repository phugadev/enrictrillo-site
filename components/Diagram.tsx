import { Fragment } from "react";
import type { Wavelength } from "@/lib/site";
import { band } from "@/lib/bands";

export type DiagramNode = {
  label: string;
  /** Tints the node's border/background; omit for a neutral hairline box. */
  wavelength?: Wavelength;
  note?: string;
};


/**
 * A left-to-right pipeline diagram (stacking top-to-bottom on mobile) for
 * architecture/system-design sections in case studies and posts — the
 * "steal the architecture diagram" idea from srbh.site's Telegram-bot post,
 * adapted to colour nodes with this site's own wavelength bands instead of
 * a generic palette.
 *
 * Deliberately linear, not a general graph: nodes render in array order,
 * connected in sequence. `edges[i]`, if given, labels the connector after
 * `nodes[i]`. Reach for this for a pipeline or request flow, not a
 * branching or cyclic architecture — those need an actual diagramming tool.
 *
 *   <Diagram
 *     nodes={[
 *       { label: "Probes", wavelength: "systems" },
 *       { label: "Batcher", wavelength: "compute", note: "5k events / flush" },
 *       { label: "Postgres", wavelength: "intelligence" },
 *     ]}
 *     edges={[undefined, "flush every 200ms"]}
 *   />
 */
export function Diagram({ nodes, edges = [] }: { nodes: DiagramNode[]; edges?: (string | undefined)[] }) {
  return (
    <div className="my-stack flex flex-col rounded-panel border border-border bg-card p-gutter shadow-raised sm:flex-row sm:items-center sm:p-stack">
      {nodes.map((node, i) => {
        const chip = node.wavelength ? band[node.wavelength].chip : "border-border bg-gray-fill text-muted-foreground";
        return (
          <Fragment key={i}>
            <div className={`flex shrink-0 flex-col items-center gap-1 rounded-control-md border px-gutter py-inset text-center ${chip}`}>
              <span className="signal type-label">
                {node.label}
              </span>
              {node.note && <span className="type-caption-sm text-subtle-foreground">{node.note}</span>}
            </div>
            {i < nodes.length - 1 && (
              <div className="flex flex-col items-center justify-center gap-1 px-1 py-2 sm:flex-1 sm:px-3 sm:py-0">
                {edges[i] && (
                  <span className="signal type-label-xs text-faint">{edges[i]}</span>
                )}
                <span aria-hidden="true" className="text-faint sm:hidden">
                  ↓
                </span>
                <span aria-hidden="true" className="hidden text-faint sm:inline">
                  →
                </span>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
