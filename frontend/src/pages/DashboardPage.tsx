import { AlertTriangle, Gauge, Layers, MoveUpRight, Zap } from 'lucide-react'
import { useMemo } from 'react'
import { AlertsPanel } from '../components/dashboard/AlertsPanel'
import { MetricCard } from '../components/dashboard/MetricCard'
import { DisplacementChart } from '../components/charts/DisplacementChart'
import { HazardChart } from '../components/charts/HazardChart'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { useSimulation } from '../context/SimulationContext'
import { formatNumber, formatPercent } from '../utils/format'
import { normalizeRisk } from '../utils/risk'

function pickDisplacement(modelOutput: Record<string, unknown> | null | undefined, rawRow: Record<string, unknown> | null | undefined) {
  const fromModel =
    (modelOutput && (modelOutput['displacement_value'] ?? modelOutput['risk_score'])) ??
    (rawRow && (rawRow['Displacement'] ?? rawRow['displacement']))
  const v = typeof fromModel === 'number' ? fromModel : Number(fromModel)
  return Number.isFinite(v) ? v : null
}

export function DashboardPage() {
  const { status, history, loading, error, activeAlertsCount, riskBand } = useSimulation()

  const lastRecord = history.length ? history[history.length - 1] : null
  const mode = status?.mode ?? (lastRecord?.mode ?? 'classification')
  const risk = normalizeRisk(mode, (status?.last_prediction as Record<string, unknown> | null)?.hazard_level ?? lastRecord?.risk_level ?? null)

  const confidence =
    mode === 'classification'
      ? (status?.last_prediction as Record<string, unknown> | null)?.confidence
      : null

  const displacement = pickDisplacement(
    (status?.last_prediction as Record<string, unknown> | null) ?? lastRecord?.model_output,
    lastRecord?.raw_row
  )

  const chartData = useMemo(() => {
    const tail = history.slice(-160)
    return {
      hazard: tail.map((r) => {
        const d = new Date(r.timestamp)
        const t = Number.isNaN(d.getTime()) ? r.timestamp : d.toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })
        return { t, hazard: normalizeRisk(r.mode, r.risk_level).index }
      }),
      displacement: tail.map((r) => {
        const d = new Date(r.timestamp)
        const t = Number.isNaN(d.getTime()) ? r.timestamp : d.toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })
        const disp = pickDisplacement(r.model_output, r.raw_row) ?? 0
        return { t, displacement: disp }
      }),
    }
  }, [history])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xl font-semibold text-white">Monitoring Dashboard</div>
          <div className="mt-1 text-sm text-white/60">
            Live simulation telemetry • Mode: <span className="font-semibold text-white/80">{mode}</span> • Risk:{' '}
            <span className="font-semibold text-white/80">{riskBand}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="flex items-center gap-2 rounded-xl bg-white/4 px-3 py-2 ring-1 ring-white/10">
              <Spinner className="h-4 w-4" />
              <span className="text-sm font-semibold text-white/70">Syncing</span>
            </div>
          ) : (
            <div className="rounded-xl bg-white/4 px-3 py-2 text-sm font-semibold text-white/70 ring-1 ring-white/10">
              {status?.running ? 'Simulation running' : 'Simulation stopped'}
            </div>
          )}
        </div>
      </div>

      {error ? (
        <Card className="p-4">
          <div className="text-sm text-rose-200">
            <span className="font-semibold">Backend error:</span> {error}
          </div>
          <div className="mt-1 text-xs text-white/50">Ensure the FastAPI server is running on `VITE_API_BASE_URL`.</div>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard title="Hazard level" value={risk.band} subtitle={`Index: ${risk.index}`} icon={Gauge} accentClassName="bg-indigo-500/15 ring-indigo-400/25" />
        <MetricCard title="Confidence score" value={confidence == null ? 'N/A' : formatPercent(confidence, 0)} subtitle={mode === 'classification' ? 'From model output' : 'Not provided by backend in regression mode'} icon={MoveUpRight} accentClassName="bg-emerald-500/15 ring-emerald-400/25" />
        <MetricCard title="Displacement value" value={displacement == null ? '—' : formatNumber(displacement, 3)} subtitle="Derived from displacement_value / risk_score" icon={Layers} accentClassName="bg-cyan-500/15 ring-cyan-400/25" />
        <MetricCard title="Active alerts" value={String(activeAlertsCount)} subtitle="Last 200 records window" icon={AlertTriangle} accentClassName="bg-rose-500/15 ring-rose-400/25" />
        <MetricCard title="Simulation speed" value={status?.speed != null ? `${formatNumber(status.speed, 2)}s` : '—'} subtitle="Loop sleep interval" icon={Zap} accentClassName="bg-amber-500/15 ring-amber-400/25" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
          <HazardChart data={chartData.hazard} />
          <DisplacementChart data={chartData.displacement} />
        </div>
        <AlertsPanel records={history} />
      </div>
    </div>
  )
}

