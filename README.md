# Uruguaí Yerba Mate — Landing con precios desde Google Sheets

Landing de una sola página (React + Vite + Tailwind CSS + Zustand).
Muestra las yerbas, permite armarlas en un carrito y envía el pedido por WhatsApp.
Los **precios** se leen de una hoja de Google Sheets: los cambiás en la hoja y la página se actualiza sola, sin tocar código ni volver a publicar.

---

## 1. Correrlo en tu compu

```bash
npm install
npm run dev        # abre http://localhost:5173
```

Mientras no configures la hoja, en modo desarrollo se usan los precios de ejemplo de `public/precios-demo.csv` y aparece una franja amarilla que dice "Modo demo".
En el sitio publicado esos precios de ejemplo **nunca** se usan: sin hoja configurada, la tienda muestra un error y no deja enviar pedidos.

Otros comandos:

```bash
npm run build      # genera la carpeta dist/ para publicar
npm run preview    # prueba localmente la versión de dist/
npm test           # pruebas del lector de precios y del mensaje de WhatsApp
```

---

## 2. Crear la hoja de precios (paso a paso)

1. Entrá a [sheets.new](https://sheets.new) con tu cuenta de Google. Ponele un nombre, por ejemplo **Precios Uruguaí**.
2. En la **fila 1** escribí los títulos: `id` en la celda **A1** y `precio` en la **B1**.
3. Desde la fila 2, cargá un producto por fila (o importá el archivo `precios-plantilla.csv` con *Archivo → Importar*):

   | id           | precio |
   |--------------|--------|
   | premium-1kg  | 7999   |
   | suave-1kg    | 6999   |

   - El `id` tiene que ser **exactamente** igual al de `src/data/products.js` (minúsculas, con guion).
   - El precio va en pesos, sin centavos si no hace falta. Se aceptan `8000`, `8.000` o `$ 8.000`.
   - Si dejás un precio **vacío**, ese producto aparece como "Sin precio" y no se puede agregar al carrito.
   - Un precio negativo o con letras se considera inválido y se trata igual que vacío.

4. **Publicar como CSV**: *Archivo → Compartir → Publicar en la web*.
   - En el primer desplegable elegí la **pestaña** donde están los precios (no "Todo el documento").
   - En el segundo desplegable elegí **Valores separados por comas (.csv)**.
   - Tocá **Publicar** y confirmá.
   - Copiá el enlace que aparece. Termina en `output=csv`.
5. **Permisos**: no compartas la hoja con nadie más como editor. Publicarla en la web solo da **acceso de lectura** a esa pestaña en formato CSV; nadie puede editarla desde ese enlace. En *Compartir* dejá el acceso general como "Restringido". Así vos sos la única persona que puede editar.
6. Asegurate de que en *Publicar en la web → Contenido publicado y configuración* esté tildado **"Volver a publicar automáticamente cuando se realicen cambios"** (viene activado por defecto).

## 3. Pegar la URL en el proyecto

Abrí `src/config.js` y pegá el enlace entre las comillas:

```js
export const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv'
```

Guardá, corré `npm run dev` y comprobá que desaparezca la franja "Modo demo" y se vean tus precios. Después publicá el sitio (paso 6).

> **Ojo con la demora de Google:** Google tarda unos minutos (normalmente hasta 5) en reflejar los cambios en el enlace publicado. La página siempre pide la versión más nueva, pero si cambiás un precio y no lo ves enseguida, esperá un poco y recargá.

---

## 4. Cómo funcionan los precios en la página

- La hoja se vuelve a leer **al abrir la página**, **cada vez que volvés a la pestaña** y **justo antes de armar el mensaje de WhatsApp**.
- El carrito guarda solo productos y cantidades (en `localStorage`). Los precios se calculan siempre con la última lectura de la hoja, nunca con precios guardados.
- Si la hoja no se puede leer, aparece un aviso rojo, se ocultan los totales y **no se puede enviar el pedido**.
- Si a un producto del carrito le falta el precio, se avisa cuál es y no se puede enviar hasta quitarlo.
- Si al tocar "Enviar pedido" el precio cambió respecto del que veía el cliente, el pedido no se envía: se actualiza el total y se le pide que lo revise y toque de nuevo.

---

## 5. Cambiar productos, textos e imágenes

**Textos y presentaciones** → `src/data/products.js`
Cada producto tiene `name`, `description`, `image` y una lista `variants` (presentaciones). Cada presentación tiene un `id` (el que va en la hoja) y un `label` (lo que ve el cliente, ej. "1 kg").

Para **agregar un producto o presentación**:
1. Agregalo en `src/data/products.js` con un `id` nuevo (ej. `premium-250g`).
2. Agregá una fila en la hoja con ese mismo `id` y su precio.

Para **quitar** una presentación, borrala de `products.js` (la fila de la hoja puede quedar, no molesta).

**Imágenes** → carpeta `public/images/`
Reemplazá `premium.png` o `suave.png` por otra foto con el mismo nombre, o subí un archivo nuevo y cambiá la ruta en `image: '/images/mi-foto.png'`. Funcionan mejor PNG con fondo transparente, de unos 600–800 px de alto.

> Las imágenes incluidas están recortadas de las capturas de la web de referencia. Para el sitio final conviene reemplazarlas por las fotos originales en alta resolución (paquetes, logo del gaucho y medalla Gran Oro).

**WhatsApp y modalidad de retiro/envío** → `src/config.js` (`WHATSAPP_NUMBER` y `DELIVERY_OPTIONS`).

**Colores y tipografías** → `src/index.css` (bloque `@theme`) e `index.html` (link de Google Fonts).

---

## 6. Publicar

Cualquier hosting de sitios estáticos sirve (Vercel, Netlify, Cloudflare Pages, GitHub Pages):

- Comando de build: `npm run build`
- Carpeta a publicar: `dist`

Una vez publicado, **no hace falta volver a publicar para cambiar precios**: solo editá la hoja.

---

## Estructura

```
public/images/          fotos de productos, logo y medalla
public/precios-demo.csv precios de ejemplo (solo en desarrollo)
precios-plantilla.csv   plantilla para importar en Google Sheets
src/config.js           URL de la hoja, WhatsApp, modalidades de entrega
src/data/products.js    productos (nombres, descripciones, imágenes, ids)
src/lib/prices.js       lectura y validación del CSV
src/lib/whatsapp.js     armado del mensaje y del enlace
src/store/              carrito (Zustand + localStorage) y precios
src/components/         Header, Hero, tarjetas, detalle, carrito, footer
```
