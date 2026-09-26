import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { Eyebrow, PAGE } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Not found — ${site.name}`,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <PageShell mainClassName={`${PAGE} py-[calc(var(--spacing-section)*1.5)]`}>
      <Eyebrow>Error 404</Eyebrow>
      <h1 className="mt-gutter max-w-2xl text-balance type-title text-foreground sm:type-display">
        No signal at this wavelength.
      </h1>
      <p className="mt-gutter max-w-xl text-pretty type-lead text-muted-foreground">
        That page doesn&rsquo;t exist — it may have moved, or the link that brought you here may be
        out of date.
      </p>
      <div className="mt-stack flex flex-wrap gap-inset">
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          Home
        </Link>
        <Link href="/blog" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Writing
        </Link>
      </div>
    </PageShell>
  );
}
