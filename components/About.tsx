import { Section } from "./layout";
import { site, aboutFacts } from "@/lib/site";

export function About() {
  return (
    <Section id="about" label="About">
      <div className="grid gap-stack lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="prose">
          <p>
            I&rsquo;m {site.name}, a {site.role.toLowerCase()} based in {site.location}, working
            through {site.company}.
          </p>
          <p>
            I build and ship production software end to end: product thinking through frontend,
            backend, cloud and AI. In practice that&rsquo;s TypeScript and Next.js on the front,
            Python and Node behind it, Azure underneath, and AI work layered through the middle —
            part of the toolkit rather than a separate specialism.
          </p>
        </div>

        {aboutFacts.length > 0 && (
          <dl className="h-fit divide-y divide-border rounded-panel border border-border bg-card">
            {aboutFacts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-gutter px-gutter py-gutter">
                <dt className="signal type-label-sm text-faint">{fact.label}</dt>
                <dd className="text-right type-body text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Section>
  );
}
