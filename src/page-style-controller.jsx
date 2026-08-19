import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { DialRoot, useDialKit } from 'dialkit'
import 'dialkit/styles.css'

const STORAGE_KEY = 'knowhere-page-style'
const DEFAULTS = { font: 'schengen', color: '#181818' }
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

function PageStyleControls() {
  const defaultOpen = !matchMedia('(max-width: 767px)').matches
  const params = useDialKit('Page Style', {
    typography: {
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
    },
    color: {
      mainColor: { type: 'color', default: initialSettings.color },
    },
  })

  const font = FONT_STACKS[params.typography.fontFamily]
    ? params.typography.fontFamily
    : DEFAULTS.font
  const color = /^#[0-9a-f]{6}$/i.test(params.color.mainColor || '')
    ? params.color.mainColor.toUpperCase()
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

  return <DialRoot position="top-right" defaultOpen={defaultOpen} theme="dark" productionEnabled />
}

const mount = document.querySelector('#page-style-dialkit')
if (mount) createRoot(mount).render(<PageStyleControls />)
