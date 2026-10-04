import { useEffect } from 'react'

/** Bloquea el scroll del fondo y cierra con Escape mientras `active` es true. */
export function useOverlay(active, onClose) {
  useEffect(() => {
    if (!active) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [active, onClose])
}
