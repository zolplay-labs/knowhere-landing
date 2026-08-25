import { useEffect, useMemo, useRef, useState } from 'react'
import { ColorControl, RangeControl } from './catenoid-field-embed'
import animationUrl from './converging-helix.js?url'
import './converging-helix-embed.css'

const DEFAULT_SETTINGS = {
  accentColor: null,
  amplitude: 0.52,
  backgroundColor: 'transparent',
  centerGap: 120,
  compression: 1.22,
  dashGap: 8,
  dashLength: 5,
  decay: 1.05,
  horizontalSpan: 1,
  lineWidth: 1,
  opacity: 0.86,
  rotation: [0, 0.57, 0],
  scale: 1,
  showDataSquares: true,
  speed: 1,
  strands: 7,
  turns: 2.25,
}
const SETTINGS_STORAGE_KEY = 'knowhere:converging-helix-settings'
let animationLoad = null

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function getAnimationApi() {
  return window.__convergingHelixAnimations
}

function resolveColor(color) {
  const token = color.match(/^var\((--[^,)]+)(?:,[^)]+)?\)$/)?.[1]
  return token ? getComputedStyle(document.documentElement).getPropertyValue(token).trim() : color
}

function resolveOptions(options) {
  return {
    ...options,
    accent: resolveColor(options.accent),
    background: options.background === 'transparent' ? 'transparent' : resolveColor(options.background),
  }
}

function loadSavedSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY))
    if (!saved) return DEFAULT_SETTINGS
    const number = (value, fallback, min, max) => Number.isFinite(value) ? clamp(value, min, max) : fallback
    return {
      accentColor: /^#[0-9a-f]{6}$/i.test(saved.accentColor) ? saved.accentColor : null,
      amplitude: number(saved.amplitude, DEFAULT_SETTINGS.amplitude, 0.05, 1.5),
      backgroundColor: 'transparent',
      centerGap: number(saved.centerGap, DEFAULT_SETTINGS.centerGap, 0, 320),
      compression: number(saved.compression, DEFAULT_SETTINGS.compression, 0.2, 4),
      dashGap: number(saved.dashGap, DEFAULT_SETTINGS.dashGap, 0.5, 40),
      dashLength: number(saved.dashLength, DEFAULT_SETTINGS.dashLength, 0.5, 40),
      decay: number(saved.decay, DEFAULT_SETTINGS.decay, 0.2, 4),
      horizontalSpan: number(saved.horizontalSpan, DEFAULT_SETTINGS.horizontalSpan, 0.5, 1.3),
      lineWidth: number(saved.lineWidth, DEFAULT_SETTINGS.lineWidth, 0.25, 8),
      opacity: number(saved.opacity, DEFAULT_SETTINGS.opacity, 0, 1),
      rotation: Array.isArray(saved.rotation) && saved.rotation.length === 3
        ? saved.rotation.map((value, index) => number(value, DEFAULT_SETTINGS.rotation[index], -180, 180))
        : DEFAULT_SETTINGS.rotation,
      scale: number(saved.scale, DEFAULT_SETTINGS.scale, 0.5, 1.5),
      showDataSquares: typeof saved.showDataSquares === 'boolean' ? saved.showDataSquares : true,
      speed: number(saved.speed, DEFAULT_SETTINGS.speed, 0, 4),
      strands: Math.round(number(saved.strands, DEFAULT_SETTINGS.strands, 1, 16)),
      turns: number(saved.turns, DEFAULT_SETTINGS.turns, 0.25, 8),
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function loadAnimation() {
  if (getAnimationApi()) return Promise.resolve()
  if (animationLoad) return animationLoad
  animationLoad = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-converging-helix-embed]')
    const script = existing ?? document.createElement('script')
    const onLoad = () => resolve()
    const onError = () => {
      animationLoad = null
      reject(new Error('Unable to load the converging helix animation.'))
    }
    script.addEventListener('load', onLoad, { once: true })
    script.addEventListener('error', onError, { once: true })
    if (!existing) {
      script.src = animationUrl
      script.async = true
      script.dataset.convergingHelixEmbed = 'true'
      document.head.appendChild(script)
    }
  })
  return animationLoad
}

