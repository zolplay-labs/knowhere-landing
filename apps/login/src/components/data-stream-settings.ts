export const DEFAULT_STREAM_SETTINGS = {
  speed: 2.9,
  phase: 33.7,
  offsetX: -300,
  spacingX: 4.1,
  cellSize: 5,
  density: 0.9,
  opacity: 1.1,
  warp: 0.65,
  height: 1.2,
  paused: false,
}

export type StreamSettings = typeof DEFAULT_STREAM_SETTINGS

export const STREAM_CONTROLS = [
  { key: 'speed', en: 'Flow speed', zh: '流动速度', min: 0, max: 4, step: 0.05, unit: '×' },
  { key: 'warp', en: 'Flow distortion', zh: '流动扭曲', min: 0, max: 3, step: 0.05, unit: '×' },
  { key: 'phase', en: 'Pattern phase', zh: '图案相位', min: 0, max: 100, step: 0.1, unit: '' },
  { key: 'cellSize', en: 'Block size', zh: '数据块大小', min: 3, max: 16, step: 1, unit: 'px' },
  { key: 'density', en: 'Density', zh: '密度', min: 0.2, max: 2, step: 0.05, unit: '×' },
  { key: 'opacity', en: 'Intensity', zh: '纹理强度', min: 0, max: 2, step: 0.05, unit: '×' },
  { key: 'height', en: 'Pattern height', zh: '纹理高度', min: 0.5, max: 3, step: 0.1, unit: '×' },
  { key: 'spacingX', en: 'Horizontal spread', zh: '横向疏密', min: 0.5, max: 6, step: 0.1, unit: '×' },
  { key: 'offsetX', en: 'Horizontal position', zh: '水平位置', min: -2400, max: 2400, step: 10, unit: 'px' },
] as const
