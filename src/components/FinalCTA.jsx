import { useRef } from "react";
import { site } from "../data/site";
import { gsap, useGsap } from "../lib/motion";
import { AnchorLink, Lines, OrderButton, Pending, socialIcon } from "./ui";

export default function FinalCTA() {
  const root = useRef(null);

  useGsap(root, ({ reduce }) => {
    if (reduce) return;
    const q = gsap.utils.selector(root);
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 65%", once: true } });
    tl.from(q("h2 .line-mask > span"), { yPercent: 115, stagger: 0.1, duration: 1.1, ease: "power4.out" })
      .from(q("[data-final-cta] > *"), { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.8 }, 0.45);
    gsap.fromTo(
      q("[data-final-photo]"),
      { scale: 1.25, yPercent: -6 },
      { scale: 1.02, yPercent: 4, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: 1 } }
    );
  });

  return (
    <>
      <section id="pedir" ref={root} aria-labelledby="final-title" className="relative isolate overflow-hidden bg-coal">
        <div className="relative grid min-h-[100svh] items-end lg:grid-cols-2">
          <div className="absolute inset-0 -z-10 overflow-hidden lg:relative lg:inset-auto lg:order-2 lg:-ml-px lg:h-full">
            <img data-final-photo src="/images/hq/burger-exploded.webp" alt="Hamburguesa con todas sus capas separadas" width="1122" height="1402" loading="lazy" decoding="async" className="size-full object-cover" style={{ objectPosition: "50% 45%" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/60 to-coal/10 lg:hidden" />
          </div>
          <div className="px-4 pb-16 pt-40 sm:px-8 lg:order-1 lg:self-center lg:py-24 lg:pl-[max(2rem,calc((100vw-1400px)/2+2rem))]">
            <img src={site.brand.logo} alt="Burger Shack" width="1029" height="501" loading="lazy" className="mb-8 w-28" />
            <h2 id="final-title" className="display text-[clamp(4.2rem,12vw,11rem)] text-cream">
              <Lines lines={["Good", "burgers.", "Good", "vibes."]} lineClass={["", "", "text-shack-hot", "text-shack-hot"]} />
            </h2>
            <div data-final-cta className="mt-10 flex flex-wrap items-center gap-4">
              <OrderButton magnet className="btn btn-primary !px-8 !py-4 text-lg" />
              <AnchorLink href="#locales" className="btn btn-ghost text-cream">
                Encuentra tu Shack
              </AnchorLink>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-shack-hot text-cream">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-10">
            <div>
              <img src={site.brand.logo} alt="Burger Shack" width="1029" height="501" loading="lazy" className="w-36" />
              <p className="mt-4 max-w-xs text-sm text-cream/85">Hamburguesas, papas, shakes y buena vibra. {site.brand.city}.</p>
            </div>
            <nav aria-label="Pie de página">
              <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm font-semibold">
                {site.nav.map((n) => (
                  <li key={n.href}>
                    <AnchorLink href={n.href} className="hover:underline">
                      {n.label}
                    </AnchorLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="eyebrow">Síguenos</p>
              <ul className="mt-3 flex gap-3">
                {site.social.map((s) => {
                  const I = socialIcon[s.id];
                  const cls = "grid size-12 place-items-center rounded-full border-2 border-cream/60 transition";
                  return (
                    <li key={s.id}>
                      {s.href ? (
                        <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className={`${cls} hover:bg-cream hover:text-shack-hot`}>
                          <I />
                        </a>
                      ) : (
                        <span aria-label={`${s.label} (enlace pendiente)`} title={`${s.label}: enlace oficial pendiente`} className={`${cls} cursor-not-allowed opacity-60`}>
                          <I />
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              {site.social.some((s) => !s.href) && (
                <p className="mt-2">
                  <Pending>Enlaces oficiales por confirmar</Pending>
                </p>
              )}
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-end justify-between gap-4 border-t-2 border-cream/25 pt-6">
            <p className="display text-[clamp(2.4rem,7vw,5.4rem)] leading-none text-coal">Nunca es suficiente Shack.</p>
            <p className="text-xs text-cream/80">© {new Date().getFullYear()} Burger Shack Venezuela</p>
          </div>
          {site.showPending && (
            <p className="mt-6 rounded-xl bg-coal/15 px-4 py-3 text-xs text-cream/90">
              Versión de propuesta: imágenes conceptuales y datos marcados como "por confirmar" deben validarse con Burger Shack antes de publicar.
            </p>
          )}
        </div>
      </footer>
    </>
  );
}
