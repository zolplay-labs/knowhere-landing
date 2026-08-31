import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DialRoot, useDialKit } from 'dialkit'
import '@fontsource/geist-sans/300.css'
import '@fontsource/geist-sans/400.css'
import '@fontsource/geist-sans/500.css'
import '@fontsource/geist-sans/600.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import 'dialkit/styles.css'
import { colorAlpha, colorHex, materialDark } from './colors'

const STORAGE_KEY = 'knowhere-page-style'
const HERO_CONTROLS_STORAGE_KEY = 'knowhere-hero-vortex-controls'
const HERO_LOOP_PAUSE_PATH = 'redParticleFlow.redFlowLoopPause'
const PALETTE_VERSION = 6
const FONT_VERSION = 5
const MAIN_PALETTES = {
  'main-3': colorHex['mineral-green'],
}
const MAIN_COLOR_VALUES = {
  'main-3': colorHex['mineral-green'][500],
}
const DEFAULTS = { font: 'geist', chineseFont: 'frex-sans-gb', palette: 'main-3' }

try {
  const storedHeroControls = JSON.parse(localStorage.getItem(HERO_CONTROLS_STORAGE_KEY) || 'null')
  if (storedHeroControls?.baseValues?.[HERO_LOOP_PAUSE_PATH] === 5) {
    storedHeroControls.baseValues[HERO_LOOP_PAUSE_PATH] = 1
    if (storedHeroControls.values?.[HERO_LOOP_PAUSE_PATH] === 5) {
      storedHeroControls.values[HERO_LOOP_PAUSE_PATH] = 1
    }
    localStorage.setItem(HERO_CONTROLS_STORAGE_KEY, JSON.stringify(storedHeroControls))
  }
} catch {
  // Keep the in-memory defaults when browser storage is unavailable or invalid.
}
const FONT_STACKS = {
  poppins: '"Poppins", "Helvetica Neue", Helvetica, Arial, sans-serif',
  geist: '"Geist Sans", "Helvetica Neue", Arial, sans-serif',
}
const ENGLISH_FONT_FACES = {
  poppins: '"Poppins", "Helvetica Neue", Helvetica, Arial',
  geist: '"Geist Sans", "Helvetica Neue", Arial',
}
const CHINESE_FONT_STACKS = {
  'frex-sans-gb': '"Frex Sans GB", "Noto Sans SC", "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif',
}

const CONTROLLER_TRANSLATIONS = {
  DialKit: '页面控制器',
  'Knowhere Landing': 'Knowhere 页面控制',
  'Hero Vortex': '首屏漩涡',
  Layout: '布局',
  'Show Grid': '显示网格',
  Appearance: '外观',
  'Font Family': '英文字体',
  'Chinese Font Family': '中文字体',
  'Main Color': '主色',
  Motion: '运动',
  Direction: '方向',
  'Flow Speed': '流动速度',
  'Rotation Speed': '旋转速度',
  'Mouth Speed': '入口速度',
  'Twist Per Stage': '每阶段扭转',
  'Middle Twist': '中段扭转',
  'Speed Variation': '速度变化',
  Shape: '形状',
  'Center Position': '中心位置',
  'Field Scale': '场景缩放',
  'Stage Spacing': '阶段间距',
  'Inner Shell': '内层半径',
  Perspective: '透视强度',
  'Orbit Height': '轨道高度',
  'Camera Yaw': '相机水平偏转',
  'Camera Lift': '相机抬升',
  'Camera Roll': '相机旋转',
  'Waist Width': '收束处宽度',
  'First Expansion': '第一次扩张',
  'Final Expansion': '最终扩张',
  'Fade Distance': '渐隐距离',
  Particles: '粒子',
  'Mouth Enabled': '显示入口粒子',
  'Mouth Count': '入口粒子数量',
  'Mouth Density': '入口粒子密度',
  'Stream Density': '流动粒子密度',
  'Ridge Frequency': '纹理频率',
  'Ridge Strength': '纹理强度',
  'Middle Layering': '中段层次',
  'Depth Density': '深度密度',
  'Depth Alpha': '深度透明度',
  'Overall Alpha': '整体透明度',
  'Red Particle Flow': '红色粒子流',
  'Red Flow Delay': '整体出现延迟',
  'Red Flow Duration': '单次持续时间',
  'Red Flow Interval': '线条出现间隔',
  'Red Flow Loop Pause': '每轮循环间隔',
  'Red Flow Line1 Extra Delay': '第 1 条额外延迟',
  'Red Flow Line2 Extra Delay': '第 2 条额外延迟',
  'Red Flow Line3 Extra Delay': '第 3 条额外延迟',
  'Red Flow Line4 Extra Delay': '第 4 条额外延迟',
  'Red Flow Line5 Extra Delay': '第 5 条额外延迟',
  'Red Flow Entry Spread': '入口位置偏差',
  'Red Flow Start Angle': '起始角度',
  'Red Flow Angle Spread': '轨道角度偏差',
  Outflow: '输出流',
  Enabled: '启用',
  Count: '数量',
  Speed: '速度',
  'Base Spread': '初始扩散',
  'Spread Growth': '扩散增长',
  Turns: '旋转圈数',
  Alpha: '透明度',
  Labels: '标签',
  'All Labels Y': '全部标签纵向位置',
  'Hover Height': '悬停区域高度',
  'Original Document Y': '原始文档纵向位置',
  'Page Images Y': '页面图像纵向位置',
  'Lightweight Notes Y': '轻量笔记纵向位置',
  'Chapter Map Y': '章节地图纵向位置',
  'Version 1': '版本 1',
  'Add preset': '添加预设',
  'Copy parameters': '复制参数',
  Off: '关闭',
  On: '开启',
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      font: saved.fontVersion === FONT_VERSION && FONT_STACKS[saved.font]
        ? saved.font
        : DEFAULTS.font,
      chineseFont: CHINESE_FONT_STACKS[saved.chineseFont] ? saved.chineseFont : DEFAULTS.chineseFont,
      palette: DEFAULTS.palette,
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

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      // Fall back for browsers that expose Clipboard API but deny the write.
    }
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()
  if (!copied) throw new Error('Clipboard write failed')
}

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

