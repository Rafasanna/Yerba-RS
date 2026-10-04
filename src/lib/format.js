const ars = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

/** 8000 → "$ 8.000" */
export const formatARS = (n) => ars.format(n).replace(/ /g, ' ')
