import { useEffect, useRef, useState } from 'react'
import { DataStreamControls } from './data-stream-controls'
import { DEFAULT_STREAM_SETTINGS, type StreamSettings } from './data-stream-settings'
const random = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 17) * 43758.5453
  return value - Math.floor(value)
}
const noiseValues = Float32Array.from({ length: 4096 }, (_, index) => random(index))
const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const smoothstep = (start: number, end: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - start) / (end - start)))
  return t * t * (3 - 2 * t)
}
const noise = (x: number, y: number) => {
  const column = Math.floor(x)
  const row = Math.floor(y)
  const u = smoothstep(0, 1, x - column)
  const v = smoothstep(0, 1, y - row)
  const at = (dx: number, dy: number) => noiseValues[((row + dy) & 63) * 64 + ((column + dx) & 63)]
  const top = at(0, 0) * (1 - u) + at(1, 0) * u
  const bottom = at(0, 1) * (1 - u) + at(1, 1) * u
  return top * (1 - v) + bottom * v
}

export function DataStream({ chinese }: { chinese: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [settings, setSettings] = useState({ ...DEFAULT_STREAM_SETTINGS })
  const settingsRef = useRef(settings)
  const refreshRef = useRef<((previous: StreamSettings) => void) | null>(null)

  useEffect(() => {
    const previous = settingsRef.current
    settingsRef.current = settings
    refreshRef.current?.(previous)
  }, [settings])

  useEffect(() => {
    const canvas = ref.current!
    const context = canvas.getContext('2d')
    if (!context) return
    let width = 0
    let height = 0
    let color = ''
    let phase = settingsRef.current.phase * 0.22
    let frame = 0
    let previousTime = 0
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
    let points: { x: number; y: number; threshold: number; fade: number }[] = []

    function draw() {
      if (!context) return
      context.clearRect(0, 0, width, height)
      context.fillStyle = color
      const current = settingsRef.current
      for (const point of points) {
        const u = (point.x - width / 2 - current.offsetX) / (96 * current.spacingX)
        const v = point.y / 96
        // Evolve the field at different rates while the pixel grid stays anchored.
        const warpX = noise(u * 0.45 + phase * 0.25, v * 0.55 - phase * 0.3) * 2 - 1
        const warpY = noise(u * 0.4 - phase * 0.15 + 19, v * 0.6 + phase * 0.35) * 2 - 1
        const x = u - phase * 1.4 + warpX * 0.85 * current.warp
        const y = v + warpY * 1.2 * current.warp
        const field = noise(x, y) * 0.65
          + noise(x * 2.8 + phase * 0.4, y * 2.8 - phase * 0.7) * 0.25
          + noise(x * 7 - phase * 0.8, y * 7 + phase) * 0.1
        const density = Math.min(1, smoothstep(0.18, 0.8, field) * current.density)
        const active = smoothstep(point.threshold - 0.12, point.threshold + 0.12, density)
        const size = (current.cellSize - 2) * active
        context.globalAlpha = point.fade * active * (0.08 + density * 0.34) * current.opacity
        context.fillRect(point.x + (current.cellSize - 2 - size) / 2, point.y, size, size)
      }
      context.globalAlpha = 1
    }

    function animate(time: number) {
      phase += Math.min((time - previousTime) / 1000, 0.05) * 0.12 * settingsRef.current.speed
      previousTime = time
      draw()
      frame = requestAnimationFrame(animate)
    }

    function syncAnimation() {
      cancelAnimationFrame(frame)
      if (document.hidden || width <= 0 || height <= 0) return
      draw()
      previousTime = performance.now()
      if (!reducedMotion.matches && !settingsRef.current.paused && settingsRef.current.speed > 0) {
        frame = requestAnimationFrame(animate)
      }
    }

    function resize() {
      const bounds = canvas.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context!.setTransform(ratio, 0, 0, ratio, 0, 0)
      color = getComputedStyle(canvas).color
      points = []
      const cell = settingsRef.current.cellSize
      // Anchor the first row to the bottom edge, keeping the upper edge soft.
      for (let row = 0; row <= Math.ceil(height / cell); row += 1) {
        const y = height - (cell - 2) - row * cell
        for (let column = -1; column <= Math.ceil(width / cell); column += 1) {
          points.push({
            x: column * cell + 1,
            y,
            threshold: (bayer[(row & 3) * 4 + (column & 3)] + 0.5) / 16,
            fade: smoothstep(0, height * 0.85, y),
          })
        }
      }
      syncAnimation()
    }

    refreshRef.current = previous => {
      if (previous.phase !== settingsRef.current.phase) phase = settingsRef.current.phase * 0.22
      if (previous.cellSize !== settingsRef.current.cellSize) resize()
      else syncAnimation()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    document.addEventListener('visibilitychange', syncAnimation)
    reducedMotion.addEventListener('change', syncAnimation)
    resize()
    return () => {
      cancelAnimationFrame(frame)
      refreshRef.current = null
      observer.disconnect()
      document.removeEventListener('visibilitychange', syncAnimation)
      reducedMotion.removeEventListener('change', syncAnimation)
    }
  }, [])

  return (
    <>
      <canvas
        ref={ref}
        className="login-data-stream"
        aria-hidden="true"
        style={{ height: `clamp(${96 * settings.height}px, ${18 * settings.height}svh, ${216 * settings.height}px)` }}
      />
      <DataStreamControls settings={settings} onChange={setSettings} chinese={chinese} />
    </>
  )
}
