import { cn } from '../../utils/cn'

export function MiniSparkline({
  values,
  className,
  width = 120,
  height = 32,
}: {
  values: number[]
  className?: string
  width?: number
  height?: number
}) {
  if (values.length < 2) {
    return <div className={cn('h-8 w-30 rounded bg-white/5 ring-1 ring-white/10', className)} />
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1

  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - 2) + 1
    const y = height - 1 - ((v - min) / span) * (height - 2)
    return `${x},${y}`
  })

  return (
    <svg width={width} height={height} className={cn('rounded bg-black/20 ring-1 ring-white/10', className)}>
      <polyline points={pts.join(' ')} fill="none" stroke="rgba(99,102,241,0.95)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