const CONTROLLER_LAYOUT_STYLES = `
  .dialkit-root {
    position: fixed;
    z-index: 2147483000;
    inset: 0;
    width: 100%;
    height: 0;
    --dial-surface: var(--mist-white-400);
    --dial-surface-hover: var(--mist-white-500);
    --dial-surface-active: var(--mist-white-600);
    --dial-surface-subtle: var(--mist-white-600);
    --dial-text-root: var(--mist-white-950);
    --dial-text-section: var(--mist-white-800);
    --dial-text-label: var(--mist-white-900);
    --dial-text-focus: var(--mist-white-950);
    --dial-text-primary: var(--mist-white-950);
    --dial-text-secondary: var(--mist-white-800);
    --dial-text-tertiary: var(--mist-white-700);
    --dial-border: var(--mist-white-600);
    --dial-border-hover: var(--mist-white-700);
    --dial-glass-bg: var(--white-100);
    --dial-dropdown-bg: var(--mist-white-100);
    --dial-backdrop-blur: 14px;
    --dial-radius: 4px;
    --dial-row-height: 44px;
    --dial-shadow: 0 16px 48px var(--black-10);
    --dial-shadow-collapsed: none;
    --dial-shadow-dropdown: 0 12px 32px var(--black-10);
    font-family: var(--sans);
  }
  html[data-theme="dark"] .dialkit-root {
    --dial-surface: var(--md-sys-color-surface-container-high);
    --dial-surface-hover: var(--md-sys-color-surface-container-highest);
    --dial-surface-active: var(--md-sys-color-primary-container);
    --dial-surface-subtle: var(--md-sys-color-surface-container);
    --dial-text-root: var(--md-sys-color-on-surface);
    --dial-text-section: var(--md-sys-color-on-surface-variant);
    --dial-text-label: var(--md-sys-color-on-surface);
    --dial-text-focus: var(--md-sys-color-on-surface);
    --dial-text-primary: var(--md-sys-color-on-surface);
    --dial-text-secondary: var(--md-sys-color-on-surface-variant);
    --dial-text-tertiary: var(--md-sys-color-outline);
    --dial-border: var(--md-sys-color-outline-variant);
    --dial-border-hover: var(--md-sys-color-outline);
    --dial-glass-bg: var(--md-sys-color-surface-container-high);
    --dial-dropdown-bg: var(--md-sys-color-surface-container);
    --dial-shadow: 0 16px 48px color-mix(in srgb, var(--md-sys-color-shadow) 40%, transparent);
    --dial-shadow-dropdown: 0 12px 32px color-mix(in srgb, var(--md-sys-color-shadow) 40%, transparent);
  }
  .dialkit-panel-inner:not([data-collapsed="true"]) {
    width: min(400px, calc(100vw - 32px)) !important;
    padding: 0 14px !important;
    border-color: var(--mist-white-600);
    border-radius: 6px !important;
    background: var(--white-100);
  }
  .dialkit-panel[data-position="top-right"] {
    top: 80px;
  }
  .dialkit-panel-inner[data-collapsed="true"] {
    border-color: var(--mist-white-950);
    border-radius: 4px !important;
    background: var(--mist-white-950);
    color: var(--white-100);
  }
  .dialkit-panel-inner[data-collapsed="true"] .dialkit-panel-icon {
    color: var(--white-100);
  }
  .dialkit-panel-inner:not([data-collapsed="true"]) .dialkit-panel-header {
    min-height: 54px;
    margin: 0;
    padding: 0;
    border-bottom-color: var(--mist-white-600);
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
    border-color: var(--mist-white-600);
  }
  .dialkit-folder:not(.dialkit-folder-root) > .dialkit-folder-header {
    height: 42px;
  }
  .dialkit-folder:not(.dialkit-folder-root) .dialkit-folder-title {
    color: var(--mist-white-700);
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
    color: var(--mist-white-900);
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
    border: 1px solid var(--mist-white-600);
    border-radius: 4px;
    background: var(--mist-white-300);
  }
  .dialkit-select-trigger:hover .dialkit-select-right,
  .dialkit-select-trigger[data-open="true"] .dialkit-select-right {
    border-color: var(--mist-white-700);
    background: var(--white-100);
  }
  .dialkit-select-value {
    min-width: 0;
    overflow: hidden;
    color: var(--mist-white-950);
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
    border: 1px solid var(--mist-white-600);
    border-radius: 4px;
    background: var(--mist-white-100);
    box-shadow: 0 12px 32px var(--black-10);
    font-family: var(--sans);
  }
  .dialkit-select-option {
    min-height: 36px;
    padding: 8px 10px;
    border-radius: 3px;
    color: var(--mist-white-900);
    font-size: 12px;
    font-weight: 400;
  }
  .dialkit-select-option:hover {
    background: var(--mist-white-500);
  }
  .dialkit-select-option[data-selected="true"] {
    background: color-mix(in srgb, var(--page-primary) 16%, var(--mist-white-100));
    color: var(--mist-white-950);
  }
  .dialkit-panel button:focus-visible {
    outline: 2px solid var(--page-primary);
    outline-offset: 2px;
  }
  .hero-vortex-controls-folder > .dialkit-folder-content > .dialkit-folder-inner >
  .dialkit-panel-section-toolbar button[title="Copy parameters"] {
    display: none;
  }
  .hero-vortex-copy-slot {
    margin: 0 0 8px;
  }
  .hero-vortex-action-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .hero-vortex-copy-button {
    width: 100%;
    min-height: 40px;
    padding: 8px 12px;
    border: 1px solid var(--mist-white-600);
    border-radius: 4px;
    background: var(--mist-white-300);
    color: var(--mist-white-950);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
  }
  .hero-vortex-copy-button:hover {
    border-color: var(--mist-white-700);
    background: var(--white-100);
  }
  .hero-vortex-copy-button[data-state="copied"],
  .hero-vortex-copy-button[data-state="saved"] {
    border-color: var(--page-primary);
    background: color-mix(in srgb, var(--page-primary) 14%, var(--white-100));
  }
  .hero-vortex-copy-button[data-state="error"] {
    border-color: var(--coral-signal-700);
    color: var(--coral-signal-700);
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
  const defaultOpen = !matchMedia('(max-width: 767px)').matches
  const [colorTheme, setColorTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const [vortexCopyTarget, setVortexCopyTarget] = useState(null)
  const [copyState, setCopyState] = useState('idle')
  const [saveState, setSaveState] = useState('idle')
  const copyResetTimer = useRef(0)
  const saveResetTimer = useRef(0)
  const paramsRef = useRef(null)
  const vortexParamsRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    const syncColorTheme = () => setColorTheme(root.dataset.theme || 'light')
    const observer = new MutationObserver(syncColorTheme)
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    syncColorTheme()
    return () => observer.disconnect()
  }, [])

  const saveControllerSettings = () => {
    clearTimeout(saveResetTimer.current)
    try {
      localStorage.setItem('knowhere-controller-snapshot', JSON.stringify({
        page: paramsRef.current,
        heroVortex: vortexParamsRef.current,
        savedAt: new Date().toISOString(),
      }))
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
    saveResetTimer.current = window.setTimeout(() => setSaveState('idle'), 2000)
  }
  const params = useDialKit('Knowhere Landing', {
    layout: {
      showGrid: false,
    },
    appearance: {
      fontFamily: {
        type: 'select',
        options: [
          { value: 'geist', label: 'Geist Sans · 默认' },
          { value: 'poppins', label: 'Poppins' },
        ],
        default: initialSettings.font,
      },
    },
  }, {
    id: 'knowhere-landing-controls-v2',
    persist: { key: 'knowhere-landing-controls-v2', storage: 'localStorage', presets: true },
  })
  paramsRef.current = params
  const vortexParams = useDialKit('Hero Vortex', {
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
      middleTwist: [1.35, 0, 4, 0.05],
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
    redParticleFlow: {
      redFlowDelay: [0, 0, 10, 0.1],
      redFlowDuration: [2.4, 0.6, 8, 0.05],
      redFlowInterval: [0.45, 0, 2, 0.05],
      redFlowLoopPause: [1, 0, 5, 0.5],
      redFlowLine1ExtraDelay: [0, 0, 5, 0.05],
      redFlowLine2ExtraDelay: [0, 0, 5, 0.05],
      redFlowLine3ExtraDelay: [0, 0, 5, 0.05],
      redFlowLine4ExtraDelay: [0, 0, 5, 0.05],
      redFlowLine5ExtraDelay: [0, 0, 5, 0.05],
      redFlowEntrySpread: [0.12, 0, 0.3, 0.01],
      redFlowStartAngle: [135, 90, 180, 1],
      redFlowAngleSpread: [22, 4, 30, 1],
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
    persist: { key: HERO_CONTROLS_STORAGE_KEY, storage: 'localStorage', presets: true },
  })
  vortexParamsRef.current = vortexParams

  const font = FONT_STACKS[params.appearance.fontFamily]
    ? params.appearance.fontFamily
    : DEFAULTS.font
  const chineseFont = DEFAULTS.chineseFont
  const palette = DEFAULTS.palette

  const copyAllVortexParameters = async () => {
    clearTimeout(copyResetTimer.current)
    try {
      await copyText(JSON.stringify(vortexParams, null, 2))
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
    copyResetTimer.current = window.setTimeout(() => setCopyState('idle'), 2000)
  }

  useEffect(() => {
    let currentTarget = null
    const syncCopyTarget = () => {
      const vortexFolder = [...document.querySelectorAll('.dialkit-folder')].find(folder => (
        ['Hero Vortex', 'Hero 漩涡', '首屏漩涡'].includes(
          folder.querySelector(':scope > .dialkit-folder-header .dialkit-folder-title')?.textContent
        )
      ))
      const folderInner = vortexFolder?.querySelector(
        ':scope > .dialkit-folder-content > .dialkit-folder-inner'
      )
      if (!folderInner) return

      vortexFolder.classList.add('hero-vortex-controls-folder')
      let target = folderInner.querySelector(':scope > .hero-vortex-copy-slot')
      if (!target) {
        target = document.createElement('div')
        target.className = 'hero-vortex-copy-slot'
        folderInner.querySelector(':scope > .dialkit-panel-section-toolbar')?.after(target)
      }
      if (target !== currentTarget) {
        currentTarget = target
        setVortexCopyTarget(target)
      }
    }

    const observer = new MutationObserver(syncCopyTarget)
    observer.observe(document.body, { subtree: true, childList: true })
    syncCopyTarget()

    return () => {
      observer.disconnect()
      clearTimeout(copyResetTimer.current)
      clearTimeout(saveResetTimer.current)
      currentTarget?.remove()
    }
  }, [])

  useEffect(() => {
    let frame = 0
    const translateController = () => {
      frame = 0
      const root = document.querySelector('.dialkit-root')
      if (!root) return
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      let node = walker.nextNode()
      while (node) {
        const source = node.nodeValue?.trim()
        const translation = CONTROLLER_TRANSLATIONS[source]
        if (translation) node.nodeValue = node.nodeValue.replace(source, translation)
        node = walker.nextNode()
      }
      root.querySelectorAll('[aria-label], [title]').forEach(element => {
        for (const attribute of ['aria-label', 'title']) {
          const source = element.getAttribute(attribute)
          const translation = CONTROLLER_TRANSLATIONS[source]
          if (translation) element.setAttribute(attribute, translation)
        }
      })
    }
    const scheduleTranslation = () => {
      if (!frame) frame = requestAnimationFrame(translateController)
    }
    const observer = new MutationObserver(scheduleTranslation)
    observer.observe(document.body, { subtree: true, childList: true, characterData: true })
    scheduleTranslation()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

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
      <style>{`:root{${paletteStyles(initialPalette)};${colorTokenStyles()};--page-primary:${initialMainColor};--page-primary-foreground:${readableForeground(initialMainColor)};--accent:${initialMainColor};--figma-primary:${initialPalette[600]}}${CONTROLLER_LAYOUT_STYLES}`}</style>
      <DialRoot position="top-right" defaultOpen={defaultOpen} theme={colorTheme} />
      {vortexCopyTarget && createPortal(
        <div className="hero-vortex-action-buttons">
          <button
            type="button"
            className="hero-vortex-copy-button"
            data-state={saveState}
            onClick={saveControllerSettings}
          >
            {saveState === 'saved'
              ? '已保存 ✓'
              : saveState === 'error'
                ? '保存失败'
                : '保存当前设置'}
          </button>
          <button
            type="button"
            className="hero-vortex-copy-button"
            data-state={copyState}
            onClick={copyAllVortexParameters}
          >
            {copyState === 'copied'
              ? '已复制参数'
              : copyState === 'error'
                ? '复制失败'
                : '复制全部参数'}
          </button>
        </div>,
        vortexCopyTarget,
      )}
    </>
  )
}
