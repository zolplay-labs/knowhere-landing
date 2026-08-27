import React, { useEffect } from 'react'
import { DialRoot, useDialKit } from 'dialkit'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import 'dialkit/styles.css'
import { colorHex } from './colors'

const STORAGE_KEY = 'knowhere-page-style'
const PALETTE_VERSION = 5
const FONT_VERSION = 3
const MAIN_PALETTES = {
  'main-1': { 50: '#F5F6FA', 100: '#E9EBF3', 200: '#D5D9EA', 300: '#BFC6DF', 400: '#ACB5D6', 500: '#96A2CB', 600: '#6D80B6', 700: '#4E5D88', 800: '#343F5E', 900: '#1B2134', 950: '#101523' },
  'main-3': colorHex['mineral-green'],
}
const MAIN_COLOR_VALUES = {
  'main-1': '#6D80B6',
  'main-3': '#19A88B',
}
const MAIN_PALETTE_OPTIONS = [
  { value: 'main-1', label: 'Blue · Default' },
  { value: 'main-3', label: 'Green' },
]
const DEFAULTS = { font: 'poppins', chineseFont: 'frex-sans-gb', palette: 'main-1' }
const FONT_STACKS = {
  poppins: '"Poppins", "Helvetica Neue", Helvetica, Arial, sans-serif',
  schengen: '"ABC Schengen Greek Variable Trial", "Space Grotesk", "Noto Sans SC", "Noto Sans CJK SC", "PingFang SC", sans-serif',
  fellix: '"Fellix", "Helvetica Neue", Helvetica, Arial, sans-serif',
  geist: '"Geist Sans", "Helvetica Neue", Arial, sans-serif',
  helvetica: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  serif: 'Georgia, "Times New Roman", "Songti SC", serif',
}
const ENGLISH_FONT_FACES = {
  poppins: '"Poppins", "Helvetica Neue", Helvetica, Arial',
  schengen: '"ABC Schengen Greek Variable Trial", "Space Grotesk"',
  fellix: '"Fellix", "Helvetica Neue", Helvetica, Arial',
  geist: '"Geist Sans", "Helvetica Neue", Arial',
  helvetica: '"Helvetica Neue", Helvetica, Arial',
  serif: 'Georgia, "Times New Roman"',
}
const CHINESE_FONT_STACKS = {
  'frex-sans-gb': '"Frex Sans GB", "Noto Sans SC", "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif',
  'noto-sans-sc': '"Noto Sans SC", "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif',
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      font: saved.fontVersion === FONT_VERSION && FONT_STACKS[saved.font]
        ? saved.font
        : DEFAULTS.font,
      chineseFont: CHINESE_FONT_STACKS[saved.chineseFont] ? saved.chineseFont : DEFAULTS.chineseFont,
      palette: saved.paletteVersion === PALETTE_VERSION && MAIN_PALETTES[saved.palette]
        ? saved.palette
        : DEFAULTS.palette,
    }
  } catch {
    return { ...DEFAULTS }
  }
}

const initialSettings = loadSettings()

function saveSettings(settings) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...saved, ...settings }))
  } catch {
    // Styling still works when storage is unavailable.
  }
}

function readableForeground(hex) {
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
  const linear = channels.map((value) => (
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ))
  const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
  return luminance > 0.179 ? '#181818' : '#FFFFFF'
}

function paletteStyles(palette) {
  return Object.entries(palette).map(([stop, color]) => `--main-${stop}:${color}`).join(';')
}

