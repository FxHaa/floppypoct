import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Flappypoct from './Flappypoct'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Flappypoct />
  </StrictMode>,
)
