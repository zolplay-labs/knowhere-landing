import { useEffect, useRef } from 'react'
import settings from '../lib/fluid-gradient/cover-settings.json'
import type { MeshGradientRenderValues } from '../lib/fluid-gradient/mesh-gradient-renderer'

export function FluidCover() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    let cancelled = false
    let dispose = () => {}

    // Read both the pigment and opacity from the semantic CSS color token.
    const color = getComputedStyle(canvas).color
    const channels = color.match(/[\d.]+/g)!
    const pigment = color.startsWith('color(srgb ')
      ? channels.slice(0, 3).map((channel) => Math.round(Number(channel) * 255))
      : channels.slice(0, 3)
    canvas.style.setProperty('--fluid-opacity', channels[3] ?? '1')

    // Load the generator only in the browser.
    import('../lib/fluid-gradient/mesh-gradient-renderer').then(({ createMeshGradientSurface, advanceGradientPhase }) => {
      if (cancelled) return
      const surface = createMeshGradientSurface(canvas)
      const values = {
        ...settings,
        colors: [`rgb(${pigment.join(', ')})`],
      } as MeshGradientRenderValues
      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
      let frame = 0
      let phase = 0.23
      let previousTime = 0
      let visible = false

      const draw = () => {
        surface.render(values, phase)
        canvas.dataset.ready = 'true'
      }
      const animate = (time: number) => {
        if (time - previousTime >= 1000 / 30) {
          phase = advanceGradientPhase(phase, Math.min((time - previousTime) / 1000, 0.1), 0.03)
          previousTime = time
          draw()
        }
        frame = requestAnimationFrame(animate)
      }
      const sync = () => {
        cancelAnimationFrame(frame)
        const { width, height } = canvas.getBoundingClientRect()
        visible = width > 0 && height > 0 && !document.hidden
        if (!visible) return
        surface.resize(width, height, Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(3_000_000 / (width * height))))
        draw()
        previousTime = performance.now()
        if (!reducedMotion.matches) frame = requestAnimationFrame(animate)
      }
      const observer = new ResizeObserver(sync)
      observer.observe(canvas)
      document.addEventListener('visibilitychange', sync)
      reducedMotion.addEventListener('change', sync)
      dispose = () => {
        cancelAnimationFrame(frame)
        observer.disconnect()
        document.removeEventListener('visibilitychange', sync)
        reducedMotion.removeEventListener('change', sync)
        surface.dispose()
      }
      sync()
    }).catch(() => {
      // Keep the token background on browsers without WebGL.
      canvas.dataset.ready = 'false'
    })

    return () => {
      cancelled = true
      dispose()
    }
  }, [])

  return <canvas ref={ref} className="fluid-cover" aria-hidden="true" />
}