const CONTROLLER_LAYOUT_STYLES = `
  .dialkit-root {
    position: fixed;
    z-index: 2147483000;
    inset: 0;
    width: 100%;
    height: 0;
    --dial-surface: #f3f2ee;
    --dial-surface-hover: #ecebe6;
    --dial-surface-active: #e5e4de;
    --dial-surface-subtle: #d8d6d0;
    --dial-text-root: #181818;
    --dial-text-section: #5f5e5c;
    --dial-text-label: #454440;
    --dial-text-focus: #181818;
    --dial-text-primary: #181818;
    --dial-text-secondary: #5f5e5c;
    --dial-text-tertiary: #898887;
    --dial-border: #c9c7c0;
    --dial-border-hover: #898887;
    --dial-glass-bg: rgba(253, 252, 252, .96);
    --dial-dropdown-bg: #fdfcfc;
    --dial-backdrop-blur: 14px;
    --dial-radius: 4px;
    --dial-row-height: 44px;
    --dial-shadow: 0 16px 48px rgba(24, 24, 24, .12);
    --dial-shadow-collapsed: none;
    --dial-shadow-dropdown: 0 12px 32px rgba(24, 24, 24, .12);
    font-family: var(--sans);
  }
  .dialkit-panel-inner:not([data-collapsed="true"]) {
    width: min(400px, calc(100vw - 32px)) !important;
    padding: 0 14px !important;
    border-color: #c9c7c0;
    border-radius: 6px !important;
    background: rgba(253, 252, 252, .96);
  }
  .dialkit-panel[data-position="top-right"] {
    top: 80px;
  }
  .dialkit-panel-inner[data-collapsed="true"] {
    border-color: #181818;
    border-radius: 4px !important;
    background: #181818;
    color: #fff;
  }
  .dialkit-panel-inner[data-collapsed="true"] .dialkit-panel-icon {
    color: #fff;
  }
  .dialkit-panel-inner:not([data-collapsed="true"]) .dialkit-panel-header {
    min-height: 54px;
    margin: 0;
    padding: 0;
    border-bottom-color: #c9c7c0;
    cursor: grab;
    touch-action: none;
    user-select: none;
  }
  .dialkit-panel[data-dragging="true"] .dialkit-panel-header {
    cursor: grabbing;
  }
  .dialkit-panel-inner:not([data-collapsed="true"]) .dialkit-panel-header button,
  .dialkit-panel-inner:not([data-collapsed="true"]) .dialkit-panel-header a,
  .dialkit-panel-inner:not([data-collapsed="true"]) .dialkit-panel-header input,
  .dialkit-panel-inner:not([data-collapsed="true"]) .dialkit-panel-header select {
    cursor: pointer;
  }
  .dialkit-panel-inner:not([data-collapsed="true"]) .dialkit-panel-header .dialkit-folder-header-top {
    min-height: 54px;
    padding: 0;
  }
  .dialkit-folder-title-root {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: -.01em;
  }
  .dialkit-folder:not(.dialkit-folder-root) {
    margin: 0;
    border-color: #d8d6d0;
  }
  .dialkit-folder:not(.dialkit-folder-root) > .dialkit-folder-header {
    height: 42px;
  }
  .dialkit-folder:not(.dialkit-folder-root) .dialkit-folder-title {
    color: #777670;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: .08em;
    text-transform: uppercase;
  }
  .dialkit-folder:not(.dialkit-folder-root) > .dialkit-folder-content > .dialkit-folder-inner {
    gap: 8px;
    padding: 2px 0 14px;
  }
  .dialkit-select-trigger {
    gap: 12px;
    padding: 0 !important;
    background: transparent !important;
    border-radius: 0;
  }
  .dialkit-select-label {
    min-width: 0;
    flex: 1 1 auto;
    color: #454440;
    font-size: 12px;
    font-weight: 400;
    text-align: left;
  }
  .dialkit-select-right {
    min-width: 0;
    min-height: 40px;
    flex: 0 0 214px;
    align-self: stretch;
    padding: 0 12px;
    justify-content: space-between;
    border: 1px solid #c9c7c0;
    border-radius: 4px;
    background: #f7f6f1;
  }
  .dialkit-select-trigger:hover .dialkit-select-right,
  .dialkit-select-trigger[data-open="true"] .dialkit-select-right {
    border-color: #898887;
    background: #fff;
  }
  .dialkit-select-value {
    min-width: 0;
    overflow: hidden;
    color: #181818;
    font-size: 12px;
    font-weight: 400;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dialkit-select-chevron {
    width: 16px;
    height: 16px;
    opacity: .65;
  }
  .dialkit-select-dropdown {
    padding: 4px;
    border: 1px solid #c9c7c0;
    border-radius: 4px;
    background: #fdfcfc;
    box-shadow: 0 12px 32px rgba(24, 24, 24, .12);
    font-family: var(--sans);
  }
  .dialkit-select-option {
    min-height: 36px;
    padding: 8px 10px;
    border-radius: 3px;
    color: #454440;
    font-size: 12px;
    font-weight: 400;
  }
  .dialkit-select-option:hover {
    background: #f0efe9;
  }
  .dialkit-select-option[data-selected="true"] {
    background: color-mix(in srgb, var(--page-primary) 16%, #fdfcfc);
    color: #181818;
  }
  .dialkit-panel button:focus-visible {
    outline: 2px solid var(--page-primary);
    outline-offset: 2px;
  }
  .dialkit-select-option:focus-visible {
    outline: 2px solid var(--page-primary);
    outline-offset: -1px;
  }
  @media (max-width: 479px) {
    .dialkit-select-right {
      flex-basis: 176px;
    }
  }
`

