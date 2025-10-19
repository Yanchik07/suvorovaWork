import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Инициализация Яндекс.Метрики для SPA
if (typeof window !== 'undefined' && window.ym) {
  // Отслеживаем загрузку страницы
  window.ym(104708408, 'hit', window.location.href);
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
