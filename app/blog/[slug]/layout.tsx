import { Instrument_Serif, Newsreader } from "next/font/google";

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

/**
 * The authorship display face, per @ruskel/tokens: serif marks a person
 * speaking, as distinct from the interface (sans) or the machine (mono).
 * Loaded here with the reading face so only post pages pay for it.
 *
 * Display only — Instrument Serif is high-contrast and loses its footing
 * under about 24px, which is why prose body stays on Newsreader.
 */
const authored = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-voice is what unlocks the serif; it is independent of exposure, so
    // this works on the site's dark ground exactly as it would on paper.
    <div className={`${reading.variable} ${authored.variable}`} data-voice="author">
      {children}
    </div>
  );
}
