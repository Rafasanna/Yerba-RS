import { products } from '../data/products.js'

export default function AwardBand({ onOpenProduct }) {
  const premium = products.find((p) => p.award)
  if (!premium) return null
  return (
    <section id="gran-oro" className="mt-16 scroll-mt-20 bg-pine-900 sm:mt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-[auto_1fr] md:gap-14 md:py-16">
        <img src={premium.award.image} alt="Medalla Gran Oro — Mundial de la Yerba Mate" className="mx-auto w-40 drop-shadow-[0_20px_40px_rgb(184_151_90/0.35)] sm:w-52" />
        <div>
          <h2 className="font-display text-4xl leading-tight text-cream-100 sm:text-5xl">
            La máxima distinción. <span className="text-gold-400">Un estándar que se demuestra.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-cream-100/80">
            Uruguaí Premium alcanzó el puntaje más alto del Primer Mundial de la Yerba Mate y fue reconocida con el Gran Oro.
          </p>
          <div className="mt-6 flex flex-wrap items-end gap-x-10 gap-y-4 border-t border-gold-500/25 pt-5">
            <div>
              <p className="font-display text-5xl text-gold-500">100<span className="text-xl">/100</span></p>
              <p className="text-xs font-semibold tracking-[0.2em] text-cream-100/70">PUNTAJE PERFECTO</p>
            </div>
            <div>
              <p className="font-display text-5xl text-gold-500">+420</p>
              <p className="text-xs font-semibold tracking-[0.2em] text-cream-100/70">MUESTRAS EVALUADAS A CIEGAS</p>
            </div>
            <button onClick={() => onOpenProduct(premium)} className="rounded-md bg-gold-500 px-5 py-3 text-sm font-semibold tracking-wider text-pine-900 transition hover:bg-gold-400">
              PROBAR LA PREMIUM
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
