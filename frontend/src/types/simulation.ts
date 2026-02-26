export type SimulationMode = 'classification' | 'regression'

// Mirrors `StateManager.state` + `SimulationController.status()` (adds dataset_length).
export type SimulationStatus = {
  running: boolean
  current_index: number
  mode: SimulationMode
  speed: number
  last_prediction: Record<string, unknown> | null
  dataset_length: number
}

// Mirrors `DBManager.fetch_history()` record shape as returned by `/simulation/history`.
export type SimulationHistoryRecord = {
  id: number
  timestamp: string
  mode: string
  raw_row: Record<string, unknown>
  model_output: Record<string, unknown>
  risk_level: number
  alert_message: string
}

