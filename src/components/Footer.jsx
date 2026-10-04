import Logo from './Logo.jsx'
import { WhatsAppIcon } from './Icons.jsx'
import { DELIVERY_OPTIONS, WHATSAPP_NUMBER } from '../config.js'

export default function Footer() {
  const retiro = DELIVERY_OPTIONS.find((o) => o.address)
  const phone = `+${WHATSAPP_NUMBER.replace(/^(\d{2})(\d)(\d{4})(\d{6})$/, '$1 $2 $3 $4')}`
  return (
    <footer id="contacto" className="bg-andino text-cream-100/85">
      <div className="guarda" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="flex items-center gap-4">
          <img src="/images/logo-gaucho.png" alt="" className="w-16 rounded-full" />
          <Logo />
        </div>
        <div>
          <h3 className="text-xs font-semibold tracking-[0.25em] text-gold-400">RETIRO</h3>
          {retiro && <p className="mt-2">{retiro.address}</p>}
          <p className="mt-1 text-sm text-cream-100/65">También hacemos envíos: el costo se coordina por WhatsApp.</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold tracking-[0.25em] text-gold-400">PEDIDOS</h3>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 font-medium hover:text-gold-300">
            <WhatsAppIcon /> {phone}
          </a>
        </div>
      </div>
    </footer>
  )
}
