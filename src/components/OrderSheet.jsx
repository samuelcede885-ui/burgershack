import { useEffect, useRef } from "react";
import { site } from "../data/site";
import { useOrder } from "../lib/order";
import { gsap, getLenis, prefersReducedMotion, scrollToHash } from "../lib/motion";
import { Icon, Pending } from "./ui";

/**
 * Panel de pedidos. Se muestra cuando no hay un canal oficial configurado
 * en src/data/site.js → order. Cuando se configure `order.whatsapp` o
 * `order.url`, los botones "Pedir" enlazan directo y este panel solo
 * se usa para catering.
 */
export default function OrderSheet() {
  const { state, close } = useOrder();
  const panelRef = useRef(null);
  const backdropRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastFocus = useRef(null);
  const isOpen = Boolean(state);

  useEffect(() => {
    if (!isOpen) return;
    lastFocus.current = document.activeElement;
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    const reduce = prefersReducedMotion();
    gsap.fromTo(backdropRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: reduce ? 0 : 0.35 });
    gsap.fromTo(panelRef.current, { yPercent: 12, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: reduce ? 0 : 0.6, ease: "power4.out" });
    closeBtnRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const f = panelRef.current.querySelectorAll("a[href],button:not([disabled])");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
      document.documentElement.style.overflow = "";
      lastFocus.current?.focus?.();
    };
  }, [isOpen, close]);

  if (!isOpen) return null;
  const catering = state.mode === "catering";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center" role="presentation">
      <div ref={backdropRef} className="absolute inset-0 bg-coal/70 backdrop-blur-sm" onClick={close} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-title"
        className="relative m-0 w-full max-w-lg rounded-t-[28px] bg-cream p-6 text-coal shadow-2xl sm:m-6 sm:rounded-[28px] sm:p-8"
        data-lenis-prevent
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-shack-hot">{catering ? "Catering y eventos" : "Haz tu pedido"}</p>
            <h2 id="order-title" className="display mt-2 text-5xl">
              {catering ? "Hablemos de tu evento" : "¿Cómo lo quieres?"}
            </h2>
          </div>
          <button ref={closeBtnRef} type="button" onClick={close} className="grid size-11 shrink-0 place-items-center rounded-full bg-coal text-cream transition hover:bg-shack-hot" aria-label="Cerrar">
            <Icon.Close />
          </button>
        </div>

        {state.product && (
          <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm">
            Producto: <strong>{state.product}</strong>
          </p>
        )}

        {catering ? (
          <div className="mt-6 space-y-4 text-sm leading-relaxed">
            <p>Cuéntanos la fecha, el lugar y cuántas personas esperas. El equipo de Burger Shack te contactará con las opciones disponibles.</p>
            <p className="text-coal/70">{site.catering.note}</p>
            {site.catering.contactUrl ? (
              <a href={site.catering.contactUrl} className="btn btn-primary w-full" target="_blank" rel="noopener noreferrer">
                Solicitar catering <Icon.Arrow className="arrow" />
              </a>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-coal/25 p-4">
                <p className="font-semibold">Canal de contacto para catering</p>
                <p className="mt-1 text-coal/70">Pendiente: correo o WhatsApp oficial de Burger Shack.</p>
              </div>
            )}
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {site.order.channels.map((c) => {
              const content = (
                <>
                  <span>
                    <span className="block font-bold">{c.label}</span>
                    <span className="block text-sm text-coal/65">{c.note}</span>
                  </span>
                  {c.href ? <Icon.Arrow className="arrow shrink-0" /> : <Pending className="shrink-0 text-coal" />}
                </>
              );
              const cls = "flex w-full items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 text-left";
              return (
                <li key={c.id}>
                  {c.href ? (
                    <a
                      href={c.href}
                      className={`${cls} btn-row transition hover:bg-shack hover:text-white`}
                      onClick={(e) => {
                        if (c.href.startsWith("#")) {
                          e.preventDefault();
                          close();
                          setTimeout(() => scrollToHash(c.href), 60);
                        }
                      }}
                    >
                      {content}
                    </a>
                  ) : (
                    <div className={`${cls} opacity-80`} aria-disabled="true">
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-6 text-xs text-coal/55">Sin carrito ni pagos en esta web: el pedido se completa en el canal oficial de Burger Shack.</p>
      </div>
    </div>
  );
}
