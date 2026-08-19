import React, { useEffect } from 'react'
import { DialRoot, useDialKit } from 'dialkit'
import 'dialkit/styles.css'

const STORAGE_KEY = 'knowhere-page-style'
const HERO_TEXTURE_STORAGE_KEY = 'hero-b-pixel-controls'
const DEFAULTS = { font: 'schengen', color: '#181818' }
const HERO_TEXTURE_DEFAULTS = { position: 76, spread: 12, density: 30, contrast: 50 }
const FONT_STACKS = {
  schengen: '"ABC Schengen Greek Variable Trial", "Space Grotesk", "Noto Sans SC", "Noto Sans CJK SC", "PingFang SC", sans-serif',
  geist: '"Geist Sans", "Helvetica Neue", Arial, sans-serif',
  helvetica: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  serif: 'Georgia, "Times New Roman", "Songti SC", serif',
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      font: FONT_STACKS[saved.font] ? saved.font : DEFAULTS.font,
      color: /^#[0-9a-f]{6}$/i.test(saved.color || '')
        ? saved.color.toUpperCase()
        : DEFAULTS.color,
    }
  } catch {
    return { ...DEFAULTS }
  }
}

const initialSettings = loadSettings()

function loadHeroTextureSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(HERO_TEXTURE_STORAGE_KEY) || '{}')
    return { ...HERO_TEXTURE_DEFAULTS, ...saved }
  } catch {
    return { ...HERO_TEXTURE_DEFAULTS }
  }
}

const initialHeroTextureSettings = loadHeroTextureSettings()

function readableForeground(hex) {
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
  const linear = channels.map((value) => (
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ))
  const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
  return luminance > 0.42 ? '#181818' : '#FFFFFF'
}

function applySettings(targetDocument, settings) {
  if (!targetDocument?.documentElement) return

  const rootStyle = targetDocument.documentElement.style
  const fontStack = FONT_STACKS[settings.font] || FONT_STACKS[DEFAULTS.font]

  for (const property of ['--sans', '--serif', '--mono', '--figma-display', '--figma-mono']) {
    rootStyle.setProperty(property, fontStack)
  }
  rootStyle.setProperty('--accent', settings.color)
  rootStyle.setProperty('--page-primary', settings.color)
  rootStyle.setProperty('--page-primary-foreground', readableForeground(settings.color))
}

export function PageStyleControls() {
  const defaultOpen = !matchMedia('(max-width: 767px)').matches
  const params = useDialKit('Knowhere Landing', {
    appearance: {
      fontFamily: {
        type: 'select',
        options: [
          { value: 'schengen', label: 'Schengen · Default' },
          { value: 'geist', label: 'Geist Sans' },
          { value: 'helvetica', label: 'Helvetica Neue' },
          { value: 'serif', label: 'Georgia Serif' },
        ],
        default: initialSettings.font,
      },
      mainColor: { type: 'color', default: initialSettings.color },
    },
    heroTexture: {
      position: [initialHeroTextureSettings.position, 55, 88, 1],
      spread: [initialHeroTextureSettings.spread, 6, 24, 1],
      density: [initialHeroTextureSettings.density, 5, 70, 1],
      contrast: [initialHeroTextureSettings.contrast, 10, 85, 1],
      reset: { type: 'action', label: 'Reset Texture' },
    },
  }, {
    onAction: (path) => {
      if (path !== 'heroTexture.reset') return
      localStorage.removeItem(HERO_TEXTURE_STORAGE_KEY)
      window.location.reload()
    },
  })

  const font = FONT_STACKS[params.appearance.fontFamily]
    ? params.appearance.fontFamily
    : DEFAULTS.font
  const color = /^#[0-9a-f]{6}$/i.test(params.appearance.mainColor || '')
    ? params.appearance.mainColor.toUpperCase()
    : DEFAULTS.color

  useEffect(() => {
    const settings = { font, color }
    const scanFrame = document.querySelector('.section-scan-frame iframe')
    const syncFrame = () => {
      try {
        applySettings(scanFrame?.contentDocument, settings)
      } catch {
        // The embedded preview can become cross-origin without affecting the page controls.
      }
    }

    applySettings(document, settings)
    syncFrame()
    scanFrame?.addEventListener('load', syncFrame)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // Styling still works when storage is unavailable.
    }

    return () => scanFrame?.removeEventListener('load', syncFrame)
  }, [color, font])

  useEffect(() => {
    const settings = {
      position: params.heroTexture.position,
      spread: params.heroTexture.spread,
      density: params.heroTexture.density,
      contrast: params.heroTexture.contrast,
    }

    localStorage.setItem(HERO_TEXTURE_STORAGE_KEY, JSON.stringify(settings))
    window.dispatchEvent(new CustomEvent('hero-texture-change', { detail: settings }))
  }, [
    params.heroTexture.contrast,
    params.heroTexture.density,
    params.heroTexture.position,
    params.heroTexture.spread,
  ])

  return <DialRoot position="top-right" defaultOpen={defaultOpen} theme="dark" productionEnabled />
}
