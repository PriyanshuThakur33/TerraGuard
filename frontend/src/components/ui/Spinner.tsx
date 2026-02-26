import { cn } from '../../utils/cn'

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/80',
        className
      )}
      aria-label="Loading"
    />
  )
}

