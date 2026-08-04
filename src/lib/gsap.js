import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Custom eases used across the site so motion feels like one hand made it. */
gsap.registerEase('out-expo', (p) => (p === 1 ? 1 : 1 - Math.pow(2, -10 * p)))
gsap.registerEase('in-out-quint', (p) =>
  p < 0.5 ? 16 * p * p * p * p * p : 1 - Math.pow(-2 * p + 2, 5) / 2
)

gsap.defaults({ ease: 'out-expo', duration: 1.1 })

ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }
