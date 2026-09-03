import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(root, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        landingSource: resolve(root, 'landing-source.html'),
        documentScanSection: resolve(root, 'document-scan-section.html'),
      },
    },
  },
  server: {
    allowedHosts: true,
  },
})
