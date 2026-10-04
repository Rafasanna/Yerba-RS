import { usePriceStore } from '../store/priceStore.js'
import { formatARS } from '../lib/format.js'

/** Muestra el precio de una presentación según la última lectura de la hoja. */
export default function Price({ id, className = '' }) {
  const status = usePriceStore((s) => s.status)
  const price = usePriceStore((s) => s.prices[id])

  if (typeof price === 'number') return <span className={className}>{formatARS(price)}</span>
  if (status === 'idle' || status === 'loading')
    return <span className={`inline-block h-[0.9em] w-20 animate-pulse rounded bg-current opacity-15 align-middle ${className}`} aria-label="Cargando precio" />
  return <span className={`text-[0.8em] font-medium opacity-70 ${className}`}>Sin precio</span>
}
