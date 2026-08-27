const TAU = Math.PI * 2

export function initializeCapabilityWireframes(root, cleanups) {
  root.querySelectorAll('[data-capability-wireframe]').forEach((canvas) => {
    initializeCapabilityWireframe(canvas, cleanups)
  })
}

function initializeCapabilityWireframe(canvas, cleanups) {
  const context = canvas.getContext('2d')
  if (!context) return

  const controller = new AbortController()
  const { signal } = controller
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)')
  const kind = canvas.dataset.capabilityWireframe
  let frameId = 0
  let width = 0
  let height = 0
  let visible = false
  let primary = '#6d80b6'
  let signalColor = '#ff634a'
  const startedAt = performance.now()

  const syncColors = () => {
    const styles = getComputedStyle(document.documentElement)
    primary = styles.getPropertyValue('--page-primary').trim() || '#6d80b6'
    signalColor = styles.getPropertyValue('--coral-signal-500').trim() || '#ff634a'
    draw(motionQuery.matches ? 0 : performance.now() - startedAt)
  }

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    if (rect.width < 2 || rect.height < 2) return
    const pixelRatio = Math.min(devicePixelRatio || 1, 2)
    width = rect.width
    height = rect.height
    canvas.width = Math.round(width * pixelRatio)
    canvas.height = Math.round(height * pixelRatio)
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    draw(motionQuery.matches ? 0 : performance.now() - startedAt)
  }

  const draw = (elapsed) => {
    if (!width || !height) return
    context.clearRect(0, 0, width, height)
    drawReferenceGrid(context, width, height, primary)

    const scene = { context, width, height, elapsed, primary, signalColor, reducedMotion: motionQuery.matches }
    if (kind === 'ingest') drawConvergingStreams(scene)
    else if (kind === 'capture') drawProjectionField(scene)
    else if (kind === 'structure') drawLayeredStructure(scene)
    else drawTraceField(scene)

    canvas.dataset.wireframeReady = 'true'
  }

  const tick = (now) => {
    draw(now - startedAt)
    frameId = requestAnimationFrame(tick)
  }

  const stop = () => {
    cancelAnimationFrame(frameId)
    frameId = 0
  }

  const start = () => {
    if (!visible || document.hidden || motionQuery.matches || frameId) return
    frameId = requestAnimationFrame(tick)
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) start()
    else stop()
  }, { threshold: 0 })
  intersectionObserver.observe(canvas)

  window.addEventListener('main-palette-change', syncColors, { signal })
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop()
    else start()
  }, { signal })
  motionQuery.addEventListener('change', () => {
    stop()
    draw(0)
    start()
  }, { signal })

  syncColors()
  resize()
  cleanups.push(() => {
    stop()
    controller.abort()
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    delete canvas.dataset.wireframeReady
  })
}

function drawReferenceGrid(context, width, height, color) {
  context.save()
  context.strokeStyle = color
  context.globalAlpha = 0.07
  context.lineWidth = 1
  const step = Math.max(20, Math.round(Math.min(width, height) / 10))
  for (let x = step / 2; x < width; x += step) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, height)
    context.stroke()
  }
  for (let y = step / 2; y < height; y += step) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()
  }
  context.restore()
}

