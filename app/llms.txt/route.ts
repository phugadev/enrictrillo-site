import { getAllPosts, getAllSeries, getPostsByTopic } from "@/lib/posts";
import { getAllCaseStudies } from "@/lib/work";
import { credentials, projects, site, topics } from "@/lib/site";

export const dynamic = "force-static";

const LINK_LABELS = { live: "Live", repo: "Source", npm: "npm" } as const;

/** The HTML pages pluralise properly; "post(s)" here read as machine-generated. */
const plural = (n: number, word: string) => `${n} ${n === 1 ? word : `${word}s`}`;

/**
 * /llms.txt — the llmstxt.org convention: a curated markdown map of the site
 * for language models reading it, in place of them scraping rendered HTML.
 *
 * Generated from the same source as every other page, so it can't drift out
 * of date the way a hand-written one would. If someone asks an assistant
 * "who is Enric Trillo", this is what that assistant should find.
 */
export function GET() {
  const posts = getAllPosts();
  const groups = getPostsByTopic();
  const series = getAllSeries();
  const caseStudies = getAllCaseStudies();
  const { availability } = site;

  const lines: string[] = [
    `# ${site.name}`,
    "",
    // site.tagline already opens with the role, so don't restate it here.
    `> ${site.tagline} Based in ${site.location}, working through ${site.company}.`,
    "",
    availability.open
      ? `Available for ${availability.contracts}, working ${availability.mode}, with ${availability.notice}. Contact: ${site.email}`
      : `Not currently taking new contracts. Contact: ${site.email}`,
    "",
    "Work and writing are both filed by a four-group \"topic\" taxonomy:",
    "",
    ...Object.values(topics).map((wl) => `- **${wl.label}** — ${wl.description}`),
    "",
  ];

  if (projects.length > 0) {
    lines.push("## Selected work", "");
    for (const project of projects) {
      const primary = project.links?.live ?? project.links?.repo ?? project.links?.npm;
      const title = primary ? `[${project.name}](${primary})` : project.name;
      const stack = project.stack?.length ? ` Stack: ${project.stack.join(", ")}.` : "";
      const metrics = project.metrics?.length ? ` ${project.metrics.join(". ")}.` : "";
      // Every link, not just the primary — an assistant answering "where can I
      // see his code" should get the repo even when the live site is listed.
      const links = Object.entries(project.links ?? {})
        .map(([kind, url]) => `${LINK_LABELS[kind as keyof typeof LINK_LABELS]}: ${url}`)
        .join(", ");

      lines.push(
        `- ${title}: ${project.description} ${project.status}, ${project.year}. ${topics[project.topic].label}.${stack}${metrics}${links ? ` Links — ${links}.` : ""}`,
      );
    }
    lines.push("");
  }

  if (caseStudies.length > 0) {
    lines.push("## Case studies", "");
    for (const study of caseStudies) {
      const stack = study.stack?.length ? ` Stack: ${study.stack.join(", ")}.` : "";
      const links = Object.entries(study.links ?? {})
        .map(([kind, url]) => `${LINK_LABELS[kind as keyof typeof LINK_LABELS]}: ${url}`)
        .join(", ");

      lines.push(
        `- [${study.title}](${site.url}/work/${study.slug}): ${study.excerpt} ${topics[study.topic].label}, ${study.year}.${stack}${links ? ` Links — ${links}.` : ""}`,
      );
    }
    lines.push("");
  }

  if (credentials.length > 0) {
    lines.push("## Certifications", "");
    for (const c of credentials) lines.push(`- ${c.name} — ${c.issuer}, earned ${c.earned}`);
    lines.push("");
  }

  lines.push("## Writing", "");
  if (posts.length === 0) {
    lines.push("No posts published yet.", "");
  } else {
    for (const post of posts) {
      lines.push(`- [${post.title}](${site.url}/blog/${post.slug}): ${post.excerpt} (${post.date})`);
    }
    lines.push("");
  }

  if (groups.length > 0) {
    lines.push("## Writing by topic", "");
    for (const group of groups) {
      const wl = topics[group.topic];
      lines.push(
        `- [${wl.label}](${site.url}/blog/topic/${group.topic}): ${wl.description}. ${plural(group.posts.length, "post")}.`,
      );
    }
    lines.push("");
  }

  if (series.length > 0) {
    lines.push("## Series", "");
    for (const s of series) {
      lines.push(
        `- [${s.name}](${site.url}/blog/series/${s.slug}): ${plural(s.posts.length, "post")} in this series.`,
      );
    }
    lines.push("");
  }

  lines.push(
    "## Elsewhere",
    "",
    `- [GitHub](${site.social.github})`,
    `- [LinkedIn](${site.social.linkedin})`,
    `- [RSS feed](${site.url}/feed.xml)`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
