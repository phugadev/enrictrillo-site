import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { JsonLd, personSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";

/**
 * Three faces, one per voice. Minima's reading register is the sans and its
 * signal and figure registers are the mono; the serif is this site's own.
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
  // 500 is the medium behind font-medium (list titles, table headers); 600 is
  // Minima's prose <strong>. Inter is variable, so all three are one file —
  // without 600 listed, the browser thickened the 500 instead.
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

/**
 * Inter's real italic, for prose <em> only (app/globals.css). A separate
 * instance so it can skip preloading: in the one above it was a 50 KB file
 * preloaded on every page, the home page included, which has no italics.
 * Unpreloaded, the browser fetches it only when a page actually sets italic
 * text in this family.
 */
const bodyItalic = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["italic"],
  variable: "--font-body-italic",
  display: "swap",
  preload: false,
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
  variable: "--font-mono-face",
  display: "swap",
});

/**
 * Plex's real italic, for comments in code blocks (app/globals.css). Like the
 * Inter italic, unpreloaded: only a page with a commented code block pays for it.
 */
const monoItalic = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-mono-italic",
  display: "swap",
  preload: false,
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

export const viewport: Viewport = {
  // Minima's canvas in each mode, so the browser chrome matches the page.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f8f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light dark",
};

/*
 * Minima keys dark mode off a `.dark` class on the root. The site follows the
 * reader's OS setting: the class is set from prefers-color-scheme before first
 * paint — inline in the head, so there is no flash of the wrong mode — and
 * kept in step if the setting changes while the page is open.
 */
const followSystemTheme = `(() => {
  const q = matchMedia("(prefers-color-scheme: dark)");
  const apply = () => document.documentElement.classList.toggle("dark", q.matches);
  apply();
  q.addEventListener("change", apply);
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${body.variable} ${bodyItalic.variable} ${mono.variable} ${monoItalic.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: followSystemTheme }} />
      </head>
      {/*
        suppressHydrationWarning covers only <body>'s own attributes, not its
        children — browser extensions (Bitdefender's `bis_register`, password
        managers, etc.) inject attributes here before React hydrates, which
        otherwise throws a hydration mismatch on every page load in dev. Real
        mismatches inside the tree still surface normally.
      */}
      <body className="bg-background font-sans text-foreground antialiased" suppressHydrationWarning>
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
