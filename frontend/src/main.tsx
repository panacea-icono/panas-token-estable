import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Importar estilos
import './index.css'

// Crear root
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

// Renderizar aplicación
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
