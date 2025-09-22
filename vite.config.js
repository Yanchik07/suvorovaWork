import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,           // <— не перепрыгивать на другой порт
    proxy: {
      '/api': 'http://localhost:5174' // бэкенд на 5174
    }
  }
})
