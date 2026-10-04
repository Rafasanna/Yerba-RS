import Price from './Price.jsx'
import { ArrowIcon } from './Icons.jsx'

export default function ProductCard({ product, onOpen, index }) {
  const main = product.variants[0]
  return (
    <article
      className="anim-fade-up group flex flex-col overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 shadow-[0_20px_50px_-25px_rgb(20_28_18/0.55)]"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex flex-1 flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-gold-500"
        aria-label={`Ver ${product.fullName}`}
      >
        <div className="relative bg-cream-200 p-4 sm:p-5">
          <div className="relative grid h-64 place-items-center rounded-xl border border-gold-500/30 bg-gradient-to-b from-cream-100 to-cream-200 sm:h-80">
            <img
              src={product.image}
              alt={`Paquete de ${product.fullName}`}
              className="h-56 w-auto object-contain sm:h-72 drop-shadow-[0_18px_18px_rgb(30_36_26/0.25)] transition duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.02]"
              loading="eager"
            />
            {product.award && (
              <img
                src={product.award.image}
                alt="Gran Oro — Mundial de la Yerba Mate"
                className="absolute top-3 right-3 w-20 drop-shadow-lg sm:top-4 sm:right-4 sm:w-24"
              />
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-7">
          <span className="text-sm font-semibold tracking-[0.2em] text-gold-500">{product.number}</span>
          <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-display text-4xl text-ink-800 sm:text-5xl">{product.name}</h3>
            <p className="text-2xl font-semibold text-ink-800 sm:text-xl">
              <span className="mr-1.5 text-base font-medium text-ink-600 sm:text-sm">{main.label}</span>
              <Price id={main.id} />
            </p>
          </div>
          {product.award && (
            <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold tracking-wide text-gold-600">
              ★ {product.award.title}
            </p>
          )}

          <div className="mt-auto pt-6">
            <span className="flex items-center justify-center gap-2 rounded-md border border-gold-500/40 py-3 text-sm font-semibold tracking-wider text-gold-600 transition group-hover:gap-3 group-hover:bg-pine-800 group-hover:text-gold-300">
              VER Y AGREGAR <ArrowIcon />
            </span>
          </div>
        </div>
      </button>
    </article>
  )
}
