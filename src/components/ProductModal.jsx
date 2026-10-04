import { useEffect, useState } from 'react'
import { useCartStore } from '../store/cartStore.js'
import { usePriceStore } from '../store/priceStore.js'
import { useOverlay } from '../lib/useOverlay.js'
import { formatARS } from '../lib/format.js'
import Price from './Price.jsx'
import QtyStepper from './QtyStepper.jsx'
import { CloseIcon, CartIcon } from './Icons.jsx'

export default function ProductModal({ product, onClose }) {
  const prices = usePriceStore((s) => s.prices)
  const status = usePriceStore((s) => s.status)
  const add = useCartStore((s) => s.add)
  const openCart = useCartStore((s) => s.open)
  const [variantId, setVariantId] = useState(null)
  const [qty, setQty] = useState(1)

  useOverlay(Boolean(product), onClose)

  // Elegir por defecto la primera presentación que tenga precio
  useEffect(() => {
    if (!product) return
    const firstWithPrice = product.variants.find((v) => typeof prices[v.id] === 'number')
    setVariantId((current) =>
      current && product.variants.some((v) => v.id === current) ? current : (firstWithPrice || product.variants[0]).id,
    )
  }, [product, prices])

  if (!product) return null
  const price = prices[variantId]
  const hasPrice = typeof price === 'number'

  const handleAdd = () => {
    if (!hasPrice) return
    add(variantId, qty)
    onClose()
    openCart()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="anim-fade-in absolute inset-0 bg-pine-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="anim-fade-up relative grid max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-cream-50 shadow-2xl sm:grid-cols-[0.9fr_1.1fr] sm:rounded-3xl">
        <button onClick={onClose} className="absolute top-3 right-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-cream-50/90 text-ink-800 shadow hover:bg-cream-200" aria-label="Cerrar">
          <CloseIcon />
        </button>

        <div className="relative grid place-items-center bg-cream-200 p-6 sm:p-8">
          <img src={product.image} alt={`Paquete de ${product.fullName}`} className="h-60 w-auto object-contain drop-shadow-[0_20px_20px_rgb(30_36_26/0.28)] sm:h-[26rem]" />
          {product.award && (
            <img src={product.award.image} alt="" className="absolute bottom-4 left-4 w-20 drop-shadow-lg sm:w-28" />
          )}
        </div>

        <div className="flex flex-col p-6 sm:p-9">
          <span className="text-sm font-semibold tracking-[0.2em] text-gold-500">{product.number} · {product.tagline.toUpperCase()}</span>
          <h2 id="modal-title" className="mt-1 font-display text-4xl text-ink-800 sm:text-5xl">{product.fullName}</h2>
          <p className="mt-4 leading-relaxed">{product.description}</p>

          {product.award && (
            <div className="mt-5 flex items-center gap-4 rounded-xl bg-pine-800 p-4 text-cream-100">
              <span className="font-display text-4xl leading-none text-gold-400">100<span className="text-base text-gold-300">/100</span></span>
              <p className="text-sm leading-snug"><strong className="text-gold-300">{product.award.title}.</strong> {product.award.text}</p>
            </div>
          )}

          {product.variants.length === 1 && (
            <p className="mt-6 text-3xl font-semibold text-ink-800">
              <span className="mr-2 text-base font-medium text-ink-600">{product.variants[0].label}</span>
              <Price id={product.variants[0].id} />
            </p>
          )}

          {product.variants.length > 1 && (
          <fieldset className="mt-6">
            <legend className="mb-2 text-xs font-semibold tracking-[0.2em] text-ink-800">PRESENTACIÓN</legend>
            <div className="grid grid-cols-2 gap-3">
              {product.variants.map((v) => {
                const selected = v.id === variantId
                return (
                  <label key={v.id} className={`cursor-pointer rounded-xl border-2 px-4 py-3 transition ${selected ? 'border-gold-500 bg-gold-500/10' : 'border-cream-300 hover:border-gold-400'}`}>
                    <input type="radio" name="variant" value={v.id} checked={selected} onChange={() => setVariantId(v.id)} className="sr-only" />
                    <span className="block font-semibold text-ink-800">{v.label}</span>
                    <Price id={v.id} className="text-sm" />
                  </label>
                )
              })}
            </div>
          </fieldset>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <QtyStepper value={qty} onChange={(n) => setQty(Math.max(1, Math.min(99, n)))} label="Cantidad" />
            <button
              type="button"
              onClick={handleAdd}
              disabled={!hasPrice}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-pine-800 px-5 py-3 font-semibold tracking-wider text-gold-300 transition hover:bg-pine-700 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <CartIcon />
              {hasPrice ? `AGREGAR · ${formatARS(price * qty)}` : status === 'loading' ? 'CARGANDO PRECIO…' : 'PRECIO NO DISPONIBLE'}
            </button>
          </div>
          {!hasPrice && status !== 'loading' && (
            <p className="mt-3 text-sm text-alert-600">Esta presentación no tiene un precio válido en este momento. Consultanos por WhatsApp.</p>
          )}
        </div>
      </div>
    </div>
  )
}
