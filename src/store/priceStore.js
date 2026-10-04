import { create } from 'zustand'
import { fetchPriceSheet } from '../lib/prices.js'
import { SHEET_CSV_URL, DEMO_CSV_URL } from '../config.js'

const isDemo = !SHEET_CSV_URL && import.meta.env.DEV
const sheetUrl = SHEET_CSV_URL || (isDemo ? DEMO_CSV_URL : '')

let inFlight = null

// Los precios NO se guardan en localStorage: siempre se leen de la hoja.
export const usePriceStore = create((set) => ({
  status: 'idle', // idle | loading | ready | error
  prices: {},
  invalid: [],
  error: null,
  updatedAt: null,
  isDemo,

  /** Vuelve a leer la hoja. Devuelve { ok, prices, error }. */
  load: () => {
    if (inFlight) return inFlight
    if (!sheetUrl) {
      const error = 'Falta configurar la hoja de precios (SHEET_CSV_URL en src/config.js).'
      set({ status: 'error', prices: {}, error })
      return Promise.resolve({ ok: false, prices: {}, error })
    }
    set({ status: 'loading' })
    inFlight = fetchPriceSheet(sheetUrl)
      .then(({ prices, invalid }) => {
        set({ status: 'ready', prices, invalid, error: null, updatedAt: Date.now() })
        return { ok: true, prices, error: null }
      })
      .catch((err) => {
        // Ante un error se descartan los precios anteriores: nunca se vende con un precio viejo.
        const error = err.message || 'No se pudo leer la hoja de precios.'
        set({ status: 'error', prices: {}, invalid: [], error })
        return { ok: false, prices: {}, error }
      })
      .finally(() => { inFlight = null })
    return inFlight
  },
}))
