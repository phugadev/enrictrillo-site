import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { JsonLd, personSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";

/**
 * Space Grotesk carries display only. Set against Inter and Geist at headline
 * size it's the one that reads as authored rather than as the category
 * default, which is worth keeping for the first thing a reader sees — but its
 * personality works against a paragraph, and it's noticeably wider.
 *
 * Inter carries body copy: denser, more neutral, and it gets out of the way.
 * Mono carries metadata. Omitting `weight` pulls the variable font, which
 * covers the whole range in one file per style; fixed-weight axes meant prose
 * headings (700) had no real cut and were being synthetically bolded.
 *
 * Prose keeps Newsreader — see app/blog/[slug]/layout.tsx.
 */
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/**
 * Pinned to 400, unlike the other two. Body copy is the one face that never
 * changes weight here — every `font-medium` in the codebase sits on
 * `font-display`, and the only bold or italic text is inside prose, which is
 * Newsreader. Shipping Inter's full 100–900 variable axis for a single weight
 * cost 47 KB against 15 KB for the static cut.
 *
 * If you ever put a <strong> or a `font-semibold` on body copy, add the weight
 * here — otherwise the browser will synthesise it.
 */
const body = Inter({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-body",
  display: "swap",
});

/**
 * IBM Plex Mono over JetBrains Mono. Mono here is almost entirely metadata —
 * uppercase, tracked, at 11px — and Plex is the more humanist face at that
 * size. JetBrains is tuned for 14px code, which this site only reaches inside
 * post code blocks.
 *
 * Plex is not variable, so the weights used have to be listed.
 */
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.tagline,
  metadataBase: new URL(site.url),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${site.url}/feed.xml`,
      // Points agents at the curated markdown map rather than the rendered DOM.
      "text/plain": `${site.url}/llms.txt`,
    },
  },
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    type: "website",
    url: site.url,
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      // The site is dark-only, so it runs the luminous exposure of @ruskel/tokens.
      data-exposure="luminous"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      {/*
        suppressHydrationWarning covers only <body>'s own attributes, not its
        children — browser extensions (Bitdefender's `bis_register`, password
        managers, etc.) inject attributes here before React hydrates, which
        otherwise throws a hydration mismatch on every page load in dev. Real
        mismatches inside the tree still surface normally.
      */}
      <body className="bg-ink font-body text-paper antialiased" suppressHydrationWarning>
        {children}
        {/* Entity data for search and assistants — see lib/schema.tsx */}
        <JsonLd data={personSchema()} />
        <JsonLd data={websiteSchema()} />
        {/*
          Cookieless and GDPR-friendly by default — no consent banner needed.
          Only sends events from the deployed site; local dev is a no-op.
        */}
        <Analytics />
      </body>
    </html>
  );
}
