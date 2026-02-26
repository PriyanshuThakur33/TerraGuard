import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL,
  // Increase global timeout to handle longer model loads (classification/regression)
  timeout: 60_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

