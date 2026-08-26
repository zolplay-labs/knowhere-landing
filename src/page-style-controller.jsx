import React, { useEffect } from 'react'
import { DialRoot, useDialKit } from 'dialkit'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import 'dialkit/styles.css'

const STORAGE_KEY = 'knowhere-page-style'
const PALETTE_VERSION = 3
const FONT_VERSION = 3
const MAIN_PALETTES = {
  'main-1': { 50: '#F5F6FA', 100: '#E9EBF3', 200: '#D5D9EA', 300: '#BFC6DF', 400: '#ACB5D6', 500: '#96A2CB', 600: '#6D80B6', 700: '#4E5D88', 800: '#343F5E', 900: '#1B2134', 950: '#101523' },
  'main-2': { 50: '#F8F4E0', 100: '#F2E9B9', 200: '#DFD5A4', 300: '#C8BF92', 400: '#B4AC83', 500: '#9E9773', 600: '#7D775A', 700: '#5C5741', 800: '#3F3C2C', 900: '#222016', 950: '#15130C' },
  'main-3': { 50: '#EEF7DF', 100: '#E2F1C7', 200: '#CCDAB4', 300: '#B9C6A3', 400: '#A7B293', 500: '#939D81', 600: '#747D66', 700: '#565C4B', 800: '#393D31', 900: '#20231B', 950: '#12140E' },
  'main-4': { 50: '#F3F3F7', 100: '#E3E5EC', 200: '#C8CBDA', 300: '#B0B5CB', 400: '#969DB9', 500: '#7C85A8', 600: '#60698B', 700: '#484F69', 800: '#2F3446', 900: '#1A1D29', 950: '#11131C' },
  'main-5': { 50: '#F1F3FD', 100: '#E6EAFB', 200: '#CDD6F8', 300: '#B3C2F5', 400: '#99AFF2', 500: '#7C9BEE', 600: '#4078E3', 700: '#2E59AB', 800: '#1D3C76', 900: '#0D2045', 950: '#06122C' },
  'main-6': { 50: '#F0F8F7', 100: '#E0F1EF', 200: '#C7E2DF', 300: '#BAD4D1', 400: '#ABC3C0', 500: '#9CB2AF', 600: '#7B8C8A', 700: '#5B6867', 800: '#3B4443', 900: '#1F2524', 950: '#121616' },
  'main-7': { 50: '#F4F7F9', 100: '#EAEEF4', 200: '#D4DEE9', 300: '#BFCEDE', 400: '#ADC0D6', 500: '#96B0CB', 600: '#748BA3', 700: '#536577', 800: '#374350', 900: '#1D242C', 950: '#11161C' },
}
const MAIN_COLOR_VALUES = {
  'main-1': '#6D80B6',
  'main-2': '#9E9773',
  'main-3': '#939D81',
  'main-4': '#7C85A8',
  'main-5': '#7C9BEE',
  'main-6': '#9CB2AF',
  'main-7': '#96B0CB',
}
const MAIN_PALETTE_OPTIONS = [
  { value: 'main-1', label: 'Blue · Default' },
  { value: 'main-2', label: 'Yellow' },
  { value: 'main-3', label: 'Green' },
  { value: 'main-4', label: 'Indigo' },
  { value: 'main-5', label: 'Electric Blue' },
  { value: 'main-6', label: 'Teal' },
  { value: 'main-7', label: 'Slate Blue' },
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
      <style>{`:root{${paletteStyles(initialPalette)};--page-primary:${initialMainColor};--page-primary-foreground:${readableForeground(initialMainColor)};--accent:${initialMainColor};--figma-primary:${initialPalette[600]}}${CONTROLLER_LAYOUT_STYLES}`}</style>
      <DialRoot position="top-right" defaultOpen={defaultOpen} theme="light" productionEnabled />
    </>
  )
}
