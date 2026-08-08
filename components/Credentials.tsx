import { format } from "date-fns";
import { Section } from "./ui/Section";
import { SectionLabel } from "./ui/SectionLabel";
import { SmartLink } from "./ui/SmartLink";
import { WavelengthDot } from "./ui/WavelengthDot";
import { credentials } from "@/lib/site";

/**
 * Earned credentials only — see the note on `credentials` in lib/site.ts.
 * Hides itself entirely while nothing is banked, so the homepage never shows
 * an empty heading.
 */
export function Credentials() {
  if (credentials.length === 0) return null;

  const sorted = [...credentials].sort((a, b) => (a.earned < b.earned ? 1 : -1));

  return (
    <Section>
      <SectionLabel>Certified</SectionLabel>
      <ul className="mt-6 divide-y divide-hairline">
        {sorted.map((credential) => {
          const row = (
            <span className="flex items-baseline justify-between gap-6 py-4">
              <span className="flex items-baseline gap-2.5">
                <WavelengthDot
                  wavelength={credential.wavelength}
                  className="translate-y-[-2px]"
                />
                <span>
                  <span className="font-display text-[16px] text-paper">{credential.name}</span>{" "}
                  <span className="font-mono text-[11px] uppercase tracking-wider text-faint">
                    {credential.issuer}
                  </span>
                </span>
              </span>
              <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-faint">
                {format(new Date(`${credential.earned}-01`), "MMM yyyy")}
              </span>
            </span>
          );

          return (
            <li key={`${credential.issuer}-${credential.name}`}>
              {credential.href ? (
                <SmartLink href={credential.href} className="block">
                  {row}
                </SmartLink>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
