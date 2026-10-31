import { useRef } from "react";
import { site } from "../data/site";
import { useOrder } from "../lib/order";
import { gsap, useGsap } from "../lib/motion";
import { Icon, Lines, Pending } from "./ui";

export default function Catering() {
  const root = useRef(null);
  const { open } = useOrder();

  useGsap(root, ({ reduce }) => {
    if (reduce) return;
    const q = gsap.utils.selector(root);
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
    tl.from(q("h2 .line-mask > span"), { yPercent: 110, stagger: 0.1, duration: 1, ease: "power4.out" })
      .from(q("[data-cat-copy] > *"), { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.8 }, 0.35)
      .from(q("[data-cat-photo]"), { clipPath: "inset(100% 0 0 0 round 32px)", duration: 1.2, ease: "power4.out" }, 0.1)
      .from(q("[data-cat-photo] img"), { scale: 1.2, duration: 1.4, ease: "power4.out" }, 0.1);
    gsap.to(q("[data-cat-mascot]"), {
      yPercent: -18,
      rotate: 6,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1.2 },
    });
  });

  return (
    <section id="catering" ref={root} aria-labelledby="catering-title" className="grain relative overflow-hidden bg-shack-hot py-24 text-cream sm:py-32">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow text-coal">Catering by Burger Shack</p>
          <h2 id="catering-title" className="display mt-3 text-[clamp(3.2rem,8.4vw,8.6rem)]">
            <Lines lines={["Llevamos", "el Shack a", "tu evento."]} lineClass={["", "", "text-coal"]} />
          </h2>
          <div data-cat-copy className="mt-8 max-w-lg space-y-6">
            <p className="text-lg leading-relaxed text-cream/90">
              Llevamos la experiencia Shack a tus eventos, reuniones y celebraciones: hamburguesas, papas y buena vibra donde estés.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => (site.catering.contactUrl ? window.open(site.catering.contactUrl, "_blank", "noopener") : open({ mode: "catering" }))}
                aria-haspopup="dialog"
              >
                Solicitar catering <Icon.Arrow className="arrow" />
              </button>
              <span className="text-cream">
                <Pending>Paquetes y tarifas por confirmar</Pending>
              </span>
            </div>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <figure data-cat-photo className="relative mx-auto aspect-[4/5] max-w-[480px] overflow-hidden rounded-[32px] border-4 border-coal bg-coal">
            <img src="/images/hq/nuggets.webp" alt="Nuggets crujientes con salsa para compartir" width="1122" height="1402" loading="lazy" decoding="async" className="size-full object-cover" />
          </figure>
          <img data-cat-mascot src="/images/photos/g-mascot.webp" alt="" aria-hidden="true" width="700" height="843" loading="lazy" className="absolute -bottom-10 -right-2 w-32 rotate-[6deg] sm:w-40 lg:-right-10 rounded-3xl border-4 border-coal shadow-[6px_6px_0_var(--color-coal)]" />
        </div>
      </div>
    </section>
  );
}
