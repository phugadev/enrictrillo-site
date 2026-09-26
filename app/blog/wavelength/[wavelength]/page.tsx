import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { WavelengthChips } from "@/components/WavelengthChips";
import { Eyebrow, PAGE, PageHeader } from "@/components/layout";
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
    // No `images` here on purpose — the co-located opengraph-image.tsx supplies
    // the card (and the twitter:image with it). siteName is restated because a
    // child openGraph block replaces the root layout's rather than merging.
    openGraph: {
      type: "website",
      title: `${wl.label} · ${wl.nm}nm`,
      description,
      url: `/blog/wavelength/${band.wavelength}`,
      siteName: site.name,
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
    <PageShell>
      <PageHeader
        eyebrow={
          <Eyebrow wavelength={band.wavelength as Wavelength}>
            {wl.nm}nm · {band.posts.length} {band.posts.length === 1 ? "post" : "posts"}
          </Eyebrow>
        }
        title={wl.label}
        lead={`${wl.description}.`}
      >
        <WavelengthChips active={band.wavelength as Wavelength} />
      </PageHeader>
      <div className={PAGE}>
        <div className="focuslist divide-y divide-border border-t border-border">
          {band.posts.map((post) => (
            <PostCard key={post.slug} post={post} showWavelength={false} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
