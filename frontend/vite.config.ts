import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const directory = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: directory,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(directory, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8443'),
    strictPort: true,
    proxy: {
      '/api': process.env.VITE_DEV_API_PROXY || 'http://localhost:8787',
    },
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8443'),
  },
})
