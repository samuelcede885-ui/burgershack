import { useLayoutEffect, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power3.out", duration: 0.85 });

export { gsap, ScrollTrigger };

const isBrowser = typeof window !== "undefined";
export const useIsoLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

export const prefersReducedMotion = () =>
  isBrowser && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isCoarsePointer = () => isBrowser && window.matchMedia("(pointer: coarse)").matches;

/** Lenis compartido: se crea una vez y alimenta ScrollTrigger desde el ticker de GSAP. */
let lenis = null;
export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis;
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 });
  lenis.on("scroll", ScrollTrigger.update);
  const raf = (time) => lenis && lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  lenis.__raf = raf;
  return lenis;
}
export function destroySmoothScroll() {
  if (!lenis) return;
  gsap.ticker.remove(lenis.__raf);
  lenis.destroy();
  lenis = null;
}
export const getLenis = () => lenis;

/** Desplazamiento suave a un ancla (#id) respetando el header fijo. */
export function scrollToHash(hash) {
  const el = typeof hash === "string" ? document.querySelector(hash) : hash;
  if (!el) return;
  const offset = 0;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.3 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  if (typeof hash === "string") history.replaceState(null, "", hash);
}

/** Crea un gsap.context ligado a un ref y lo revierte al desmontar. */
export function useGsap(scopeRef, setup, deps = []) {
  useIsoLayoutEffect(() => {
    if (!scopeRef.current) return;
    const ctx = gsap.context(() => setup({ reduce: prefersReducedMotion() }), scopeRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Revelado de líneas: busca .line-mask > span dentro del elemento. */
export function revealLines(el, opts = {}) {
  const lines = el.querySelectorAll(".line-mask > span");
  return gsap.from(lines, {
    yPercent: 110,
    duration: 1,
    ease: "power4.out",
    stagger: 0.1,
    ...opts,
  });
}

/** Magnetismo sutil en botones (solo puntero fino). */
export function magnetic(el, strength = 0.22) {
  if (!el || isCoarsePointer() || prefersReducedMotion()) return () => {};
  const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
  const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
  const move = (e) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - r.left - r.width / 2) * strength);
    yTo((e.clientY - r.top - r.height / 2) * strength);
  };
  const leave = () => {
    xTo(0);
    yTo(0);
  };
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerleave", leave);
  return () => {
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerleave", leave);
  };
}
