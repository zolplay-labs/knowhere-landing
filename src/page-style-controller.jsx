import React, { useEffect, useState } from 'react'
import { DialRoot, useDialKit } from 'dialkit'
import 'dialkit/styles.css'
import { colorAlpha, colorHex, materialDark } from './colors'

const HERO_CONTROLS_STORAGE_KEY = 'knowhere-hero-vortex-controls'
// Stored hero controls whose old default should move to the new default.
const HERO_CONTROL_MIGRATIONS = [
  { path: 'redParticleFlow.redFlowLoopPause', from: 5, to: 1 },
  { path: 'redParticleFlow.redFlowLoopPause', from: 1, to: 0.5 },
  { path: 'redParticleFlow.redFlowDuration', from: 2.4, to: 5.5 },
  { path: 'redParticleFlow.redFlowInterval', from: 0.45, to: 0.9 },
  { path: 'redParticleFlow.redFlowStartAngle', from: 135, to: 215 },
  { path: 'redParticleFlow.redFlowDuration', from: 5.5, to: 6.5 },
  { path: 'redParticleFlow.redFlowInterval', from: 0.9, to: 2 },
  { path: 'fireShadow.emberAmount', from: 0.7, to: 0.45 },
  // (4 is the value a briefly reverted build clamped it to.)
  { path: 'motion.middleTwist', from: 1.35, to: 4.45 },
  { path: 'motion.middleTwist', from: 4, to: 4.45 },
  { path: 'motion.baseTwist', from: -2.2, to: -1 },
]
const MAIN_PALETTES = {
  'main-3': colorHex['mineral-green'],
}
const MAIN_COLOR_VALUES = {
  'main-3': colorHex['mineral-green'][500],
}
const DEFAULTS = { font: 'geist', palette: 'main-3' }

try {
  const storedHeroControls = JSON.parse(localStorage.getItem(HERO_CONTROLS_STORAGE_KEY) || 'null')
  const migrated = HERO_CONTROL_MIGRATIONS.filter(({ path, from, to }) => {
    if (storedHeroControls?.baseValues?.[path] !== from) return false
    storedHeroControls.baseValues[path] = to
    if (storedHeroControls.values?.[path] === from) storedHeroControls.values[path] = to
    return true
  })
  let expandedLineAngles = false
  for (const bucketName of ['baseValues', 'values']) {
    const bucket = storedHeroControls?.[bucketName]
    if (!bucket || Number.isFinite(bucket['redParticleFlow.redFlowLine1StartAngle'])) continue
    const startAngle = Number.isFinite(bucket['redParticleFlow.redFlowStartAngle'])
      ? bucket['redParticleFlow.redFlowStartAngle']
      : 215
    const endAngle = Number.isFinite(bucket['redParticleFlow.redFlowEndAngle'])
      ? bucket['redParticleFlow.redFlowEndAngle']
      : 135
    const angleSpread = Number.isFinite(bucket['redParticleFlow.redFlowAngleSpread'])
      ? bucket['redParticleFlow.redFlowAngleSpread']
      : 22
    const normalizeAngle = angle => ((angle % 360) + 360) % 360
    for (let index = 1; index <= 5; index += 1) {
      const offset = index - 3
      bucket[`redParticleFlow.redFlowLine${index}StartAngle`] = normalizeAngle(
        startAngle + offset * angleSpread
      )
      bucket[`redParticleFlow.redFlowLine${index}EndAngle`] = normalizeAngle(
        endAngle + offset * angleSpread
      )
    }
    expandedLineAngles = true
  }
  if (migrated.length || expandedLineAngles) {
    localStorage.setItem(HERO_CONTROLS_STORAGE_KEY, JSON.stringify(storedHeroControls))
  }
} catch {
  // Keep the in-memory defaults when browser storage is unavailable or invalid.
}

const FONT_STACKS = {
  geist: '"Geist", "Frex Sans GB VF", sans-serif',
}
const MONO_FONT_STACK = '"Geist Mono", "Frex Sans GB VF", monospace'

function readableForeground(hex) {
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
  const linear = channels.map((value) => (
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ))
  const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
  return luminance > 0.179 ? colorHex['mist-white'][950] : colorHex.white
}

function paletteStyles(palette) {
  return Object.entries(palette).map(([stop, color]) => `--main-${stop}:${color}`).join(';')
}

function resolveColorToken(token) {
  if (typeof colorHex[token] === 'string') return colorHex[token]
  const match = token.match(/^(.*)-(\d+)$/)
  return match ? colorHex[match[1]]?.[match[2]] : undefined
}

