import { useEffect, useRef } from "react";
import { site, orderHref } from "../data/site";
import { useOrder } from "../lib/order";
import { magnetic, scrollToHash } from "../lib/motion";

/** Titular con líneas enmascaradas para revelarse por línea. */
export function Lines({ lines, as: Tag = "span", className = "", lineClass = [] }) {
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        <span key={i} className="line-mask">
          <span className={lineClass[i] || ""}>{l}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Etiqueta para datos sin verificar. Se oculta con site.showPending = false. */
export function Pending({ children = "Por confirmar", className = "" }) {
  if (!site.showPending) return null;
  return (
    <span className={`pending-badge ${className}`} title="Dato pendiente de validación con Burger Shack">
      <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true"><circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M5 2.8V5.3L6.4 6.2" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" /></svg>
      {children}
    </span>
  );
}

/** Botón de pedido: enlace directo si hay canal oficial, si no abre el panel. */
export function OrderButton({ product, className = "btn btn-primary", children = "Pedir ahora", magnet = false, arrow = true }) {
  const { open } = useOrder();
  const ref = useRef(null);
  useEffect(() => (magnet ? magnetic(ref.current) : undefined), [magnet]);
  const href = orderHref(product);
  const inner = (
    <>
      {children}
      {arrow && <Icon.Arrow className="arrow" />}
    </>
  );
  if (href)
    return (
      <a ref={ref} href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  return (
    <button ref={ref} type="button" className={className} onClick={() => open({ product })} aria-haspopup="dialog">
      {inner}
    </button>
  );
}

/** Enlace a ancla interna con scroll suave (Lenis). */
export function AnchorLink({ href, className = "", children, onClick, magnet = false, ...rest }) {
  const ref = useRef(null);
  useEffect(() => (magnet ? magnetic(ref.current) : undefined), [magnet]);
  return (
    <a
      ref={ref}
      href={href}
      className={className}
      onClick={(e) => {
        if (href?.startsWith("#")) {
          e.preventDefault();
          scrollToHash(href);
        }
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export const Icon = {
  Arrow: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Pin: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="9.5" r="2.6" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Clock: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Star: (p) => (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" {...p}>
      <path d="M20 2c1.2 9.6 8.4 16.8 18 18-9.6 1.2-16.8 8.4-18 18-1.2-9.6-8.4-16.8-18-18C11.6 18.8 18.8 11.6 20 2Z" fill="currentColor" />
    </svg>
  ),
  Burst: ({ children, ...p }) => (
    <svg viewBox="0 0 120 120" aria-hidden="true" {...p}>
      <path
        fill="currentColor"
        d="M60 0l9 18 19-9-1 21 21-1-9 19 18 9-18 9 9 19-21-1 1 21-19-9-9 18-9-18-19 9 1-21-21 1 9-19L0 60l18-9-9-19 21 1-1-21 19 9z"
      />
    </svg>
  ),
  Instagram: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
    </svg>
  ),
  TikTok: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 3c.4 2.8 2.3 4.6 5 4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Globe: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Close: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  ),
  Plus: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
};

export const socialIcon = { instagram: Icon.Instagram, tiktok: Icon.TikTok, web: Icon.Globe };
