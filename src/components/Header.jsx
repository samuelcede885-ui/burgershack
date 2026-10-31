import { useEffect, useRef, useState } from "react";
import { site } from "../data/site";
import { gsap, getLenis, ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import { AnchorLink, OrderButton, Icon } from "./ui";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 80,
      end: "max",
      onToggle: (self) => setScrolled(self.isActive),
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    if (menuOpen) {
      getLenis()?.stop();
      document.documentElement.style.overflow = "hidden";
      if (!prefersReducedMotion()) {
        gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power4.out" });
        gsap.from(el.querySelectorAll("[data-menu-item]"), { yPercent: 100, autoAlpha: 0, stagger: 0.06, duration: 0.7, delay: 0.15, ease: "power4.out" });
      }
      const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        getLenis()?.start();
        document.documentElement.style.overflow = "";
      };
    }
  }, [menuOpen]);

  return (
    <header
      data-header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,padding,box-shadow] duration-500 ${
        scrolled ? "bg-coal/90 py-2.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md" : "py-4 sm:py-5"
      }`}
    >
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-cream focus:px-4 focus:py-2 focus:text-coal">
        Saltar al contenido
      </a>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-8">
        <AnchorLink href="#inicio" className="block shrink-0" aria-label="Burger Shack, ir al inicio">
          <img src={site.brand.logo} alt="Burger Shack" width="1029" height="501" className={`h-auto transition-[width] duration-500 ${scrolled ? "w-[92px]" : "w-[108px] sm:w-[124px]"}`} />
        </AnchorLink>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-sm font-semibold">
            {site.nav.map((n) => (
              <li key={n.href}>
                <AnchorLink href={n.href} className="group relative py-2 text-cream/85 transition hover:text-cream">
                  {n.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-shack transition-transform duration-500 group-hover:scale-x-100" />
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <OrderButton className="btn btn-primary !px-5 !py-2.5 text-sm" arrow={false} />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border-2 border-cream/30 text-cream lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <Icon.Close />
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 8h16M4 16h11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div ref={overlayRef} id="mobile-menu" className="fixed inset-0 top-0 -z-10 flex flex-col justify-between bg-shack-hot px-6 pb-10 pt-28 lg:hidden">
          <nav aria-label="Móvil">
            <ul className="space-y-1">
              {site.nav.map((n) => (
                <li key={n.href} className="overflow-hidden">
                  <AnchorLink href={n.href} data-menu-item className="display block py-1 text-[16vw] leading-none text-cream sm:text-7xl" onClick={() => setMenuOpen(false)}>
                    {n.label}
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </nav>
          <p data-menu-item className="display text-3xl text-coal">Good burgers. Good vibes.</p>
        </div>
      )}
    </header>
  );
}