function drawConvergingStreams({ context, width, height, elapsed, primary, signalColor, reducedMotion }) {
  const left = width * 0.08
  const span = width * 0.84
  const centerY = height * 0.5
  const samples = 100

  for (let strand = 0; strand < 7; strand += 1) {
    context.beginPath()
    for (let index = 0; index <= samples; index += 1) {
      const progress = index / samples
      const convergence = 1 - progress
      const angle = progress * TAU * 2.15 + strand * 0.8 - elapsed * 0.00034
      const depth = Math.cos(angle)
      const x = left + span * progress + depth * 5
      const y = centerY + Math.sin(angle) * height * 0.27 * convergence
      if (index === 0) context.moveTo(x, y)
      else context.lineTo(x, y)
    }
    context.strokeStyle = primary
    context.globalAlpha = 0.28 + strand * 0.045
    context.lineWidth = 1
    context.setLineDash([4, 7])
    context.stroke()
  }
  context.setLineDash([])

  const fileTypes = ['PDF', 'XLSX', 'PPTX', 'SCAN']
  fileTypes.forEach((label, index) => {
    const phase = reducedMotion ? 0.42 + index * 0.06 : loopPhase(elapsed, index, 6400)
    const progress = Math.min(1, phase / 0.72)
    const startY = height * (0.18 + index * 0.21)
    drawWireCard(context, {
      x: width * (0.04 + progress * 0.34),
      y: startY + (centerY - startY) * progress * 0.62,
      width: 64,
      height: 32,
      label,
      detail: 'FILE',
      primary,
      signalColor,
      opacity: loopOpacity(phase),
      active: phase > 0.38 && phase < 0.68,
    })
  })

  drawSceneLabel(context, width * 0.72, centerY - 20, 'UPLOAD QUEUE', primary, 0.76)
  drawSceneLabel(context, width * 0.72, centerY + 2, 'NORMALIZING…', signalColor, pulse(elapsed, 11, reducedMotion))

  for (let index = 0; index < 9; index += 1) {
    const progress = 0.08 + index * 0.095
    const angle = progress * TAU * 2.15 + (index % 7) * 0.8 - elapsed * 0.00034
    drawSignalSquare(
      context,
      left + span * progress + Math.cos(angle) * 5,
      centerY + Math.sin(angle) * height * 0.27 * (1 - progress),
      signalColor,
      pulse(elapsed, index, reducedMotion)
    )
  }
  context.globalAlpha = 1
}

function drawProjectionField({ context, width, height, elapsed, primary, signalColor, reducedMotion }) {
  const origin = { x: width * 0.12, y: height * 0.5 }
  const center = { x: width * 0.76, y: height * 0.5 }
  const radiusX = width * 0.13
  const radiusY = height * 0.34

  context.strokeStyle = primary
  context.lineWidth = 1
  context.globalAlpha = 0.42
  context.beginPath()
  context.ellipse(center.x, center.y, radiusX, radiusY, 0, 0, TAU)
  context.stroke()

  const pageWidth = width * 0.28
  const pageHeight = height * 0.62
  for (let layer = 2; layer >= 0; layer -= 1) {
    const phase = reducedMotion ? 0.58 : loopPhase(elapsed, layer, 5400)
    const offset = layer * 7
    context.save()
    context.globalAlpha = 0.16 + layer * 0.08
    context.strokeStyle = primary
    context.strokeRect(center.x - pageWidth / 2 + offset, center.y - pageHeight / 2 - offset, pageWidth, pageHeight)
    context.restore()
    if (layer === 0) {
      const scan = reducedMotion ? 0.54 : phase
      context.save()
      context.strokeStyle = signalColor
      context.globalAlpha = 0.8
      context.beginPath()
      context.moveTo(center.x - pageWidth / 2, center.y - pageHeight / 2 + pageHeight * scan)
      context.lineTo(center.x + pageWidth / 2, center.y - pageHeight / 2 + pageHeight * scan)
      context.stroke()
      context.restore()
    }
  }

  ;['TEXT', 'TABLE', 'FIGURE'].forEach((label, index) => {
    const phase = reducedMotion ? 0.45 + index * 0.08 : loopPhase(elapsed, index + 2, 5000)
    drawWireCard(context, {
      x: width * (0.57 + index * 0.08),
      y: height * (0.18 + index * 0.23),
      width: 58,
      height: 25,
      label,
      primary,
      signalColor,
      opacity: loopOpacity(phase),
      active: phase > 0.4 && phase < 0.7,
    })
  })

  drawSceneLabel(context, width * 0.06, height * 0.14, 'PAGE CAPTURE', primary, 0.72)

  for (let index = 0; index < 11; index += 1) {
    const angle = index / 11 * TAU
    const endX = center.x + Math.cos(angle) * radiusX
    const endY = center.y + Math.sin(angle) * radiusY
    context.globalAlpha = 0.18 + (index % 3) * 0.07
    context.beginPath()
    context.moveTo(origin.x, origin.y)
    context.lineTo(endX, endY)
    context.stroke()

    const travel = reducedMotion ? 0.62 : (elapsed * 0.00018 + index * 0.137) % 1
    drawSignalSquare(
      context,
      origin.x + (endX - origin.x) * travel,
      origin.y + (endY - origin.y) * travel,
      signalColor,
      pulse(elapsed, index + 3, reducedMotion)
    )
  }

  context.fillStyle = primary
  context.globalAlpha = 0.8
  context.fillRect(origin.x - 3, origin.y - 3, 6, 6)
  context.globalAlpha = 1
}

