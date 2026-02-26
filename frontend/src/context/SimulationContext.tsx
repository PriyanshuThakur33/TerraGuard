/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import type { SimulationHistoryRecord, SimulationMode, SimulationStatus } from '../types/simulation'
import { useInterval } from '../hooks/useInterval'
import * as simulationApi from '../services/simulationApi'
import { bandClasses, normalizeRisk } from '../utils/risk'
import type { RiskBand } from '../utils/risk'

export type ControlAction = 'start' | 'stop' | 'reset' | null

type SimulationContextValue = {
  status: SimulationStatus | null
  history: SimulationHistoryRecord[]
  loading: boolean
  error: string | null
  lastStatusAt: number | null
  lastHistoryAt: number | null
  /** True while start/stop/reset request is in flight; prevents double-clicks and shows feedback. */
  actionInProgress: boolean
  /** Which control is currently running, for button label (e.g. "Starting..."). */
  actionLabel: ControlAction

  refreshNow: () => Promise<void>

  start: (params?: simulationApi.StartSimulationParams) => Promise<void>
  stop: () => Promise<void>
  reset: () => Promise<void>
  setSpeed: (speed: number) => Promise<void>
  setMode: (mode: SimulationMode) => Promise<void>

  // derived
  riskBand: RiskBand
  riskIndex: number
  activeAlertsCount: number
}

