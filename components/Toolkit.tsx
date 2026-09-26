import { Section } from "./layout";
import { toolkit, wavelengthOrder, wavelengths } from "@/lib/site";
import { band } from "@/lib/bands";

export function Toolkit() {
  return (
    <Section label="Toolkit" aside="Filed by band">
      <dl className="grid gap-gutter sm:grid-cols-2">
        {wavelengthOrder.map((wavelength) => {
          const wl = wavelengths[wavelength];
          const b = band[wavelength];
          const items = toolkit[wavelength];
          if (!items?.length) return null;
          return (
            <div key={wavelength} className="rounded-panel border border-border bg-card p-gutter sm:p-stack">
              <dt className="flex items-baseline justify-between gap-gutter">
                <span className={`signal type-label flex items-center gap-2 ${b.tint}`}>
                  <span aria-hidden="true" className={`size-1.5 rounded-full ${b.mark}`} />
                  {wl.label}
                </span>
                <span className="figure type-caption-sm text-faint">{wl.nm}nm</span>
              </dt>
              <dd className="mt-gutter flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <span
                    key={item}
                    className={`rounded-chip border border-border bg-background px-2.5 py-1 type-caption text-muted-foreground transition-colors duration-quick ${b.hover}`}
                  >
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          );
        })}
      </dl>
    </Section>
  );
}
