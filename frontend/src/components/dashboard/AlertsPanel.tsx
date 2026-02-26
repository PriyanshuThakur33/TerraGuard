import { Bell } from 'lucide-react'
import type { SimulationHistoryRecord } from '../../types/simulation'
import { formatUtcIso } from '../../utils/format'
import { bandClasses, normalizeRisk } from '../../utils/risk'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { cn } from '../../utils/cn'

export function AlertsPanel({ records }: { records: SimulationHistoryRecord[] }) {
  const alerts = records.filter((r) => r.alert_message).slice(-50).reverse()

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-white/70" />
            Alerts
          </CardTitle>
          <div className="text-xs font-semibold text-white/50">{alerts.length} recent</div>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="max-h-90 space-y-2 overflow-auto pr-1">
          {alerts.length === 0 ? (
            <div className="rounded-xl bg-white/3 p-4 text-sm text-white/60 ring-1 ring-white/10">
              No alerts in the current window.
            </div>
          ) : (
            alerts.map((a) => {
              const normalized = normalizeRisk(a.mode, a.risk_level)
              const cls = bandClasses(normalized.band)
              return (
                <div
                  key={a.id}
                  className={cn(
                    'rounded-xl px-3 py-2 ring-1 ring-white/10 bg-white/3 hover:bg-white/5 transition'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2 w-2 rounded-full', cls.dot)} />
                    <div className="text-xs font-semibold text-white/80">{formatUtcIso(a.timestamp)}</div>
                    <div className={cn('ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold', cls.badge)}>
                      {normalized.band}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-white/75">{a.alert_message}</div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}

