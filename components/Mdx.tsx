import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import minimaDark from "@/styles/minima-syntax-dark.json";
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
 * Records how many lines a fenced block holds, on the block's own figure.
 *
 * Line numbers only earn their place once there is more than one line: on a
 * one-liner the "1" is pure decoration, a gutter that indexes nothing. But CSS
 * has no way to ask "does this element have more than one child of that kind"
 * — :has() can test for *presence*, not for a count — so the decision has to be
 * made where the tree is still a tree. rehype-pretty-code has already wrapped
 * every line in a `<span data-line>` by the time this runs, so counting them is
 * exact: it is the renderer's own idea of a line, not a guess from newlines in
 * the source (a trailing newline, a fence that ends mid-line, and a block that
 * shiki decided to split differently would all be off by one).
 *
 * The count is published as data-line-count for anything that wants the number,
 * and the boolean data-line-numbers is what the stylesheet actually keys on, so
 * the threshold lives here in prose rather than as a magic number in a selector.
 */
function rehypeCountCodeLines() {
  return (tree: HastNode) => {
    visit(tree, "element", (node: HastNode) => {
      if (node.tagName !== "figure") return;
      if (!node.properties || !("data-rehype-pretty-code-figure" in node.properties)) return;

      let lines = 0;
      visit(node, "element", (inner: HastNode) => {
        if (inner.properties && "data-line" in inner.properties) lines += 1;
      });

      node.properties["data-line-count"] = String(lines);
      if (lines > 1) node.properties["data-line-numbers"] = "true";
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
/**
 * Syntax colours from Minima's own shiki theme, generated from the same ramps
 * as every other colour on the site and installed from the registry
 * (phugadev/minima/syntax-shiki). Literal colours rather than CSS variables
 * because shiki dropped its css-variables theme from the bundle.
 */
const syntax = minimaDark as unknown as NonNullable<Options["theme"]>;

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
      [rehypePrettyCode, { theme: syntax, keepBackground: false }],
      // Must run after rehype-pretty-code — it counts the `data-line` spans
      // that plugin creates.
      rehypeCountCodeLines,
      rehypeUnwrapImages,
      rehypeWrapTables,
    ],
  });

  return <Content components={mdxComponents} />;
}
