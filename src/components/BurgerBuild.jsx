import { useRef } from "react";
import { stack } from "../data/site";
import { gsap, useGsap } from "../lib/motion";
import { Lines } from "./ui";

/*
 * Hamburguesa desmontable.
 * Las capas salen de una sola foto del despiece (public/images/stack/s*.webp),
 * recortadas con fondo transparente y en su posición original = estado "separado".
 * El estado "armado" desplaza cada capa hacia arriba según stack.shifts.
 */
const H = stack.height;
const cum = stack.shifts.reduce((acc, s) => [...acc, acc[acc.length - 1] + s], [0]);
const total = cum[cum.length - 1];
const assembledPx = cum.map((c) => -c + total / 2); // en px de la imagen original

export default function BurgerBuild({ eyebrow, title, titleAccent = [false, false, true], caption, bigWord, alt }) {
  const root = useRef(null);

  useGsap(root, ({ reduce }) => {
    const q = gsap.utils.selector(root);
    const box = q("[data-stack]")[0];
    const items = q("[data-slice]");
    const labels = q("[data-label]");
    const A = (i) => (assembledPx[i] / H) * box.offsetHeight;

    gsap.from(q("h2 .line-mask > span"), {
      yPercent: 110,
      stagger: 0.1,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
    });

    if (reduce) {
      gsap.set(labels, { autoAlpha: 1 });
      return;
    }

    gsap.set(items, { y: (i) => A(i) });
    gsap.set(labels, { autoAlpha: 0 });

    const mm = gsap.matchMedia();
    mm.add({ desktop: "(min-width: 1024px)", mobile: "(max-width: 1023px)" }, (c) => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: c.conditions.desktop ? "+=260%" : "+=200%",
          pin: q("[data-pin]")[0],
          scrub: c.conditions.desktop ? 1 : 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const counter = q("[data-count]")[0];
            if (!counter) return;
            const n = stack.labels.length;
            counter.textContent = String(Math.min(n, Math.max(1, Math.ceil(self.progress * 1.7 * n)))).padStart(2, "0");
          },
        },
      });

      tl.to(items, { y: 0, duration: 3, ease: "power2.inOut", stagger: { each: 0.04, from: "center" } }, 0)
        .to(q("[data-bigword]"), { yPercent: -18, duration: 7 }, 0)
        .to(q("[data-progress]"), { scaleY: 1, duration: 6.5 }, 0);

      labels.forEach((el, i) => {
        const fromX = el.dataset.side === "left" ? 24 : -24;
        tl.fromTo(el, { autoAlpha: 0, x: fromX }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" }, 1.2 + i * 0.16);
      });

      tl.addLabel("hold", 4.4)
        .to(labels, { autoAlpha: 0, duration: 0.5, stagger: 0.03 }, "hold")
        .to(items, { y: (i) => A(i), duration: 2, ease: "power3.inOut", stagger: { each: 0.035, from: "edges" } }, "hold+=0.2")
        .fromTo(q("[data-caption]"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "hold+=1.9")
        .to({}, { duration: 0.6 });
    });
  });

  return (
    <section id="ingredientes" ref={root} aria-labelledby="ingredientes-title" className="relative bg-coal">
      <div data-pin className="grain relative h-[100svh] min-h-[560px] overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[60%] size-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(238,90,51,0.35),transparent)] lg:left-[64%] lg:top-1/2 lg:size-[62vw]" />
        <p
          data-bigword
          aria-hidden="true"
          className="display pointer-events-none absolute -bottom-[6vw] left-1/2 -translate-x-1/2 select-none text-[34vw] leading-none text-transparent opacity-40 lg:left-[64%]"
          style={{ WebkitTextStroke: "2px rgba(244,240,229,0.12)" }}
        >
          {bigWord}
        </p>

        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col px-4 pt-24 sm:px-8 lg:justify-center lg:pt-0">
          <div className="text-center lg:w-[30%] lg:text-left">
            <p className="eyebrow text-shack">{eyebrow}</p>
            <h2 id="ingredientes-title" className="display mt-3 text-[clamp(2.4rem,4.6vw,4.8rem)]">
              <Lines lines={title} lineClass={titleAccent.map((a) => (a ? "text-shack-hot" : ""))} />
            </h2>
            <p className="mt-4 hidden max-w-xs text-cream/70 lg:block">Desliza y mira cómo se arma. Cada capa tiene su razón de estar ahí.</p>
            <div className="mt-8 hidden items-center gap-4 lg:flex" aria-hidden="true">
              <span className="relative block h-28 w-[3px] overflow-hidden rounded bg-cream/15">
                <span data-progress className="absolute inset-0 origin-top scale-y-0 rounded bg-shack" />
              </span>
              <span className="display text-5xl tabular-nums">
                <span data-count>01</span>
                <span className="text-cream/30"> / {String(stack.labels.length).padStart(2, "0")}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-[3%] top-[25%] flex items-center justify-center lg:bottom-[4%] lg:left-[30%] lg:top-[6%]">
          <div
            data-stack
            className="relative w-[min(54vw,calc(68svh*0.709))] lg:w-[min(30vw,calc(90svh*0.709))]"
            style={{ aspectRatio: `${stack.width} / ${stack.height}` }}
          >
            <span aria-hidden="true" className="absolute -bottom-[2%] left-1/2 h-[5%] w-[70%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-xl" />
            {stack.slices.map((s, i) => (
              <img
                key={s.src}
                data-slice
                src={s.src}
                alt={i === 0 ? alt : ""}
                aria-hidden={i === 0 ? undefined : "true"}
                width={stack.width}
                height={s.h}
                loading="lazy"
                decoding="async"
                className="absolute left-0 w-full max-w-none will-change-transform"
                style={{ top: `${(s.top / H) * 100}%`, height: `${(s.h / H) * 100}%`, zIndex: stack.slices.length - i }}
              />
            ))}

            <ol className="contents">
              {stack.labels.map((l) => (
                <li
                  key={l.label}
                  data-label
                  data-side={l.side}
                  className={`absolute z-30 w-[calc(50vw-50%-1rem)] lg:w-[14rem] ${
                    l.side === "left" ? "right-[calc(100%+0.5rem)] text-right lg:right-[calc(100%+2rem)]" : "left-[calc(100%+0.5rem)] lg:left-[calc(100%+2rem)]"
                  }`}
                  style={{ top: `${(l.y / H) * 100}%`, translate: "0 -50%" }}
                >
                  <span className={`flex items-center gap-2 ${l.side === "left" ? "justify-end" : ""}`}>
                    {l.side === "right" && <span aria-hidden="true" className="hidden h-px w-8 bg-shack lg:block" />}
                    <span className="display text-[clamp(0.8rem,1.5vw,1.5rem)] leading-none text-cream">{l.label}</span>
                    {l.side === "left" && <span aria-hidden="true" className="hidden h-px w-8 bg-shack lg:block" />}
                  </span>
                  <span className="mt-1 hidden text-sm text-cream/60 lg:block">{l.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <p data-caption className="invisible absolute inset-x-4 bottom-[4%] z-20 mx-auto max-w-md text-center text-base font-medium text-cream/85 lg:left-[30%] lg:right-0 lg:text-lg">
          {caption}
        </p>
      </div>
    </section>
  );
}