export function ConvergingHelixEmbed({
  accentColor = 'var(--main-400)',
  amplitude = DEFAULT_SETTINGS.amplitude,
  backgroundColor = DEFAULT_SETTINGS.backgroundColor,
  centerGap = DEFAULT_SETTINGS.centerGap,
  className,
  compression = DEFAULT_SETTINGS.compression,
  dashGap = DEFAULT_SETTINGS.dashGap,
  dashLength = DEFAULT_SETTINGS.dashLength,
  decay = DEFAULT_SETTINGS.decay,
  horizontalSpan = DEFAULT_SETTINGS.horizontalSpan,
  lineWidth = DEFAULT_SETTINGS.lineWidth,
  mirror = false,
  opacity = DEFAULT_SETTINGS.opacity,
  rotation = DEFAULT_SETTINGS.rotation,
  scale = DEFAULT_SETTINGS.scale,
  showDataSquares = DEFAULT_SETTINGS.showDataSquares,
  speed = DEFAULT_SETTINGS.speed,
  strands = DEFAULT_SETTINGS.strands,
  turns = DEFAULT_SETTINGS.turns,
}) {
  const canvasRef = useRef(null)
  const options = useMemo(() => ({
    accent: accentColor,
    amplitude,
    background: backgroundColor,
    centerGap,
    compression,
    dashGap,
    dashLength,
    decay,
    horizontalSpan,
    lineWidth,
    mirror,
    opacity,
    rotation: rotation.map(value => value * Math.PI / 180),
    scale,
    showDataSquares,
    speed,
    strands,
    turns,
  }), [accentColor, amplitude, backgroundColor, centerGap, compression, dashGap, dashLength, decay, horizontalSpan, lineWidth, mirror, opacity, rotation, scale, showDataSquares, speed, strands, turns])
  const optionsRef = useRef(options)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    let disposed = false
    void loadAnimation()
      .then(() => {
        if (disposed) return
        getAnimationApi()?.initialize(canvas)
        canvas.__convergingHelixAnimation?.setOptions(resolveOptions(optionsRef.current))
        canvas.__convergingHelixAnimation?.restart()
      })
      .catch(() => {
        canvas.dataset.animationError = 'true'
      })
    return () => {
      disposed = true
      getAnimationApi()?.destroy(canvas)
    }
  }, [])

  useEffect(() => {
    optionsRef.current = options
    const applyOptions = () => {
      canvasRef.current?.__convergingHelixAnimation?.setOptions(resolveOptions(options))
    }
    applyOptions()
    window.addEventListener('main-palette-change', applyOptions)
    return () => window.removeEventListener('main-palette-change', applyOptions)
  }, [options])

  return (
    <div className={['converging-helix-embed', className].filter(Boolean).join(' ')}>
      <canvas
        ref={canvasRef}
        className="converging-helix-embed__canvas"
        data-animation="converging-helix"
        data-mirror={mirror ? 'true' : 'false'}
        aria-hidden="true"
      />
    </div>
  )
}

function ToggleControl({ label, onChange, value }) {
  return (
    <label className="converging-helix-toggle-control">
      <span>{label}</span>
      <output>{value ? 'On' : 'Off'}</output>
      <input type="checkbox" checked={value} onChange={event => onChange(event.target.checked)} />
    </label>
  )
}