function applySettings(targetDocument, settings) {
  if (!targetDocument?.documentElement) return

  const rootStyle = targetDocument.documentElement.style
  const englishFont = FONT_STACKS[settings.font] || FONT_STACKS[DEFAULTS.font]
  const englishFaces = ENGLISH_FONT_FACES[settings.font] || ENGLISH_FONT_FACES[DEFAULTS.font]
  const chineseFont = CHINESE_FONT_STACKS[settings.chineseFont] || CHINESE_FONT_STACKS[DEFAULTS.chineseFont]
  const fontStack = settings.language === 'zh' ? `${englishFaces}, ${chineseFont}` : englishFont
  const palette = MAIN_PALETTES[settings.palette] || MAIN_PALETTES[DEFAULTS.palette]
  const mainColor = MAIN_COLOR_VALUES[settings.palette] || MAIN_COLOR_VALUES[DEFAULTS.palette]

  for (const property of ['--sans', '--serif', '--mono', '--figma-display', '--figma-mono']) {
    rootStyle.setProperty(property, fontStack)
  }
  for (const [stop, color] of Object.entries(palette)) {
    rootStyle.setProperty(`--main-${stop}`, color)
  }
  rootStyle.setProperty('--mist-white-50', colorHex['mist-white'][50])
  rootStyle.setProperty('--mist-white-100', colorHex['mist-white'][100])
  rootStyle.setProperty('--mist-white-300', colorHex['mist-white'][300])
  rootStyle.setProperty('--mist-white-400', colorHex['mist-white'][400])
  rootStyle.setProperty('--mist-white-500', colorHex['mist-white'][500])
  rootStyle.setProperty('--mineral-green-400', colorHex['mineral-green'][400])
  rootStyle.setProperty('--mineral-green-500', colorHex['mineral-green'][500])
  rootStyle.setProperty('--mineral-green-600', colorHex['mineral-green'][600])
  rootStyle.setProperty('--mineral-green-700', colorHex['mineral-green'][700])
  rootStyle.setProperty('--mineral-green-900', colorHex['mineral-green'][900])
  rootStyle.setProperty('--coral-signal-500', colorHex['coral-signal'][500])
  rootStyle.setProperty('--deep-teal-500', colorHex['deep-teal'][500])
  rootStyle.setProperty('--accent', mainColor)
  rootStyle.setProperty('--page-primary', mainColor)
  rootStyle.setProperty('--page-primary-foreground', readableForeground(mainColor))
  rootStyle.setProperty('--figma-primary', palette[600])
  const targetWindow = targetDocument.defaultView
  targetWindow?.dispatchEvent(new targetWindow.CustomEvent('main-palette-change'))
}