function drawLayeredStructure({ context, width, height, elapsed, primary, signalColor, reducedMotion }) {
  const left = width * 0.12
  const right = width * 0.88
  const rows = 4
  const columns = 8

  for (let layer = 0; layer < 3; layer += 1) {
    const centerY = height * (0.27 + layer * 0.23)
    const planeHeight = height * 0.19
    const topInset = layer % 2 ? width * 0.07 : 0
    const bottomInset = layer % 2 ? 0 : width * 0.07
    const point = (u, v) => ({
      x: left + (right - left) * u + topInset * (1 - v) + bottomInset * v - (topInset + bottomInset) * 0.5,
      y: centerY + (v - 0.5) * planeHeight
    })

    context.strokeStyle = primary
    context.lineWidth = 1
    context.globalAlpha = 0.18 + layer * 0.1
    for (let row = 0; row <= rows; row += 1) {
      const start = point(0, row / rows)
      const end = point(1, row / rows)
      context.beginPath()
      context.moveTo(start.x, start.y)
      context.lineTo(end.x, end.y)
      context.stroke()
    }
    for (let column = 0; column <= columns; column += 1) {
      const start = point(column / columns, 0)
      const end = point(column / columns, 1)
      context.beginPath()
      context.moveTo(start.x, start.y)
      context.lineTo(end.x, end.y)
      context.stroke()
    }

    const scan = reducedMotion ? 0.58 : (elapsed * 0.00014 + layer * 0.27) % 1
    const scanStart = point(scan, 0)
    const scanEnd = point(scan, 1)
    context.globalAlpha = 0.72
    context.beginPath()
    context.moveTo(scanStart.x, scanStart.y)
    context.lineTo(scanEnd.x, scanEnd.y)
    context.stroke()

    for (let marker = 0; marker < 4; marker += 1) {
      const eventIndex = layer * 4 + marker
      const eventPoint = point((marker * 3 + layer + 1) % columns / columns, (marker + layer) % rows / rows)
      drawSignalSquare(context, eventPoint.x, eventPoint.y, signalColor, pulse(elapsed, eventIndex, reducedMotion))
    }
  }

  const nodes = [
    { label: 'H1', x: 0.14, y: 0.18 },
    { label: 'TABLE', x: 0.42, y: 0.43 },
    { label: 'FORMULA', x: 0.66, y: 0.66 },
    { label: 'FIGURE', x: 0.76, y: 0.25 },
  ]
  nodes.forEach((node, index) => {
    const phase = reducedMotion ? 0.5 : loopPhase(elapsed, index + 1, 6000)
    drawWireCard(context, {
      x: width * node.x,
      y: height * node.y,
      width: node.label.length > 4 ? 70 : 48,
      height: 26,
      label: node.label,
      detail: index === 0 ? 'ROOT' : `NODE ${index}`,
      primary,
      signalColor,
      opacity: 0.42 + loopOpacity(phase) * 0.58,
      active: phase > 0.35 && phase < 0.62,
    })
  })
  drawSceneLabel(context, width * 0.11, height * 0.88, 'DOCUMENT MAP / 12 NODES', primary, 0.72)
  context.globalAlpha = 1
}

