import { compile } from "@mdx-js/mdx";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import smartypants from "remark-smartypants";

export type Heading = {
  /** The `id` rehype-slug will put on the rendered heading — the anchor target. */
  id: string;
  /** Plain text of the heading, with any inline markup flattened away. */
  text: string;
  /** 2 or 3. Deeper levels are ignored — see EXTRACTED_LEVELS. */
  depth: 2 | 3;
};

/**
 * h1 belongs to PostHeader, not the body, and h4 and below are rare enough in
 * these posts that including them would turn a calm stack of lines into a
 * ragged one. Two levels is enough structure to navigate by.
 */
const EXTRACTED_LEVELS = new Set(["h2", "h3"]);

/**
 * Headings the outline drops even though they are real h2s in the rendered
 * page. Only one so far: remark-gfm generates a "Footnotes" section whenever
 * a post uses `[^1]`, and it is machinery, not a section anyone wrote. It was
 * always in this list — as a 1px line in the old rail nobody could tell — but
 * the rail now prints every label, and an outline of the argument that ends
 * with "Footnotes" is describing the renderer rather than the post.
 *
 * Matched on the slug rather than the text: `footnote-label` is the id
 * remark-gfm gives it, and it is stable in a way the visible string is not.
 */
const GENERATED_IDS = new Set(["footnote-label"]);

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function textOf(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  if (!node.children) return "";
  return node.children.map(textOf).join("");
}

/**
 * Extracts the h2/h3 outline of a post, server-side, for the margin ToC.
 *
 * This runs the post through the *same* MDX pipeline the page renders with —
 * remark-gfm, smartypants, then rehype-slug — rather than regexing `^## ` out
 * of the source. That matters because the id the ToC links to has to be
 * byte-identical to the one rehype-slug writes onto the heading, and both
 * earlier stages can change the text it slugs from: smartypants turns `--`
 * into an en dash and straight quotes into curly ones, and github-slugger
 * (inside rehype-slug) strips those two classes of character differently.
 * A hand-rolled slug would agree on today's eight posts and quietly break on
 * the first title with a dash in it.
 *
 * It costs one extra MDX compile per post. That is build-time only — every
 * post page is statically generated — and rehype-pretty-code, the expensive
 * plugin, is deliberately not in this pipeline.
 */
export async function getHeadings(source: string): Promise<Heading[]> {
  const found: Heading[] = [];

  const collect = () => (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (node.type === "element" && node.tagName && EXTRACTED_LEVELS.has(node.tagName)) {
        const id = node.properties?.id;
        const text = textOf(node).trim();
        if (typeof id === "string" && text && !GENERATED_IDS.has(id)) {
          found.push({ id, text, depth: node.tagName === "h2" ? 2 : 3 });
        }
        return;
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };

  await compile(source, {
    remarkPlugins: [remarkGfm, smartypants],
    rehypePlugins: [rehypeSlug, collect],
  });

  return found;
}
