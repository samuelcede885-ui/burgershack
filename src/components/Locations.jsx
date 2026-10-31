import { useRef } from "react";
import { locations, mapsDirections, mapsSearch } from "../data/site";
import { gsap, useGsap } from "../lib/motion";
import { Icon, Lines, Pending } from "./ui";

export default function Locations() {
  const root = useRef(null);

  useGsap(root, ({ reduce }) => {
    if (reduce) return;
    const q = gsap.utils.selector(root);
    gsap.from(q("h2 .line-mask > span"), {
      yPercent: 110,
      stagger: 0.1,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
    });
    gsap.from(q("[data-loc]"), {
      y: 40,
      autoAlpha: 0,
      stagger: 0.08,
      duration: 0.9,
      ease: "power4.out",
      scrollTrigger: { trigger: q("[data-loc-list]")[0], start: "top 85%", once: true },
    });
    gsap.fromTo(
      q("[data-store] img"),
      { yPercent: -8, scale: 1.15 },
      { yPercent: 8, scale: 1.15, ease: "none", scrollTrigger: { trigger: q("[data-store]")[0], start: "top bottom", end: "bottom top", scrub: 1 } }
    );
  });

  return (
    <section id="locales" ref={root} aria-labelledby="locales-title" className="relative bg-coal py-24 text-cream sm:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-shack">Nuestras sucursales</p>
          <h2 id="locales-title" className="display mt-3 text-[clamp(3.4rem,8vw,7.6rem)]">
            <Lines lines={["Encuentra", "tu Shack."]} lineClass={["", "text-shack-hot"]} />
          </h2>
          <p className="mt-6 max-w-sm text-cream/70">Encuéntranos en Caracas. Abre el mapa o pide indicaciones desde tu ubicación.</p>
          <figure data-store className="relative mt-10 aspect-[4/3.6] overflow-hidden rounded-[28px]">
            <img src="/images/hq/burger-hand.webp" alt="Hamburguesa envuelta en papel frente a un local iluminado" width="1122" height="1402" loading="lazy" decoding="async" className="size-full object-cover" />
          </figure>
        </div>

        <ul data-loc-list className="grid content-start gap-4 sm:grid-cols-2 lg:col-span-7 lg:pt-24">
          {locations.map((loc) => (
            <li key={loc.id} data-loc className="group flex flex-col rounded-[24px] border border-cream/12 bg-coal-soft p-6 transition-colors duration-500 hover:border-shack">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-shack-hot text-cream transition-transform duration-500 group-hover:-rotate-12">
                  <Icon.Pin />
                </span>
                {loc.pending && <Pending className="text-mustard" />}
              </div>
              <h3 className="display mt-6 text-4xl">{loc.name}</h3>
              <p className="mt-1 text-cream/75">{loc.address}</p>
              <p className="mt-3 flex items-center gap-2 text-sm text-cream/55">
                <Icon.Clock /> {loc.hours || "Horario por confirmar"}
              </p>
              <div className="mt-6 flex flex-wrap gap-2 pt-2">
                <a href={mapsSearch(loc)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !px-4 !py-2.5 text-sm text-cream">
                  Ver en Google Maps
                </a>
                <a href={mapsDirections(loc)} target="_blank" rel="noopener noreferrer" className="btn btn-primary !px-4 !py-2.5 text-sm">
                  Cómo llegar <Icon.Arrow className="arrow" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