export function ConvergingHelixTuner({ children }) {
  const initialSettings = useMemo(loadSavedSettings, [])
  const [settings, setSettings] = useState(initialSettings)
  const [paletteAccent, setPaletteAccent] = useState('#FFFFFF')
  const [settingsSaved, setSettingsSaved] = useState(false)
  const accentColor = settings.accentColor ?? 'var(--main-400)'
  const embedProps = { ...settings, accentColor }

  useEffect(() => {
    const updatePaletteAccent = () => {
      const value = getComputedStyle(document.documentElement).getPropertyValue('--main-400').trim()
      if (/^#[0-9a-f]{6}$/i.test(value)) setPaletteAccent(value)
    }
    updatePaletteAccent()
    window.addEventListener('main-palette-change', updatePaletteAccent)
    return () => window.removeEventListener('main-palette-change', updatePaletteAccent)
  }, [])

  useEffect(() => {
    setSettingsSaved(false)
  }, [settings])

  const setValue = (name, value) => setSettings(current => ({ ...current, [name]: value }))
  const setRotation = (axis, value) => setSettings(current => ({
    ...current,
    rotation: current.rotation.map((item, index) => index === axis ? value : item),
  }))
  const saveSettings = () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    setSettingsSaved(true)
  }
  const resetDefaults = () => setSettings({ ...DEFAULT_SETTINGS, rotation: [...DEFAULT_SETTINGS.rotation] })

  return (
    <div className="converging-helix-workbench">
      <div className="converging-helix-stage">
        <div className="final-cta-art" aria-hidden="true">
          <div className="converging-helix-pair">
            <ConvergingHelixEmbed {...embedProps} className="converging-helix-embed--left" mirror={false} />
            <ConvergingHelixEmbed {...embedProps} className="converging-helix-embed--right" mirror />
          </div>
        </div>
        {children}
      </div>
      <details className="converging-helix-controls">
        <summary><span>Adjust Converging Helix</span><small>{settings.strands} strands · {settings.speed}×</small></summary>
        <div className="converging-helix-controls__body">
          <p className="converging-helix-mode" role="status">Mirrored pair · shared parameters · 8.4s synchronized loop</p>
          <div className="converging-helix-control-grid">
            <RangeControl label="Speed" min={0} max={4} step={0.05} value={settings.speed} suffix="×" onChange={value => setValue('speed', value)} />
            <RangeControl label="Line width" min={0.25} max={4} step={0.25} value={settings.lineWidth} suffix="px" onChange={value => setValue('lineWidth', value)} />
            <RangeControl label="Dash length" min={0.5} max={20} step={0.5} value={settings.dashLength} suffix="px" onChange={value => setValue('dashLength', value)} />
            <RangeControl label="Dash gap" min={0.5} max={20} step={0.5} value={settings.dashGap} suffix="px" onChange={value => setValue('dashGap', value)} />
            <RangeControl label="Turns" min={0.25} max={8} step={0.05} value={settings.turns} onChange={value => setValue('turns', value)} />
            <RangeControl label="Amplitude" min={0.05} max={1.5} step={0.01} value={settings.amplitude} onChange={value => setValue('amplitude', value)} />
            <RangeControl label="Decay" min={0.2} max={4} step={0.05} value={settings.decay} onChange={value => setValue('decay', value)} />
            <RangeControl label="Compression" min={0.2} max={4} step={0.05} value={settings.compression} onChange={value => setValue('compression', value)} />
            <RangeControl label="Horizontal span" min={0.5} max={1.3} step={0.01} value={settings.horizontalSpan} onChange={value => setValue('horizontalSpan', value)} />
            <RangeControl label="Center gap" min={0} max={320} step={4} value={settings.centerGap} suffix="px" onChange={value => setValue('centerGap', value)} />
            <RangeControl label="Overall size" min={0.5} max={1.5} step={0.01} value={settings.scale} suffix="×" onChange={value => setValue('scale', value)} />
            <RangeControl label="Strands" min={1} max={16} value={settings.strands} onChange={value => setValue('strands', value)} />
            <RangeControl label="Opacity" min={0} max={1} step={0.01} value={settings.opacity} onChange={value => setValue('opacity', value)} />
            <RangeControl label="X / Pitch" min={-180} max={180} step={0.01} value={settings.rotation[0]} suffix="°" onChange={value => setRotation(0, value)} />
            <RangeControl label="Y / Yaw" min={-180} max={180} step={0.01} value={settings.rotation[1]} suffix="°" onChange={value => setRotation(1, value)} />
            <RangeControl label="Z / Roll" min={-180} max={180} step={0.01} value={settings.rotation[2]} suffix="°" onChange={value => setRotation(2, value)} />
            <ToggleControl label="Data squares" value={settings.showDataSquares} onChange={value => setValue('showDataSquares', value)} />
          </div>
          <div className="converging-helix-color-row">
            <ColorControl label="Accent" value={settings.accentColor ?? paletteAccent} onChange={value => setValue('accentColor', value)} />
            <button type="button" onClick={() => setValue('accentColor', null)}>Use brand token</button>
          </div>
          <div className="converging-helix-actions">
            <button type="button" onClick={saveSettings}>{settingsSaved ? 'Saved' : 'Save settings'}</button>
            <button type="button" onClick={resetDefaults}>Reset defaults</button>
          </div>
        </div>
      </details>
    </div>
  )
}
