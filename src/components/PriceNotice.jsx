import { usePriceStore } from '../store/priceStore.js'
import { AlertIcon } from './Icons.jsx'

/** Aviso global si la hoja de precios no se pudo leer (o si está en modo demo). */
export default function PriceNotice() {
  const { status, error, isDemo, load } = usePriceStore()

  if (status === 'error') {
    return (
      <div role="alert" className="bg-alert-600 text-cream-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 text-sm sm:px-6">
          <AlertIcon />
          <span className="flex-1 font-medium">
            No pudimos cargar los precios actualizados. {error} Por ahora no se pueden enviar pedidos.
          </span>
          <button onClick={load} className="rounded border border-cream-50/60 px-3 py-1 font-semibold hover:bg-cream-50/10">
            Reintentar
          </button>
        </div>
      </div>
    )
  }
  if (isDemo) {
    return (
      <div className="bg-gold-300 text-center text-xs font-semibold text-pine-900 py-1.5 px-4">
        Modo demo: precios de ejemplo (public/precios-demo.csv). Configurá SHEET_CSV_URL en src/config.js.
      </div>
    )
  }
  return null
}
