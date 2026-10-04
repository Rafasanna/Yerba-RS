// ─────────────────────────────────────────────────────────────
//  CONFIGURACIÓN DEL SITIO — este es el único archivo que tenés
//  que tocar para conectar la hoja de precios o cambiar datos
//  de contacto.
// ─────────────────────────────────────────────────────────────

// Pegá acá la URL de la hoja publicada como CSV
// (Archivo → Compartir → Publicar en la web → CSV).
// Tiene que terminar en "output=csv".
export const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQeKrd8UtLDcTcVKYlyR0q2Hd0TGmu6Tk7BJcTfO9orYDPAs1ZJGlCQzdRPdpjcbv9t4E5ss5r5nnOp/pub?output=csv'

// Mientras SHEET_CSV_URL esté vacía y estés en modo desarrollo
// (npm run dev), se usan los precios de ejemplo de
// public/precios-demo.csv. En el sitio publicado NUNCA se usan:
// sin URL, la tienda muestra un error y no deja enviar pedidos.
export const DEMO_CSV_URL = '/precios-demo.csv'

// Número de WhatsApp en formato internacional, sin "+" ni espacios.
export const WHATSAPP_NUMBER = '5493446643623'

// Modalidades de entrega. `address` se incluye en el mensaje.
export const DELIVERY_OPTIONS = [
  {
    id: 'retiro',
    label: 'Retiro en 2 de Abril 1539',
    detail: 'Agencia de Tómbola',
    address: '2 de Abril 1539 (Agencia de Tómbola)',
  },
  {
    id: 'envio',
    label: 'Envío',
    detail: 'Costo a coordinar por WhatsApp',
    address: null,
  },
]
