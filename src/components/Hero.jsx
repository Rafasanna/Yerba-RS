import { products } from '../data/products.js'
import ProductCard from './ProductCard.jsx'

export default function Hero({ onOpenProduct }) {
  return (
    <section id="inicio" className="relative">
      <div className="bg-andino pb-44 sm:pb-56">
        <div className="mx-auto flex max-w-6xl items-center gap-8 px-4 pt-10 sm:px-6 sm:pt-14">
          <div className="anim-fade-up flex-1">
            <p className="text-xs font-semibold tracking-[0.3em] text-gold-400/90">PADRÓN URUGUAYO · ENTRE RÍOS</p>
            <h1 className="mt-3 font-display text-5xl leading-[0.95] text-gold-500 sm:text-7xl">
              Uruguaí <br className="hidden sm:block" />Yerba Mate
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-cream-100/85 sm:text-lg">
              Molienda fina, hojas seleccionadas y estacionamiento prolongado. Elegí tu yerba, armá el pedido y te lo
              confirmamos por WhatsApp.
            </p>
          </div>
          <div className="relative hidden shrink-0 md:block">
            <div className="absolute -inset-10 rounded-full border border-gold-500/20" />
            <img
              src="/images/logo-gaucho.png"
              alt="Logo de Uruguaí: gaucho tomando mate"
              className="relative w-48 rounded-full shadow-[0_25px_60px_-15px_rgb(0_0_0/0.6)] lg:w-56"
            />
          </div>
        </div>
      </div>
      <div className="guarda -mt-[10px] relative" aria-hidden="true" />

      <div id="yerbas" className="relative mx-auto -mt-36 max-w-6xl scroll-mt-24 px-4 sm:-mt-48 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} onOpen={() => onOpenProduct(p)} />
          ))}
        </div>
      </div>
    </section>
  )
}
