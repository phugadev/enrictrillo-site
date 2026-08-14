"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * DESIGN TRIAL — see PR description. Easy to revert: unwrap the sections in
 * app/page.tsx and delete this file.
 *
 * Fades and lifts a section into place the first time it crosses into the
 * viewport, instead of the whole page popping in flat on load. Unobserves
 * itself after the first reveal, so scrolling back past a section doesn't
 * replay the animation every time.
 *
 * Not used on the hero or Spectrometer — both are visible on initial paint,
 * and wrapping above-the-fold content in this would mean a flash of hidden
 * content before the observer's first callback rather than a smoother load.
 *
 * `motion-reduce:` handles reduced-motion preferences at the CSS layer
 * rather than branching in JS — the observer still fires, the transition
 * and initial offset are simply removed.
 */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      } ${className}`}
    >
      {children}
    </div>
  );
}
