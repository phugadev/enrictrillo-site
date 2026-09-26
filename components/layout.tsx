import type { ReactNode } from "react";
import type { Wavelength } from "@/lib/site";
import { band } from "@/lib/bands";

/**
 * The site's layout vocabulary, drawn from what the pages actually do. These
 * are the primitives Minima does not ship yet (Container, Section, a page
 * header); they are written here first, on Minima's space ladder, so that
 * whatever goes upstream later has a real consumer behind it.
 *
 * Every gap is a rung — inset, gutter, stack, section — and the root carries
 * data-density="comfortable", so the ladder here is 10 / 20 / 40 / 80.
 */

/** The page column. Wide enough for a two-column band grid; text inside it
    sets its own measure. */
export const PAGE = "mx-auto w-full max-w-5xl px-gutter sm:px-stack";

export function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "article";
}) {
  return <Tag className={`${PAGE} ${className}`}>{children}</Tag>;
}

/** Signal voice: mono, uppercase, tracked. Scanned, never read. */
export function Eyebrow({
  children,
  wavelength,
  className = "",
  as: Tag = "p",
}: {
  children: ReactNode;
  wavelength?: Wavelength;
  className?: string;
  as?: "p" | "span" | "h2" | "h3";
}) {
  return (
    <Tag
      className={`signal type-label-sm flex items-center gap-2 ${
        wavelength ? band[wavelength].tint : "text-subtle-foreground"
      } ${className}`}
    >
      {wavelength && (
        <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${band[wavelength].mark}`} />
      )}
      {children}
    </Tag>
  );
}

/**
 * A region of a page. One section rung above it — only above, so two regions
 * sit one rung apart rather than two — and a header row
 * that names the region in the signal voice with room for one aside on the
 * right — a count, or a link to the full list.
 */
export function Section({
  id,
  label,
  aside,
  children,
  className = "",
}: {
  id?: string;
  label: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`${PAGE} pt-section ${className}`}>
      <div className="mb-stack flex items-center justify-between gap-gutter border-b border-border pb-gutter">
        <Eyebrow as="h2" className="text-foreground">
          {label}
        </Eyebrow>
        {aside && <div className="signal type-label-sm text-subtle-foreground">{aside}</div>}
      </div>
      {children}
    </section>
  );
}

/** The top of an index page: what it is, and one paragraph on why. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className={`${PAGE} pt-section pb-stack`}>
      {eyebrow}
      <h1 className="mt-gutter max-w-3xl text-balance type-title text-foreground sm:type-display">
        {title}
      </h1>
      {lead && <p className="mt-gutter max-w-2xl text-pretty type-lead text-muted-foreground">{lead}</p>}
      {children && <div className="mt-stack">{children}</div>}
    </header>
  );
}

/** The drawn break — diagonal rules in the hairline grey. */
export function Hatch({ className = "" }: { className?: string }) {
  return (
    <div
      role="separator"
      className={`h-2 bg-[repeating-linear-gradient(-45deg,var(--border)_0_1px,transparent_1px_6px)] ${className}`}
    />
  );
}
