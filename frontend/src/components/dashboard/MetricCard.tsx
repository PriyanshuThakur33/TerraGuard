import type { LucideIcon } from 'lucide-react'
import { Card } from '../ui/Card'
import { cn } from '../../utils/cn'

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentClassName,
}: {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  accentClassName?: string
}) {
  return (
    <Card className="p-5 transition hover:bg-white/6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/50">{title}</div>
          <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
          {subtitle ? <div className="mt-1 text-xs text-white/55">{subtitle}</div> : null}
        </div>
        <div className={cn('grid h-10 w-10 place-items-center rounded-xl ring-1 ring-white/10 bg-white/4', accentClassName)}>
          <Icon className="h-5 w-5 text-white/80" />
        </div>
      </div>
    </Card>
  )
}

