import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // Rolldown (Vite 8) only accepts the function form here.
        manualChunks(id) {
          // Normalise Windows separators before matching.
          const p = id.replace(/\\/g, '/')
          if (!p.includes('node_modules')) return
          if (p.includes('@react-three') || p.includes('/postprocessing/')) return 'r3f'
          if (p.includes('/three/')) return 'three'
          if (p.includes('/gsap/') || p.includes('/lenis/')) return 'motion'
        },
      },
    },
  },
})
