import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { site } from "@/lib/site";

/**
 * Two families only — Space Grotesk carries both display and body copy, mono
 * carries metadata. Omitting `weight` pulls the variable font, which covers
 * the whole range in one file per style; fixed-weight axes meant prose
 * headings (700) had no real cut and were being synthetically bolded.
 */
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
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
    <html lang="en-GB" className={`${display.variable} ${mono.variable}`}>
      {/*
        suppressHydrationWarning covers only <body>'s own attributes, not its
        children — browser extensions (Bitdefender's `bis_register`, password
        managers, etc.) inject attributes here before React hydrates, which
        otherwise throws a hydration mismatch on every page load in dev. Real
        mismatches inside the tree still surface normally.
      */}
      <body className="bg-ink font-body text-paper antialiased" suppressHydrationWarning>
        {children}
        {/*
          Cookieless and GDPR-friendly by default — no consent banner needed.
          Only sends events from the deployed site; local dev is a no-op.
        */}
        <Analytics />
      </body>
    </html>
  );
}
