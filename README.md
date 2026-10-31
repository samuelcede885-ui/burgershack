# Burger Shack Venezuela: web interactiva

Propuesta funcional en React, Vite, Tailwind CSS v4, GSAP (ScrollTrigger) y Lenis.
Las animaciones siguen las skills *cinematic-gsap-lenis-motion-system* y *gsap-scrolltrigger-storytelling*.

## Cómo ejecutar

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # versión de producción en /dist
npm run preview   # revisar la build de producción
```

Requiere Node 18 o superior.

## Estructura

```
index.html
src/
  main.jsx, App.jsx        Arranque, scroll suave y orden de secciones
  index.css                Tokens de marca (@theme), fuentes y utilidades
  data/site.js             TODO el contenido editable: menú, sucursales, enlaces, pedidos
  lib/motion.js            GSAP + ScrollTrigger + Lenis, hooks y utilidades de animación
  lib/order.jsx            Estado del panel de pedidos y catering
  components/
    Loader.jsx             Cortina de entrada
    Header.jsx             Navegación fija y menú móvil
    Hero.jsx               1. Hero cinematográfico (entrada, inclinación 3D, parallax)
    Marquee.jsx            Cinta tipográfica ligada al scroll
    BurgerBuild.jsx        2. Hamburguesa desmontable (pin + scrub)
    Menu.jsx               3. Menú con pestañas accesibles
    Featured.jsx           4. Destacados: scroll horizontal fijado en escritorio, carrusel táctil en móvil
    Extras.jsx             5. Shakes, salsas y extras (composición editorial)
    Catering.jsx           6. Catering y eventos
    Locations.jsx          7. Sucursales con Google Maps
    FinalCTA.jsx           8. Cierre, pedidos, redes y footer
    OrderSheet.jsx         Panel de pedidos y catering (sin checkout)
    ui.jsx                 Botones, iconos, titulares por líneas, etiqueta "por confirmar"
public/
  images/photos            Fotos recortadas de las láminas (WebP)
  images/layers            8 capas con transparencia real (WebP con alfa)
  images/brand             Logo blanco con fondo transparente
  fonts                    Anton + Inter (licencia OFL, autoalojadas)
