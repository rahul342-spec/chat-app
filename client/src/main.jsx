import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from './components/ui/sonner'
import { SocketProvide } from './context/SocketContext'

createRoot(document.getElementById('root')).render(
  <SocketProvide>
    <Toaster closeButton/>
    <App />
  </SocketProvide>,
)