function colorTokenStyles() {
  const solidTokens = Object.entries(colorHex).flatMap(([family, value]) => (
    typeof value === 'string'
      ? [`--${family}:${value}`]
      : Object.entries(value).map(([stop, color]) => `--${family}-${stop}:${color}`)
  ))
  const alphaTokens = Object.entries(colorAlpha).flatMap(([family, values]) => (
    Object.entries(values).map(([opacity, color]) => `--${family}-${opacity}:${color}`)
  ))
  const materialDarkTokens = Object.entries(materialDark).map(([role, token]) => (
    `--md-sys-color-${role}:${resolveColorToken(token)}`
  ))
  return [...solidTokens, ...alphaTokens, ...materialDarkTokens].join(';')
}

function applySettings(targetDocument, settings) {
  if (!targetDocument?.documentElement) return

  const rootStyle = targetDocument.documentElement.style
  const fontStack = FONT_STACKS[settings.font] || FONT_STACKS[DEFAULTS.font]
  const palette = MAIN_PALETTES[settings.palette] || MAIN_PALETTES[DEFAULTS.palette]
  const mainColor = MAIN_COLOR_VALUES[settings.palette] || MAIN_COLOR_VALUES[DEFAULTS.palette]

  for (const property of ['--sans', '--serif', '--figma-display']) {
    rootStyle.setProperty(property, fontStack)
  }
  for (const property of ['--mono', '--figma-mono']) {
    rootStyle.setProperty(property, MONO_FONT_STACK)
  }
  for (const [stop, color] of Object.entries(palette)) {
    rootStyle.setProperty(`--main-${stop}`, color)
  }
  for (const [family, value] of Object.entries(colorHex)) {
    if (typeof value === 'string') {
      rootStyle.setProperty(`--${family}`, value)
      continue
    }
    for (const [stop, color] of Object.entries(value)) {
      rootStyle.setProperty(`--${family}-${stop}`, color)
    }
  }
  for (const [family, values] of Object.entries(colorAlpha)) {
    for (const [opacity, color] of Object.entries(values)) {
      rootStyle.setProperty(`--${family}-${opacity}`, color)
    }
  }
  for (const [role, token] of Object.entries(materialDark)) {
    rootStyle.setProperty(`--md-sys-color-${role}`, resolveColorToken(token))
  }
  rootStyle.setProperty('--accent', mainColor)
  rootStyle.setProperty('--page-primary', mainColor)
  rootStyle.setProperty('--page-primary-foreground', readableForeground(mainColor))
  rootStyle.setProperty('--figma-primary', palette[600])
  const targetWindow = targetDocument.defaultView
  targetWindow?.dispatchEvent(new targetWindow.CustomEvent('main-palette-change'))
}

