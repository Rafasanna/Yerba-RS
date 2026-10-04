import Logo from './Logo.jsx'
import { CartIcon } from './Icons.jsx'
import { useCartStore } from '../store/cartStore.js'

export default function Header() {
  const count = useCartStore((s) => Object.values(s.items).reduce((a, b) => a + b, 0))
  const open = useCartStore((s) => s.open)

  return (
    <header className="sticky top-0 z-30 border-b border-gold-500/15 bg-pine-800/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6">
        <a href="#inicio" aria-label="1108 Yerba Mate — inicio">
          <Logo />
        </a>

        <nav className="flex items-center gap-2 sm:gap-8">
          <a href="#yerbas" className="hidden text-xs font-semibold tracking-[0.2em] text-cream-100/85 transition hover:text-gold-400 sm:inline">
            YERBAS
          </a>
          <a href="#gran-oro" className="hidden text-xs font-semibold tracking-[0.2em] text-cream-100/85 transition hover:text-gold-400 sm:inline">
            GRAN ORO
          </a>
          <a href="#contacto" className="hidden text-xs font-semibold tracking-[0.2em] text-cream-100/85 transition hover:text-gold-400 sm:inline">
            CONTACTO
          </a>
          <button
            type="button"
            onClick={open}
            className="relative inline-flex items-center gap-2 rounded-md bg-gold-500 px-3.5 py-2 text-sm font-semibold tracking-wider text-pine-900 transition hover:bg-gold-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
            aria-label={`Abrir carrito, ${count} ${count === 1 ? 'producto' : 'productos'}`}
          >
            <CartIcon />
            <span className="hidden sm:inline">CARRITO</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 grid h-5 min-w-5 place-items-center rounded-full bg-cream-50 px-1 text-[0.7rem] font-bold text-pine-900 ring-2 ring-pine-800">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
