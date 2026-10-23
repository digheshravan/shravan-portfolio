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
          // three.js and r3f are deliberately NOT named here. Forcing them
          // into a manual chunk made Rolldown emit React's CJS wrappers inside
          // it too, so the entry imported that chunk statically and ~890 kB of
          // three/r3f was preloaded and parsed before first render — the lazy
          // <Scene> split did nothing. Left alone, they land in the chunk only
          // the dynamic import reaches.
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(p)) return 'react'
          if (p.includes('/gsap/') || p.includes('/lenis/')) return 'motion'
        },
      },
    },
  },
})
