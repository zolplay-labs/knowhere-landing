import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = 'rgb(0, 0, 0)',
  width,
  height,
  className = '',
  maxOpacity = 0.3,
  ...props
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [isInView, setIsInView] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  const rgbaColor = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1

    const context = canvas.getContext('2d')
    if (!context) return 'rgba(0, 0, 0,'

    const tokenMatch = color.match(/^var\((--[^,)]+)(?:,\s*([^)]+))?\)$/)
    const resolvedColor = tokenMatch
      ? getComputedStyle(document.documentElement).getPropertyValue(tokenMatch[1]).trim() || tokenMatch[2] || color
      : color
    context.fillStyle = resolvedColor
    context.fillRect(0, 0, 1, 1)
    const [red, green, blue] = context.getImageData(0, 0, 1, 1).data
    return `rgba(${red}, ${green}, ${blue},`
  }, [color])

  const setupCanvas = useCallback((canvas, nextWidth, nextHeight) => {
    const dpr = window.devicePixelRatio || 1
    canvas.width = nextWidth * dpr
    canvas.height = nextHeight * dpr
    canvas.style.width = `${nextWidth}px`
    canvas.style.height = `${nextHeight}px`

    const columns = Math.ceil(nextWidth / (squareSize + gridGap))
    const rows = Math.ceil(nextHeight / (squareSize + gridGap))
    const squares = new Float32Array(columns * rows)

    for (let index = 0; index < squares.length; index += 1) {
      squares[index] = Math.random() * maxOpacity
    }

    return { columns, rows, squares, dpr }
  }, [gridGap, maxOpacity, squareSize])

  const updateSquares = useCallback((squares, deltaTime) => {
    for (let index = 0; index < squares.length; index += 1) {
      if (Math.random() < flickerChance * deltaTime) {
        squares[index] = Math.random() * maxOpacity
      }
    }
  }, [flickerChance, maxOpacity])

  const drawGrid = useCallback((context, canvas, grid) => {
    context.clearRect(0, 0, canvas.width, canvas.height)

    for (let column = 0; column < grid.columns; column += 1) {
      for (let row = 0; row < grid.rows; row += 1) {
        const opacity = grid.squares[column * grid.rows + row]
        context.fillStyle = `${rgbaColor}${opacity})`
        context.fillRect(
          column * (squareSize + gridGap) * grid.dpr,
          row * (squareSize + gridGap) * grid.dpr,
          squareSize * grid.dpr,
          squareSize * grid.dpr,
        )
      }
    }
  }, [gridGap, rgbaColor, squareSize])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !container || !context) return undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animationFrameId = null
    let grid = null
    let lastTime = 0

    const updateCanvasSize = () => {
      const nextWidth = width || container.clientWidth
      const nextHeight = height || container.clientHeight
      setCanvasSize({ width: nextWidth, height: nextHeight })
      grid = setupCanvas(canvas, nextWidth, nextHeight)
      drawGrid(context, canvas, grid)
    }

    const animate = (time) => {
      if (!isInView || !grid || prefersReducedMotion) return

      const deltaTime = lastTime ? (time - lastTime) / 1000 : 0
      lastTime = time
      updateSquares(grid.squares, deltaTime)
      drawGrid(context, canvas, grid)
      animationFrameId = requestAnimationFrame(animate)
    }

    updateCanvasSize()

    const resizeObserver = new ResizeObserver(updateCanvasSize)
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting)
    })
    intersectionObserver.observe(canvas)

    if (isInView && !prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [drawGrid, height, isInView, setupCanvas, updateSquares, width])

  return (
    <div ref={containerRef} className={className} {...props}>
      <canvas
        ref={canvasRef}
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />
    </div>
  )
}
