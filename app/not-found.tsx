import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { CONTAINER } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Not found — ${site.name}`,
  // A 404 shouldn't be indexed, and it shouldn't claim a canonical either.
  robots: { index: false, follow: true },
};

/**
 * Without this, Next serves its built-in error page: system-ui, no nav, no
 * footer and not a single link out. It's the page a reader lands on from a
 * stale link or a mistyped URL, and it was the clearest "this is a template"
 * tell on the site.
 */
export default function NotFound() {
  return (
    <PageShell mainClassName={`${CONTAINER} py-24 sm:py-32`}>
      <SectionLabel as="p">Error 404</SectionLabel>

      <h1 className="mt-4 font-display text-[32px] font-medium leading-tight tracking-tight text-paper sm:text-[38px]">
        No signal at this wavelength.
      </h1>

      <p className="mt-4 max-w-md text-[16px] leading-relaxed text-muted">
        That page doesn&rsquo;t exist — it may have moved, or the link that brought you here may be
        out of date.
      </p>

      <div className="mt-9 font-mono text-[13px]">
        <Link
          href="/"
          className="inline-block rounded-full border border-hairline px-5 py-2.5 text-paper transition-colors hover:border-paper"
        >
          Home
        </Link>
      </div>
    </PageShell>
  );
}