const SimulationContext = createContext<SimulationContextValue | null>(null)

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SimulationStatus | null>(null)
  const [history, setHistory] = useState<SimulationHistoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastStatusAt, setLastStatusAt] = useState<number | null>(null)
  const [lastHistoryAt, setLastHistoryAt] = useState<number | null>(null)
  const [actionInProgress, setActionInProgress] = useState(false)
  const [actionLabel, setActionLabel] = useState<ControlAction>(null)

  const lastToastedAlertId = useRef<number>(0)
  const inflight = useRef<{ status: boolean; history: boolean }>({ status: false, history: false })
  const controlInFlightRef = useRef(false)

  const fetchStatus = useCallback(async () => {
    if (inflight.current.status) return
    inflight.current.status = true
    try {
      const s = await simulationApi.getSimulationStatus()
      setStatus(s)
      setError(null)
      setLastStatusAt(Date.now())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch simulation status')
    } finally {
      inflight.current.status = false
      setLoading(false)
    }
  }, [])

  const fetchHistory = useCallback(async () => {
    if (inflight.current.history) return
    inflight.current.history = true
    try {
      const h = await simulationApi.getSimulationHistory(300)
      setHistory(h)
      setError(null)
      setLastHistoryAt(Date.now())

      // Toast only for *new* alerts (records where alert_message is non-empty)
      const newAlerts = h.filter((r) => r.alert_message && r.id > lastToastedAlertId.current)
      if (newAlerts.length > 0) {
        const maxId = Math.max(...newAlerts.map((a) => a.id))
        lastToastedAlertId.current = maxId

        // Improve UX: Dismiss any existing toast before showing a new one
        toast.dismiss()

        // Show only the latest alert if multiple arrive at once
        const latestAlert = newAlerts[newAlerts.length - 1]

        const mode = latestAlert.mode
        const hazardValue = latestAlert.risk_level
        const normalized = normalizeRisk(mode, hazardValue)
        const cls = bandClasses(normalized.band)

        toast.custom(
          (t) => (
            <div
              className={[
                'pointer-events-auto w-90 rounded-xl px-4 py-3 shadow-2xl',
                'bg-black/90 ring-1 ring-white/10 backdrop-blur',
                t.visible ? 'animate-in fade-in slide-in-from-top-2' : 'animate-out fade-out',
              ].join(' ')}
            >
              <div className="flex items-start gap-3">
                <div className={['mt-1 h-2.5 w-2.5 rounded-full', cls.dot].join(' ')} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">TerraGuard Alert</span>
                    <span className={['inline-flex items-center rounded-full px-2 py-0.5 text-xs', cls.badge].join(' ')}>
                      {normalized.band}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-white/80">{latestAlert.alert_message}</div>
                </div>
                <button
                  className="ml-auto text-white/60 hover:text-white"
                  onClick={() => toast.dismiss(t.id)}
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
            </div>
          ),
          { duration: 6500 }
        )
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch simulation history')
    } finally {
      inflight.current.history = false
      setLoading(false)
    }
  }, [])

  const refreshNow = useCallback(async () => {
    await Promise.all([fetchStatus(), fetchHistory()])
  }, [fetchHistory, fetchStatus])

  // Polling cadence (centralized)
  useInterval(fetchStatus, 1000)
  useInterval(fetchHistory, 2000)

  // initial load (StrictMode-safe: effect will run twice in dev but is idempotent)
  useEffect(() => {
    void refreshNow()
  }, [refreshNow])

  const start = useCallback(
    async (params: simulationApi.StartSimulationParams = {}) => {
      if (controlInFlightRef.current) return
      controlInFlightRef.current = true
      setActionInProgress(true)
      setActionLabel('start')
      try {
        await simulationApi.startSimulation(params)
        // Success handled via UI state; avoid noisy popups for start/stop/reset actions
        await refreshNow()
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to start simulation'
        setError(msg)
      } finally {
        controlInFlightRef.current = false
        setActionInProgress(false)
        setActionLabel(null)
      }
    },
    [refreshNow]
  )

  const stop = useCallback(
    async () => {
      if (controlInFlightRef.current) return
      controlInFlightRef.current = true
      setActionInProgress(true)
      setActionLabel('stop')
      try {
        await simulationApi.stopSimulation()
        // Success handled via UI state; avoid noisy popups for start/stop/reset actions
        await refreshNow()
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to stop simulation'
        setError(msg)
      } finally {
        controlInFlightRef.current = false
        setActionInProgress(false)
        setActionLabel(null)
      }
    },
    [refreshNow]
  )

  const reset = useCallback(
    async () => {
      if (controlInFlightRef.current) return
      controlInFlightRef.current = true
      setActionInProgress(true)
      setActionLabel('reset')
      try {
        await simulationApi.resetSimulation()
        // Success handled via UI state; avoid noisy popups for start/stop/reset actions
        await refreshNow()
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to reset simulation'
        setError(msg)
      } finally {
        controlInFlightRef.current = false
        setActionInProgress(false)
        setActionLabel(null)
      }
    },
    [refreshNow]
  )

  const setSpeed = useCallback(async (speed: number) => {
    await simulationApi.setSimulationSpeed(speed)
    await fetchStatus()
  }, [fetchStatus])

  const setMode = useCallback(async (mode: SimulationMode) => {
    await simulationApi.setSimulationMode(mode)
    await fetchStatus()
    await fetchHistory()
  }, [fetchHistory, fetchStatus])

  const derived = useMemo(() => {
    const lastRecord = history.length ? history[history.length - 1] : null
    const mode = status?.mode ?? (lastRecord?.mode ?? 'classification')
    const hazardValue =
      (status?.last_prediction && (status.last_prediction as Record<string, unknown>)['hazard_level']) ??
      lastRecord?.risk_level ??
      null

    const normalized = normalizeRisk(mode, hazardValue)
    const activeAlertsCount = history.slice(-200).filter((r) => r.alert_message).length

    return {
      riskBand: normalized.band,
      riskIndex: normalized.index,
      activeAlertsCount,
    }
  }, [history, status])

  const value: SimulationContextValue = {
    status,
    history,
    loading,
    error,
    lastStatusAt,
    lastHistoryAt,
    actionInProgress,
    actionLabel,
    refreshNow,
    start,
    stop,
    reset,
    setSpeed,
    setMode,
    riskBand: derived.riskBand,
    riskIndex: derived.riskIndex,
    activeAlertsCount: derived.activeAlertsCount,
  }

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
}

export function useSimulation() {
  const ctx = useContext(SimulationContext)
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider')
  return ctx
}

