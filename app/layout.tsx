import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { JsonLd, personSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";

/**
 * Three faces, one per register — see @ruskel/tokens.
 *
 *   sans   Inter            the system speaking: nav, labels, headings, body
 *   mono   IBM Plex Mono    the machine stating: figures, states, nm, code
 *   serif  Instrument Serif a person speaking: article headlines (post routes)
 *
 * Space Grotesk and Newsreader are gone. Space Grotesk was a fourth display
 * face doing a job the register model assigns to the sans, and Newsreader put
 * long-form body on a serif — which read as the whole article being "authored"
 * rather than just its headline. One variable axis of Inter covers display and
 * body, so the site now ships three faces instead of five.
 */
const body = Inter({
  subsets: ["latin"],
  // Display sizes need a real medium cut now that Inter carries headings too;
  // without it the browser synthesises one.
  weight: ["400", "500"],
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
      className={`${body.variable} ${mono.variable}`}
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
