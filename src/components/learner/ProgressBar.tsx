interface Props {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
}

export default function ProgressBar({ value, max = 100, className = '', showLabel = false }: Props) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-zinc-500 w-8 text-right">{pct}%</span>
      )}
    </div>
  )
}
