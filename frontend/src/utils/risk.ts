import type { SimulationMode } from '../types/simulation'

export type RiskBand = 'Low' | 'Moderate' | 'High' | 'Critical' | 'Unknown'

export function bandFromClassificationIndex(idx: number | null | undefined): RiskBand {
  if (idx === 0) return 'Low'
  if (idx === 1) return 'Moderate'
  if (idx === 2) return 'High'
  if (idx === 3) return 'Critical'
  return 'Unknown'
}

// Matches backend `app/ml_logic.py` thresholds for regression.
export function bandFromRegressionScore(score: number | null | undefined): RiskBand {
  if (typeof score !== 'number' || Number.isNaN(score)) return 'Unknown'
  if (score < 8) return 'Low'
  if (score < 20) return 'Moderate'
  if (score < 35) return 'High'
  return 'Critical'
}

export function bandToIndex(band: RiskBand): number {
  if (band === 'Low') return 0
  if (band === 'Moderate') return 1
  if (band === 'High') return 2
  if (band === 'Critical') return 3
  return -1
}

export function normalizeRisk(mode: SimulationMode | string | null | undefined, hazardValue: unknown): { band: RiskBand; index: number } {
  if (mode === 'classification') {
    const idx = typeof hazardValue === 'number' ? hazardValue : Number(hazardValue)
    const band = bandFromClassificationIndex(Number.isFinite(idx) ? idx : undefined)
    return { band, index: bandToIndex(band) }
  }

  // regression: hazardValue is typically an integer (rounded risk_score) from the simulation controller
  const score = typeof hazardValue === 'number' ? hazardValue : Number(hazardValue)
  const band = bandFromRegressionScore(Number.isFinite(score) ? score : undefined)
  return { band, index: bandToIndex(band) }
}

export function bandClasses(band: RiskBand): { badge: string; dot: string } {
  switch (band) {
    case 'Low':
      return { badge: 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/25', dot: 'bg-emerald-400' }
    case 'Moderate':
      return { badge: 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/25', dot: 'bg-amber-400' }
    case 'High':
      return { badge: 'bg-orange-500/15 text-orange-200 ring-1 ring-orange-400/25', dot: 'bg-orange-400' }
    case 'Critical':
      return { badge: 'bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/25', dot: 'bg-rose-400' }
    default:
      return { badge: 'bg-slate-500/15 text-slate-200 ring-1 ring-slate-400/25', dot: 'bg-slate-400' }
  }
}

