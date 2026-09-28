import type { ComponentProps, ReactNode } from "react";
import type { Wavelength } from "@/lib/site";
import { band } from "@/lib/bands";
import { cn } from "@/lib/cn";
import { Eyebrow as MinimaEyebrow, containerVariants } from "./ui/layout";

/**
 * The page primitives are Minima's (components/ui/layout.tsx, installed from
 * phugadev/minima/layout). They were written here first and moved upstream;
 * what stays is identity, which a design system should not carry.
 */
export { Container, Section, PageHeader, containerVariants } from "./ui/layout";

/** The page column, for elements that take it as a class. */
export const PAGE = containerVariants();

/**
 * The reading column: one narrow column, the whole site's shape. Minima's
 * page container, narrowed through cn so the max-width merges rather than
 * fighting the container's own.
 */
export const COLUMN = cn(containerVariants(), "max-w-xl");

/**
 * A section's name, said quietly: the body size in the subtle grey, sentence
 * case. The list under it carries the weight, not the label.
 */
export function Label({ children, id, as: Tag = "h2" }: { children: ReactNode; id?: string; as?: "h1" | "h2" | "p" }) {
  return (
    <Tag id={id} className="mb-inset type-body text-subtle-foreground">
      {children}
    </Tag>
  );
}

/**
 * Minima's eyebrow, optionally in a band's colour with its mark beside it.
 * The band is this site's taxonomy, so it lives here rather than as a prop on
 * the system's component.
 */
export function Eyebrow({
  wavelength,
  className,
  children,
  ...props
}: ComponentProps<typeof MinimaEyebrow> & { wavelength?: Wavelength }) {
  return (
    <MinimaEyebrow className={cn(wavelength && band[wavelength].tint, className)} {...props}>
      {wavelength && (
        <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${band[wavelength].mark}`} />
      )}
      {children}
    </MinimaEyebrow>
  );
}
