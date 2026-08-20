import { ProjectRow } from "@/components/ProjectRow";
import {
  CatalogueEntry,
  LeadProject,
  SpecPlate,
  ThinEntry,
  ThinRow,
} from "@/components/lab/WorkVariants";
import { CONTAINER } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { projects, type Project } from "@/lib/site";

/**
 * Obviously-fake filler, so each variant can be judged at the density it
 * would actually live at rather than only at two entries. Named so nobody
 * mistakes them for real work.
 */
const SAMPLES: Project[] = [
  {
    name: "Sample project one",
    description: "A one-line description of roughly the length a real one runs to.",
    stack: ["TypeScript", "Next.js"],
    wavelength: "interface",
    status: "Shipped",
    year: "2025",
    links: { live: "https://example.com" },
  },
  {
    name: "Sample project two",
    description: "Something still in build, to show the second status treatment.",
    stack: ["Python", "Postgres"],
    wavelength: "intelligence",
    status: "In build",
    year: "2025",
    links: { repo: "https://example.com" },
  },
  {
    name: "Sample project three",
    description: "An older one, archived — the third and quietest status.",
    wavelength: "compute",
    status: "Archived",
    year: "2024",
    links: { repo: "https://example.com" },
  },
];

const padded = [...projects, ...SAMPLES];

/** Scratch comparison page. Not linked from anywhere; not for merge. */
export const metadata = { title: "Lab — Selected work variants", robots: { index: false } };

function Variant({ tag, name, note, children }: {
  tag: string;
  name: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${CONTAINER} py-16`}>
      <div className="mb-6 border-b border-hairline pb-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
          {tag} · {name}
        </p>
        <p className="mt-1 text-[13px] text-muted">{note}</p>
      </div>
      {children}
    </div>
  );
}

/** The same variant again with filler added, to test how it scales. */
function Denser({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-10 border-t border-dashed border-hairline pt-6">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-wider text-faint">
        same, at five entries (three are filler)
      </p>
      {children}
    </div>
  );
}

export default function LabWorkPage() {
  return (
    <main className="py-10">
      <Variant tag="A" name="Ledger index — shipped" note="What is on the homepage now.">
        <div className="flex items-baseline justify-between">
          <SectionLabel>Selected work</SectionLabel>
          <span className="font-mono text-[12px] text-faint">{projects.length}</span>
        </div>
        <ul className="mt-4 border-t border-hairline">
          {projects.map((p) => (
            <ProjectRow key={p.name} project={p} />
          ))}
        </ul>
        <Denser>
          <ul className="border-t border-hairline">
            {padded.map((p) => (
              <ProjectRow key={p.name} project={p} />
            ))}
          </ul>
        </Denser>
      </Variant>

      <Variant
        tag="B"
        name="Instrument spec plate"
        note="Each project as a readout: hatch under the name, labelled fields, description and destinations below the rule."
      >
        <div className="flex items-baseline justify-between">
          <SectionLabel>Selected work</SectionLabel>
          <span className="font-mono text-[12px] text-faint">{projects.length}</span>
        </div>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <SpecPlate key={p.name} project={p} />
          ))}
        </ul>
        <Denser>
          <ul className="grid gap-4 sm:grid-cols-2">
            {padded.map((p) => (
              <SpecPlate key={p.name} project={p} />
            ))}
          </ul>
        </Denser>
      </Variant>

      <Variant
        tag="C"
        name="Lead project, then thin rows"
        note="The one with a case study gets the space; everything else is a one-line entry."
      >
        <div className="flex items-baseline justify-between">
          <SectionLabel>Selected work</SectionLabel>
          <span className="font-mono text-[12px] text-faint">{projects.length}</span>
        </div>
        <div className="mt-4">
          <LeadProject project={projects[0]} />
          <ul className="mt-6 border-t border-hairline">
            {projects.slice(1).map((p) => (
              <ThinRow key={p.name} project={p} />
            ))}
          </ul>
        </div>
        <Denser>
          <LeadProject project={padded[0]} />
          <ul className="mt-6 border-t border-hairline">
            {padded.slice(1).map((p) => (
              <ThinRow key={p.name} project={p} />
            ))}
          </ul>
        </Denser>
      </Variant>
      <Variant
        tag="D"
        name="Catalogue entry — the hybrid"
        note="C's composition, B's hatch as a structural rule (above it: what the thing is; below it: how to reach it), A's information hierarchy. Destinations are endpoints with addresses, not buttons."
      >
        <div className="flex items-baseline justify-between">
          <SectionLabel>Selected work</SectionLabel>
          <span className="font-mono text-[12px] text-faint">{projects.length}</span>
        </div>
        <ul className="mt-6 divide-y divide-hairline">
          {projects.map((p, i) => (
            <CatalogueEntry key={p.name} project={p} index={i} />
          ))}
        </ul>
        <Denser>
          <ul className="divide-y divide-hairline">
            {padded.map((p, i) => (
              <CatalogueEntry key={p.name} project={p} index={i} />
            ))}
          </ul>
        </Denser>
      </Variant>
      <Variant
        tag="E"
        name="Lead entry, then thin rows"
        note="D's entry for the project in front, C's tail for the rest. A thin row keeps index, band hue, name, description, year and one endpoint — and says the status only when it is not Shipped."
      >
        <div className="flex items-baseline justify-between">
          <SectionLabel>Selected work</SectionLabel>
          <span className="font-mono text-[12px] text-faint">{projects.length}</span>
        </div>
        <div className="mt-6">
          <ul>
            <CatalogueEntry project={projects[0]} index={0} />
          </ul>
          <ul className="mt-2 border-t border-hairline">
            {projects.slice(1).map((p, i) => (
              <ThinEntry key={p.name} project={p} index={i + 1} />
            ))}
          </ul>
        </div>
        <Denser>
          <ul>
            <CatalogueEntry project={padded[0]} index={0} />
          </ul>
          <ul className="mt-2 border-t border-hairline">
            {padded.slice(1).map((p, i) => (
              <ThinEntry key={p.name} project={p} index={i + 1} />
            ))}
          </ul>
        </Denser>
      </Variant>
    </main>
  );
}
