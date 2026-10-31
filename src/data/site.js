/**
 * ─────────────────────────────────────────────────────────────
 *  BURGER SHACK — CONTENIDO EDITABLE
 *  Todo el texto, productos, sucursales y enlaces viven aquí.
 *  Lo marcado con `pending: true` NO está verificado con la marca:
 *  confirma el dato, corrígelo y cambia `pending` a false.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  /** Muestra etiquetas "Por confirmar" en los datos sin verificar.
   *  Ponlo en false SOLO cuando todo esté validado. */
  showPending: true,

  brand: {
    name: "Burger Shack",
    logo: "/images/brand/logo-white.png",
    city: "Caracas, Venezuela",
  },

  /** Canales de pedido. Mientras todos estén en null, los botones
   *  "Pedir ahora" abren un panel con los canales pendientes.
   *  - whatsapp: número en formato internacional sin "+" ni espacios (ej. "58412XXXXXXX")
   *  - url: enlace oficial de pedidos (web propia o app de delivery) */
  order: {
    whatsapp: null,
    url: null,
    channels: [
      { id: "whatsapp", label: "WhatsApp oficial", href: null, note: "Número oficial pendiente de confirmar" },
      { id: "delivery", label: "App de delivery", href: null, note: "Plataforma oficial pendiente de confirmar" },
      { id: "store", label: "En tienda", href: "#locales", note: "Visítanos en tu Shack más cercano" },
    ],
  },

  catering: {
    /** Correo o enlace oficial para solicitudes de catering. */
    contactUrl: null,
    note: "Paquetes, tarifas y condiciones se confirman directamente con Burger Shack.",
  },

  social: [
    { id: "instagram", label: "Instagram", href: null },
    { id: "tiktok", label: "TikTok", href: null },
    { id: "web", label: "Sitio web", href: null },
  ],

  nav: [
    { href: "#menu", label: "Menú" },
    { href: "#ingredientes", label: "Ingredientes" },
    { href: "#extras", label: "Shakes" },
    { href: "#catering", label: "Catering" },
    { href: "#locales", label: "Locales" },
  ],
};

/** Menú. Nombres y descripciones tomados de la propuesta visual (lámina de diseño):
 *  todos pendientes de validar con la carta oficial. Precios: no se publican hasta confirmarlos. */
export const menu = [
  {
    id: "hamburguesas",
    label: "Hamburguesas",
    items: [
      { id: "shack-clasica", name: "Shack Clásica", desc: "Carne, queso, lechuga, tomate y salsa Shack.", image: "/images/hq/burger-classic-sm.webp", pending: true },
      { id: "bacon-shack", name: "Bacon Shack", desc: "Carne, doble queso, tocineta y salsa Shack.", image: "/images/hq/burger-bacon-sm.webp", pending: true },
      { id: "onion-shack", name: "Onion Shack", desc: "Carne, queso, cebolla caramelizada y salsa.", image: "/images/hq/burger-onion-sm.webp", pending: true },
    ],
  },
  {
    id: "acompanantes",
    label: "Papas y acompañantes",
    items: [
      { id: "papas", name: "Papas", desc: "Doradas y crujientes, con salsa para mojar.", image: "/images/hq/fries-sm.webp", pending: true },
      { id: "nuggets", name: "Nuggets", desc: "Para compartir, con tu salsa favorita.", image: "/images/hq/nuggets-sm.webp", pending: true },
    ],
  },
  {
    id: "shakes",
    label: "Shakes",
    items: [{ id: "shake-oreo", name: "Shake de Oreo", desc: "Cremoso, con galleta triturada, sirope y cereza.", image: "/images/hq/shake-oreo-sm.webp", pending: true }],
  },
  {
    id: "salsas",
    label: "Salsas",
    items: [{ id: "salsas-casa", name: "Salsas de la casa", desc: "Variedades disponibles por confirmar con la carta oficial.", image: "/images/hq/sauces-sm.webp", pending: true }],
  },
  {
    id: "combos",
    label: "Combos",
    items: [{ id: "combo-shack", name: "Combo Shack", desc: "Hamburguesa, papas medianas y refresco.", image: "/images/hq/burger-classic-sm.webp", pending: true }],
  },
];

