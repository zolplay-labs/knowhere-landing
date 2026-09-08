import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  server: { allowedHosts: true },
  plugins: [
    nitro({
      preset: 'cloudflare_module',
      compatibilityDate: '2026-09-07',
      cloudflare: {
        deployConfig: true,
        nodeCompat: true,
        wrangler: {
          name: 'knowhere-pricing',
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
