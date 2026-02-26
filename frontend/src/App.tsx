import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { PageLoader } from './components/ui/PageLoader'

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const SimulationPage = lazy(() => import('./pages/SimulationPage').then((m) => ({ default: m.SimulationPage })))
const MapMonitoringPage = lazy(() => import('./pages/MapMonitoringPage').then((m) => ({ default: m.MapMonitoringPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<PageLoader label="Loading console…" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="/map" element={<MapMonitoringPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  )
}
