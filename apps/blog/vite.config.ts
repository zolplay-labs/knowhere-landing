import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '#': fileURLToPath(new URL('./src', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    allowedHosts: true,
    fs: { allow: [fileURLToPath(new URL('../..', import.meta.url))] },
  },
  plugins: [
    nitro({
      preset: 'cloudflare_module',
      compatibilityDate: '2026-09-07',
      cloudflare: {
        deployConfig: true,
        nodeCompat: true,
        wrangler: {
          name: 'knowhere-blog',
        },
      },
      rollupConfig: { external: [/^@sentry\//] },
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
