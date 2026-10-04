import { useCallback, useState } from 'react'
import { useCartStore, computeCart } from '../store/cartStore.js'
import { usePriceStore } from '../store/priceStore.js'
import { useOverlay } from '../lib/useOverlay.js'
import { formatARS } from '../lib/format.js'
import { buildOrderMessage, buildWhatsAppUrl } from '../lib/whatsapp.js'
import { DELIVERY_OPTIONS, WHATSAPP_NUMBER } from '../config.js'
import QtyStepper from './QtyStepper.jsx'
import { AlertIcon, CloseIcon, TrashIcon, WhatsAppIcon } from './Icons.jsx'

export default function CartDrawer() {
  const { items, delivery, isOpen, close, setQty, remove, setDelivery } = useCartStore()
  const { prices, status, error: priceError, load } = usePriceStore()
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState(null) // { type: 'error' | 'info', text }

  const handleClose = useCallback(() => { close(); setNotice(null) }, [close])
  useOverlay(isOpen, handleClose)

  if (!isOpen) return null

  const { lines, missing, total, count } = computeCart(items, prices)
  const priceProblem = status === 'error' || missing.length > 0
  const deliveryOption = DELIVERY_OPTIONS.find((o) => o.id === delivery)

  const handleSend = async () => {
    setNotice(null)
    if (!deliveryOption) {
      setNotice({ type: 'error', text: 'Elegí una modalidad de entrega para continuar.' })
      return
    }

    // Se abre la pestaña ya mismo (si no, el navegador la bloquea por ser
    // posterior a una espera) y se completa cuando confirmamos los precios.
    const shown = Object.fromEntries(lines.map((l) => [l.id, l.unitPrice]))
    const win = window.open('', '_blank')
    if (win) {
      win.opener = null
      win.document.title = 'Preparando pedido…'
      win.document.body.innerHTML = '<p style="font-family:sans-serif;padding:2rem">Preparando tu pedido…</p>'
    }
    const abort = (n) => { if (win) win.close(); setNotice(n); setSending(false) }

    setSending(true)
    const result = await load() // volver a leer la hoja antes de armar el pedido
    if (!result.ok) {
      return abort({ type: 'error', text: `No pudimos confirmar los precios: ${result.error} El pedido no se envió.` })
    }

    const fresh = computeCart(useCartStore.getState().items, result.prices)
    if (fresh.missing.length) {
      return abort({ type: 'error', text: `Falta el precio de: ${fresh.missing.map((l) => l.name).join(', ')}. Quitalo del carrito o consultanos.` })
    }
    const changed = fresh.lines.some((l) => shown[l.id] !== l.unitPrice)
    if (changed) {
      return abort({ type: 'info', text: 'Los precios se actualizaron recién. Revisá el nuevo total y tocá «Enviar pedido» otra vez.' })
    }

    const message = buildOrderMessage({ lines: fresh.lines, total: fresh.total, delivery: deliveryOption })
    const url = buildWhatsAppUrl(WHATSAPP_NUMBER, message)
    if (win) win.location.href = url
    else window.location.href = url
    setSending(false)
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div className="anim-fade-in absolute inset-0 bg-pine-950/60 backdrop-blur-sm" onClick={handleClose} />

      <aside className="anim-slide-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream-50 shadow-2xl">
        <div className="flex items-center justify-between bg-pine-800 px-5 py-4 text-cream-100">
          <h2 id="cart-title" className="font-display text-2xl text-gold-400">
            Tu pedido {count > 0 && <span className="text-base text-cream-100/70">({count})</span>}
          </h2>
          <button onClick={handleClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-pine-700" aria-label="Cerrar carrito">
            <CloseIcon />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <img src="/images/logo-gaucho.png" alt="" className="w-24 opacity-80" />
            <p className="text-lg font-medium text-ink-800">Tu carrito está vacío.</p>
            <button onClick={handleClose} className="rounded-md bg-gold-500 px-5 py-2.5 font-semibold tracking-wider text-pine-900 hover:bg-gold-400">
              VER YERBAS
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {status === 'error' && (
                <Alert>
                  {priceError} No se puede enviar el pedido hasta confirmar los precios.{' '}
                  <button onClick={load} className="font-semibold underline">Reintentar</button>
                </Alert>
              )}

              <ul className="divide-y divide-cream-300">
                {lines.map((l) => (
                  <li key={l.id} className="flex gap-3 py-4">
                    <div className="grid h-20 w-16 shrink-0 place-items-center rounded-lg bg-cream-200">
                      <img src={l.product.image} alt="" className="h-16 w-auto object-contain" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold leading-tight text-ink-800">{l.product.fullName}</p>
                          <p className="text-sm">
                            {l.variant.label} ·{' '}
                            {l.unitPrice !== null ? `${formatARS(l.unitPrice)} c/u` : <span className="font-semibold text-alert-600">sin precio</span>}
                          </p>
                        </div>
                        <button onClick={() => remove(l.id)} className="rounded-full p-1.5 text-ink-600 hover:bg-cream-200 hover:text-alert-600" aria-label={`Quitar ${l.name}`}>
                          <TrashIcon />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <QtyStepper size="sm" value={l.qty} onChange={(n) => setQty(l.id, n)} label={`Cantidad de ${l.name}`} />
                        <span className="font-semibold tabular-nums text-ink-800">
                          {l.subtotal !== null ? formatARS(l.subtotal) : '—'}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {missing.length > 0 && status !== 'error' && status !== 'loading' && (
                <Alert>
                  Falta el precio de {missing.map((l) => l.name).join(', ')}. Quitalo del carrito para poder enviar el pedido.
                </Alert>
              )}

              <fieldset className="mt-4">
                <legend className="mb-2 text-xs font-semibold tracking-[0.2em] text-ink-800">MODALIDAD DE ENTREGA</legend>
                <div className="space-y-2">
                  {DELIVERY_OPTIONS.map((o) => {
                    const selected = delivery === o.id
                    return (
                      <label key={o.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 px-4 py-3 transition ${selected ? 'border-gold-500 bg-gold-500/10' : 'border-cream-300 hover:border-gold-400'}`}>
                        <input type="radio" name="delivery" value={o.id} checked={selected} onChange={() => { setDelivery(o.id); setNotice(null) }} className="mt-1 accent-[#9c7d45]" />
                        <span>
                          <span className="block font-semibold text-ink-800">{o.label}</span>
                          <span className="text-sm">{o.detail}</span>
                        </span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            </div>

            <div className="border-t border-cream-300 bg-cream-100 px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-ink-800">Total de productos</span>
                <span className="font-display text-3xl text-ink-800 tabular-nums">
                  {priceProblem ? '—' : formatARS(total)}
                </span>
              </div>
              {delivery === 'envio' && <p className="mt-1 text-right text-sm">+ envío a coordinar por WhatsApp</p>}

              {notice && (
                <p role="alert" className={`mt-3 rounded-lg px-3 py-2 text-sm font-medium ${notice.type === 'error' ? 'bg-alert-50 text-alert-600' : 'bg-gold-500/15 text-gold-600'}`}>
                  {notice.text}
                </p>
              )}

              <button
                type="button"
                onClick={handleSend}
                disabled={sending || priceProblem}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-wa-500 px-5 py-3.5 font-semibold text-white transition hover:bg-wa-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <WhatsAppIcon />
                {sending ? 'Confirmando precios…' : 'Enviar pedido por WhatsApp'}
              </button>
              <p className="mt-2 text-center text-xs">Se abre WhatsApp con tu pedido listo para revisar y enviar.</p>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

function Alert({ children }) {
  return (
    <div role="alert" className="my-3 flex gap-2 rounded-lg bg-alert-50 px-3 py-2.5 text-sm text-alert-600">
      <AlertIcon className="mt-0.5 shrink-0" />
      <p>{children}</p>
    </div>
  )
}
