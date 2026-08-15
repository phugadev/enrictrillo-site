import { Fragment } from "react";
import { wavelengths, type Wavelength } from "@/lib/site";

export type DiagramNode = {
  label: string;
  /** Tints the node's border/background; omit for a neutral hairline box. */
  wavelength?: Wavelength;
  note?: string;
};

const NEUTRAL_HEX = "#7A7C85"; // palette.faint — not re-imported to keep this component to one concern

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
    <div className="not-prose my-8 flex flex-col rounded-lg border border-hairline bg-surface p-6 sm:flex-row sm:items-center">
      {nodes.map((node, i) => {
        const hex = node.wavelength ? wavelengths[node.wavelength].hex : NEUTRAL_HEX;
        return (
          <Fragment key={i}>
            <div
              className="flex shrink-0 flex-col items-center gap-1 rounded-lg border px-4 py-3 text-center"
              style={{ borderColor: `${hex}40`, backgroundColor: `${hex}14` }}
            >
              <span className="font-mono text-[12px] uppercase tracking-wider" style={{ color: hex }}>
                {node.label}
              </span>
              {node.note && <span className="text-[12px] text-faint">{node.note}</span>}
            </div>
            {i < nodes.length - 1 && (
              <div className="flex flex-col items-center justify-center gap-1 px-1 py-2 sm:flex-1 sm:px-3 sm:py-0">
                {edges[i] && (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-faint">{edges[i]}</span>
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