/** Destacados (carrusel). Titulares expresivos, sin afirmaciones verificables. */
export const featured = [
  { id: "f1", kicker: "Hecha para hambre de verdad", title: ["Más queso.", "Más Shack."], image: "/images/hq/burger-onion-sm.webp", alt: "Hamburguesa doble con tocineta, cebolla caramelizada y cheddar", tone: "orange" },
  { id: "f2", kicker: "Siempre crujiente", title: ["Tocineta", "sin pausa."], image: "/images/hq/burger-bacon-sm.webp", alt: "Hamburguesa doble con tocineta y cheddar fundido", tone: "cream" },
  { id: "f3", kicker: "Para llevar", title: ["En papel,", "con las manos."], image: "/images/hq/burger-hand-sm.webp", alt: "Mano sosteniendo una hamburguesa envuelta en papel", tone: "coal" },
  { id: "f4", kicker: "Fresca, de verdad", title: ["Lechuga,", "tomate, todo."], image: "/images/hq/burger-classic-sm.webp", alt: "Hamburguesa con lechuga, cebolla, tomate y cheddar", tone: "yellow" },
];

/** Sabores de shake mostrados como etiquetas (lámina de diseño). */
export const shakeFlavors = ["Oreo", "Vainilla", "Chocolate", "Fresa", "Dulce de leche"];

/** Sucursales. Zonas y direcciones de la lámina de diseño y de un directorio público
 *  (Wanderlog, La Trinidad). NINGUNA está confirmada por la marca: verificar antes de publicar. */
export const locations = [
  { id: "las-mercedes", name: "Las Mercedes", address: "Av. Principal de Las Mercedes", hours: null, pending: true },
  { id: "altamira", name: "Altamira", address: "Av. San Juan Bosco", hours: null, pending: true },
  { id: "chacao", name: "Chacao", address: "C.C. Chacao", hours: null, pending: true },
  { id: "la-trinidad", name: "La Trinidad", address: "Av. Principal de La Trinidad", hours: null, pending: true },
];

export const mapsSearch = (loc) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Burger Shack ${loc.name} ${loc.address} Caracas`)}`;
export const mapsDirections = (loc) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`Burger Shack ${loc.name} ${loc.address} Caracas`)}`;

/** Devuelve el enlace directo de pedido si existe; null si hay que abrir el panel. */
export function orderHref(productName) {
  const { whatsapp, url } = site.order;
  if (whatsapp) {
    const text = productName ? `¡Hola Burger Shack! Quiero pedir: ${productName}` : "¡Hola Burger Shack! Quiero hacer un pedido.";
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
  }
  return url || null;
}

/** Hamburguesa desmontable: capas recortadas de la foto del despiece (public/images/stack).
 *  top/h en px de la imagen original (922×1300). shifts = cuánto se acerca cada capa al armarse. */
export const stack = {
  width: 922,
  height: 1300,
  slices: [
    { src: "/images/stack/s0.webp", top: 0, h: 260 },
    { src: "/images/stack/s1.webp", top: 260, h: 140 },
    { src: "/images/stack/s2.webp", top: 400, h: 57 },
    { src: "/images/stack/s3.webp", top: 457, h: 143 },
    { src: "/images/stack/s4.webp", top: 600, h: 50 },
    { src: "/images/stack/s5.webp", top: 650, h: 105 },
    { src: "/images/stack/s6.webp", top: 755, h: 190 },
    { src: "/images/stack/s7.webp", top: 945, h: 115 },
    { src: "/images/stack/s8.webp", top: 1060, h: 60 },
    { src: "/images/stack/s9.webp", top: 1120, h: 180 },
  ],
  shifts: [62, 38, 42, 40, 30, 38, 55, 45, 48],
  labels: [
    { label: "Pan brioche", text: "Tostado, suave por dentro.", y: 85, side: "left" },
    { label: "Salsa de la casa", text: "Cremosa, con especias.", y: 215, side: "right" },
    { label: "Tocineta", text: "Crujiente, como debe ser.", y: 300, side: "left" },
    { label: "Queso cheddar", text: "Fundido sobre la carne.", y: 410, side: "right" },
    { label: "Carne a la plancha", text: "Jugosa, con costra dorada.", y: 505, side: "left" },
    { label: "Tomate", text: "Fresco, en rodajas.", y: 685, side: "right" },
    { label: "Cebolla morada", text: "Crocante y dulce.", y: 765, side: "left" },
    { label: "Lechuga", text: "Verde y fresca.", y: 850, side: "right" },
    { label: "Doble carne", text: "Porque una no basta.", y: 975, side: "left" },
    { label: "Pan base", text: "La base de todo.", y: 1185, side: "right" },
  ],
};
