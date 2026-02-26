import { MapPinned } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { SensorMap } from '../components/map/SensorMap'
import { useSimulation } from '../context/SimulationContext'
import { SENSOR_NODES } from '../utils/sensors'

export function MapMonitoringPage() {
  const { history } = useSimulation()

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold text-white">Map Monitoring</div>
        <div className="mt-1 text-sm text-white/60">Live sensor visualization (distributed from backend simulation stream)</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-white/70" />
            Mandi–Kullu Highway Corridor
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <SensorMap history={history} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sensor Nodes</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid gap-3 md:grid-cols-2">
              {SENSOR_NODES.map((n) => (
                <div key={n.id} className="rounded-xl bg-white/3 p-3 ring-1 ring-white/10">
                  <div className="text-sm font-semibold text-white">{n.name}</div>
                  <div className="mt-1 text-xs text-white/55">
                    {n.id} • {n.lat.toFixed(4)}, {n.lng.toFixed(4)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legend</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2 text-sm text-white/75">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Low
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Moderate
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-400" /> High
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Critical
              </div>
              <div className="mt-3 text-xs text-white/55">
                The backend provides a single simulation stream; the UI distributes readings deterministically across nodes for visualization.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

