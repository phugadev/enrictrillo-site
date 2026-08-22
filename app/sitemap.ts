import type { MetadataRoute } from "next";
import { getAllPosts, getAllSeries, getPostsByWavelength } from "@/lib/posts";
import { getAllCaseStudies } from "@/lib/work";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const caseStudies = getAllCaseStudies();
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
    {
      url: `${site.url}/work`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // /system is a real page about real work, unlike /lab — it belongs in
    // here. Its lastModified is genuinely "whenever the package moved", and
    // the package version is what the page prints, so "now" is honest enough.
    {
      url: `${site.url}/system`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
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
    // Case studies only carry a `year`, not a precise date, so there's no
    // finer lastModified to give them than "now".
    ...caseStudies.map((study) => ({
      url: `${site.url}/work/${study.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
