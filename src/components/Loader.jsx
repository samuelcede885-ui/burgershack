import { useRef, useState } from "react";
import { site } from "../data/site";
import { gsap, useIsoLayoutEffect, prefersReducedMotion, getLenis } from "../lib/motion";

/** Cortina inicial: espera a la foto principal (máx. ~1.6 s) y se retira. */
export default function Loader() {
  const ref = useRef(null);
  const [gone, setGone] = useState(false);

  useIsoLayoutEffect(() => {
    const finish = () => {
      window.__shackIntroDone = true;
      window.dispatchEvent(new Event("shack:intro"));
    };
    if (prefersReducedMotion()) {
      setGone(true);
      finish();
      return;
    }
    getLenis()?.stop();
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.from("[data-loader-logo]", { yPercent: 40, autoAlpha: 0, duration: 0.8, ease: "power4.out" });
      gsap.fromTo("[data-loader-bar]", { scaleX: 0 }, { scaleX: 0.7, duration: 1.2, ease: "power2.out" });
    }, el);

    const img = new Image();
    img.src = "/images/hq/burger-bacon.webp";
    const ready = Promise.race([
      Promise.all([img.decode().catch(() => {}), document.fonts?.ready]),
      new Promise((r) => setTimeout(r, 1600)),
    ]);
    const minTime = new Promise((r) => setTimeout(r, 900));

    let cancelled = false;
    Promise.all([ready, minTime]).then(() => {
      if (cancelled) return;
      ctx.add(() => {
        gsap
          .timeline({
            onComplete: () => {
              getLenis()?.start();
              setGone(true);
            },
          })
          .to("[data-loader-bar]", { scaleX: 1, duration: 0.35, ease: "power2.inOut" })
          .to("[data-loader-logo]", { yPercent: -30, autoAlpha: 0, duration: 0.45, ease: "power3.in" }, "+=0.05")
          .add(finish, "-=0.1")
          .to(el, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "<");
      });
    });
    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={ref} className="fixed inset-0 z-[200] grid place-items-center bg-shack-hot" role="status" aria-label="Cargando Burger Shack">
      <div className="flex w-[min(60vw,280px)] flex-col items-center gap-6">
        <img data-loader-logo src={site.brand.logo} alt="" width="1029" height="501" className="w-full" />
        <span className="block h-1 w-full overflow-hidden rounded-full bg-coal/20">
          <span data-loader-bar className="block h-full origin-left rounded-full bg-cream" />
        </span>
      </div>
    </div>
  );
}
