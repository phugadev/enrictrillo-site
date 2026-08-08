import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeUnwrapImages from "rehype-unwrap-images";
import { mdxComponents } from "./MdxComponents";

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
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [rehypePrettyCode, { theme: "github-dark" }],
      rehypeUnwrapImages,
    ],
  });

  return <Content components={mdxComponents} />;
}
