import { useEffect, useRef } from 'react'

const SETTINGS = { offsetX: -320, spacingX: 2.4, phase: 19.5 }

const CELL = 6
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

export function DataStream() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const context = canvas.getContext('2d')
    if (!context) return
    let width = 0
    let height = 0
    let color = ''
    let points: { x: number; y: number; threshold: number; fade: number }[] = []

    function draw() {
      if (!context) return
      context.clearRect(0, 0, width, height)
      context.fillStyle = color
      const phase = SETTINGS.phase * 0.22
      for (const point of points) {
        const u = (point.x - width / 2 - SETTINGS.offsetX) / (96 * SETTINGS.spacingX)
        const v = point.y / 96
        // Render the selected pattern as a fixed frame.
        const warpX = noise(u * 0.45 + phase * 0.25, v * 0.55 - phase * 0.3) * 2 - 1
        const warpY = noise(u * 0.4 - phase * 0.15 + 19, v * 0.6 + phase * 0.35) * 2 - 1
        const x = u - phase * 1.4 + warpX * 0.85
        const y = v + warpY * 1.2
        const field = noise(x, y) * 0.65
          + noise(x * 2.8 + phase * 0.4, y * 2.8 - phase * 0.7) * 0.25
          + noise(x * 7 - phase * 0.8, y * 7 + phase) * 0.1
        const density = smoothstep(0.18, 0.8, field)
        const active = smoothstep(point.threshold - 0.12, point.threshold + 0.12, density)
        const size = (CELL - 2) * active
        context.globalAlpha = point.fade * active * (0.08 + density * 0.34)
        context.fillRect(point.x + (CELL - 2 - size) / 2, point.y, size, size)
      }
      context.globalAlpha = 1
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
      // Anchor the first row to the bottom edge, keeping the upper edge soft.
      for (let row = 0; row <= Math.ceil(height / CELL); row += 1) {
        const y = height - (CELL - 2) - row * CELL
        for (let column = -1; column <= Math.ceil(width / CELL); column += 1) {
          points.push({
            x: column * CELL + 1,
            y,
            threshold: (bayer[(row & 3) * 4 + (column & 3)] + 0.5) / 16,
            fade: smoothstep(0, height * 0.85, y),
          })
        }
      }
      draw()
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()
    return () => observer.disconnect()
  }, [])

  return <canvas ref={ref} className="login-data-stream" aria-hidden="true" />
}
