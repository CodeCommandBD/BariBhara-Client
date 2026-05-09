import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Bari Bhara — ভাড়া ব্যবস্থাপনা',
        short_name: 'Bari Bhara',
        description: 'বাংলাদেশের সেরা রেন্টাল ম্যানেজমেন্ট সিস্টেম',
        theme_color: '#7c3aed',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/dashboard',
        lang: 'bn',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable any',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any',
          },
        ],
        shortcuts: [
          {
            name: 'ড্যাশবোর্ড',
            url: '/dashboard',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
          {
            name: 'পেমেন্ট',
            url: '/payments',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
        ],
      },
      workbox: {
        // Network first — সবসময় সার্ভার থেকে ডেটা আনবে, offline হলে cache থেকে
        runtimeCaching: [
          {
            urlPattern: /^http:\/\/localhost:4000\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
