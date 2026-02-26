import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Activity, Gauge, Home, Info, MapPinned, PlayCircle, Menu, X } from 'lucide-react'
import { useSimulation } from '../../context/SimulationContext'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'
import { bandClasses } from '../../utils/risk'

export function TopNav() {
  const { status, riskBand, error, lastStatusAt, lastHistoryAt } = useSimulation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const running = status?.running ?? false
  const mode = status?.mode ?? 'classification'

  const cls = useMemo(() => bandClasses(riskBand), [riskBand])
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now()
  const lastOk = Math.max(lastStatusAt ?? 0, lastHistoryAt ?? 0)
  const ageMs = lastOk ? now - lastOk : Number.POSITIVE_INFINITY

  const apiDot =
    error ? 'bg-rose-400' : ageMs < 5000 ? 'bg-emerald-400' : ageMs < 15000 ? 'bg-amber-400' : 'bg-slate-500'
  const apiLabel = error ? 'API error' : ageMs < 5000 ? 'API live' : ageMs < 15000 ? 'API slow' : 'API idle'

  const navItems = [
    { to: '/', icon: Home, label: 'Home', end: true },
    { to: '/dashboard', icon: Gauge, label: 'Dashboard', end: true },
    { to: '/simulation', icon: PlayCircle, label: 'Simulation' },
    { to: '/map', icon: MapPinned, label: 'Map Monitoring' },
    { to: '/about', icon: Info, label: 'About' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-900/40 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-white/70 hover:bg-white/10 hover:text-white md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="grid h-10 w-10 place-items-center rounded-xl bg-black/15 ring-1 ring-neutral-400/25">
            <Activity className="h-5 w-5 text-green-700" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">TerraGuard</div>
            <div className="text-xs text-white/60">Landslide Early Warning Console</div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition',
                  isActive ? 'bg-white/8 text-white ring-1 ring-white/10' : 'text-white/70 hover:text-white hover:bg-white/6'
                )
              }
              end={item.end}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl bg-white/4 px-3 py-2 ring-1 ring-white/10 md:flex">
            <span className={cn('h-2.5 w-2.5 rounded-full', apiDot)} />
            <span className="text-xs font-semibold text-white/80">{apiLabel}</span>
          </div>
          <div className="hidden items-center gap-2 rounded-xl bg-white/4 px-3 py-2 ring-1 ring-white/10 md:flex">
            <span className={cn('h-2.5 w-2.5 rounded-full', running ? 'bg-emerald-400' : 'bg-slate-500')} />
            <span className="text-xs font-semibold text-white/80">{running ? 'Running' : 'Stopped'}</span>
            <span className="text-xs text-white/30">•</span>
            <span className="text-xs font-semibold text-white/70">{mode}</span>
          </div>
          <Badge className={cn(cls.badge, 'ring-inset')}>
            <span className={cn('h-2 w-2 rounded-full', cls.dot)} />
            Risk: {riskBand}
          </Badge>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={cn('fixed inset-0 z-50 flex md:hidden', isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar Panel */}
        <div
          className={cn(
            'relative flex h-screen w-full max-w-xs flex-col bg-neutral-900 shadow-2xl ring-1 ring-white/10 transition-transform duration-300 ease-in-out',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-black/15 ring-1 ring-neutral-400/25">
                <Activity className="h-5 w-5 text-green-700" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-white">TerraGuard</div>
                <div className="text-xs text-white/60">Console</div>
              </div>
            </div>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition',
                      isActive
                        ? 'bg-white/10 text-white ring-1 ring-white/10 shadow-sm'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    )
                  }
                  end={item.end}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                <span className="text-sm font-medium text-white/70">System Status</span>
                <div className="flex items-center gap-2">
                  <span className={cn('h-2.5 w-2.5 rounded-full', apiDot)} />
                  <span className="text-xs font-semibold text-white/90">{apiLabel}</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                <span className="text-sm font-medium text-white/70">Simulation</span>
                <div className="flex items-center gap-2">
                  <span className={cn('h-2.5 w-2.5 rounded-full', running ? 'bg-emerald-400' : 'bg-slate-500')} />
                  <span className="text-xs font-semibold text-white/90">{running ? 'Running' : 'Stopped'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
