import { Spinner } from './Spinner'

export function PageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="flex items-center gap-3 rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/10">
        <Spinner />
        <div className="text-sm font-semibold text-white/70">{label}</div>
      </div>
    </div>
  )
}

