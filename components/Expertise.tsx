import { SectionLabel } from "./ui/SectionLabel";
import { expertise } from "@/lib/site";

/**
 * DESIGN TRIAL — see PR description. Easy to revert: drop the import/usage in
 * app/page.tsx and delete this file (lib/site.ts's `expertise` export can
 * stay or go independently).
 *
 * Domain-level capability areas as a plain chip list — same visual idiom as
 * Toolkit's pills, deliberately without Toolkit's per-item descriptions or
 * band colouring, since these aren't filed under a wavelength the way a
 * technology is.
 *
 * Hides itself while `expertise` is empty, same discipline as `Now` and
 * `Credentials`.
 */
export function Expertise() {
  if (expertise.length === 0) return null;

  return (
    <div className="mt-6">
      <SectionLabel as="p" className="mb-3">
        Expertise
      </SectionLabel>
      <ul className="flex flex-wrap gap-2">
        {expertise.map((item) => (
          <li
            key={item.label}
            title={item.description}
            className="cursor-help rounded-full border border-hairline px-2.5 py-1 font-mono text-[11px] text-muted"
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
