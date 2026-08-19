import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
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
