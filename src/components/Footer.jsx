import Logo from './Logo.jsx'
import { WhatsAppIcon, InstagramIcon, GlobeIcon } from './Icons.jsx'
import { DELIVERY_OPTIONS, WHATSAPP_NUMBER, OFFICIAL_BRAND } from '../config.js'

export default function Footer() {
  const retiro = DELIVERY_OPTIONS.find((o) => o.address)
  const phone = `+${WHATSAPP_NUMBER.replace(/^(\d{2})(\d)(\d{4})(\d{6})$/, '$1 $2 $3 $4')}`
  return (
    <footer id="contacto" className="bg-andino text-cream-100/85">
      <div className="guarda" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-cream-100/65">Revendedor de {OFFICIAL_BRAND.name}.</p>
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
        <div>
          <h3 className="text-xs font-semibold tracking-[0.25em] text-gold-400">MARCA OFICIAL</h3>
          <div className="mt-3 flex items-start gap-3">
            <img src="/images/logo-gaucho.png" alt={`Logo de ${OFFICIAL_BRAND.name}`} className="w-12 shrink-0 rounded-full" />
            <ul className="space-y-1.5">
              <li>
                <a href={OFFICIAL_BRAND.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium hover:text-gold-300">
                  <InstagramIcon /> {OFFICIAL_BRAND.instagram}
                </a>
              </li>
              <li>
                <a href={OFFICIAL_BRAND.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium hover:text-gold-300">
                  <GlobeIcon /> {OFFICIAL_BRAND.website}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="border-t border-gold-500/15 px-4 py-5 text-center text-xs text-cream-100/50">
        {OFFICIAL_BRAND.name}, sus logos e imágenes pertenecen a sus titulares. 1108 es un revendedor independiente.
      </p>
    </footer>
  )
}
