// ─────────────────────────────────────────────────────────────
//  PRODUCTOS
//  Nombres, descripciones e imágenes viven acá.
//  Los PRECIOS no: vienen de la hoja de Google Sheets.
//
//  Cada presentación (variant) tiene un `id` que tiene que
//  coincidir EXACTO con la columna "id" de la hoja.
//  Las imágenes van en /public/images y se escriben como
//  "/images/nombre-archivo.png".
// ─────────────────────────────────────────────────────────────

export const products = [
  {
    slug: 'premium',
    number: '01',
    name: 'Premium',
    fullName: 'Uruguaí Premium',
    tagline: 'Ganadora del Gran Oro',
    description:
      'La variedad de Uruguaí ganadora del Gran Oro y puntaje perfecto en el Primer Mundial de la Yerba Mate. Elaborada con hojas cuidadosamente seleccionadas y un estacionamiento especial que le aporta un perfil equilibrado, un aroma distintivo y un sabor persistente.',
    image: '/images/premium.png',
    award: {
      image: '/images/gran-oro.png',
      title: 'Gran Oro · 100/100',
      text: 'Puntaje perfecto en el Primer Mundial de la Yerba Mate, entre más de 420 muestras evaluadas a ciegas.',
    },
    variants: [
      { id: 'premium-1kg', label: '1 kg' },
    ],
  },
  {
    slug: 'suave',
    number: '02',
    name: 'Suave',
    fullName: 'Uruguaí Suave',
    tagline: 'Perfil delicado',
    description:
      'Una alternativa de perfil más delicado, con molienda fina y un sabor amable. Ideal para quienes buscan un mate liviano, sin resignar aroma, cuerpo ni rendimiento.',
    image: '/images/suave.png',
    award: null,
    variants: [
      { id: 'suave-1kg', label: '1 kg' },
    ],
  },
]

// Índice rápido: id de presentación → { product, variant }
export const variantIndex = Object.fromEntries(
  products.flatMap((product) =>
    product.variants.map((variant) => [variant.id, { product, variant }]),
  ),
)
