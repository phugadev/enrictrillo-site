"use client";

import { useEffect, useRef } from "react";
import { bandGradient } from "@/lib/site";

/**
 * DESIGN TRIAL — see PR description. Easy to revert: drop the import and
 * `<ScrollProgress />` line in PageShell.tsx and delete this file.
 *
 * A thin reading-progress bar fixed to the very top of the viewport, filled
 * with the same spectrum gradient as the Spectrometer panel further down
 * the page — the site's own "sweep" motif (see the `animate-scan` line on
 * that panel) extended across the whole scroll instead of a generic bar in
 * an arbitrary accent colour.
 *
 * Reads scroll position into a ref and writes the transform directly to the
 * DOM node rather than through React state, so the ~60 updates/second while
 * scrolling never trigger a re-render — only a single style write per frame,
 * throttled to one per animation frame regardless of how many scroll events
 * fire in between.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const clamped = Math.min(1, Math.max(0, progress));
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${clamped})`;
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-30 h-[2px]" aria-hidden="true">
      <div
        ref={barRef}
        className="h-full w-full origin-left motion-reduce:hidden"
        style={{ background: bandGradient, transform: "scaleX(0)" }}
      />
    </div>
  );
}
