import { useRef, useState } from "react";
import { menu } from "../data/site";
import { gsap, useGsap, isCoarsePointer, prefersReducedMotion } from "../lib/motion";
import { Lines, OrderButton, Pending, Icon } from "./ui";

function ProductCard({ item }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (isCoarsePointer() || prefersReducedMotion()) return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(ref.current, { rotationY: nx * 6, rotationX: -ny * 6, duration: 0.5, ease: "power3.out", transformPerspective: 900 });
  };
  const onLeave = () => gsap.to(ref.current, { rotationY: 0, rotationX: 0, duration: 0.6, ease: "power3.out" });

  return (
    <article
      ref={ref}
      data-card
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group relative flex flex-col overflow-hidden rounded-[26px] bg-white text-coal shadow-[0_2px_0_rgba(32,26,23,0.08)] transition-shadow duration-500 hover:shadow-[0_30px_60px_-25px_rgba(32,26,23,0.45)]"
    >
      <div className="relative aspect-[4/3.4] overflow-hidden bg-shack">
        <img
          src={item.image}
          alt={item.name}
          width="560"
          height="560"
          loading="lazy"
          decoding="async"
          className="size-full object-cover object-[50%_62%] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.07]"
        />
        {item.pending && (
          <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-1 text-coal backdrop-blur">
            <Pending>Nombre provisional</Pending>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="display text-[1.9rem] leading-none">{item.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-coal/70">{item.desc}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-coal/55">Precio por confirmar</span>
          <OrderButton product={item.name} className="btn btn-dark !px-4 !py-2.5 text-sm" arrow={false}>
            Pedir <Icon.Plus />
          </OrderButton>
        </div>
      </div>
    </article>
  );
}

export default function Menu() {
  const root = useRef(null);
  const [active, setActive] = useState(menu[0].id);
  const tabsRef = useRef([]);

  useGsap(root, ({ reduce }) => {
    if (reduce) return;
    const q = gsap.utils.selector(root);
    gsap.from(q("h2 .line-mask > span"), {
      yPercent: 110,
      stagger: 0.1,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
    });
    gsap.from(q("[data-tabs] > *"), {
      y: 20,
      autoAlpha: 0,
      stagger: 0.05,
      duration: 0.7,
      scrollTrigger: { trigger: q("[data-tabs]")[0], start: "top 88%", once: true },
    });
    gsap.from(q("[data-panel]:not([hidden]) [data-card]"), {
      y: 60,
      autoAlpha: 0,
      stagger: 0.08,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: { trigger: q("[data-panels]")[0], start: "top 82%", once: true },
    });
  });

  const select = (id, focus = false) => {
    setActive(id);
    if (focus) tabsRef.current[menu.findIndex((c) => c.id === id)]?.focus();
    requestAnimationFrame(() => {
      if (prefersReducedMotion()) return;
      const cards = root.current.querySelectorAll(`#panel-${id} [data-card]`);
      gsap.fromTo(cards, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.8, ease: "power4.out" });
    });
  };

  const onKey = (e, i) => {
    const n = menu.length;
    let next = null;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next !== null) {
      e.preventDefault();
      select(menu[next].id, true);
    }
  };

  return (
    <section id="menu" ref={root} aria-labelledby="menu-title" className="relative bg-cream py-24 text-coal sm:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="menu-title" className="display text-[clamp(3.6rem,10vw,9rem)] text-shack-hot">
            <Lines lines={["Nuestro", "menú."]} lineClass={["text-coal text-[0.55em]", ""]} />
          </h2>
          <p className="max-w-sm text-coal/70">
            Elige una categoría, encuentra tu favorita y pídela por el canal oficial de Burger Shack.
          </p>
        </div>

        <div className="-mx-4 mt-10 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
          <div data-tabs role="tablist" aria-label="Categorías del menú" className="flex w-max gap-2">
            {menu.map((c, i) => {
              const selected = c.id === active;
              return (
                <button
                  key={c.id}
                  ref={(el) => (tabsRef.current[i] = el)}
                  role="tab"
                  id={`tab-${c.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${c.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(c.id)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`rounded-full border-2 px-5 py-2.5 text-sm font-bold whitespace-nowrap transition-colors duration-300 ${
                    selected ? "border-shack-hot bg-shack-hot text-white" : "border-coal/15 bg-transparent text-coal hover:border-coal"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div data-panels className="mt-10">
          {menu.map((c) => (
            <div key={c.id} id={`panel-${c.id}`} data-panel role="tabpanel" aria-labelledby={`tab-${c.id}`} hidden={c.id !== active} tabIndex={0}>
              <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${c.items.length === 1 ? "lg:max-w-[440px] lg:grid-cols-1 sm:max-w-[440px] sm:grid-cols-1" : ""}`}>
                {c.items.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
