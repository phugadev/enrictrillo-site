import { format } from "date-fns";
import { parseDate } from "@/lib/dates";
import { Section } from "./layout";
import { SmartLink } from "./ui/SmartLink";
import { WavelengthDot } from "./ui/WavelengthDot";
import { credentials } from "@/lib/site";

/** Hides itself while no credentials are banked. */
export function Credentials() {
  if (credentials.length === 0) return null;

  const sorted = [...credentials].sort((a, b) => (a.earned < b.earned ? 1 : -1));

  return (
    <Section label="Certified">
      <ul className="divide-y divide-border rounded-panel border border-border bg-card">
        {sorted.map((credential) => {
          const row = (
            <span className="flex items-center justify-between gap-gutter px-gutter py-gutter">
              <span className="flex min-w-0 items-center gap-inset">
                <WavelengthDot wavelength={credential.wavelength} />
                <span className="truncate type-subheading text-foreground">{credential.name}</span>
                <span className="signal hidden type-label-sm text-faint sm:inline">{credential.issuer}</span>
              </span>
              <span className="figure shrink-0 type-caption-sm text-faint">
                {format(parseDate(`${credential.earned}-01`), "MMM yyyy")}
              </span>
            </span>
          );
          return (
            <li key={`${credential.issuer}-${credential.name}`}>
              {credential.href ? (
                <SmartLink href={credential.href} className="block transition-colors duration-quick hover:bg-gray-tint">
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
