import { useRef, useState } from "react";
import { featured } from "../data/site";
import { gsap, useGsap } from "../lib/motion";
import { Icon, Lines, OrderButton } from "./ui";

const TONES = {
  orange: { bg: "bg-shack-hot", text: "text-cream", accent: "text-coal", frame: "bg-coal" },
  cream: { bg: "bg-cream", text: "text-coal", accent: "text-shack-hot", frame: "bg-shack" },
  coal: { bg: "bg-coal-soft", text: "text-cream", accent: "text-shack-hot", frame: "bg-shack" },
  yellow: { bg: "bg-mustard", text: "text-coal", accent: "text-ketchup", frame: "bg-shack-hot" },
};

export default function Featured() {
  const root = useRef(null);
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  useGsap(root, ({ reduce }) => {
    const q = gsap.utils.selector(root);
    const track = trackRef.current;

    gsap.from(q("[data-feat-head] .line-mask > span"), {
      yPercent: 110,
      stagger: 0.1,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
    });

    if (reduce) return;
    const mm = gsap.matchMedia();
    // Escritorio con puntero fino: scroll horizontal fijado
    mm.add("(min-width: 1024px) and (pointer: fine)", () => {
      track.dataset.mode = "pin";
      const panels = q("[data-feat]");
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: q("[data-feat-pin]")[0],
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setIndex(Math.round(self.progress * (panels.length - 1))),
        },
      });
      panels.forEach((panel) => {
        const img = panel.querySelector("[data-feat-img]");
        const frame = panel.querySelector("[data-feat-frame]");
        gsap.fromTo(frame, { clipPath: "inset(18% 12% 18% 12% round 40px)" }, {
          clipPath: "inset(0% 0% 0% 0% round 40px)",
          ease: "none",
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 95%", end: "left 35%", scrub: true },
        });
        gsap.fromTo(img, { scale: 1.3, xPercent: 8 }, {
          scale: 1,
          xPercent: -4,
          ease: "none",
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
        });
        gsap.from(panel.querySelectorAll(".line-mask > span"), {
          yPercent: 110,
          stagger: 0.08,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 70%", toggleActions: "play none none reverse" },
        });
      });
      return () => {
        delete track.dataset.mode;
      };
    });
    // Táctil / pantallas medianas: carrusel nativo con revelado por tarjeta
    mm.add("(max-width: 1023px), (pointer: coarse)", () => {
      gsap.from(q("[data-feat]"), {
        y: 50,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: { trigger: track, start: "top 85%", once: true },
      });
    });
  });

  const go = (dir) => {
    const track = trackRef.current;
    if (track.dataset.mode === "pin") return;
    const card = track.querySelector("[data-feat]");
    const step = card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };
  const onScroll = () => {
    const track = trackRef.current;
    if (track.dataset.mode === "pin") return;
    const card = track.querySelector("[data-feat]");
    if (!card) return;
    setIndex(Math.round(track.scrollLeft / (card.offsetWidth + 16)));
  };

  return (
    <section id="destacados" ref={root} aria-labelledby="feat-title" className="relative bg-coal">
      <div data-feat-pin className="relative overflow-hidden py-20 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0">
        <div data-feat-head className="mx-auto flex w-full max-w-[1400px] flex-wrap items-end justify-between gap-6 px-4 sm:px-8 lg:absolute lg:inset-x-0 lg:top-[6.5rem] lg:z-10 lg:pointer-events-none">
          <div>
            <p className="eyebrow text-shack">Destacados</p>
            <h2 id="feat-title" className="display mt-3 text-[clamp(2.8rem,6vw,5.4rem)] text-cream lg:text-[clamp(2.2rem,3.4vw,3.4rem)]">
              <Lines lines={["Antojos", "en grande."]} lineClass={["", "text-shack-hot"]} />
            </h2>
          </div>
          <div className="flex items-center gap-4 text-cream lg:pointer-events-auto">
            <span className="display text-2xl tabular-nums" aria-live="polite">
              {String(index + 1).padStart(2, "0")}
              <span className="text-cream/35"> / {String(featured.length).padStart(2, "0")}</span>
            </span>
            <div className="flex gap-2 lg:[@media(pointer:fine)]:hidden">
              <button type="button" onClick={() => go(-1)} aria-label="Anterior" className="grid size-12 place-items-center rounded-full border-2 border-cream/30 transition hover:bg-cream hover:text-coal">
                <Icon.Arrow className="rotate-180" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Siguiente" className="grid size-12 place-items-center rounded-full border-2 border-cream/30 transition hover:bg-cream hover:text-coal">
                <Icon.Arrow />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={trackRef}
          onScroll={onScroll}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 sm:scroll-px-8 sm:px-8 data-[mode=pin]:mt-0 data-[mode=pin]:snap-none data-[mode=pin]:overflow-visible data-[mode=pin]:pt-[15.5rem] data-[mode=pin]:pb-10 data-[mode=pin]:will-change-transform"
          aria-roledescription="carrusel"
          aria-label="Productos destacados"
        >
          {featured.map((f, i) => {
            const t = TONES[f.tone];
            return (
              <article
                key={f.id}
                data-feat
                aria-roledescription="diapositiva"
                aria-label={`${i + 1} de ${featured.length}`}
                className={`${t.bg} ${t.text} relative grid w-[86vw] shrink-0 snap-start overflow-hidden rounded-[32px] p-6 sm:w-[70vw] sm:p-10 lg:h-[calc(100svh-18rem)] lg:min-h-[460px] lg:w-[78vw] lg:grid-cols-12 lg:items-center lg:gap-8 lg:p-14`}
              >
                <div className="relative z-10 lg:col-span-5">
                  <p className="eyebrow opacity-70">{f.kicker}</p>
                  <h3 className="display mt-3 text-[clamp(2.8rem,9vw,4.6rem)] lg:text-[clamp(3.4rem,6.2vw,7.4rem)]">
                    <Lines lines={f.title} lineClass={["", t.accent]} />
                  </h3>
                  <div className="mt-6 hidden lg:block">
                    <OrderButton className={`btn ${f.tone === "coal" || f.tone === "orange" ? "btn-light" : "btn-dark"}`} />
                  </div>
                </div>
                <div data-feat-frame className={`relative mt-6 aspect-[5/4] overflow-hidden rounded-[28px] ${t.frame} lg:col-span-7 lg:mt-0 lg:aspect-auto lg:h-full`}>
                  <img data-feat-img src={f.image} alt={f.alt} width="900" height="900" loading="lazy" decoding="async" className="size-full object-cover" />
                </div>
                <span aria-hidden="true" className="display pointer-events-none absolute -bottom-6 -left-2 text-[9rem] leading-none opacity-10 lg:text-[14rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
