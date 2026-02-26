import { apiClient } from './apiClient'
import type { SimulationHistoryRecord, SimulationMode, SimulationStatus } from '../types/simulation'

export type StartSimulationParams = {
  csv_path?: string
  mode?: SimulationMode
}

export async function getSimulationStatus(): Promise<SimulationStatus> {
  const res = await apiClient.get<SimulationStatus>('/simulation/status')
  return res.data
}

export async function getSimulationHistory(limit = 300): Promise<SimulationHistoryRecord[]> {
  const res = await apiClient.get<SimulationHistoryRecord[]>('/simulation/history', {
    params: { limit },
  })
  return res.data
}

/** Start can be slow when backend loads a large Excel/CSV dataset. */
const START_TIMEOUT_MS = 60_000

export async function startSimulation(params: StartSimulationParams = {}) {
  // Backend expects query params (not JSON body): csv_path, mode
  const res = await apiClient.post('/simulation/start', null, {
    params,
    timeout: START_TIMEOUT_MS,
  })
  return res.data as unknown
}

export async function stopSimulation() {
  const res = await apiClient.post('/simulation/stop')
  return res.data as unknown
}

export async function resetSimulation() {
  const res = await apiClient.post('/simulation/reset')
  return res.data as unknown
}

export async function setSimulationSpeed(speed: number) {
  const res = await apiClient.post('/simulation/set-speed', null, { params: { speed } })
  return res.data as unknown
}

export async function setSimulationMode(mode: SimulationMode) {
  const res = await apiClient.post('/simulation/set-mode', null, { params: { mode } })
  return res.data as unknown
}

