import { useRef } from "react";
import { gsap, useGsap, isCoarsePointer } from "../lib/motion";
import { AnchorLink, Icon, Lines, OrderButton } from "./ui";

export default function Hero() {
  const root = useRef(null);

  useGsap(root, ({ reduce }) => {
    const q = gsap.utils.selector(root);
    if (reduce) return;

    // Entrada cinematográfica (pausada hasta que termina el loader)
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
    tl.from(q("[data-hero-glow]"), { autoAlpha: 0, scale: 0.7, duration: 1.6 }, 0)
      .from(q("[data-hero-frame]"), { clipPath: "inset(100% 0% 0% 0% round 999px 999px 36px 36px)", duration: 1.3 }, 0.05)
      .from(q("[data-hero-photo]"), { scale: 1.25, duration: 1.8, ease: "expo.out" }, 0.05)
      .from(q("h1 .line-mask > span"), { yPercent: 115, duration: 1.1, stagger: 0.1 }, 0.2)
      .from(q("[data-hero-float]"), { y: 60, autoAlpha: 0, rotate: (i) => (i % 2 ? 18 : -18), duration: 1.2, stagger: 0.08 }, 0.55)
      .from(q("[data-hero-copy]"), { y: 24, autoAlpha: 0, duration: 0.9 }, 0.6)
      .from(q("[data-hero-cta] > *"), { y: 26, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, 0.72)
      .from(q("[data-hero-meta]"), { autoAlpha: 0, duration: 0.8 }, 0.9);

    const play = () => tl.play();
    if (window.__shackIntroDone) play();
    else window.addEventListener("shack:intro", play, { once: true });
    const offIntro = () => window.removeEventListener("shack:intro", play);

    // Salida con scroll
    gsap.to(q("[data-hero-art]"), {
      yPercent: 14,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 },
    });
    gsap.to(q("[data-hero-text]"), {
      y: -80,
      autoAlpha: 0.2,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "20% top", end: "bottom top", scrub: 1 },
    });
    gsap.to(q("[data-hero-badge]"), {
      rotate: 200,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1.2 },
    });

    // Inclinación 3D con el puntero (solo puntero fino)
    if (!isCoarsePointer()) {
      const card = q("[data-hero-tilt]")[0];
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.9, ease: "power3.out" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.9, ease: "power3.out" });
      const floats = q("[data-hero-float]").map((el, i) => ({
        x: gsap.quickTo(el, "x", { duration: 1, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 1, ease: "power3.out" }),
        d: [0.035, -0.05, 0.06][i % 3],
      }));
      const move = (e) => {
        const r = root.current.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        ry(nx * 9);
        rx(-ny * 7);
        floats.forEach((f) => {
          f.x(nx * r.width * f.d);
          f.y(ny * r.height * f.d);
        });
      };
      const el = root.current;
      el.addEventListener("pointermove", move);
      return () => {
        offIntro();
        el.removeEventListener("pointermove", move);
      };
    }
    return offIntro;
  });

  return (
    <section id="inicio" ref={root} className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-coal pt-24 pb-16 lg:pt-28">
      {/* luz cálida de fondo */}
      <div data-hero-glow aria-hidden="true" className="pointer-events-none absolute right-[-20%] top-[5%] -z-10 size-[110vw] rounded-full bg-[radial-gradient(closest-side,rgba(244,90,27,0.55),rgba(232,112,43,0.18)_55%,transparent)] lg:right-[-8%] lg:size-[70vw]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-coal to-transparent" />

      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:gap-6">
        <div data-hero-text className="relative z-10 lg:col-span-6">
          <p data-hero-meta className="mb-6 flex flex-wrap items-center gap-3">
            <span className="sticker">Hamburguesas · Papas · Shakes</span>
            <span className="eyebrow text-cream/60">Caracas, Venezuela</span>
          </p>
          <h1 className="display">
            <Lines
              lines={["Nunca es", "suficiente", "Shack."]}
              className="block"
              lineClass={[
                "text-[clamp(3.1rem,8.2vw,7.6rem)] text-cream",
                "text-[clamp(3.1rem,8.2vw,7.6rem)] text-cream",
                "text-[clamp(6rem,17.5vw,16rem)] text-shack-hot -mt-[0.04em]",
              ]}
            />
          </h1>
          <p data-hero-copy className="mt-6 max-w-md text-lg leading-relaxed text-cream/80 sm:text-xl">
            Hamburguesas, papas, shakes y más. Una experiencia que siempre sabe mejor.
          </p>
          <div data-hero-cta className="mt-8 flex flex-wrap items-center gap-3">
            <OrderButton magnet />
            <AnchorLink href="#menu" className="btn btn-ghost text-cream" magnet>
              Ver menú <Icon.Arrow className="arrow" />
            </AnchorLink>
          </div>
        </div>

        <div data-hero-art className="relative lg:col-span-6" style={{ perspective: "1200px" }}>
          <div data-hero-tilt className="relative mx-auto w-full max-w-[560px]" style={{ transformStyle: "preserve-3d" }}>
            <div
              data-hero-frame
              className="relative aspect-[4/4.4] overflow-hidden bg-shack shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)]"
              style={{ borderRadius: "999px 999px 36px 36px", clipPath: "inset(0% 0% 0% 0% round 999px 999px 36px 36px)" }}
            >
              <img
                data-hero-photo
                src="/images/hq/burger-bacon.webp"
                alt="Hamburguesa doble con tocineta, queso cheddar fundido y salsa"
                width="1122"
                height="1402"
                fetchpriority="high"
                className="absolute inset-0 size-full object-cover"
                style={{ objectPosition: "50% 62%" }}
              />
            </div>
            <div data-hero-badge className="absolute -left-[4%] top-[4%] grid size-[24%] max-w-[150px] place-items-center text-mustard">
              <Icon.Burst className="absolute inset-0 size-full" />
              <span className="display relative rotate-[-10deg] text-center text-[clamp(0.9rem,2vw,1.5rem)] leading-[0.9] text-coal">
                Good
                <br />
                vibes
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnchorLink href="#ingredientes" data-hero-meta className="group absolute bottom-6 left-4 hidden items-center gap-3 text-cream/70 sm:left-8 sm:flex" aria-label="Desplázate para explorar">
        <span className="relative block h-12 w-[2px] overflow-hidden rounded bg-cream/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_cubic-bezier(.16,1,.3,1)_infinite] bg-shack" />
        </span>
        <span className="eyebrow leading-tight">
          Scroll
          <br />
          para explorar
        </span>
      </AnchorLink>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