tools/extract-assets.py    Script que generó los recortes, para repetirlo
```

## Integrar pedidos (sin tocar componentes)

Todo se configura en `src/data/site.js`:

- `order.whatsapp`: número oficial (por ejemplo `"58412XXXXXXX"`). Todos los botones "Pedir" abren WhatsApp con el producto ya escrito en el mensaje.
- `order.url`: enlace oficial de pedidos (web o app de delivery). Se usa si no hay WhatsApp.
- Mientras ambos valgan `null`, los botones abren un panel con los canales marcados como pendientes. La web no tiene carrito ni checkout ficticio.
- `catering.contactUrl`: enlace o `mailto:` para las solicitudes de catering.
- `social[].href`: enlaces oficiales de Instagram, TikTok y web.
- `showPending: false` oculta todas las etiquetas "Por confirmar". Hazlo solo cuando todo esté validado.

## Imágenes en alta resolución (actualización)

Las fotos principales están en `public/images/hq/`: hamburguesas, papas, nuggets, salsas, shake, mano con hamburguesa y despiece, a 1122×1402. Cada una tiene además una versión `-sm` para las tarjetas.
La hamburguesa desmontable usa `public/images/stack/s0–s9.webp`: 10 capas recortadas con transparencia de la foto del despiece. Para ajustar cuánto se juntan al armarse, edita `stack.shifts` en `src/data/site.js`.
Las tablas de abajo describen los recortes originales de las láminas, que ahora solo se usan para ilustraciones y el logo.

## Recursos usados

Todos salen de las dos láminas adjuntas (tablero de diseño y manual de marca):

| Uso | Archivo | Origen |
|---|---|---|
| Hero y cierre | `photos/hero-burger.webp` | Manual de marca, portada |
| Capas de la hamburguesa | `layers/*.webp` | Tablero, "Elementos para animaciones", con el fondo cuadriculado eliminado |
| Menú: hamburguesas, papas, aros, shakes | `photos/p-*.webp` | Tablero, "Fotografías de producto" |
| Nuggets, papas, shake de vainilla, hamburguesa grande y envuelta | `photos/nuggets`, `fries`, `shake-cup`, `burger-stack`, `burger-wrap` | Manual, "Estilo fotográfico" |
| Salsas | `photos/sauces.webp` | Manual, "Estructura sugerida" |
| Combo | `photos/combo-shack.webp` | Tablero, tarjeta Combo Shack |
| Shake con cereza | `photos/shake-cherry.webp` | Tablero, panel Shakes |
| Catering | `photos/catering-tent.webp` | Tablero, panel Catering |
| Fachada | `photos/storefront.webp` | Tablero, panel Locales |
| Mano con hamburguesa | `photos/hand-burger.webp` | Tablero, panel CTA |
| Ilustraciones (mascota, vaso, estrella, Good Vibes) | `photos/g-*.webp` | Manual, "Sistema gráfico" |
| Logo | `brand/logo-white.png` | Manual, portada (naranja eliminado) |
| Tipografías | Anton, Inter | Google Fonts, licencia OFL (sustituyen a Druk y Monserrat, que son comerciales o no están confirmadas) |

## Pendientes de aprobación o reemplazo

**Imágenes.** Todas son fotografías conceptuales de las láminas, no fotos oficiales de producto, y su resolución es baja: la mayoría mide entre 100 y 230 px en el original y se amplió. Antes de publicar deben reemplazarse por fotos autorizadas con el mismo nombre de archivo:

- `public/images/layers/{top-bun,sauce,bacon,cheese,patty,tomato,lettuce,bottom-bun}.webp`: PNG o WebP transparentes de al menos 1200 px de ancho, todos con el mismo ángulo de cámara. Si cambian las proporciones, ajusta `ASSEMBLED` en `BurgerBuild.jsx`.
- `public/images/photos/hero-burger.webp`: foto principal de al menos 2000 px.
- `public/images/photos/p-*.webp`, `nuggets`, `sauces`, `combo-shack`: fotos de menú de al menos 800 px.
- `catering-tent`, `storefront`: hoy llevan la etiqueta "Imagen conceptual de referencia". Reemplázalas por fotos reales y quita la etiqueta.
- `public/images/brand/logo-white.png`: sustitúyelo por el archivo oficial en SVG.

**Datos sin verificar** (marcados en la web con "Por confirmar"):

- Nombres y descripciones de productos: Shack Clásica, Bacon Shack, Doble Shack, Combo Shack y los sabores de shakes. Vienen del tablero de diseño.
- Precios: no se publica ninguno.
- Sucursales: Las Mercedes, Altamira y Chacao vienen del tablero. La Trinidad (Av. Principal de La Trinidad) viene de un directorio público, Wanderlog. Faltan direcciones exactas y horarios.
- Canal oficial de pedidos, contacto de catering y enlaces de redes sociales.
- Textos de ingredientes ("Carne de res", "Pan brioche", etc.): hay que confirmarlos con la receta real.
- Wanderlog lista el teléfono +58 414-2789853 y el sitio burgershackve.com. No se usaron: hay que confirmarlos con la marca.

## Comportamiento verificado

Se revisó con Playwright en 1440×900 (escritorio), 820×1180 (tablet, táctil) y 390×844 (móvil, táctil):

- Sin scroll horizontal ni errores de consola.
- Hamburguesa desmontable: se fija, se separa con etiquetas laterales, se vuelve a armar y suelta la página. En móvil y tablet usa un recorrido más corto, etiquetas compactas y sin sombras (por rendimiento).
- Destacados: scroll horizontal fijado solo en escritorio con ratón. En pantallas táctiles es un carrusel nativo con *scroll snap* y botones anterior y siguiente.
- `prefers-reduced-motion`: sin loader ni scroll suave. La hamburguesa se muestra separada y estática, y el contenido aparece directamente.
- Accesibilidad: enlace "saltar al contenido", pestañas del menú con flechas del teclado, panel de pedidos con foco atrapado y cierre con Esc, y textos alternativos.
