// Lectura y validación de la hoja de precios (CSV publicado).

/** Parser CSV mínimo: soporta comillas, comas y saltos de línea dentro de comillas. */
export function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  const src = String(text).replace(/^﻿/, '')

  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++ } else inQuotes = false
      } else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++
      row.push(field); rows.push(row); row = []; field = ''
    } else field += c
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row) }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''))
}

/**
 * Convierte el texto de una celda en número.
 * Acepta "8000", "8.000", "$ 8.000", "8000,50", "8.000,50", "8000.50".
 * Devuelve null si no es un número válido mayor o igual a cero.
 */
export function parsePrice(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\$|ARS|\s/gi, '')
  if (s === '') return null
  if (!/^[\d.,]+$/.test(s)) return null

  const hasDot = s.includes('.')
  const hasComma = s.includes(',')
  if (hasDot && hasComma) {
    // formato argentino: 8.000,50
    s = s.replace(/\./g, '').replace(',', '.')
  } else if (hasComma) {
    // "8000,50" decimal  |  "8,000" miles
    s = /^\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g, '') : s.replace(',', '.')
  } else if (hasDot && /^\d{1,3}(\.\d{3})+$/.test(s)) {
    // "8.000" → miles
    s = s.replace(/\./g, '')
  }
  if ((s.match(/\./g) || []).length > 1) return null

  const n = Number(s)
  if (!Number.isFinite(n) || n < 0) return null
  return Math.round(n * 100) / 100
}

/**
 * Lee el CSV y devuelve { prices: { id: número }, invalid: [ids con precio inválido] }.
 * Lanza un Error si el formato de la hoja no es el esperado.
 */
export function parsePriceSheet(text) {
  const trimmed = String(text).trim()
  if (/^<!doctype html|^<html/i.test(trimmed)) {
    throw new Error('La URL devolvió una página web en vez de un CSV. Revisá que la hoja esté publicada en formato CSV.')
  }
  const rows = parseCSV(trimmed)
  if (rows.length === 0) throw new Error('La hoja de precios está vacía.')

  const header = rows[0].map((h) => h.trim().toLowerCase())
  const idCol = header.indexOf('id')
  const priceCol = header.indexOf('precio')
  if (idCol === -1 || priceCol === -1) {
    throw new Error('La hoja tiene que tener dos columnas con los títulos "id" y "precio" en la primera fila.')
  }

  const prices = {}
  const invalid = []
  for (const row of rows.slice(1)) {
    const id = (row[idCol] ?? '').trim()
    if (!id) continue
    const price = parsePrice(row[priceCol])
    if (price === null) {
      if ((row[priceCol] ?? '').trim() !== '') invalid.push(id)
      delete prices[id]
    } else {
      prices[id] = price
    }
  }
  return { prices, invalid }
}

/** Descarga la hoja sin caché del navegador. */
export async function fetchPriceSheet(url, { timeoutMs = 10000 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const sep = url.includes('?') ? '&' : '?'
    const res = await fetch(`${url}${sep}_=${Date.now()}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`No se pudo leer la hoja de precios (error ${res.status}).`)
    return parsePriceSheet(await res.text())
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('La hoja de precios tardó demasiado en responder.')
    if (err instanceof TypeError) throw new Error('No se pudo conectar con la hoja de precios. Revisá tu conexión.')
    throw err
  } finally {
    clearTimeout(timer)
  }
}
