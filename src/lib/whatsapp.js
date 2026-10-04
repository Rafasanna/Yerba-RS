import { formatARS } from './format.js'

/**
 * Arma el texto del pedido.
 * lines: [{ name, qty, unitPrice, subtotal }]
 * delivery: { label, address }
 */
export function buildOrderMessage({ lines, total, delivery }) {
  const items = lines
    .map((l) => `• ${l.name}\n   ${l.qty} x ${formatARS(l.unitPrice)} = ${formatARS(l.subtotal)}`)
    .join('\n')

  const deliveryText = delivery.address
    ? `Modalidad: Retiro\nDirección: ${delivery.address}`
    : `Modalidad: Envío\nCosto de envío a coordinar`

  return [
    '¡Hola Raúl! Quiero hacer este pedido de Yerba:',
    '',
    items,
    '',
    `Total: ${formatARS(total)}`,
    '',
    deliveryText,
  ].join('\n')
}

export function buildWhatsAppUrl(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
