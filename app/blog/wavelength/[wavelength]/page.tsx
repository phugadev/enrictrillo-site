import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { WavelengthChips } from "@/components/WavelengthChips";
import { CONTAINER } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getPostsByWavelength } from "@/lib/posts";
import { site, wavelengths, type Wavelength } from "@/lib/site";

/** Only bands that actually have posts get a page. */
export async function generateStaticParams() {
  return getPostsByWavelength().map((band) => ({ wavelength: band.wavelength }));
}

function findBand(slug: string) {
  return getPostsByWavelength().find((b) => b.wavelength === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ wavelength: string }>;
}): Promise<Metadata> {
  const { wavelength } = await params;
  const band = findBand(wavelength);
  if (!band) return {};

  const wl = wavelengths[band.wavelength];
  const description = `${wl.description} — ${band.posts.length} ${
    band.posts.length === 1 ? "post" : "posts"
  } at ${wl.nm}nm.`;

  return {
    title: `${wl.label} — ${site.name}`,
    description,
    alternates: { canonical: `/blog/wavelength/${band.wavelength}` },
    openGraph: {
      title: `${wl.label} · ${wl.nm}nm`,
      description,
      url: `/blog/wavelength/${band.wavelength}`,
    },
  };
}

export default async function WavelengthPage({
  params,
}: {
  params: Promise<{ wavelength: string }>;
}) {
  const { wavelength } = await params;
  const band = findBand(wavelength);
  if (!band) notFound();

  const wl = wavelengths[band.wavelength];

  return (
    <PageShell mainClassName={`${CONTAINER} py-16`}>
      <SectionLabel as="p" style={{ color: wl.hex }}>
        {wl.nm}nm
      </SectionLabel>
      <h1 className="mt-3 font-display text-[32px] font-medium tracking-tight text-paper">
        {wl.label}
      </h1>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">{wl.description}.</p>

      <div className="mt-8">
        <WavelengthChips active={band.wavelength as Wavelength} />
      </div>

      <div className="mt-10 divide-y divide-hairline border-t border-hairline">
        {band.posts.map((post) => (
          <PostCard key={post.slug} post={post} showWavelength={false} />
        ))}
      </div>
    </PageShell>
  );
}
