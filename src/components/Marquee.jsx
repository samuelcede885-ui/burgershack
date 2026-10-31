import { useRef } from "react";
import { gsap, useGsap } from "../lib/motion";
import { Icon } from "./ui";

/** Cinta tipográfica que avanza con el scroll (no se mueve sola). */
export default function Marquee({ words, tone = "orange", reverse = false, tilt = -2 }) {
  const root = useRef(null);
  useGsap(root, ({ reduce }) => {
    if (reduce) return;
    gsap.fromTo(
      "[data-track]",
      { xPercent: reverse ? -25 : 0 },
      {
        xPercent: reverse ? 0 : -25,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
      }
    );
  });
  const tones = {
    orange: "bg-shack-hot text-cream",
    yellow: "bg-mustard text-coal",
    coal: "bg-coal text-cream",
  };
  const row = [...words, ...words, ...words, ...words];
  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none relative z-20 -my-12 overflow-hidden py-12">
      <div className={`${tones[tone]} -mx-[3vw] py-3 sm:py-4`} style={{ transform: `rotate(${tilt}deg)` }}>
        <div data-track className="flex w-max items-center gap-8 overflow-hidden whitespace-nowrap will-change-transform">
          {row.map((w, i) => (
            <span key={i} className="flex items-center gap-8">
              <span className="display text-[clamp(1.8rem,4.2vw,3.6rem)] leading-none">{w}</span>
              <Icon.Star className="size-6 shrink-0 sm:size-8" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
