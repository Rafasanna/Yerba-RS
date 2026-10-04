import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import PriceNotice from './components/PriceNotice.jsx'
import Hero from './components/Hero.jsx'
import AwardBand from './components/AwardBand.jsx'
import Footer from './components/Footer.jsx'
import ProductModal from './components/ProductModal.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import { usePriceStore } from './store/priceStore.js'

export default function App() {
  const load = usePriceStore((s) => s.load)
  const [activeProduct, setActiveProduct] = useState(null)
  const closeProduct = useCallback(() => setActiveProduct(null), [])

  // Leer la hoja al abrir y cada vez que la pestaña vuelve a tener foco.
  useEffect(() => {
    load()
    const onFocus = () => load()
    const onVisible = () => document.visibilityState === 'visible' && load()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [load])

  return (
    <>
      <Header />
      <PriceNotice />
      <main>
        <Hero onOpenProduct={setActiveProduct} />
        <AwardBand onOpenProduct={setActiveProduct} />
      </main>
      <Footer />
      <ProductModal key={activeProduct?.slug ?? 'none'} product={activeProduct} onClose={closeProduct} />
      <CartDrawer />
    </>
  )
}
