import { DispersionMark } from "./DispersionMark";
import { Section } from "./ui/Section";
import { SectionLabel } from "./ui/SectionLabel";
import { site, aboutFacts } from "@/lib/site";

/**
 * Closes the page with the bio, plus a row of diligence facts underneath it
 * — the concrete details a decision-maker actually checks before booking a
 * call (sectors delivered in, team sizes, notice period). `aboutFacts`
 * starts empty rather than guessed; this renders only the facts actually
 * filled in, same discipline as `Now` and `Credentials`.
 *
 * Years of experience isn't one of the facts — the hero already states it,
 * and repeating it here would be the same claim twice on one scroll.
 */
export function About() {
  return (
    <Section id="about">
      <SectionLabel>About</SectionLabel>
      <div className="mt-6 flex items-start gap-4">
        <DispersionMark size={22} />
        <div className="max-w-xl">
          <div className="space-y-4 text-[16px] leading-relaxed text-muted">
            <p>
              I'm {site.name}, a {site.role.toLowerCase()} based in {site.location}, working through{" "}
              {site.company}.
            </p>
            <p>
              I build and ship production software end to end: product thinking through frontend,
              backend, cloud and AI. In practice that's TypeScript and Next.js on the front, Python
              and Node behind it, Azure underneath, and AI work layered through the middle — part of
              the toolkit rather than a separate specialism.
            </p>
          </div>

          {aboutFacts.length > 0 && (
            <dl className="mt-6 grid gap-x-8 gap-y-3 border-t border-hairline pt-6 sm:grid-cols-2">
              {aboutFacts.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between gap-4 sm:block">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-faint">
                    {fact.label}
                  </dt>
                  <dd className="text-[14px] text-paper sm:mt-1">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </Section>
  );
}
