import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AlphaBuddies',
        short_name: 'AlphaBuddies',
        description: 'Learn Letters & Numbers Through Play',
        theme_color: '#6C3CE1',
        background_color: '#FFFBF5',
        display: 'fullscreen',
        icons: [
          {
            src: 'buddy.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
})
