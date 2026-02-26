import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'

type Point = {
  t: string
  displacement: number
}

export function DisplacementChart({ data }: { data: Point[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Displacement vs Time</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 8, right: 12, top: 10, bottom: 10 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="t"
                tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(2, 6, 23, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  color: 'rgba(255,255,255,0.9)',
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
              />
              <Line
                type="monotone"
                dataKey="displacement"
                stroke="rgba(16,185,129,0.95)"
                strokeWidth={2}
                dot={false}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 text-xs text-white/55">Auto-refreshing</div>
      </CardContent>
    </Card>
  )
}

