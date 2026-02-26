import { Loader2, PauseCircle, PlayCircle, RotateCcw, Settings2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useSimulation } from '../context/SimulationContext'
import type { SimulationMode } from '../types/simulation'
import { formatNumber } from '../utils/format'

export function SimulationPage() {
  const { status, start, stop, reset, setMode, setSpeed, loading, actionInProgress, actionLabel } = useSimulation()
  const [mode, setModeLocal] = useState<SimulationMode>(status?.mode ?? 'classification')
  const [speed, setSpeedLocal] = useState<number>(status?.speed ?? 1.0)
  const [csvPath, setCsvPath] = useState<string>('')

  const running = status?.running ?? false
  const currentIndex = status?.current_index ?? 0
  const length = status?.dataset_length ?? 0
  const progressPct = useMemo(() => {
    if (!length) return 0
    return Math.max(0, Math.min(100, (currentIndex / length) * 100))
  }, [currentIndex, length])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xl font-semibold text-white">Simulation Control</div>
          <div className="mt-1 text-sm text-white/60">
            Start/stop/reset • Select mode • Adjust speed • Monitor dataset index
          </div>
        </div>
        <div className="rounded-xl bg-white/4 px-3 py-2 text-sm font-semibold text-white/70 ring-1 ring-white/10">
          {running ? 'Running' : 'Stopped'} • idx {currentIndex}/{length}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-white/70" />
              Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/50">Mode</div>
                <div className="flex gap-2">
                  <Button
                    variant={mode === 'classification' ? 'primary' : 'secondary'}
                    onClick={async () => {
                      setModeLocal('classification')
                      await setMode('classification')
                    }}
                    disabled={loading || actionInProgress}
                  >
                    Classification
                  </Button>
                  <Button
                    variant={mode === 'regression' ? 'primary' : 'secondary'}
                    onClick={async () => {
                      setModeLocal('regression')
                      await setMode('regression')
                    }}
                    disabled={loading || actionInProgress}
                  >
                    Regression
                  </Button>
                </div>
                <div className="text-xs text-white/55">Backend endpoint: POST /simulation/set-mode</div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/50">Speed</div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={0.05}
                    value={speed}
                    onChange={(e) => setSpeedLocal(Number(e.target.value))}
                    className="w-full accent-indigo-400"
                  />
                  <div className="w-16 text-right text-sm font-semibold text-white/80">{formatNumber(speed, 2)}s</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                      await setSpeed(speed)
                    }}
                    disabled={loading || actionInProgress}
                  >
                    Apply speed
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSpeedLocal(status?.speed ?? 1.0)
                    }}
                  >
                    Reset
                  </Button>
                </div>
                <div className="text-xs text-white/55">Backend endpoint: POST /simulation/set-speed</div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/50">Dataset path (optional)</div>
                <input
                  value={csvPath}
                  onChange={(e) => setCsvPath(e.target.value)}
                  placeholder="Leave empty to use backend defaults"
                  className="h-10 w-full rounded-xl bg-white/4 px-3 text-sm text-white/85 ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                />
                <div className="text-xs text-white/55">
                  Backend uses Windows default paths when empty.
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                onClick={() => start({ mode, csv_path: csvPath || undefined })}
                disabled={loading || running || actionInProgress}
              >
                {actionInProgress && actionLabel === 'start' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="h-4 w-4" />
                )}
                {actionInProgress && actionLabel === 'start' ? 'Starting…' : 'Start'}
              </Button>
              <Button
                variant="secondary"
                onClick={stop}
                disabled={loading || !running || actionInProgress}
              >
                {actionInProgress && actionLabel === 'stop' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PauseCircle className="h-4 w-4" />
                )}
                {actionInProgress && actionLabel === 'stop' ? 'Stopping…' : 'Stop'}
              </Button>
              <Button
                variant="danger"
                onClick={reset}
                disabled={loading || actionInProgress}
              >
                {actionInProgress && actionLabel === 'reset' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
                {actionInProgress && actionLabel === 'reset' ? 'Resetting…' : 'Reset (clears history)'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Running</span>
                <span className="font-semibold text-white">{running ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Mode</span>
                <span className="font-semibold text-white">{status?.mode ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Speed</span>
                <span className="font-semibold text-white">{status?.speed != null ? `${formatNumber(status.speed, 2)}s` : '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Index</span>
                <span className="font-semibold text-white">
                  {currentIndex} / {length || '—'}
                </span>
              </div>

              <div className="pt-2">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/50">Progress</div>
                <div className="h-2 rounded-full bg-white/10 ring-1 ring-white/10">
                  <div className="h-2 rounded-full bg-indigo-500/80" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="mt-1 text-xs text-white/55">{formatNumber(progressPct, 0)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Last Prediction Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <pre className="max-h-65 overflow-auto rounded-xl bg-black/30 p-3 text-xs text-white/75 ring-1 ring-white/10">
            {JSON.stringify(status?.last_prediction ?? null, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