export function PageStyleControls() {
  const [colorTheme, setColorTheme] = useState(() => document.documentElement.dataset.theme || 'light')

  useEffect(() => {
    const root = document.documentElement
    const syncColorTheme = () => setColorTheme(root.dataset.theme || 'light')
    const observer = new MutationObserver(syncColorTheme)
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    syncColorTheme()
    return () => observer.disconnect()
  }, [])

  const vortexParams = useDialKit('Hero Vortex', {
    redParticleFlow: {
      redFlowLine1StartAngle: [171, 0, 359, 1],
      redFlowLine1EndAngle: [91, 0, 359, 1],
      redFlowLine2StartAngle: [193, 0, 359, 1],
      redFlowLine2EndAngle: [113, 0, 359, 1],
      redFlowLine3StartAngle: [215, 0, 359, 1],
      redFlowLine3EndAngle: [135, 0, 359, 1],
      redFlowLine4StartAngle: [237, 0, 359, 1],
      redFlowLine4EndAngle: [157, 0, 359, 1],
      redFlowLine5StartAngle: [259, 0, 359, 1],
      redFlowLine5EndAngle: [179, 0, 359, 1],
      redFlowTurnPosition: [0.62, 0.2, 0.9, 0.01],
      redFlowDelay: [0, 0, 10, 0.1],
      redFlowDuration: [6.5, 0.6, 12, 0.05],
      redFlowInterval: [2, 0.3, 4, 0.1],
      redFlowLine1ExtraDelay: [0, 0, 5, 0.05],
      redFlowLine2ExtraDelay: [0, 0, 5, 0.05],
      redFlowLine3ExtraDelay: [0, 0, 5, 0.05],
      redFlowLine4ExtraDelay: [0, 0, 5, 0.05],
      redFlowLine5ExtraDelay: [0, 0, 5, 0.05],
      redFlowLineAlpha: [0.95, 0.3, 1, 0.02],
      redFlowLineWidth: [1.1, 0.3, 3, 0.1],
      redFlowSilhouetteFade: [0.18, 0.02, 0.5, 0.01],
      redFlowMouthOpen: [0.9, 0.05, 2, 0.05],
      redFlowBaseOpen: [4.8, 3.5, 6, 0.1],
    },
    motion: {
      direction: {
        type: 'select',
        options: [
          { value: 'clockwise', label: '顺时针' },
          { value: 'counterclockwise', label: '逆时针' },
        ],
        default: 'counterclockwise',
      },
      flowSpeed: [0.026, 0, 0.12, 0.002],
      rotationSpeed: [0.03, 0, 0.12, 0.002],
      mouthSpeed: [0.055, 0, 0.2, 0.005],
      twistPerStage: [1.95, 0.2, 2.4, 0.05],
      middleTwist: [4.45, 0, 6, 0.05],
      baseTwist: [-1, -3, 3, 0.05],
      speedVariation: [0.04, 0, 0.2, 0.005],
    },
    shape: {
      centerPosition: [0.55, 0.25, 0.55, 0.01],
      fieldScale: [0.96, 0.7, 1.2, 0.01],
      stageSpacing: [0.8, 0.8, 1.2, 0.01],
      innerShell: [0.49, 0.1, 0.8, 0.01],
      perspective: [0.11, 0, 0.6, 0.01],
      orbitHeight: [0.15, 0.05, 0.4, 0.01],
      cameraYaw: [0, -0.35, 0.35, 0.01],
      cameraLift: [80, -400, 80, 5],
      cameraRoll: [0, -12, 12, 1],
      waistWidth: [0.095, 0.02, 0.15, 0.005],
      firstExpansion: [0.29, 0.1, 0.5, 0.01],
      finalExpansion: [1, 0.3, 1, 0.01],
      fadeDistance: [108, 48, 240, 6],
    },
    particles: {
      mouthEnabled: false,
      mouthCount: [500, 120, 800, 20],
      mouthDensity: [1.25, 0.2, 1.6, 0.05],
      streamDensity: [0.85, 0.2, 1.8, 0.05],
      ridgeFrequency: [2.4, 1, 6, 0.1],
      ridgeStrength: [0.28, 0, 0.8, 0.02],
      middleLayering: [0.52, 0, 1.2, 0.02],
      depthDensity: [0.5, 0, 0.5, 0.01],
      depthAlpha: [0.05, 0, 0.8, 0.01],
      overallAlpha: [0.75, 0.2, 1.5, 0.05],
    },
    fireShadow: {
      emberAmount: [0.45, 0, 1.5, 0.05],
      emberAlpha: [1.1, 0.2, 1.5, 0.05],
    },
    outflow: {
      enabled: false,
      count: [33, 0, 120, 1],
      speed: [0.02, 0, 0.2, 0.005],
      baseSpread: [1.7, 0.5, 5, 0.1],
      spreadGrowth: [4.4, 0, 10, 0.2],
      turns: [1, 0.2, 3, 0.1],
      alpha: [0.42, 0.1, 1.2, 0.02],
    },
    labels: {
      allLabelsY: [50, -600, 600, 5],
      hoverHeight: [150, 60, 300, 5],
      originalDocumentY: [96, -120, 120, 2],
      pageImagesY: [120, -120, 120, 2],
      lightweightNotesY: [120, -120, 120, 2],
      chapterMapY: [106, -120, 120, 2],
    },
  }, {
    id: 'hero-vortex-controls',
    persist: { key: HERO_CONTROLS_STORAGE_KEY, storage: 'localStorage', presets: false },
  })

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('hero-vortex-controls', {
      detail: vortexParams,
    }))
  }, [vortexParams])

  useEffect(() => {
    applySettings(document, DEFAULTS)
  }, [])

  const initialPalette = MAIN_PALETTES[DEFAULTS.palette]
  const initialMainColor = MAIN_COLOR_VALUES[DEFAULTS.palette]

  return (
    <>
      <style>{`:root{${paletteStyles(initialPalette)};${colorTokenStyles()};--page-primary:${initialMainColor};--page-primary-foreground:${readableForeground(initialMainColor)};--accent:${initialMainColor};--figma-primary:${initialPalette[600]}}`}</style>
      <DialRoot position="top-right" defaultOpen={false} theme={colorTheme} />
    </>
  )
}
