import { cn } from '../../utils/cn'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white/4 ring-1 ring-white/10 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 pt-5', className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('text-sm font-semibold text-white/90', className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 pb-5', className)} {...props} />
}

