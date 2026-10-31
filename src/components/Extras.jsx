import { useRef } from "react";
import { shakeFlavors } from "../data/site";
import { gsap, useGsap } from "../lib/motion";
import { Lines, OrderButton, Pending } from "./ui";

function Photo({ src, alt, className = "", label, rotate = 0, speed = 0, w = 700, h = 700 }) {
  return (
    <figure data-speed={speed} data-pop className={`relative ${className}`} style={{ rotate: `${rotate}deg` }}>
      <div className="size-full overflow-hidden rounded-[24px] border-4 border-coal bg-coal shadow-[8px_8px_0_var(--color-coal)]">
        <img src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" className="size-full object-cover" />
      </div>
      {label && <figcaption className="sticker absolute -bottom-4 left-4">{label}</figcaption>}
    </figure>
  );
}

export default function Extras() {
  const root = useRef(null);

  useGsap(root, ({ reduce }) => {
    const q = gsap.utils.selector(root);
    if (reduce) return;
    gsap.from(q("h2 .line-mask > span"), {
      yPercent: 110,
      stagger: 0.09,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
    });
    q("[data-pop]").forEach((el) => {
      gsap.from(el, {
        scale: 0.86,
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });
    gsap.from(q("[data-flavor]"), {
      x: 30,
      autoAlpha: 0,
      stagger: 0.07,
      duration: 0.7,
      scrollTrigger: { trigger: q("[data-flavors]")[0], start: "top 85%", once: true },
    });
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      q("[data-speed]").forEach((el) => {
        const s = Number(el.dataset.speed);
        if (!s) return;
        gsap.to(el, {
          yPercent: -s * 100,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
      });
    });
  });

  return (
    <section id="extras" ref={root} aria-labelledby="extras-title" className="relative overflow-hidden bg-cream py-24 text-coal sm:py-32">
      <div aria-hidden="true" className="checker absolute right-0 top-0 h-24 w-1/2 opacity-90 [mask-image:linear-gradient(to_left,black,transparent)] sm:h-32" />

      <div className="relative mx-auto grid max-w-[1400px] gap-x-6 gap-y-14 px-4 sm:px-8 md:grid-cols-12">
        {/* Titular */}
        <div className="md:col-span-7 lg:col-span-6">
          <p className="eyebrow text-shack-hot">Shakes · Salsas · Extras</p>
          <h2 id="extras-title" className="display mt-3 text-[clamp(3rem,7.4vw,7rem)]">
            <Lines lines={["Shakes que", "completan la", "experiencia."]} lineClass={["", "", "text-shack-hot"]} />
          </h2>
          <p className="mt-6 max-w-md text-coal/70">
            Cremosos, con todo encima y hechos para acompañar tu Shack. Súmale papas, nuggets o aros y tu salsa favorita.
          </p>
        </div>

        <div className="hidden items-start justify-end gap-4 md:col-span-5 md:flex lg:col-span-6">
          <img data-pop data-speed="0.25" src="/images/photos/g-star.webp" alt="" aria-hidden="true" width="360" height="517" loading="lazy" className="w-24 rotate-6 rounded-2xl lg:w-28" />
          <img data-pop data-speed="0.12" src="/images/photos/g-goodvibes.webp" alt="" aria-hidden="true" width="360" height="563" loading="lazy" className="mt-16 w-28 -rotate-3 rounded-2xl lg:w-32" />
        </div>

        {/* Shake protagonista + sabores */}
        <div className="relative md:col-span-6 lg:col-span-5">
          <div data-pop className="relative mx-auto aspect-[3/4.4] w-full max-w-[460px] overflow-hidden rounded-[999px_999px_32px_32px] bg-white">
            <img src="/images/hq/shake-oreo.webp" alt="Shake de galleta con crema batida, sirope de chocolate y cereza" width="1122" height="1402" loading="lazy" decoding="async" className="size-full object-cover object-[50%_30%]" />
          </div>
          <div data-flavors className="absolute bottom-8 right-0 flex flex-col items-end gap-2">
            {shakeFlavors.map((f, i) => (
              <span key={f} data-flavor className="sticker" style={{ rotate: `${i % 2 ? 3 : -3}deg`, background: ["#F4BA48", "#F4F0E5", "#7A3BBD", "#E63946", "#FF9A3C"][i], color: i === 2 || i === 3 ? "#F4F0E5" : undefined }}>
                {f}
              </span>
            ))}
            <span className="mt-1 text-coal">
              <Pending>Sabores por confirmar</Pending>
            </span>
          </div>
        </div>

        {/* Collage de extras */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:col-span-6 lg:col-span-7 lg:grid-cols-6 lg:gap-x-6">
          <Photo src="/images/hq/fries-sm.webp" alt="Papas sazonadas con salsa para mojar" w={640} h={800} label="Papas" rotate={-2.5} speed={0.08} className="aspect-square lg:col-span-3" />
          <Photo src="/images/hq/nuggets-sm.webp" alt="Nuggets crujientes con salsa" w={640} h={800} label="Nuggets" rotate={2} speed={0.18} className="aspect-square lg:col-span-3 lg:mt-20" />
          <Photo src="/images/hq/sauces-sm.webp" alt="Cuatro salsas: BBQ, chimichurri, chipotle y ajo" w={640} h={800} label="Salsas" rotate={1.5} speed={0.1} className="col-span-2 aspect-[16/10] lg:col-span-4" />
          <figure data-pop data-speed="0.3" className="relative hidden aspect-[3/4] overflow-hidden rounded-[24px] lg:col-span-2 lg:block lg:-mt-10">
            <img src="/images/photos/g-cup.webp" alt="" aria-hidden="true" width="400" height="511" loading="lazy" className="size-full object-cover" />
          </figure>
        </div>

        <div className="md:col-span-12 flex flex-wrap items-center justify-between gap-6 border-t-2 border-coal/10 pt-10">
          <p className="display text-[clamp(1.8rem,3.6vw,3rem)]">
            ¿Ya tienes tu combo? <span className="text-shack-hot">Súmale un shake.</span>
          </p>
          <OrderButton product="Shake" magnet />
        </div>
      </div>
    </section>
  );
}
