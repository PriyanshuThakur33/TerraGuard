import { cn } from '../../utils/cn'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md'

export function Button({
  className,
  variant = 'secondary',
  size = 'md',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' ? 'h-9 px-3 text-sm' : 'h-10 px-4 text-sm',
        variant === 'primary' &&
        'bg-indigo-500/90 text-white shadow-[0_10px_30px_-18px_rgba(99,102,241,0.9)] ring-1 ring-indigo-400/30 hover:bg-indigo-500',
        variant === 'secondary' &&
        'bg-white/6 text-white ring-1 ring-white/10 hover:bg-white/10',
        variant === 'danger' &&
        'bg-rose-500/90 text-white shadow-[0_10px_30px_-18px_rgba(244,63,94,0.9)] ring-1 ring-rose-400/30 hover:bg-rose-500',
        variant === 'ghost' && 'bg-transparent text-white/80 hover:text-white hover:bg-white/6',
        className
      )}
      {...props}
    />
  )
}