export function PageStyleControls() {
  const defaultOpen = !matchMedia('(max-width: 767px)').matches
  const params = useDialKit('Knowhere Landing', {
    layout: {
      showGrid: false,
    },
    appearance: {
      fontFamily: {
        type: 'select',
        options: [
          { value: 'poppins', label: 'Poppins · Default' },
          { value: 'schengen', label: 'Schengen' },
          { value: 'fellix', label: 'Fellix' },
          { value: 'geist', label: 'Geist Sans' },
          { value: 'helvetica', label: 'Helvetica Neue' },
          { value: 'serif', label: 'Georgia Serif' },
        ],
        default: initialSettings.font,
      },
      chineseFontFamily: {
        type: 'select',
        options: [
          { value: 'frex-sans-gb', label: 'Frex Sans GB · Default' },
          { value: 'noto-sans-sc', label: 'Noto Sans SC' },
        ],
        default: initialSettings.chineseFont,
      },
      mainColor: {
        type: 'select',
        options: MAIN_PALETTE_OPTIONS,
        default: initialSettings.palette,
      },
    },
  })
  const vortexParams = useDialKit('Hero Vortex', {
    motion: {
      direction: {
        type: 'select',
        options: [
          { value: 'clockwise', label: 'Clockwise' },
          { value: 'counterclockwise', label: 'Counterclockwise' },
        ],
        default: 'clockwise',
      },
      flowSpeed: [0.018, 0, 0.12, 0.002],
      rotationSpeed: [0.012, 0, 0.12, 0.002],
      mouthSpeed: [0.018, 0, 0.2, 0.005],
      twistPerStage: [1.25, 0.2, 2.4, 0.05],
      middleTwist: [1.35, 0, 4, 0.05],
      speedVariation: [0.015, 0, 0.2, 0.005],
    },
    shape: {
      centerPosition: [0.4, 0.25, 0.55, 0.01],
      fieldScale: [0.98, 0.7, 1.2, 0.01],
      stageSpacing: [1, 0.8, 1.2, 0.01],
      innerShell: [0.48, 0.1, 0.8, 0.01],
      perspective: [0.28, 0, 0.6, 0.01],
      orbitHeight: [0.2, 0.05, 0.4, 0.01],
      cameraYaw: [0, -0.35, 0.35, 0.01],
      cameraLift: [0, -400, 80, 5],
      cameraRoll: [0, -12, 12, 1],
      waistWidth: [0.055, 0.02, 0.15, 0.005],
      firstExpansion: [0.28, 0.1, 0.5, 0.01],
      finalExpansion: [0.68, 0.3, 1, 0.01],
      fadeDistance: [120, 48, 240, 6],
    },
    particles: {
      mouthEnabled: false,
      mouthCount: [480, 120, 800, 20],
      mouthDensity: [1, 0.2, 1.6, 0.05],
      streamDensity: [1, 0.2, 1.8, 0.05],
      ridgeFrequency: [3, 1, 6, 0.1],
      ridgeStrength: [0.48, 0, 0.8, 0.02],
      middleLayering: [0.52, 0, 1.2, 0.02],
      depthDensity: [0.22, 0, 0.5, 0.01],
      depthAlpha: [0.46, 0, 0.8, 0.01],
      overallAlpha: [1, 0.2, 1.5, 0.05],
    },
    redParticleFlow: {
      redFlowDuration: [7, 0.8, 20, 0.2],
    },
    outflow: {
      enabled: true,
      count: [44, 0, 120, 1],
      speed: [0.03, 0, 0.2, 0.005],
      baseSpread: [2.2, 0.5, 5, 0.1],
      spreadGrowth: [5.2, 0, 10, 0.2],
      turns: [1.2, 0.2, 3, 0.1],
      alpha: [0.56, 0.1, 1.2, 0.02],
    },
    labels: {
      allLabelsY: [0, -600, 600, 5],
      hoverHeight: [150, 60, 300, 5],
      originalDocumentY: [0, -120, 120, 2],
      pageImagesY: [0, -120, 120, 2],
      lightweightNotesY: [0, -120, 120, 2],
      chapterMapY: [0, -120, 120, 2],
    },
  }, {
    id: 'hero-vortex',
    persist: true,
  })

  const font = FONT_STACKS[params.appearance.fontFamily]
    ? params.appearance.fontFamily
    : DEFAULTS.font
  const chineseFont = CHINESE_FONT_STACKS[params.appearance.chineseFontFamily]
    ? params.appearance.chineseFontFamily
    : DEFAULTS.chineseFont
  const palette = MAIN_PALETTES[params.appearance.mainColor]
    ? params.appearance.mainColor
    : DEFAULTS.palette

  useEffect(() => {
    document.documentElement.toggleAttribute('data-layout-grid', params.layout.showGrid)
    return () => document.documentElement.removeAttribute('data-layout-grid')
  }, [params.layout.showGrid])

  useEffect(() => {
    const positionKey = 'knowhere-dialkit-panel-position'
    let dragState = null

    const panelInner = panel => panel?.querySelector('.dialkit-panel-inner')
    const isExpanded = panel => panelInner(panel)?.dataset.collapsed !== 'true'
    const readPosition = () => {
      try {
        const position = JSON.parse(localStorage.getItem(positionKey) || 'null')
        return Number.isFinite(position?.x) && Number.isFinite(position?.y) ? position : null
      } catch {
        return null
      }
    }
    const clampPosition = (panel, x, y) => {
      const rect = panel.getBoundingClientRect()
      return {
        x: Math.max(8, Math.min(x, innerWidth - rect.width - 8)),
        y: Math.max(8, Math.min(y, innerHeight - rect.height - 8)),
      }
    }
    const applyPosition = (panel, position) => {
      if (!panel || !position || !isExpanded(panel)) return
      const clamped = clampPosition(panel, position.x, position.y)
      panel.style.setProperty('inset', 'auto', 'important')
      panel.style.setProperty('left', `${clamped.x}px`, 'important')
      panel.style.setProperty('top', `${clamped.y}px`, 'important')
      panel.style.setProperty('right', 'auto', 'important')
      panel.style.setProperty('bottom', 'auto', 'important')
      panel.style.setProperty('transform', 'none', 'important')
    }
    const clearPosition = panel => {
      for (const property of ['inset', 'left', 'top', 'right', 'bottom', 'transform']) {
        panel?.style.removeProperty(property)
      }
    }
    const savePosition = panel => {
      const rect = panel.getBoundingClientRect()
      try {
        localStorage.setItem(positionKey, JSON.stringify({ x: rect.left, y: rect.top }))
      } catch {
        // The panel remains draggable when browser storage is unavailable.
      }
    }
    const onPointerDown = event => {
      const header = event.target.closest?.('.dialkit-panel-header')
      const panel = header?.closest('.dialkit-panel')
      if (!panel || !isExpanded(panel)) return
      if (event.target.closest('button, a, input, select, textarea, [role="button"]')) return

      const rect = panel.getBoundingClientRect()
      dragState = {
        panel,
        header,
        pointerId: event.pointerId,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
      }
      header.setPointerCapture?.(event.pointerId)
      panel.dataset.dragging = 'true'
      event.preventDefault()
    }
    const onPointerMove = event => {
      if (!dragState || event.pointerId !== dragState.pointerId) return
      applyPosition(dragState.panel, {
        x: event.clientX - dragState.offsetX,
        y: event.clientY - dragState.offsetY,
      })
      savePosition(dragState.panel)
    }
    const finishDrag = event => {
      if (!dragState) return
      if (event.type.startsWith('pointer') && event.pointerId !== dragState.pointerId) return
      const { panel, header, pointerId } = dragState
      if (header.hasPointerCapture?.(pointerId)) header.releasePointerCapture(pointerId)
      panel.removeAttribute('data-dragging')
      dragState = null
      savePosition(panel)
    }
    const syncPanelPosition = () => {
      const panel = document.querySelector('.dialkit-panel')
      if (!panel) return
      if (isExpanded(panel)) applyPosition(panel, readPosition())
      else clearPosition(panel)
    }

    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', finishDrag)
    window.addEventListener('pointercancel', finishDrag)
    window.addEventListener('mouseup', finishDrag)
    window.addEventListener('resize', syncPanelPosition)
    const observer = new MutationObserver(syncPanelPosition)
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-collapsed'],
    })
    syncPanelPosition()

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', finishDrag)
      window.removeEventListener('pointercancel', finishDrag)
      window.removeEventListener('mouseup', finishDrag)
      window.removeEventListener('resize', syncPanelPosition)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('hero-vortex-controls', {
      detail: vortexParams,
    }))
  }, [vortexParams])

  useEffect(() => {
    const settings = {
      font,
      fontVersion: FONT_VERSION,
      chineseFont,
      palette,
      paletteVersion: PALETTE_VERSION,
    }
    const scanFrame = document.querySelector('.section-scan-frame iframe')
    const syncSettings = () => {
      const language = document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en'
      const localizedSettings = { ...settings, language }
      applySettings(document, localizedSettings)
      try {
        applySettings(scanFrame?.contentDocument, localizedSettings)
      } catch {
        // The embedded preview can become cross-origin without affecting the page controls.
      }
    }

    syncSettings()
    const languageObserver = new MutationObserver(syncSettings)
    languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })
    scanFrame?.addEventListener('load', syncSettings)
    saveSettings(settings)

    return () => {
      languageObserver.disconnect()
      scanFrame?.removeEventListener('load', syncSettings)
    }
  }, [font, chineseFont, palette])

  useEffect(() => {
    document.documentElement.setAttribute('data-hero-texture', '')
    window.dispatchEvent(new CustomEvent('hero-texture-change', {
      detail: { visible: true },
    }))
  }, [])

  useEffect(() => {
    const scanFrame = document.querySelector('.section-scan-frame iframe')
    const syncTextureVisibility = () => {
      try {
        if (typeof scanFrame?.contentWindow?.setTraceDitherVisible === 'function') {
          scanFrame.contentWindow.setTraceDitherVisible(false)
        } else {
          const textureCanvas = scanFrame?.contentDocument?.querySelector('[data-trace-dither-field]')
          if (textureCanvas) textureCanvas.hidden = true
        }
      } catch {
        // The embedded preview can become cross-origin without affecting the control.
      }
    }

    syncTextureVisibility()
    scanFrame?.addEventListener('load', syncTextureVisibility)
    return () => scanFrame?.removeEventListener('load', syncTextureVisibility)
  }, [])

  const initialPalette = MAIN_PALETTES[initialSettings.palette]
  const initialMainColor = MAIN_COLOR_VALUES[initialSettings.palette]

  return (
    <>
      <style>{`:root{${paletteStyles(initialPalette)};--mist-white-50:${colorHex['mist-white'][50]};--mist-white-100:${colorHex['mist-white'][100]};--mist-white-300:${colorHex['mist-white'][300]};--mist-white-400:${colorHex['mist-white'][400]};--mist-white-500:${colorHex['mist-white'][500]};--mineral-green-400:${colorHex['mineral-green'][400]};--mineral-green-500:${colorHex['mineral-green'][500]};--mineral-green-600:${colorHex['mineral-green'][600]};--mineral-green-700:${colorHex['mineral-green'][700]};--mineral-green-900:${colorHex['mineral-green'][900]};--coral-signal-500:${colorHex['coral-signal'][500]};--deep-teal-500:${colorHex['deep-teal'][500]};--page-primary:${initialMainColor};--page-primary-foreground:${readableForeground(initialMainColor)};--accent:${initialMainColor};--figma-primary:${initialPalette[600]}}${CONTROLLER_LAYOUT_STYLES}`}</style>
      <DialRoot position="top-right" defaultOpen={defaultOpen} theme="light" productionEnabled />
    </>
  )
}
