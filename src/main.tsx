import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SDMANAGER from './SDMANAGER'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SDMANAGER />
  </StrictMode>,
)
