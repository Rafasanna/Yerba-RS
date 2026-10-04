import test from 'node:test'
import assert from 'node:assert/strict'
import { parsePrice, parsePriceSheet, parseCSV } from './prices.js'
import { buildOrderMessage, buildWhatsAppUrl } from './whatsapp.js'

test('parsePrice', () => {
  assert.equal(parsePrice('8000'), 8000)
  assert.equal(parsePrice('8.000'), 8000)
  assert.equal(parsePrice('$ 8.000'), 8000)
  assert.equal(parsePrice('8.000,50'), 8000.5)
  assert.equal(parsePrice('8000,5'), 8000.5)
  assert.equal(parsePrice('8000.5'), 8000.5)
  assert.equal(parsePrice('1.234.567'), 1234567)
  assert.equal(parsePrice('0'), 0)
  assert.equal(parsePrice('-5'), null)
  assert.equal(parsePrice(''), null)
  assert.equal(parsePrice('abc'), null)
  assert.equal(parsePrice('1.2.3'), null)
})

test('parsePriceSheet', () => {
  const csv = '﻿id,precio\r\npremium-1kg,"8.000"\r\nsuave-1kg,7000\r\npremium-500g,\r\nsuave-500g,gratis\r\n'
  const { prices, invalid } = parsePriceSheet(csv)
  assert.deepEqual(prices, { 'premium-1kg': 8000, 'suave-1kg': 7000 })
  assert.deepEqual(invalid, ['suave-500g'])
  assert.throws(() => parsePriceSheet('nombre,valor\na,1'), /id/)
  assert.throws(() => parsePriceSheet('<!DOCTYPE html><html>'), /CSV/)
  assert.deepEqual(parseCSV('a,"b,""c"""\n'), [['a', 'b,"c"']])
})

test('whatsapp message', () => {
  const msg = buildOrderMessage({
    lines: [{ name: 'Uruguaí Premium 1 kg', qty: 2, unitPrice: 8000, subtotal: 16000 }],
    total: 16000,
    delivery: { address: null },
  })
  assert.match(msg, /2 x \$ 8\.000 = \$ 16\.000/)
  assert.match(msg, /Costo de envío a coordinar/)
  const url = buildWhatsAppUrl('5493446643623', msg)
  assert.ok(msg.startsWith('¡Hola Raúl! Quiero hacer este pedido de Yerba:'))
  assert.ok(url.startsWith('https://wa.me/5493446643623?text=%C2%A1Hola'))
  assert.equal(decodeURIComponent(url.split('text=')[1]), msg)
})
