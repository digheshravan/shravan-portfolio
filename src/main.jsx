import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

import './styles/base.css'
import './styles/ui.css'
import './styles/sections.css'

// Step 0 concept gate for the redesign — throwaway, not part of the shipped
// app. Bypasses the whole app shell (Lenis, preloader, fonts wait) since it
// only needs to answer one question: does the primitive vocabulary read.
const isLab = new URLSearchParams(window.location.search).get('lab') === '1'

async function boot() {
  const root = createRoot(document.getElementById('root'))
  if (isLab) {
    const { Lab } = await import('./three/Lab')
    root.render(
      <StrictMode>
        <Lab />
      </StrictMode>
    )
  } else {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  }
}

boot()
