import { Instrument_Serif } from "next/font/google";

/**
 * The authorship display face, per @ruskel/tokens: serif marks a person
 * speaking, as distinct from the interface (sans) or the machine (mono).
 * Loaded here rather than in the root layout so only post pages pay for it.
 *
 * Display only — Instrument Serif is high-contrast and loses its footing
 * under about 24px, which is why it is the headline only and body stays
 * on the sans.
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
    <div className={authored.variable} data-voice="author">
      {children}
    </div>
  );
}
