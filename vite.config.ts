import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages serves a project site under /<repo>/, so production assets need
// this base. Dev/preview stay at root.
const BASE = '/forge-fitness-tracker/'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const base = mode === 'production' ? BASE : '/'
  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
        manifest: {
          name: 'FORGE — Fitness Tracker',
          short_name: 'FORGE',
          description: 'Single-user strength & fitness tracker',
          theme_color: '#0a0a0b',
          background_color: '#0a0a0b',
          display: 'standalone',
          orientation: 'portrait',
          scope: base,
          start_url: base,
          icons: [
            { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
            { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
          navigateFallback: base + 'index.html',
        },
      }),
    ],
    // expose the dev/preview server on the local network so a phone on the
    // same Wi-Fi can open it
    server: { host: true },
    preview: { host: true },
  }
})
