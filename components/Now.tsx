import { Section } from "./ui/Section";
import { SectionLabel } from "./ui/SectionLabel";
import { now } from "@/lib/site";

/**
 * "What I'm doing now" — the highest-signal block on most of the portfolio
 * sites worth copying, because it's the only one that dates itself.
 *
 * Hides entirely while `now` is empty, the same way Credentials does. An
 * invented or stale present tense is worse than no section: a reader who spots
 * one out-of-date line discounts everything else on the page.
 */
export function Now() {
  if (now.length === 0) return null;

  return (
    <Section>
      <SectionLabel>Now</SectionLabel>
      <ul className="mt-6 space-y-3">
        {now.map((item) => (
          <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-muted">
            <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-hairline" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
