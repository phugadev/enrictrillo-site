import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout";
import { PageShell } from "@/components/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Not found — ${site.name}`,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <PageShell back={{ href: "/", label: site.name }}>
      <PageHeader
        variant="quiet"
        size="narrow"
        className="pt-stack pb-0"
        title="Nothing here."
        lead={
          <>
            That page doesn&rsquo;t exist — it may have moved, or the link that brought you here may
            be out of date.{" "}
            <Link
              href="/"
              className="text-foreground underline decoration-subtle-foreground/50 decoration-dotted underline-offset-4 hover:decoration-solid"
            >
              Start from the beginning
            </Link>
            .
          </>
        }
      />
    </PageShell>
  );
}
