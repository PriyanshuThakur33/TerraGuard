import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import { SimulationProvider } from './context/SimulationContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimulationProvider>
      <App />
      <Toaster
        position="top-right"
        gutter={10}
        containerStyle={{ marginTop: '4.5rem' }}
      />
    </SimulationProvider>
  </StrictMode>,
) 
