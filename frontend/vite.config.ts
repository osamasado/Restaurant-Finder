import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss({})
  ],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:8080'
      },
      '/logout': {
        target: 'http://localhost:8080'
      }
    }
  }
})
