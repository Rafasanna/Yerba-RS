import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { variantIndex } from '../data/products.js'

const clampQty = (n) => Math.max(1, Math.min(99, Math.floor(Number(n)) || 1))

// Solo se guardan ids y cantidades. Los precios se calculan siempre
// con la última lectura de la hoja.
export const useCartStore = create(
  persist(
    (set) => ({
      items: {}, // { [variantId]: cantidad }
      delivery: null, // id de DELIVERY_OPTIONS
      isOpen: false,

      add: (variantId, qty = 1) =>
        set((s) => ({
          items: { ...s.items, [variantId]: clampQty((s.items[variantId] || 0) + qty) },
        })),
      setQty: (variantId, qty) =>
        set((s) => ({ items: { ...s.items, [variantId]: clampQty(qty) } })),
      remove: (variantId) =>
        set((s) => {
          const items = { ...s.items }
          delete items[variantId]
          return { items }
        }),
      clear: () => set({ items: {} }),
      setDelivery: (delivery) => set({ delivery }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: 'uruguai-carrito',
      version: 1,
      partialize: (s) => ({ items: s.items, delivery: s.delivery }),
      // Al cargar, descarta productos que ya no existen en products.js
      merge: (persisted, current) => {
        const items = {}
        for (const [id, qty] of Object.entries(persisted?.items || {})) {
          if (variantIndex[id]) items[id] = clampQty(qty)
        }
        return { ...current, items, delivery: persisted?.delivery ?? null }
      },
    },
  ),
)

/** Arma las líneas del carrito con los precios dados. */
export function computeCart(items, prices) {
  const lines = Object.entries(items)
    .filter(([id]) => variantIndex[id])
    .map(([id, qty]) => {
      const { product, variant } = variantIndex[id]
      const unitPrice = prices[id]
      const hasPrice = typeof unitPrice === 'number'
      return {
        id,
        qty,
        product,
        variant,
        name: `${product.fullName} ${variant.label}`,
        unitPrice: hasPrice ? unitPrice : null,
        subtotal: hasPrice ? unitPrice * qty : null,
      }
    })
  const missing = lines.filter((l) => l.unitPrice === null)
  const total = lines.reduce((sum, l) => sum + (l.subtotal || 0), 0)
  const count = lines.reduce((sum, l) => sum + l.qty, 0)
  return { lines, missing, total, count }
}
