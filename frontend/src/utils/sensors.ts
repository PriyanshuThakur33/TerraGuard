export type SensorNode = {
  id: string
  name: string
  lat: number
  lng: number
}

// 5 sensor nodes along the Mandi–Kullu highway corridor (approximate, realistic coordinates).
export const SENSOR_NODES: SensorNode[] = [
  { id: 'TG-01', name: 'Mandi (South Gate)', lat: 31.7089, lng: 76.9325 },
  { id: 'TG-02', name: 'Pandoh Dam Stretch', lat: 31.7715, lng: 77.0022 },
  { id: 'TG-03', name: 'Aut Tunnel Approach', lat: 31.8308, lng: 77.0701 },
  { id: 'TG-04', name: 'Bhuntar Junction', lat: 31.8787, lng: 77.1552 },
  { id: 'TG-05', name: 'Kullu (North Ridge)', lat: 31.9578, lng: 77.1095 },
]

// Deterministically distribute a single hazard/displacement stream across nodes.
export function deriveNodeScalar(base: number, nodeIdx: number, seed: number, spread = 0.22): number {
  const wobble = Math.sin((seed + 1) * 0.9 + nodeIdx * 1.7) * spread + Math.cos((seed + 2) * 0.3 + nodeIdx * 0.8) * (spread / 2)
  return base + wobble
}

