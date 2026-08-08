import type { MetadataRoute } from "next";
import { getAllPosts, getAllSeries, getPostsByWavelength } from "@/lib/posts";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const newest = (list: { date: string }[]) =>
    list.length ? new Date(list[0].date) : new Date();

  return [
    { url: site.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    {
      url: `${site.url}/blog`,
      lastModified: newest(posts),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Band and series indexes are real, linkable pages — they belong here too.
    ...getPostsByWavelength().map((band) => ({
      url: `${site.url}/blog/wavelength/${band.wavelength}`,
      lastModified: newest(band.posts),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...getAllSeries().map((series) => ({
      url: `${site.url}/blog/series/${series.slug}`,
      lastModified: newest(series.posts),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
