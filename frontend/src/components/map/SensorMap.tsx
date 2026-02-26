import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { SimulationHistoryRecord } from '../../types/simulation'
import { SENSOR_NODES, deriveNodeScalar } from '../../utils/sensors'
import { formatNumber, formatPercent, formatUtcIso } from '../../utils/format'
import { normalizeRisk } from '../../utils/risk'
import { MiniSparkline } from './MiniSparkline'

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n))
}

function colorForIndex(idx: number) {
  if (idx <= 0) return { fill: '#34d399', stroke: '#10b981' } // emerald
  if (idx === 1) return { fill: '#fbbf24', stroke: '#f59e0b' } // amber
  if (idx === 2) return { fill: '#fb923c', stroke: '#f97316' } // orange
  return { fill: '#fb7185', stroke: '#f43f5e' } // rose
}

function pickConfidence(record: SimulationHistoryRecord | null) {
  const v = record?.model_output?.confidence
  const num = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(num) ? num : null
}

function pickDisplacement(record: SimulationHistoryRecord | null) {
  const out = record?.model_output
  const raw = record?.raw_row
  const v = (out?.displacement_value ?? out?.risk_score ?? raw?.Displacement ?? raw?.displacement) as unknown
  const num = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(num) ? num : null
}

export function SensorMap({ history }: { history: SimulationHistoryRecord[] }) {
  const last = history.length ? history[history.length - 1] : null
  const seed = last?.id ?? 0

  const baseRisk = normalizeRisk(last?.mode ?? 'classification', last?.risk_level ?? 0)
  const baseIdx = baseRisk.index < 0 ? 0 : baseRisk.index
  const baseDisp = pickDisplacement(last) ?? 0
  const baseConf = pickConfidence(last)

  const tail = history.slice(-36)

  return (
    <MapContainer
      center={[31.84, 77.06]}
      zoom={10}
      scrollWheelZoom
      className="h-140 w-full overflow-hidden rounded-2xl ring-1 ring-white/10"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap contributors &copy; CARTO"
      />

      {SENSOR_NODES.map((n, idx) => {
        const hazard = clamp(Math.round(deriveNodeScalar(baseIdx, idx, seed, 0.55)), 0, 3)
        const disp = Math.max(0, deriveNodeScalar(baseDisp, idx, seed, Math.max(0.15, baseDisp * 0.03)))
        const conf = baseConf == null ? null : clamp(deriveNodeScalar(baseConf, idx, seed, 0.06), 0, 1)

        const color = colorForIndex(hazard)

        const nodeAlerts = history
          .filter((r) => r.alert_message && r.id % SENSOR_NODES.length === idx)
          .slice(-3)
          .reverse()

        const trend = tail.map((r) => {
          const idx0 = normalizeRisk(r.mode, r.risk_level).index
          const base = idx0 < 0 ? 0 : idx0
          return clamp(Math.round(deriveNodeScalar(base, idx, r.id, 0.45)), 0, 3)
        })

        return (
          <CircleMarker
            key={n.id}
            center={[n.lat, n.lng]}
            radius={10}
            pathOptions={{ color: color.stroke, fillColor: color.fill, fillOpacity: 0.85, weight: 2 }}
          >
            <Popup>
              <div className="min-w-65">
                <div className="text-sm font-semibold text-slate-900">{n.name}</div>
                <div className="mt-1 text-xs text-slate-600">
                  Node <span className="font-semibold">{n.id}</span> • Updated {formatUtcIso(last?.timestamp ?? '')}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-slate-100 px-2 py-1">
                    <div className="text-slate-500">Hazard</div>
                    <div className="text-sm font-semibold text-slate-900">{hazard}</div>
                  </div>
                  <div className="rounded-lg bg-slate-100 px-2 py-1">
                    <div className="text-slate-500">Confidence</div>
                    <div className="text-sm font-semibold text-slate-900">{conf == null ? 'N/A' : formatPercent(conf, 0)}</div>
                  </div>
                  <div className="rounded-lg bg-slate-100 px-2 py-1">
                    <div className="text-slate-500">Displacement</div>
                    <div className="text-sm font-semibold text-slate-900">{formatNumber(disp, 3)}</div>
                  </div>
                  <div className="rounded-lg bg-slate-100 px-2 py-1">
                    <div className="text-slate-500">Mode</div>
                    <div className="text-sm font-semibold text-slate-900">{last?.mode ?? '—'}</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs font-semibold text-slate-600">Mini trend</div>
                  <div className="mt-1">
                    <MiniSparkline values={trend} />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs font-semibold text-slate-600">Recent alerts</div>
                  <div className="mt-1 space-y-1 text-xs text-slate-700">
                    {nodeAlerts.length === 0 ? (
                      <div className="text-slate-500">None</div>
                    ) : (
                      nodeAlerts.map((a) => (
                        <div key={a.id} className="rounded bg-slate-100 px-2 py-1">
                          {a.alert_message}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}

