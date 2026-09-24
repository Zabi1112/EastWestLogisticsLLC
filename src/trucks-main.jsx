import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AvailableTrucks from './components/AvailableTrucks.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode><AvailableTrucks /></StrictMode>,
)
