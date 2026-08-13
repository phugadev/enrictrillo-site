import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeUnwrapImages from "rehype-unwrap-images";
import remarkGfm from "remark-gfm";
import smartypants from "remark-smartypants";
import { visit } from "unist-util-visit";
import { mdxComponents } from "./MdxComponents";

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

/**
 * Wraps every GFM table in a scrolling div.
 *
 * `display: block; overflow-x: auto` directly on a <table> does make it
 * scroll, but it also drops the element out of table layout: the rows then
 * shrink-wrap their content, so a table in a 745px column rendered its rows at
 * 297px and every rule stopped short of the right margin. Putting the overflow
 * on a wrapper lets the table stay `display: table` and fill the column, while
 * still scrolling when it genuinely doesn't fit.
 */
function rehypeWrapTables() {
  return (tree: HastNode) => {
    visit(tree, "element", (node: HastNode, index: number | undefined, parent: HastNode | undefined) => {
      if (node.tagName !== "table" || !parent || index === undefined) return;
      // Already wrapped on a previous visit — the traversal re-enters the new
      // div's children, and without this it would nest wrappers forever.
      if (parent.tagName === "div" && parent.properties?.["data-table-wrapper"] !== undefined) return;

      parent.children![index] = {
        type: "element",
        tagName: "div",
        properties: { "data-table-wrapper": "" },
        children: [node],
      };
    });
  };
}

/**
 * Renders an MDX string as a server component.
 *
 * Uses @mdx-js/mdx directly rather than next-mdx-remote: that package resolves
 * its JSX runtime through a bundled .cjs shim (`require('react/jsx-dev-runtime')`
 * whenever NODE_ENV !== "production"), which sidesteps Next's React aliasing and
 * hands MDX a different React instance than the RSC renderer uses. The result was
 * every post page 500ing in dev with "Cannot read properties of undefined
 * (reading 'stack')" while production builds rendered fine.
 *
 * Importing the runtime here keeps it on the same React instance as the rest of
 * the tree, and `development: false` matches the non-dev runtime we import.
 */
export async function Mdx({ source }: { source: string }) {
  const { default: Content } = await evaluate(source, {
    ...runtime,
    development: false,
    remarkPlugins: [
      // Without GFM, tables render as literal pipe characters and strikethrough
      // and task lists don't parse at all.
      remarkGfm,
      // Curly quotes, real apostrophes and proper dashes. The prose face is
      // loaded specifically for typographic quality, so typewriter marks in the
      // body copy were the one place undercutting it. Skips code by design.
      smartypants,
    ],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      // keepBackground: false drops the theme's own `background-color` inline
      // style, which otherwise beat --tw-prose-pre-bg and painted every code
      // block GitHub's blue-grey #24292e — the only bluish grey on the site,
      // and a visible seam against the filename bar sitting on top of it.
      [rehypePrettyCode, { theme: "github-dark", keepBackground: false }],
      rehypeUnwrapImages,
      rehypeWrapTables,
    ],
  });

  return <Content components={mdxComponents} />;
}
