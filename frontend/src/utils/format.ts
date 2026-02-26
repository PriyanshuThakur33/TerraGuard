export function formatUtcIso(ts: string | null | undefined): string {
  if (!ts) return '—'
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ts
  return d.toLocaleString()
}

export function formatNumber(n: unknown, digits = 2): string {
  const num = typeof n === 'number' ? n : Number(n)
  if (!Number.isFinite(num)) return '—'
  return num.toFixed(digits)
}

export function formatPercent(n: unknown, digits = 0): string {
  const num = typeof n === 'number' ? n : Number(n)
  if (!Number.isFinite(num)) return '—'
  return `${(num * 100).toFixed(digits)}%`
}

