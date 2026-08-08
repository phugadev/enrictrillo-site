import { Newsreader } from "next/font/google";

/**
 * The reading face is loaded here rather than in the root layout so only post
 * pages pay for it. Homepage, blog index and series pages stay on the two-font
 * setup (~64 KB); someone who has clicked into an article has committed to
 * reading, which is when a proper reading face earns its bytes.
 *
 * Space Grotesk has no italic cut, so <em> in prose would otherwise be a
 * browser-synthesised oblique. Newsreader brings a real one.
 */
const reading = Newsreader({
  subsets: ["latin"],
  variable: "--font-reading",
  style: ["normal", "italic"],
  display: "swap",
});

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return <div className={reading.variable}>{children}</div>;
}
