import { Section } from "./layout";
import { now } from "@/lib/site";

/** Hides itself until there is a present tense worth stating. */
export function Now() {
  if (now.length === 0) return null;

  return (
    <Section label="Now">
      <ul className="max-w-3xl space-y-gutter">
        {now.map((item) => (
          <li key={item} className="flex gap-gutter text-pretty type-lead text-muted-foreground">
            <span aria-hidden="true" className="mt-[0.8em] h-px w-6 shrink-0 bg-interface" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