function drawTraceField({ context, width, height, elapsed, primary, signalColor, reducedMotion }) {
  const sourceX = width * 0.15
  const sinkX = width * 0.85
  const centerY = height * 0.5

  context.strokeStyle = primary
  context.lineWidth = 1
  for (let index = 0; index < 11; index += 1) {
    const normalized = index / 10 * 2 - 1
    const bend = normalized * height * 0.46
    context.globalAlpha = 0.2 + (1 - Math.abs(normalized)) * 0.28
    context.beginPath()
    context.moveTo(sourceX, centerY)
    context.bezierCurveTo(width * 0.34, centerY + bend, width * 0.66, centerY + bend, sinkX, centerY)
    context.stroke()

    const travel = reducedMotion ? 0.5 : (elapsed * 0.00016 + index * 0.083) % 1
    const point = cubicPoint(
      { x: sourceX, y: centerY },
      { x: width * 0.34, y: centerY + bend },
      { x: width * 0.66, y: centerY + bend },
      { x: sinkX, y: centerY },
      travel
    )
    drawSignalSquare(context, point.x, point.y, signalColor, pulse(elapsed, index + 5, reducedMotion))
  }

  context.fillStyle = primary
  context.globalAlpha = 0.82
  context.fillRect(sourceX - 4, centerY - 4, 8, 8)
  context.fillRect(sinkX - 4, centerY - 4, 8, 8)
  context.globalAlpha = 1

  const tracePhase = reducedMotion ? 0.52 : loopPhase(elapsed, 2, 5600)
  drawWireCard(context, {
    x: width * 0.04,
    y: height * 0.39,
    width: 74,
    height: 50,
    label: 'PAGE 12',
    detail: 'REGION A4',
    primary,
    signalColor,
    opacity: 0.85,
    active: tracePhase > 0.28 && tracePhase < 0.56,
  })
  drawWireCard(context, {
    x: width * 0.76,
    y: height * 0.39,
    width: 70,
    height: 50,
    label: 'JSON',
    detail: 'SOURCE ↗',
    primary,
    signalColor,
    opacity: loopOpacity(tracePhase),
    active: tracePhase > 0.42 && tracePhase < 0.72,
  })
  drawSceneLabel(context, width * 0.33, height * 0.84, 'SOURCE LINK VERIFIED', signalColor, pulse(elapsed, 7, reducedMotion))
}

function loopPhase(elapsed, index, duration) {
  return (elapsed / duration - index * 0.17 + 1) % 1
}

function loopOpacity(phase) {
  if (phase < 0.12) return phase / 0.12
  if (phase < 0.7) return 1
  if (phase < 0.9) return 1 - (phase - 0.7) / 0.2
  return 0
}

function drawWireCard(context, {
  x,
  y,
  width,
  height,
  label,
  detail,
  primary,
  signalColor,
  opacity,
  active,
}) {
  if (opacity <= 0.01) return
  context.save()
  context.globalAlpha = opacity
  context.fillStyle = 'rgba(252, 252, 250, .92)'
  context.fillRect(x, y, width, height)
  context.strokeStyle = active ? signalColor : primary
  context.lineWidth = active ? 1.4 : 1
  context.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1)
  context.fillStyle = active ? signalColor : primary
  context.fillRect(x + 7, y + 7, 5, 5)
  context.font = '500 9px "Geist Mono", monospace'
  context.textBaseline = 'top'
  context.fillText(label, x + 17, y + 5)
  if (detail) {
    context.globalAlpha = opacity * 0.62
    context.font = '400 7px "Geist Mono", monospace'
    context.fillText(detail, x + 7, y + height - 11)
  }
  context.restore()
}

function drawSceneLabel(context, x, y, text, color, opacity) {
  if (opacity <= 0.01) return
  context.save()
  context.fillStyle = color
  context.globalAlpha = opacity
  context.font = '400 8px "Geist Mono", monospace'
  context.textBaseline = 'top'
  context.fillText(text, x, y)
  context.restore()
}

function cubicPoint(a, b, c, d, t) {
  const inverse = 1 - t
  return {
    x: inverse ** 3 * a.x + 3 * inverse ** 2 * t * b.x + 3 * inverse * t ** 2 * c.x + t ** 3 * d.x,
    y: inverse ** 3 * a.y + 3 * inverse ** 2 * t * b.y + 3 * inverse * t ** 2 * c.y + t ** 3 * d.y,
  }
}

function pulse(elapsed, index, reducedMotion) {
  if (reducedMotion) return index % 3 === 0 ? 0.9 : 0
  const phase = (elapsed / 2600 + index * 0.173) % 1
  if (phase > 0.24) return 0
  return Math.sin(phase / 0.24 * Math.PI)
}

function drawSignalSquare(context, x, y, color, opacity) {
  if (opacity <= 0.01) return
  const size = 5 + opacity * 3
  context.fillStyle = color
  context.globalAlpha = opacity
  context.fillRect(x - size / 2, y - size / 2, size, size)
}
