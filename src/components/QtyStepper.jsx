import { MinusIcon, PlusIcon } from './Icons.jsx'

export default function QtyStepper({ value, onChange, size = 'md', label }) {
  const btn = size === 'sm' ? 'h-8 w-8' : 'h-11 w-11'
  return (
    <div className="inline-flex items-center rounded-full border border-cream-300 bg-cream-50" role="group" aria-label={label}>
      <button type="button" className={`${btn} grid place-items-center rounded-full text-ink-800 transition hover:bg-cream-200 disabled:opacity-35`} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Restar uno">
        <MinusIcon />
      </button>
      <span className={`min-w-8 text-center font-semibold tabular-nums text-ink-800 ${size === 'sm' ? 'text-sm' : ''}`} aria-live="polite">{value}</span>
      <button type="button" className={`${btn} grid place-items-center rounded-full text-ink-800 transition hover:bg-cream-200 disabled:opacity-35`} onClick={() => onChange(value + 1)} disabled={value >= 99} aria-label="Sumar uno">
        <PlusIcon />
      </button>
    </div>
  )
}
