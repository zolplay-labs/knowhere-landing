export function initializeLandingCanvases(root) {
  if (!(root instanceof Element)) return () => {};

  const cleanups = [];
  initializeHeroCanvas(root, cleanups);
  initializeFormatGlobe(root, cleanups);

  let cleaned = false;
  return () => {
    if (cleaned) return;
    cleaned = true;
    cleanups.splice(0).reverse().forEach(cleanup => cleanup());
  };
}

function initializeHeroCanvas(root, cleanups) {
    'use strict';

    const hero = root.querySelector('#top');
    const canvas = root.querySelector('#hero-b-pixel-field');
    const copy = hero?.querySelector('.hero-copy');
    const visual = hero?.querySelector('.hero-visual');
    const tooltip = root.querySelector('#hero-b-pixel-tooltip');
    const header = root.querySelector('.site-header');
    const ctx = canvas?.getContext('2d');
    if (!hero || !canvas || !copy || !visual || !tooltip || !ctx) return;
    const controller = new AbortController();
    const { signal } = controller;
    let active = true;
    let lowerTextureVisible = document.documentElement.hasAttribute('data-hero-texture');

    const SETTINGS = Object.freeze({
      cellSize: 6,
      fieldScale: 1,
      densityThreshold: .14,
      ambientStrength: 1.4,
      randomness: .075,
      motionSpeed: 1.22,
      trailDecay: .925,
      brushRadius: 10,
      interactionStrength: .19,
      fadeStart: .58,
      fadeSoftness: .28,
      paperColor: '#fff',
      seed: 17
    });
    const mainColor = stop => getComputedStyle(document.documentElement)
      .getPropertyValue(`--main-${stop}`).trim();
    const STAGE_COLORS = [
      mainColor(800),
      mainColor(700),
      mainColor(600),
      mainColor(500),
      mainColor(400)
    ];
    const LAYER_COLORS = STAGE_COLORS.slice(1);
    let heroInkColor = mainColor(800);
    let heroShadowColor = mainColor(900);
    const syncMainPalette = () => {
      [800, 700, 600, 500, 400].forEach((stop, index) => {
        STAGE_COLORS[index] = mainColor(stop);
        if (index > 0) LAYER_COLORS[index - 1] = STAGE_COLORS[index];
      });
      heroInkColor = mainColor(800);
      heroShadowColor = mainColor(900);
    };
    window.addEventListener('main-palette-change', syncMainPalette, { signal });
    window.addEventListener('hero-texture-change', event => {
      lowerTextureVisible = Boolean(event.detail?.visible);
    }, { signal });
    const DATA = [
      { count: 168, width: 1 },
      { count: 96, width: .322 },
      { count: 64, width: .23 },
      { count: 36, width: .1 },
      { count: 14, width: .035 }
    ];
    const LAYERS = [
      { label: 'ORIGINAL DOCUMENT', detail: 'Pages · layouts · evidence' },
      { label: 'PAGE IMAGES', detail: 'Full-page visual originals' },
      { label: 'LIGHTWEIGHT NOTES', detail: 'Page topic · chapter location' },
      { label: 'CHAPTER MAP', detail: 'Navigate · open source on demand' }
    ];
    const displayLabel = label => label[0] + label.slice(1).toLowerCase();
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const unitCounts = DATA.map(stage => stage.count);
    const selectEvenly = (previous, count) => Array.from(
      { length: Math.min(count, previous.length) },
      (_, index) => previous[Math.min(previous.length - 1, Math.floor((index + .5) * previous.length / count))]
    );
    const stageTracks = [Array.from({ length: unitCounts[0] }, (_, index) => index)];
    for (let stage = 1; stage < DATA.length; stage += 1) {
      stageTracks.push(selectEvenly(stageTracks[stage - 1], unitCounts[stage]));
    }
    const lastStageByTrack = new Map(stageTracks[0].map(trackId => [trackId, 0]));
    stageTracks.forEach((tracks, stage) => tracks.forEach(trackId => lastStageByTrack.set(trackId, stage)));

    let width = 0;
    let height = 0;
    let scanExtension = 0;
    let dpr = 1;
    let cell = SETTINGS.cellSize;
    let cols = 0;
    let rows = 0;
    let heat = new Float32Array(0);
    let unitHitAreas = [];
    let hoveredTrack = null;
    let hoveredLayer = null;
    let hoverFlowLayer = null;
    let hoverFlowStarted = 0;
    let clickFlowLayer = null;
    let clickFlowStarted = 0;
    let selectedLayer = null;
    let morphFromLayer = null;
    let morphToLayer = null;
    let morphStarted = -1;
    let pointerX = -1;
    let pointerY = -1;
    let pointerFieldX = -1;
    let pointerFieldY = -1;
    let previousX = -1;
    let previousY = -1;
    let visible = true;
    let intro = 0;
    let lastFrame = 0;
    let frameId = 0;
    let animationTime = 0;
    const MORPH_DURATION = .46;
    const MORPH_POINT_COUNT = 680;
    const scatterDefaults = { position: 76, spread: 12, density: 30, contrast: 50 };
    const scatterControls = { ...scatterDefaults };

    const hash = (x, y) => {
      const value = Math.sin(x * 127.1 + y * 311.7 + SETTINGS.seed * .13) * 43758.5453;
      return value - Math.floor(value);
    };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const heroHeight = Math.max(1, Math.round(hero.getBoundingClientRect().height));
      const gridTail = width < 768 ? 90 : Math.min(148, Math.max(128, width * .1));
      scanExtension = Math.max(0, height - heroHeight - gridTail);
      dpr = Math.min(devicePixelRatio || 1, 2);
      cell = SETTINGS.cellSize;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / cell) + 1;
      rows = Math.ceil(height / cell) + 1;
      heat = new Float32Array(cols * rows);
    }

    function buildLayout() {
      const canvasRect = canvas.getBoundingClientRect();
      const visualRect = visual.getBoundingClientRect();
      const visualLeft = visualRect.left - canvasRect.left;
      const visualTop = visualRect.top - canvasRect.top;
      const centerX = width < 1100
        ? visualLeft + visualRect.width * .5
        : visualLeft + visualRect.width * .35;
      const maxWidth = (width < 1100
        ? visualRect.width * .96
        : Math.min(width * .92, 1080)) * SETTINGS.fieldScale;
      const stageSpan = Math.min(visualRect.height * .98, 580) * 1.2;
      const isDesktopLayout = width >= 768;
      const navHeight = header?.getBoundingClientRect().height || 68;
      const topY = isDesktopLayout
        ? navHeight + 2
        : visualTop + Math.max(18, visualRect.height * .018);
      const stageGap = stageSpan / (DATA.length - 1);
      const visualOrders = stageTracks.map(tracks => [...tracks]);
      const positions = visualOrders.map((tracks, stage) => {
        const isFullWidthStage = isDesktopLayout && stage === 0;
        const stageWidth = isFullWidthStage ? width + cell * 2 : maxWidth * DATA[stage].width;
        const stageCenter = isFullWidthStage ? width / 2 : centerX;
        const jitter = SETTINGS.randomness * cell * 4;
        const columns = Math.max(2, Math.min(tracks.length, Math.floor(stageWidth / cell)));
        const layerRows = Math.max(1, Math.ceil(tracks.length / columns));
        return new Map(tracks.map((trackId, rank) => [trackId, {
          x: stageCenter - stageWidth / 2
            + ((rank % columns) + .5) / columns * stageWidth
            + Math.sin(trackId * .61 + stage * 1.73) * cell * .62
            + (hash(trackId + 3, stage + 11) - .5) * jitter,
          y: (Math.floor(rank / columns) - (layerRows - 1) / 2) * cell
        }]));
      });
      return { centerX, maxWidth, topY, stageGap, positions, visualLeft, visualWidth: visualRect.width, isDesktopLayout };
    }

    function pointOnSegment(layout, trackId, stage, progress) {
      const origin = layout.positions[stage].get(trackId);
      const destination = layout.positions[stage + 1].get(trackId);
      const eased = progress * progress * (3 - 2 * progress);
      const bend = (hash(trackId + 37, stage + 211) - .5) * cell * 4.2;
      const flutter = Math.sin(progress * Math.PI * 2 + hash(trackId + 61, stage + 229) * Math.PI * 2)
        * cell * .45 * Math.sin(progress * Math.PI);
      return {
        x: origin.x + (destination.x - origin.x) * eased
          + Math.sin(progress * Math.PI) * bend + flutter,
        y: layout.topY + layout.stageGap * stage + origin.y
          + (layout.stageGap + destination.y - origin.y) * progress
      };
    }

    function createPixelShape(layerIndex) {
      const pixels = new Map();
      const add = (x, y, alpha = 1) => {
        const key = `${x},${y}`;
        const current = pixels.get(key);
        if (!current || current.alpha < alpha) pixels.set(key, { x, y, alpha });
      };
      const line = (x0, y0, x1, y1, alpha = 1) => {
        const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
        for (let step = 0; step <= steps; step += 1) {
          const progress = steps ? step / steps : 0;
          add(Math.round(x0 + (x1 - x0) * progress), Math.round(y0 + (y1 - y0) * progress), alpha);
        }
      };
      const rect = (x, y, w, h, alpha = 1) => {
        line(x, y, x + w, y, alpha);
        line(x + w, y, x + w, y + h, alpha);
        line(x + w, y + h, x, y + h, alpha);
        line(x, y + h, x, y, alpha);
      };
      const node = (x, y, size = 3, alpha = 1) => {
        for (let row = 0; row < size; row += 1) {
          for (let column = 0; column < size; column += 1) add(x + column, y + row, alpha);
        }
      };

      if (layerIndex === 0) {
        line(2, 8, 2, 27);
        line(2, 8, 11, 8);
        line(11, 8, 14, 4);
        line(14, 4, 23, 4);
        line(23, 4, 26, 8);
        line(26, 8, 32, 8);
        line(32, 8, 32, 27);
        line(32, 27, 2, 27);
        line(2, 12, 32, 12, .72);
        for (let y = 14; y < 27; y += 1) {
          for (let x = 4; x < 31; x += 1) {
            if ((x * 3 + y * 5) % 7 < 2) add(x, y, .32 + hash(x + 1301, y + 1321) * .28);
          }
        }
      } else if (layerIndex === 1) {
        rect(4, 3, 22, 27, .42);
        rect(7, 5, 22, 27, .58);
        rect(10, 7, 22, 27, 1);
        rect(13, 11, 16, 13, .82);
        line(13, 23, 19, 17, .88);
        line(19, 17, 23, 21, .88);
        line(23, 21, 29, 14, .88);
        node(15, 13, 3, .92);
        for (let x = 13; x < 30; x += 3) add(x, 28, .5);
      } else if (layerIndex === 2) {
        rect(5, 3, 25, 31, 1);
        line(23, 3, 30, 10, .72);
        line(23, 3, 23, 10, .72);
        line(23, 10, 30, 10, .72);
        const lengths = [15, 18, 13, 19, 16, 11];
        lengths.forEach((length, row) => {
          node(9, 14 + row * 3, 2, .78);
          line(13, 14 + row * 3, 13 + length, 14 + row * 3, row === 0 ? .9 : .58);
        });
        for (let x = 8; x < 27; x += 2) add(x, 8, .34);
      } else {
        const connections = [
          [17, 4, 17, 10], [17, 10, 8, 16], [17, 10, 26, 16],
          [8, 16, 5, 25], [8, 16, 13, 25], [26, 16, 22, 25], [26, 16, 30, 25],
          [13, 25, 17, 31], [22, 25, 17, 31]
        ];
        connections.forEach(([x0, y0, x1, y1], index) => {
          line(x0, y0, x1, y1, index < 3 ? .84 : .56);
          line(x0 + 1, y0, x1 + 1, y1, .28);
        });
        [[15, 2], [15, 9], [6, 15], [24, 15], [3, 24], [11, 24], [20, 24], [28, 24], [15, 30]].forEach(
          ([x, y], index) => node(x, y, index === 0 || index === 8 ? 5 : 4, index < 4 ? 1 : .78)
        );
      }
      const basePixels = [...pixels.values()];
      const densePixels = new Map();
      const addDense = (x, y, alpha) => {
        const key = `${x},${y}`;
        const current = densePixels.get(key);
        if (!current || current.alpha < alpha) densePixels.set(key, { x, y, alpha });
      };
      const denseOffsets = [
        { value: 0, alpha: 1 },
        { value: 1 / 3, alpha: .78 },
        { value: 2 / 3, alpha: .62 }
      ];
      basePixels.forEach(point => {
        denseOffsets.forEach(offsetX => denseOffsets.forEach(offsetY => {
          addDense(
            point.x + offsetX.value,
            point.y + offsetY.value,
            point.alpha * Math.min(offsetX.alpha, offsetY.alpha)
          );
        }));
      });
      return [...densePixels.values()];
    }

    const PIXEL_SHAPES = LAYERS.map((_, layerIndex) => createPixelShape(layerIndex));

    function normalizeMorphPoints(points) {
      if (points.length === MORPH_POINT_COUNT) return points;
      if (points.length > MORPH_POINT_COUNT) {
        return Array.from({ length: MORPH_POINT_COUNT }, (_, index) => points[
          Math.min(points.length - 1, Math.floor((index + .5) * points.length / MORPH_POINT_COUNT))
        ]);
      }
      return Array.from({ length: MORPH_POINT_COUNT }, (_, index) => {
        const point = points[index % points.length];
        return { ...point, alpha: point.alpha * (index < points.length ? 1 : .08) };
      });
    }

    function funnelMorphPoints(layout) {
      const points = [];
      stageTracks[0].forEach(trackId => {
        const lastStage = lastStageByTrack.get(trackId);
        for (let stage = 0; stage < lastStage; stage += 1) {
          for (let sample = 0; sample < 4; sample += 1) {
            const point = pointOnSegment(layout, trackId, stage, sample / 4);
            points.push({ ...point, alpha: .56 + hash(trackId + 1409, stage * 7 + sample) * .38 });
          }
        }
      });
      return normalizeMorphPoints(points);
    }

    function modeMorphPoints(layout, layerIndex) {
      if (layerIndex === null) return funnelMorphPoints(layout);
      const shape = PIXEL_SHAPES[layerIndex];
      const centerY = layout.topY + layout.stageGap * 2.02;
      const shapeScale = width < 768 ? 1.48 : 1.68;
      const shapeCenterX = 17;
      const shapeCenterY = 18;
      return normalizeMorphPoints(shape.map(point => ({
        x: layout.centerX + (point.x - shapeCenterX) * cell * shapeScale,
        y: centerY + (point.y - shapeCenterY) * cell * shapeScale,
        alpha: point.alpha
      })));
    }

    function morphState(time) {
      if (morphStarted < 0) return { from: selectedLayer, to: selectedLayer, progress: 1 };
      const linear = Math.max(0, Math.min(1, (time - morphStarted) / MORPH_DURATION));
      const progress = linear * linear * (3 - 2 * linear);
      return { from: morphFromLayer, to: morphToLayer, progress };
    }

    function funnelOpacityAt(time) {
      const state = morphState(time);
      if (state.from === null && state.to === null) return 1;
      if (state.from === null) return 1 - state.progress;
      if (state.to === null) return state.progress;
      return 0;
    }

    function layerCardVisibility(layerIndex, time) {
      const state = morphState(time);
      if (state.from === null && state.to === null) return 1;
      if (state.from === null) {
        return layerIndex === state.to
          ? 1 - Math.min(1, state.progress / .36)
          : 1 - state.progress;
      }
      if (state.to === null) return Math.max(0, Math.min(1, (state.progress - .28) / .72));
      if (layerIndex === state.from) return 1 - state.progress;
      return 0;
    }

    function shapeCardPresentation(time) {
      const state = morphState(time);
      if (state.from === null && state.to === null) return { layerIndex: null, visibility: 0 };
      const elapsed = Math.max(0, time - morphStarted);
      if (state.from === null) {
        const progress = reducedMotion
          ? state.progress
          : Math.max(0, Math.min(1, (elapsed - .16) / .36));
        return { layerIndex: state.to, visibility: 1 - (1 - progress) ** 3 };
      }
      if (state.to === null) {
        const progress = reducedMotion
          ? state.progress
          : Math.max(0, Math.min(1, elapsed / .22));
        return { layerIndex: state.from, visibility: 1 - progress ** 2 };
      }
      return { layerIndex: state.to, visibility: state.progress };
    }

    function mixHexColor(from, to, progress) {
      const read = color => [1, 3, 5].map(index => parseInt(color.slice(index, index + 2), 16));
      const fromRgb = read(from);
      const toRgb = read(to);
      return `rgb(${fromRgb.map((value, index) => Math.round(value + (toRgb[index] - value) * progress)).join(',')})`;
    }

    function drawSelectedPointerField(time, delta) {
      if (selectedLayer === null || pointerX < 0 || pointerY < 0 || !finePointer) return;
      const radius = width < 768 ? 128 : 180;
      const strength = reducedMotion ? .22 : .5;
      const color = LAYER_COLORS[selectedLayer];
      if (pointerFieldX < 0 || pointerFieldY < 0) {
        pointerFieldX = pointerX;
        pointerFieldY = pointerY;
      }
      const follow = reducedMotion ? 1 : 1 - Math.pow(.86, delta * 60);
      pointerFieldX += (pointerX - pointerFieldX) * follow;
      pointerFieldY += (pointerY - pointerFieldY) * follow;
      const minX = Math.max(0, Math.floor((pointerFieldX - radius) / cell) * cell);
      const maxX = Math.min(width, Math.ceil((pointerFieldX + radius) / cell) * cell);
      const minY = Math.max(0, Math.floor((pointerFieldY - radius) / cell) * cell);
      const maxY = Math.min(height, Math.ceil((pointerFieldY + radius) / cell) * cell);
      ctx.save();
      ctx.fillStyle = color;
      for (let y = minY; y <= maxY; y += cell) {
        for (let x = minX; x <= maxX; x += cell) {
          const centerX = x + cell / 2;
          const centerY = y + cell / 2;
          const distance = Math.hypot(centerX - pointerFieldX, centerY - pointerFieldY);
          if (distance >= radius) continue;
          const falloff = 1 - distance / radius;
          const wave = reducedMotion
            ? .8
            : .58 + .42 * (Math.sin(time * 3.2 - distance * .05 + (x + y) * .035) * .5 + .5);
          ctx.globalAlpha = strength * falloff * falloff * wave;
          ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
        }
      }
      ctx.restore();
    }

    function drawModeMorph(layout, time) {
      if (morphStarted < 0 && selectedLayer === null) return;
      const state = morphState(time);
      const fromPoints = modeMorphPoints(layout, state.from);
      const toPoints = modeMorphPoints(layout, state.to);
      const fromColor = state.from === null ? STAGE_COLORS[0] : LAYER_COLORS[state.from];
      const toColor = state.to === null ? STAGE_COLORS[0] : LAYER_COLORS[state.to];
      const opacity = state.from === null ? state.progress : state.to === null ? 1 - state.progress : 1;
      const color = mixHexColor(fromColor, toColor, state.progress);
      const targetIsShape = state.to !== null;
      const bounds = targetIsShape ? toPoints.reduce((result, point) => ({
        minX: Math.min(result.minX, point.x),
        maxX: Math.max(result.maxX, point.x),
        minY: Math.min(result.minY, point.y),
        maxY: Math.max(result.maxY, point.y)
      }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }) : null;
      const flowTime = reducedMotion ? 0 : time;
      for (let index = 0; index < MORPH_POINT_COUNT; index += 1) {
        const from = fromPoints[index];
        const to = toPoints[index];
        let flow = 0;
        if (targetIsShape) {
          const horizontal = (to.x - bounds.minX) / Math.max(1, bounds.maxX - bounds.minX);
          const vertical = (to.y - bounds.minY) / Math.max(1, bounds.maxY - bounds.minY);
          const route = horizontal * .3 + vertical * .7 + hash(index + 1553, state.to + 1571) * .035;
          const phase = ((flowTime * .48 - route) % 1 + 1) % 1;
          if (phase < .18) flow = Math.sin(phase / .18 * Math.PI);
        }
        drawPixel(
          from.x + (to.x - from.x) * state.progress,
          from.y + (to.y - from.y) * state.progress,
          (from.alpha + (to.alpha - from.alpha) * state.progress) * opacity * (.72 + flow * .46),
          flow > 0 ? mixHexColor(color, heroShadowColor, flow * .11) : color
        );
      }
    }

    function drawShapeAnnotation(layout, time) {
      const presentation = shapeCardPresentation(time);
      if (presentation.layerIndex === null || presentation.visibility <= .001) return;

      const layerIndex = presentation.layerIndex;
      const layer = LAYERS[layerIndex];
      const color = LAYER_COLORS[layerIndex];
      const points = modeMorphPoints(layout, layerIndex);
      const bounds = points.reduce((result, point) => ({
        minX: Math.min(result.minX, point.x),
        maxX: Math.max(result.maxX, point.x),
        minY: Math.min(result.minY, point.y),
        maxY: Math.max(result.maxY, point.y)
      }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
      const shapeCenterY = (bounds.minY + bounds.maxY) / 2;
      const visibility = presentation.visibility;
      const rightInset = width < 768 ? 12 : 18;
      const cardWidth = Math.min(273, width - rightInset * 2);
      const cardHeight = 95;
      const rightLimit = width - cardWidth - rightInset;
      const targetX = Math.min(bounds.maxX + cell * 4.4, rightLimit);
      const targetY = Math.max(layout.topY + cell, shapeCenterY - cardHeight / 2);
      const cardX = targetX + (1 - visibility) * cell * 3.2;
      const cardY = targetY + (1 - visibility) * cell * .8;
      const lineStart = bounds.maxX + cell * 1.15;
      const lineEnd = cardX;
      const lineWidth = Math.max(20, lineEnd - lineStart) * visibility;

      ctx.save();
      ctx.fillStyle = color;
      const connectorY = Math.round(shapeCenterY / cell) * cell + 1;
      for (let lineX = lineStart; lineX < lineStart + lineWidth; lineX += cell) {
        const column = Math.round(lineX / cell);
        ctx.globalAlpha = (.46 + hash(column, layerIndex + 1621) * .18) * visibility;
        ctx.fillRect(column * cell + 1, connectorY, cell - 3, cell - 3);
      }

      ctx.translate(cardX + cardWidth / 2, cardY + cardHeight / 2);
      const scale = .94 + visibility * .06;
      ctx.scale(scale, scale);
      ctx.translate(-cardWidth / 2, -cardHeight / 2);

      ctx.globalAlpha = visibility;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, cardWidth, cardHeight);
      ctx.strokeStyle = '#cecde0';
      ctx.lineWidth = 1;
      ctx.strokeRect(.5, .5, cardWidth - 1, cardHeight - 1);

      const textX = 16;
      ctx.textBaseline = 'top';
      ctx.globalAlpha = visibility;
      ctx.fillStyle = '#4e5d88';
      ctx.font = '500 14px "Fellix-TRIAL", "ABC Schengen Greek Variable Trial", Arial, sans-serif';
      ctx.fillText(displayLabel(layer.label), textX, 16);
      ctx.fillStyle = '#181818';
      ctx.font = '400 13px "Fellix-TRIAL", "ABC Schengen Greek Variable Trial", Arial, sans-serif';
      ctx.fillText(layer.detail, textX, 40);

      const statusY = 66;
      ctx.globalAlpha = .4 * visibility;
      ctx.fillStyle = '#000';
      ctx.fillText('Live data pass', textX, statusY);
      const statusColors = ['#ced3e7', '#8191c0', '#a1aed1', '#dce0ee', '#dce0ee', '#dce0ee', '#dce0ee'];
      const statusStartX = cardWidth - 118;
      statusColors.forEach((statusColor, index) => {
        const phase = ((time * 1.15 - index * .11) % 1 + 1) % 1;
        const pulse = phase < .3 ? Math.sin(phase / .3 * Math.PI) : 0;
        ctx.globalAlpha = (.18 + pulse * .7) * visibility;
        ctx.fillStyle = statusColor;
        ctx.fillRect(statusStartX + index * 16, statusY + 7, 6, 6);
      });
      ctx.restore();
    }

    function toggleLayerShape(layerIndex) {
      const nextLayer = selectedLayer === layerIndex ? null : layerIndex;
      if (nextLayer === null) {
        clickFlowLayer = null;
        hoverFlowLayer = null;
      } else {
        clickFlowLayer = layerIndex;
        clickFlowStarted = animationTime;
      }
      morphFromLayer = selectedLayer;
      morphToLayer = nextLayer;
      morphStarted = reducedMotion ? animationTime - MORPH_DURATION : animationTime;
      selectedLayer = nextLayer;
      if (hoveredLayer === layerIndex) {
        if (nextLayer === layerIndex) tooltip.classList.remove('is-visible');
        else tooltip.textContent = 'Click to view pixel form';
      }
    }

    function deposit(x, y, amount, radius) {
      const centerColumn = x / cell;
      const centerRow = y / cell;
      const reach = Math.ceil(radius * 1.7);
      const divisor = 2 * radius * radius * .2;
      for (let dy = -reach; dy <= reach; dy += 1) {
        for (let dx = -reach; dx <= reach; dx += 1) {
          const column = (centerColumn + dx) | 0;
          const row = (centerRow + dy) | 0;
          if (column < 0 || row < 0 || column >= cols || row >= rows) continue;
          const distanceX = column + .5 - centerColumn;
          const distanceY = row + .5 - centerRow;
          const weight = Math.exp(-(distanceX ** 2 + distanceY ** 2) / divisor);
          if (weight < .02) continue;
          const index = row * cols + column;
          heat[index] = Math.min(1.15, heat[index] + amount * weight);
        }
      }
    }

    function heatAt(x, y) {
      const column = Math.max(0, Math.min(cols - 1, Math.floor(x / cell)));
      const row = Math.max(0, Math.min(rows - 1, Math.floor(y / cell)));
      return heat[row * cols + column] || 0;
    }

    function drawPixel(x, y, alpha = 1, color = heroInkColor) {
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = color;
      ctx.fillRect(
        Math.round(x / cell) * cell + 1,
        Math.round(y / cell) * cell + 1,
        cell - 3,
        cell - 3
      );
    }

    function easeOutCubic(value) {
      const clamped = Math.max(0, Math.min(1, value));
      return 1 - (1 - clamped) ** 3;
    }

    function entranceAt(layout, y, salt = 0) {
      if (reducedMotion) return 1;
      const span = Math.max(1, layout.stageGap * (DATA.length - 1));
      const verticalProgress = Math.max(0, Math.min(1, (y - layout.topY) / span));
      const threshold = intro * 1.42 - verticalProgress * .92 - hash(salt + 19, 71) * .12;
      return easeOutCubic(threshold / .18);
    }

    function funnelFadeAt(layout, y) {
      const start = layout.topY + layout.stageGap * 2.8;
      const end = layout.topY + layout.stageGap * 4.5;
      const progress = Math.max(0, Math.min(1, (y - start) / (end - start)));
      const eased = progress * progress * (3 - 2 * progress);
      return 1 - eased;
    }

    function drawGrid() {
      const gridEntrance = reducedMotion ? 1 : .2 + easeOutCubic(intro * 1.65) * .8;
      const gridGradient = ctx.createLinearGradient(0, 0, 0, height);
      gridGradient.addColorStop(0, `rgba(0, 0, 0, ${.04 * gridEntrance})`);
      gridGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.strokeStyle = gridGradient;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += cell) {
        ctx.moveTo(x + .5, 0);
        ctx.lineTo(x + .5, height);
      }
      for (let y = 0; y <= height; y += cell) {
        ctx.moveTo(0, y + .5);
        ctx.lineTo(width, y + .5);
      }
      ctx.stroke();
    }

    const SCAN_TRAIL_ROWS = 8;
    const SCAN_TRANSIT = 0;
    const SCAN_HEAD_ALPHA = .72;
    const SCAN_TRAIL_ALPHA = .56;
    const SCAN_GRID_UNIT = 6;

    const scanRevealTargets = [header, copy, visual].filter(Boolean);

    function scanState() {
      const scan = (intro - .067) / .933;
      const clamped = Math.max(0, Math.min(1, scan));
      const progress = clamped * clamped * (3 - 2 * clamped);
      return {
        scan,
        progress,
        headY: SCAN_TRANSIT + (height - SCAN_TRANSIT) * progress
      };
    }

    function syncScanReveal() {
      if (reducedMotion) return;
      const { scan, headY } = scanState();
      if (scan >= 1) {
        scanRevealTargets.forEach(element => {
          element.style.opacity = '1';
          element.style.clipPath = 'none';
          element.style.willChange = 'auto';
        });
        return;
      }
      const lineY = canvas.getBoundingClientRect().top + headY;
      const states = scanRevealTargets.map(element => {
        const rect = element.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (lineY - rect.top) / Math.max(1, rect.height)));
        return { element, progress };
      });
      states.forEach(({ element, progress }) => {
        element.style.opacity = progress > 0 ? '1' : '0';
        element.style.clipPath = `inset(0 0 ${(1 - progress) * 100}% 0)`;
      });
    }

    function drawScanTrail() {
      if (reducedMotion) return;
      const { scan, headY } = scanState();
      if (scan <= 0 || scan >= 1) return;
      const fadeOut = scan < .9 ? 1 : Math.max(0, 1 - (scan - .9) / .1);
      const headRow = Math.round(headY / SCAN_GRID_UNIT);
      if (headRow < 1) return;
      const firstRow = Math.max(0, headRow - SCAN_TRAIL_ROWS);
      const trailCols = Math.ceil(width / SCAN_GRID_UNIT) + 1;

      ctx.lineWidth = 1;
      ctx.strokeStyle = STAGE_COLORS[0];
      ctx.globalAlpha = 1;

      for (let r = firstRow; r <= headRow; r += 1) {
        const dist = headRow - r;
        const rowFade = Math.pow(1 - dist / (SCAN_TRAIL_ROWS + 1), 1.12);
        const isHead = dist === 0;
        const maxAlpha = (isHead ? SCAN_HEAD_ALPHA : SCAN_TRAIL_ALPHA) * rowFade * fadeOut;
        if (maxAlpha <= .02) continue;
        const y = r * SCAN_GRID_UNIT + .5;

        let segStart = 0;
        while (segStart < trailCols) {
          const segHash = hash(r * 53, segStart * 31 + dist * 7);
          const segEnd = Math.min(trailCols - 1, segStart + 1 + Math.floor(segHash * 6));
          const stagger = easeOutCubic(Math.min(1, Math.max(0, (scan - segHash * .16) / .45)));
          const broken = !isHead && hash(r * 97, segStart * 23 + dist * 11) < .17;
          const alpha = broken ? 0 : maxAlpha * (.5 + hash(r * 71, segStart * 17) * .5) * stagger;
          if (alpha >= .02) {
            ctx.globalAlpha = Math.min(1, alpha);
            const x0 = segStart * SCAN_GRID_UNIT + .5;
            const x1 = (segEnd + 1) * SCAN_GRID_UNIT + .5;
            ctx.beginPath();
            ctx.moveTo(x0, y);
            ctx.lineTo(x1, y);
            ctx.stroke();
          }
          segStart = segEnd + 1;
        }

        if (!isHead) {
          const bandBottom = (r + 1) * SCAN_GRID_UNIT + .5;
          for (let c = 0; c < trailCols; c += 1) {
            if (hash(r * 43, c * 7 + dist * 19) < .48) continue;
            const alpha = maxAlpha * (.18 + hash(r * 31, c * 13) * .38);
            if (alpha < .02) continue;
            ctx.globalAlpha = Math.min(1, alpha);
            const x = c * SCAN_GRID_UNIT + .5;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, bandBottom);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    function drawConvergingDivider() {
      const heroRect = hero.getBoundingClientRect();
      const heroProgress = -heroRect.top / Math.max(1, heroRect.height);
      const rawProgress = Math.max(0, Math.min(1, (heroProgress - .06) / .62));
      const scrollProgress = reducedMotion
        ? (rawProgress > 0 ? 1 : 0)
        : rawProgress * rawProgress * (3 - 2 * rawProgress);
      const dataHeight = height - scanExtension;
      const dividerY = Math.floor((dataHeight - cell) / cell) * cell;
      const squareCount = Math.ceil(width / cell) + 1;
      const requestedScatterTop = Math.floor((dataHeight - 32) * scatterControls.position / 100 / cell) * cell + cell * 10 + 32 + 72;
      const scatterTop = Math.min(dividerY - cell * 9, requestedScatterTop);
      const scatterHeight = Math.max(cell * 2, Math.min(
        cell * 8,
        dividerY - scatterTop - cell,
        Math.floor(dataHeight * scatterControls.spread / 100 / cell) * cell
      ));
      const scatterDensity = scatterControls.density / 100;
      const scatterContrast = scatterControls.contrast / 100;
      const lineY = Math.round((scatterTop + scatterHeight * .5) / cell) * cell;
      const lineColumnCount = cols;
      const lineStartX = 0;
      const mergeProgress = easeOutCubic((scrollProgress - .58) / .34);

      ctx.fillStyle = heroInkColor;
      for (let index = 0; index < squareCount; index += 1) {
        const prominence = hash(index + 61, 601);
        if (prominence >= scatterDensity) continue;
        const delay = hash(index + 17, 541) * .16;
        const localProgress = easeOutCubic(Math.max(0, Math.min(1, (scrollProgress - delay) / (1 - delay))));
        const startX = Math.floor(hash(index + 31, 563) * cols) * cell;
        const startY = scatterTop + Math.floor(hash(index + 47, 587) * scatterHeight / cell) * cell;
        const targetColumn = Math.round(index / Math.max(1, squareCount - 1) * (lineColumnCount - 1));
        const targetX = lineStartX + targetColumn * cell;
        const arc = Math.sin(localProgress * Math.PI)
          * Math.sin(index * 1.17)
          * cell * 1.4;
        const x = Math.round((startX + (targetX - startX) * localProgress) / cell) * cell;
        const y = Math.round((startY + (lineY - startY) * localProgress + arc) / cell) * cell;
        const restingAlpha = scatterContrast * (.4 + hash(index + 79, 619) * .6);
        ctx.globalAlpha = (restingAlpha * (1 - localProgress) + localProgress * .24) * (1 - mergeProgress);
        ctx.fillRect(x, y, cell - 1, cell - 1);
      }
      for (let column = 0; column < lineColumnCount; column += 1) {
        const tone = .16 + hash(column + 193, 641) * .04;
        ctx.globalAlpha = mergeProgress * tone;
        ctx.fillRect(lineStartX + column * cell + 1, lineY + 1, cell - 3, cell - 3);
      }
      ctx.globalAlpha = 1;
    }

    function rotationalTone(layout, x, stagePosition, time, baseColor) {
      const clampedStage = Math.max(0, Math.min(DATA.length - 1, stagePosition));
      const lowerStage = Math.min(DATA.length - 2, Math.floor(clampedStage));
      const stageMix = clampedStage - lowerStage;
      const firstWidth = layout.isDesktopLayout ? width : layout.maxWidth;
      const widthAt = stageIndex => stageIndex === 0
        ? firstWidth
        : layout.maxWidth * DATA[stageIndex].width;
      const localWidth = widthAt(lowerStage) + (widthAt(lowerStage + 1) - widthAt(lowerStage)) * stageMix;
      const firstCenter = layout.isDesktopLayout ? width / 2 : layout.centerX;
      const localCenter = clampedStage < 1
        ? firstCenter + (layout.centerX - firstCenter) * clampedStage
        : layout.centerX;
      const horizontal = Math.max(-1.25, Math.min(1.25, (x - localCenter) / Math.max(cell * 3, localWidth * .5)));
      const rotation = time * .78 + clampedStage * 1.08;
      const lightCenter = Math.sin(rotation) * .58;
      const shadowCenter = -lightCenter * .88;
      const highlight = Math.exp(-(((horizontal - lightCenter) / .34) ** 2));
      const shadow = Math.exp(-(((horizontal - shadowCenter) / .48) ** 2));
      const rim = Math.max(0, Math.abs(horizontal) - .7) / .55;
      return {
        alpha: Math.max(.56, Math.min(1.24, .68 + highlight * .54 - shadow * .08 - rim * .06)),
        color: mixHexColor(baseColor, STAGE_COLORS[0], shadow * .045 + rim * .025)
      };
    }

    function drawStreamLineFormations(layout, time, funnelOpacity) {
      if (reducedMotion || funnelOpacity <= .001) return;

      const cycleTime = (time + .5) % 8.4;
      ctx.save();
      ctx.lineWidth = 1;
      ctx.lineCap = 'square';

      for (let stage = 0; stage < DATA.length - 1; stage += 1) {
        const localProgress = (cycleTime - (.7 + stage * .52)) / 1.4;
        if (localProgress <= 0 || localProgress >= 1) continue;

        const formationAlpha = Math.sin(localProgress * Math.PI) ** 2;
        const head = .1 + localProgress * .8;
        const start = Math.max(.02, head - .19);
        const end = Math.min(.98, head + .05);
        const tracks = selectEvenly(stageTracks[stage + 1], Math.max(4, 10 - stage * 2));

        tracks.forEach((trackId, trackIndex) => {
          const firstPoint = pointOnSegment(layout, trackId, stage, start);
          const reveal = entranceAt(layout, firstPoint.y, trackId + stage * 181);
          ctx.globalAlpha = formationAlpha
            * (.2 + hash(trackId + 1901, trackIndex + stage * 17) * .16)
            * reveal
            * funnelOpacity
            * funnelFadeAt(layout, firstPoint.y);
          ctx.strokeStyle = LAYER_COLORS[stage];
          ctx.beginPath();
          for (let sample = 0; sample <= 8; sample += 1) {
            const progress = start + (end - start) * sample / 8;
            const point = pointOnSegment(layout, trackId, stage, progress);
            if (sample === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          }
          ctx.stroke();
        });
      }

      ctx.restore();
    }

    function drawDataStream(layout, time, funnelOpacity = 1) {
      const dataAlpha = Math.max(.32, Math.min(1, SETTINGS.ambientStrength * .76));
      const unitAlpha = Math.max(.46, Math.min(.96, 1.12 - SETTINGS.densityThreshold));
      const trailAlpha = .05 + (SETTINGS.trailDecay - .75) / .22 * .08;
      unitHitAreas = [];

      ctx.save();
      ctx.font = '600 9px "ABC Schengen Greek Variable Trial", Arial, sans-serif';
      ctx.textBaseline = 'bottom';

      DATA.forEach((stage, stageIndex) => {
        const y = layout.topY + layout.stageGap * stageIndex;
        const isFullWidthStage = layout.isDesktopLayout && stageIndex === 0;
        const stageWidth = isFullWidthStage ? width : layout.maxWidth * stage.width;
        const stageCenter = isFullWidthStage ? width / 2 : layout.centerX;
        const boundaryActive = hoveredLayer === stageIndex || hoveredLayer === stageIndex - 1;
        const railX = stageCenter - stageWidth / 2 - cell;
        const stageFade = funnelFadeAt(layout, y);
        if (!isFullWidthStage) {
          if (!boundaryActive) {
            ctx.globalAlpha = .16 * funnelOpacity * stageFade;
            ctx.fillStyle = STAGE_COLORS[stageIndex];
            ctx.fillRect(railX, y + cell * .72, stageWidth + cell * 2, 1);
          }
          ctx.globalAlpha = (boundaryActive ? .68 : .38) * funnelOpacity * stageFade;
          ctx.fillStyle = STAGE_COLORS[stageIndex];
          ctx.fillRect(railX, y + cell * .48, cell * .45, cell * .45);
          ctx.fillRect(railX + stageWidth + cell * 1.55, y + cell * .48, cell * .45, cell * .45);
        }
      });

      drawStreamLineFormations(layout, time, funnelOpacity);

      stageTracks[0].forEach(trackId => {
        const lastStage = lastStageByTrack.get(trackId);
        if (lastStage < 1) return;
        for (let stage = 0; stage < lastStage; stage += 1) {
          const layerColor = LAYER_COLORS[stage];
          const sampleCount = Math.max(6, Math.round(layout.stageGap / cell));
          for (let sample = 0; sample < sampleCount; sample += 1) {
            const gapChance = stage === 0
              ? .01 + hash(trackId + 83, stage + 271) * .03
              : stage <= 2
                ? .015 + hash(trackId + 83, stage + 271) * .035
                : .02 + hash(trackId + 83, stage + 271) * .06;
            if (hash(trackId * 97 + sample, stage + 293) < gapChance) continue;
            const segmentProgress = sample / sampleCount;
            const point = pointOnSegment(layout, trackId, stage, segmentProgress);
            const streamProgress = (stage + segmentProgress) / lastStage;
            const channelOffset = hash(trackId + 101, stage + 307);
            const channelSpeed = .11 + hash(trackId + 127, stage + 331) * .24;
            const pulseWindow = .1 + hash(trackId + 149, stage + 353) * .23;
            const travelScale = .72 + hash(trackId + 173, stage + 379) * .55;
            const phase = ((time * SETTINGS.motionSpeed * channelSpeed
              - streamProgress * travelScale + channelOffset) % 1 + 1) % 1;
            const pulse = !reducedMotion && phase < pulseWindow
              ? Math.sin(phase / pulseWindow * Math.PI) * (.55 + hash(trackId + 197, sample + 397) * .45)
              : 0;
            const reveal = entranceAt(layout, point.y, trackId + stage * 109 + sample);
            const tone = rotationalTone(layout, point.x, stage + segmentProgress, time, layerColor);
            drawPixel(
              point.x,
              point.y,
              (trailAlpha * (.6 + hash(trackId + 211, sample + 419) * .8) + pulse * .84)
                * tone.alpha * reveal * funnelOpacity * funnelFadeAt(layout, point.y),
              tone.color
            );
          }
        }
      });

      DATA.forEach((stage, stageIndex) => {
        if (stageIndex === 0) return;
        stageTracks[stageIndex].forEach(trackId => {
          const position = layout.positions[stageIndex].get(trackId);
          const x = position.x;
          const boundaryActive = hoveredLayer === stageIndex || hoveredLayer === stageIndex - 1;
          const boundaryOffset = boundaryActive ? (trackId % 2 ? -cell : cell) : 0;
          const y = layout.topY + layout.stageGap * stageIndex + position.y + boundaryOffset;
          const nodeSpeed = .09 + hash(trackId + 227, stageIndex + 431) * .13;
          const stagePhase = ((time * nodeSpeed + hash(trackId + 251, stageIndex + 457)) % 1 + 1) % 1;
          const stageGlow = !reducedMotion && stagePhase < .22
            ? Math.sin(stagePhase / .22 * Math.PI) * .16
            : 0;
          const reveal = entranceAt(layout, y, trackId + stageIndex * 137);
          const tone = rotationalTone(layout, x, stageIndex, time, STAGE_COLORS[stageIndex]);
          drawPixel(
            x,
            y,
            (Math.max(.9, unitAlpha * dataAlpha) + stageGlow + heatAt(x, y) * .3 + (boundaryActive ? .12 : 0))
              * tone.alpha * reveal * funnelOpacity * funnelFadeAt(layout, y),
            tone.color
          );
          unitHitAreas.push({ x, y, trackId, stageIndex });
        });
      });

      stageTracks[0].forEach(trackId => {
        const lastStage = lastStageByTrack.get(trackId);
        if (lastStage >= DATA.length - 1) return;
        const origin = layout.positions[lastStage].get(trackId);
        const originX = origin.x;
        const originY = layout.topY + layout.stageGap * lastStage + origin.y;
        const side = trackId % 2 ? 1 : -1;
        const progress = reducedMotion ? .62 : (time * (.1 + SETTINGS.motionSpeed * .06) + (trackId % 8) / 8) % 1;
        const distance = cell * (6 + trackId % 4);
        const dropoutY = originY + layout.stageGap * .48 * progress;
        drawPixel(
          originX + side * distance * progress,
          dropoutY,
          (1 - progress) * .28 * entranceAt(layout, dropoutY, trackId + 401)
            * funnelOpacity * funnelFadeAt(layout, dropoutY)
        );
      });

      LAYERS.forEach((layer, layerIndex) => {
        const layerProgress = layerIndex === 0 && layout.isDesktopLayout ? .72 : .5;
        const y = layout.topY + layout.stageGap * (layerIndex + layerProgress);
        const isSelected = selectedLayer === layerIndex;
        const isActive = hoveredLayer === layerIndex || isSelected;
        const labelWidth = Math.min(230, width - 24);
        const labelX = Math.min(width - labelWidth - 16, layout.visualLeft + layout.visualWidth - labelWidth - 12);
        const funnelBoundaryX = stageTracks[layerIndex + 1].reduce((rightEdge, trackId) => {
          const point = pointOnSegment(layout, trackId, layerIndex, layerProgress);
          return Math.max(rightEdge, point.x);
        }, layout.centerX);
        const lineEnd = labelX - 26;
        const lineStart = Math.min(funnelBoundaryX + cell * 1.25, lineEnd - 28);
        const labelReveal = entranceAt(layout, y, layerIndex + 701);
        const cardVisibility = layerCardVisibility(layerIndex, time);
        const layerFade = funnelFadeAt(layout, y);
        const labelOffsetX = (1 - cardVisibility) * cell * 1.8;
        const markerSize = 8;

        const lineLength = Math.max(28, lineEnd - lineStart) * cardVisibility;
        const lineAlpha = (isActive ? .56 : .18) * labelReveal * cardVisibility * layerFade;
        const lineY = Math.round(y / cell) * cell + 1;
        ctx.fillStyle = isActive ? LAYER_COLORS[layerIndex] : heroInkColor;
        for (let lineX = lineStart; lineX < lineStart + lineLength; lineX += cell) {
          const column = Math.round(lineX / cell);
          ctx.globalAlpha = lineAlpha * (.74 + hash(column, layerIndex + 743) * .26);
          ctx.fillRect(column * cell + 1, lineY, cell - 3, cell - 3);
        }

        const markerX = labelX + labelOffsetX;
        ctx.globalAlpha = (isSelected ? 1 : isActive ? .9 : .74) * labelReveal * cardVisibility * layerFade;
        ctx.fillStyle = LAYER_COLORS[layerIndex];
        ctx.fillRect(markerX, y - markerSize / 2, markerSize, markerSize);

        const titleX = markerX + 19;
        ctx.textBaseline = 'alphabetic';
        ctx.globalAlpha = (isActive ? 1 : .88) * labelReveal * cardVisibility * layerFade;
        ctx.fillStyle = isActive ? LAYER_COLORS[layerIndex] : heroInkColor;
        ctx.font = '500 13px "ABC Schengen Greek Variable Trial", Arial, sans-serif';
        ctx.fillText(layer.label, titleX, y + 5);
        ctx.globalAlpha = (isActive ? .76 : .68) * labelReveal * cardVisibility * layerFade;
        ctx.font = '400 13px "ABC Schengen Greek Variable Trial", Arial, sans-serif';
        ctx.fillText(layer.detail, markerX, y + 31);
      });
      drawShapeAnnotation(layout, time);
      ctx.restore();
    }

    function drawGridFlowPass(layout, time, layerIndex, started) {
      if (layerIndex === null) return false;
      const top = layout.topY + layout.stageGap * layerIndex + cell * .5;
      const bottom = top + layout.stageGap - cell;
      const firstRow = Math.ceil(top / cell);
      const lastRow = Math.floor(bottom / cell);
      const centerColumn = layout.centerX / cell;
      const maxColumnDistance = Math.max(centerColumn, cols - centerColumn);
      const age = time - started;
      const duration = 1.85;

      if (reducedMotion && hoveredLayer === null) return false;
      if (!reducedMotion && (age < 0 || age > duration)) return false;
      ctx.fillStyle = mixHexColor(LAYER_COLORS[layerIndex], heroShadowColor, .2);

      for (let row = firstRow; row <= lastRow; row += 1) {
        for (let column = 0; column < cols; column += 1) {
          const distance = Math.abs(column + .5 - centerColumn) / maxColumnDistance;
          const rowDrift = Math.sin(row * .82 + column * .16) * .045
            + Math.sin(row * 1.71 - column * .08) * .025;
          const cellJitter = (hash(column + layerIndex * 37, row + 719) - .5) * .11;
          const delay = distance * .68 + rowDrift + cellJitter;
          let envelope = .58;

          if (!reducedMotion) {
            const localAge = age - delay;
            if (localAge <= 0) continue;
            const enter = easeOutCubic(localAge / .16);
            const fade = 1 - easeOutCubic((localAge - .38) / .62);
            envelope = enter * fade;
            if (envelope <= .01) continue;
          }

          const variation = .62 + hash(column + 811, row + layerIndex * 53) * .38;
          ctx.globalAlpha = envelope * variation * .2;
          ctx.fillRect(column * cell + 1, row * cell + 1, cell - 3, cell - 3);
        }
      }
      ctx.globalAlpha = 1;
      return true;
    }

    function drawHoverGridFlow(layout, time) {
      if (clickFlowLayer !== null) {
        if (drawGridFlowPass(layout, time, clickFlowLayer, clickFlowStarted)) return;
        clickFlowLayer = null;
      }
      drawGridFlowPass(layout, time, hoverFlowLayer, hoverFlowStarted);
    }

    function updateHoveredTrack(x, y, clientX, clientY) {
      const layout = buildLayout();
      const stagePosition = (y - layout.topY) / layout.stageGap;
      const layerIndex = Math.floor(stagePosition);
      const isInsidePipeline = x >= layout.visualLeft - cell * 2
        && x <= layout.visualLeft + layout.visualWidth
        && layerIndex >= 0
        && layerIndex < LAYERS.length;
      const visibleLayer = selectedLayer === null || selectedLayer === layerIndex;
      const nextHoveredLayer = isInsidePipeline && visibleLayer ? layerIndex : null;
      if (nextHoveredLayer !== null && nextHoveredLayer !== hoveredLayer) {
        hoverFlowLayer = nextHoveredLayer;
        hoverFlowStarted = performance.now() / 1000;
      }
      hoveredLayer = nextHoveredLayer;
      hero.classList.toggle('is-data-layer-hovered', hoveredLayer !== null && hoveredLayer !== 0);

      hoveredTrack = null;
      if (hoveredLayer === null) {
        tooltip.classList.remove('is-visible');
        return;
      }
      if (selectedLayer === hoveredLayer) {
        tooltip.classList.remove('is-visible');
        return;
      }
      tooltip.textContent = 'Click to view pixel form';
      tooltip.style.left = `${Math.min(innerWidth - 240, clientX)}px`;
      tooltip.style.top = `${Math.min(innerHeight - 70, clientY)}px`;
      tooltip.classList.add('is-visible');
    }

    function frame(milliseconds) {
      frameId = 0;
      if (!active || !visible || document.hidden) return;
      const delta = lastFrame ? Math.min(.04, (milliseconds - lastFrame) / 1000) : 0;
      lastFrame = milliseconds;
      intro = Math.min(1, intro + delta / 1.2);
      syncScanReveal();
      const time = reducedMotion ? 0 : milliseconds / 1000;
      animationTime = milliseconds / 1000;
      const layout = buildLayout();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = SETTINGS.paperColor;
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      drawGrid();
      drawSelectedPointerField(time, delta);
      drawScanTrail();
      drawHoverGridFlow(layout, milliseconds / 1000);
      if (lowerTextureVisible) drawConvergingDivider();
      const funnelOpacity = funnelOpacityAt(animationTime);
      drawModeMorph(layout, animationTime);
      drawDataStream(layout, time, funnelOpacity);
      ctx.globalAlpha = 1;
      ctx.restore();
      const decay = reducedMotion ? .84 : Math.pow(SETTINGS.trailDecay, Math.max(.2, delta * 60));
      for (let index = 0; index < heat.length; index += 1) {
        heat[index] *= decay;
        if (heat[index] < .003) heat[index] = 0;
      }
      frameId = requestAnimationFrame(frame);
    }

    function startAnimation() {
      if (!active || !visible || document.hidden || frameId) return;
      lastFrame = 0;
      frameId = requestAnimationFrame(frame);
    }

    function stopAnimation() {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }

    hero.addEventListener('pointermove', event => {
      if (!finePointer) return;
      const rect = canvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      if (previousX >= 0) {
        const dx = pointerX - previousX;
        const dy = pointerY - previousY;
        const steps = Math.max(1, Math.min(30, Math.round(Math.hypot(dx, dy) / (cell * .75))));
        for (let index = 1; index <= steps; index += 1) {
          const progress = index / steps;
          deposit(previousX + dx * progress, previousY + dy * progress, SETTINGS.interactionStrength, SETTINGS.brushRadius);
        }
      }
      previousX = pointerX;
      previousY = pointerY;
      updateHoveredTrack(pointerX, pointerY, event.clientX, event.clientY);
    }, { signal });

    hero.addEventListener('pointerleave', () => {
      hoveredTrack = null;
      hoveredLayer = null;
      hoverFlowLayer = null;
      hero.classList.remove('is-data-layer-hovered');
      pointerX = -1;
      pointerY = -1;
      pointerFieldX = -1;
      pointerFieldY = -1;
      previousX = -1;
      previousY = -1;
      tooltip.classList.remove('is-visible');
    }, { signal });

    hero.addEventListener('pointerdown', event => {
      if (event.target.closest?.('a, button')) return;
      const rect = canvas.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const layout = buildLayout();
      const clickedLayer = Math.floor((localY - layout.topY) / layout.stageGap);
      const clickedDataRegion = localX >= layout.visualLeft - cell * 2
        && localX <= layout.visualLeft + layout.visualWidth
        && clickedLayer >= 0
        && clickedLayer < LAYERS.length;
      if (clickedDataRegion) {
        toggleLayerShape(selectedLayer !== null ? selectedLayer : clickedLayer);
      }
    }, { signal });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);
    const intersectionObserver = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) startAnimation();
      else {
        stopAnimation();
        tooltip.classList.remove('is-visible');
      }
    }, { threshold: 0 });
    intersectionObserver.observe(hero);

    resize();
    startAnimation();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAnimation();
      else startAnimation();
    }, { signal });
    window.addEventListener('pagehide', stopAnimation, { once: true, signal });
    cleanups.push(() => {
      active = false;
      controller.abort();
      stopAnimation();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      hero.classList.remove('is-data-layer-hovered');
      tooltip.classList.remove('is-visible');
      scanRevealTargets.forEach(element => {
        element.style.removeProperty('opacity');
        element.style.removeProperty('clip-path');
        element.style.removeProperty('will-change');
      });
    });
  }

function initializeFormatGlobe(root, cleanups) {
    'use strict';

    const canvas = root.querySelector('[data-format-globe]');
    const stage = canvas?.closest('.format-orbit-stage--thread-globe');
    if (!canvas || !stage) return;
    canvas.dataset.formatGlobeOwned = 'true';

    const context = canvas.getContext('2d');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ringRotations = [
      [0, 0, 0],
      [0.92, 0.10, 0.56],
      [-0.78, 0.38, -0.68],
      [0.22, 1.05, 1.16]
    ];
    const movingDashRingIndex = 2;
    const formatLabels = ['.docx', '.pdf', '.jpg', '.pptx', '.xlsx', '.csv', '.png', '.md', '.json', '.txt'];
    const formatIconPaths = {
      '.csv': '/assets/file-icons/table.svg',
      '.docx': '/assets/file-icons/word.svg',
      '.jpg': '/assets/file-icons/image.svg',
      '.json': '/assets/file-icons/json.svg',
      '.md': '/assets/file-icons/markdown.svg',
      '.pdf': '/assets/file-icons/pdf.svg',
      '.png': '/assets/file-icons/image.svg',
      '.pptx': '/assets/file-icons/powerpoint.svg',
      '.txt': '/assets/file-icons/document.svg',
      '.xlsx': '/assets/file-icons/table.svg'
    };
    const particles = Array.from({ length: 10 }, (_, index) => ({
      ring: index % ringRotations.length,
      phase: (index * 0.61803398875) % 1,
      speed: 0.012 + (index % 4) * 0.003,
      radius: index % 5 === 0 ? 3.4 : 2.1,
      label: formatLabels[index]
    }));
    const formatIconImages = new Map(Object.entries(formatIconPaths).map(([label, source]) => {
      const image = new Image();
      image.src = source;
      return [label, image];
    }));
    const whiteIconCanvas = document.createElement('canvas');
    whiteIconCanvas.width = 16;
    whiteIconCanvas.height = 16;
    const whiteIconContext = whiteIconCanvas.getContext('2d');

    let width = 1;
    let height = 1;
    let pointerX = 0;
    let pointerY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let pointerLocalX = 0;
    let pointerLocalY = 0;
    let pointerInside = false;
    let visible = true;
    let frameId = 0;
    let startTime = performance.now();
    let introStartedAt = reducedMotion ? startTime : null;
    let introComplete = reducedMotion;
    const controller = new AbortController();
    const { signal } = controller;
    let active = true;
    const introRingDuration = 1200;
    const introRingStagger = 140;
    const autoLabelInterval = 10000;
    const labelFadeDuration = 800;
    let activeLabelIndex = Math.floor(Math.random() * particles.length);
    let outgoingLabelIndex = null;
    let labelTransitionStartedAt = 0;
    let previousHoveredParticleIndex = null;
    let autoLabelTimer = 0;

    function nextRandomLabelIndex(currentIndex) {
      return (currentIndex + 1 + Math.floor(Math.random() * (particles.length - 1))) % particles.length;
    }

    function activateLabel(nextIndex, now = performance.now()) {
      if (nextIndex === activeLabelIndex) return;
      outgoingLabelIndex = reducedMotion ? null : activeLabelIndex;
      activeLabelIndex = nextIndex;
      labelTransitionStartedAt = now;
    }

    function scheduleAutoLabel() {
      clearTimeout(autoLabelTimer);
      if (!active || !visible || document.hidden) return;
      autoLabelTimer = window.setTimeout(() => {
        const now = performance.now();
        activateLabel(nextRandomLabelIndex(activeLabelIndex), now);
        draw(reducedMotion ? 0 : now - startTime, now);
        scheduleAutoLabel();
      }, autoLabelInterval);
    }

    function easeInOutSine(progress) {
      return -(Math.cos(Math.PI * progress) - 1) / 2;
    }

    function getRingIntroState(ringIndex, now) {
      if (introComplete || reducedMotion) return { reveal: 1, headOpacity: 0 };
      if (introStartedAt === null) return { reveal: 0, headOpacity: 0 };
      const raw = Math.max(0, Math.min(1, (
        now - introStartedAt - ringIndex * introRingStagger
      ) / introRingDuration));
      return {
        reveal: easeInOutSine(raw),
        headOpacity: raw > 0.82 ? Math.max(0, (1 - raw) / 0.18) : 1
      };
    }

    function colorWithAlpha(color, alpha) {
      const [red, green, blue] = [1, 3, 5].map(index => parseInt(color.slice(index, index + 2), 16));
      return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    function mainColor() {
      const color = getComputedStyle(document.documentElement).getPropertyValue('--main-600').trim();
      return /^#[0-9a-f]{6}$/i.test(color) ? color : '#6D80B6';
    }

    function activeLabelColorWithAlpha(alpha) {
      return colorWithAlpha(mainColor(), alpha);
    }

    function rotate(point, rotation) {
      let [x, y, z] = point;
      const [rx, ry, rz] = rotation;
      let cosine = Math.cos(rx);
      let sine = Math.sin(rx);
      [y, z] = [y * cosine - z * sine, y * sine + z * cosine];
      cosine = Math.cos(ry);
      sine = Math.sin(ry);
      [x, z] = [x * cosine + z * sine, -x * sine + z * cosine];
      cosine = Math.cos(rz);
      sine = Math.sin(rz);
      [x, y] = [x * cosine - y * sine, x * sine + y * cosine];
      return [x, y, z];
    }

    function pointOnRing(ringIndex, angle, elapsed) {
      let point = [Math.cos(angle), Math.sin(angle), 0];
      if (ringIndex === 0) return point;
      point = rotate(point, ringRotations[ringIndex]);
      point = rotate(point, [tiltX, elapsed * 0.00008 + tiltY, 0]);
      return point;
    }

    function project(point, radius) {
      const perspective = 1 + point[2] * 0.08;
      return {
        x: width * 0.5 + point[0] * radius * perspective,
        y: height * 0.5 + point[1] * radius * perspective,
        z: point[2]
      };
    }

    function drawTraceHead(ringIndex, ringRadius, reveal, opacity, elapsed, segments) {
      if (reveal <= 0 || opacity <= 0) return;
      const tailStart = Math.max(0, reveal - 0.16);
      const firstSegment = Math.floor(tailStart * segments);
      const lastSegment = Math.ceil(reveal * segments);
      const tailLength = Math.max(0.001, reveal - tailStart);

      context.save();
      context.shadowColor = activeLabelColorWithAlpha(0.55);
      context.shadowBlur = 5;
      for (let index = firstSegment; index < lastSegment; index += 1) {
        const start = Math.max(index / segments, tailStart);
        const end = Math.min((index + 1) / segments, reveal);
        if (end <= start) continue;
        const strength = Math.max(0, Math.min(1, (end - tailStart) / tailLength));
        const pointA = project(pointOnRing(ringIndex, start * Math.PI * 2, elapsed), ringRadius);
        const pointB = project(pointOnRing(ringIndex, end * Math.PI * 2, elapsed), ringRadius);
        context.beginPath();
        context.moveTo(pointA.x, pointA.y);
        context.lineTo(pointB.x, pointB.y);
        context.lineWidth = 1 + strength * 1.1;
        context.strokeStyle = activeLabelColorWithAlpha((0.12 + strength * 0.88) * opacity);
        context.stroke();
      }
      context.restore();
    }

    function draw(elapsed, now = performance.now()) {
      context.clearRect(0, 0, width, height);
      const radius = Math.min(width, height) * 0.42;
      const radiusForRing = ringIndex => ringIndex === 0 ? radius : radius * 1.06;
      const segments = 180;
      const ringIntroStates = ringRotations.map((_, ringIndex) => getRingIntroState(ringIndex, now));

      if (!introComplete && ringIntroStates.every(state => state.reveal >= 1)) {
        introComplete = true;
      }

      ringRotations.forEach((_, ringIndex) => {
        const ringRadius = radiusForRing(ringIndex);
        const introState = ringIntroStates[ringIndex];
        if (introState.reveal <= 0) return;
        if (ringIndex === movingDashRingIndex) {
          context.save();
          context.beginPath();
          const visibleSegments = Math.ceil(segments * introState.reveal);
          for (let index = 0; index <= visibleSegments; index += 1) {
            const angle = Math.min(index / segments, introState.reveal) * Math.PI * 2;
            const point = project(pointOnRing(ringIndex, angle, elapsed), ringRadius);
            if (index === 0) context.moveTo(point.x, point.y);
            else context.lineTo(point.x, point.y);
          }
          context.setLineDash([7, 5]);
          context.lineDashOffset = reducedMotion ? 0 : -(elapsed * 0.028) % 12;
          context.lineWidth = 1.1;
          context.strokeStyle = activeLabelColorWithAlpha(0.78);
          context.stroke();
          context.restore();
          drawTraceHead(ringIndex, ringRadius, introState.reveal, introState.headOpacity, elapsed, segments);
          return;
        }

        const visibleSegments = Math.ceil(segments * introState.reveal);
        for (let index = 0; index < visibleSegments; index += 1) {
          const angleA = index / segments * Math.PI * 2;
          const angleB = Math.min((index + 1) / segments, introState.reveal) * Math.PI * 2;
          const pointA = project(pointOnRing(ringIndex, angleA, elapsed), ringRadius);
          const pointB = project(pointOnRing(ringIndex, angleB, elapsed), ringRadius);
          const colorPhase = ringIndex === 0
            ? 0.88
            : (elapsed * 0.000055 + ringIndex * 0.21) % 1;
          const normalized = index / segments;
          const distance = Math.min(Math.abs(normalized - colorPhase), 1 - Math.abs(normalized - colorPhase));
          const colorStrength = Math.max(0, 1 - distance / 0.12);
          const depthAlpha = 0.22 + (pointA.z + 1) * 0.16;

          context.beginPath();
          context.moveTo(pointA.x, pointA.y);
          context.lineTo(pointB.x, pointB.y);
          context.lineWidth = colorStrength > 0 ? 1.25 : 0.75;
          context.strokeStyle = colorStrength > 0
            ? activeLabelColorWithAlpha(0.18 + colorStrength * 0.78)
            : `rgba(24, 24, 24, ${depthAlpha})`;
          context.stroke();
        }
        drawTraceHead(ringIndex, ringRadius, introState.reveal, introState.headOpacity, elapsed, segments);
      });

      const particlePoints = particles.map((particle, index) => {
        const phase = reducedMotion
          ? particle.phase
          : (particle.phase + elapsed * 0.001 * particle.speed) % 1;
        const point = pointOnRing(particle.ring, phase * Math.PI * 2, elapsed);
        const introAlpha = Math.max(0, Math.min(1, (ringIntroStates[particle.ring].reveal - 0.72) / 0.28));
        return { ...project(point, radiusForRing(particle.ring)), ...particle, index, introAlpha };
      }).sort((a, b) => a.z - b.z);

      const hoveredParticle = pointerInside
        ? particlePoints.reduce((closest, particle) => {
            if (particle.introAlpha < 0.9) return closest;
            const distance = Math.hypot(particle.x - pointerLocalX, particle.y - pointerLocalY);
            if (distance > 12 || (closest && distance >= closest.distance)) return closest;
            return { particle, distance };
          }, null)?.particle
        : null;

      const hoveredParticleIndex = hoveredParticle?.index ?? null;
      if (hoveredParticleIndex !== previousHoveredParticleIndex) {
        previousHoveredParticleIndex = hoveredParticleIndex;
        if (hoveredParticleIndex !== null) {
          activateLabel(hoveredParticleIndex, now);
          scheduleAutoLabel();
        }
      }

      particlePoints.forEach(particle => {
        if (particle.introAlpha <= 0) return;
        const isHovered = hoveredParticle?.index === particle.index;
        const isColored = isHovered || particle.index === 0 || particle.index === 5;
        context.beginPath();
        context.arc(particle.x, particle.y, isHovered ? 4.8 : particle.radius, 0, Math.PI * 2);
        context.fillStyle = isColored
          ? colorWithAlpha(mainColor(), (0.62 + (particle.z + 1) * 0.16) * particle.introAlpha)
          : `rgba(24, 24, 24, ${(0.22 + (particle.z + 1) * 0.20) * particle.introAlpha})`;
        context.fill();
      });

      const transitionRaw = outgoingLabelIndex === null
        ? 1
        : Math.max(0, Math.min(1, (now - labelTransitionStartedAt) / labelFadeDuration));
      const transitionProgress = easeInOutSine(transitionRaw);
      const activeLabelParticle = particlePoints.find(
        particle => particle.index === activeLabelIndex && particle.introAlpha >= 0.9
      );
      const outgoingLabelParticle = outgoingLabelIndex === null
        ? null
        : particlePoints.find(particle => particle.index === outgoingLabelIndex && particle.introAlpha >= 0.9);

      function drawLabel(particle, opacity) {
        if (!particle || opacity <= 0) return;
        context.save();
        context.globalAlpha = opacity;
        context.font = '500 15px Fellix-TRIAL, "ABC Schengen Greek Variable Trial", sans-serif';
        context.textBaseline = 'middle';
        const textWidth = context.measureText(particle.label).width;
        const labelWidth = textWidth + 36;
        const preferredX = particle.x + 10;
        const labelX = preferredX + labelWidth > width - 4
          ? particle.x - labelWidth - 10
          : preferredX;
        const labelY = Math.max(4, Math.min(height - 28, particle.y - 12));
        context.fillStyle = mainColor();
        context.fillRect(labelX, labelY, labelWidth, 24);
        const frameX = labelX - 2;
        const frameY = labelY - 2;
        const frameWidth = labelWidth + 4;
        const frameHeight = 28;
        const cornerLength = 7;
        context.beginPath();
        context.moveTo(frameX + cornerLength, frameY + 0.5);
        context.lineTo(frameX + 0.5, frameY + 0.5);
        context.lineTo(frameX + 0.5, frameY + cornerLength);
        context.moveTo(frameX + cornerLength, frameY + frameHeight - 0.5);
        context.lineTo(frameX + 0.5, frameY + frameHeight - 0.5);
        context.lineTo(frameX + 0.5, frameY + frameHeight - cornerLength);
        context.moveTo(frameX + frameWidth - cornerLength, frameY + 0.5);
        context.lineTo(frameX + frameWidth - 0.5, frameY + 0.5);
        context.lineTo(frameX + frameWidth - 0.5, frameY + cornerLength);
        context.moveTo(frameX + frameWidth - cornerLength, frameY + frameHeight - 0.5);
        context.lineTo(frameX + frameWidth - 0.5, frameY + frameHeight - 0.5);
        context.lineTo(frameX + frameWidth - 0.5, frameY + frameHeight - cornerLength);
        context.strokeStyle = mainColor();
        context.lineWidth = 1;
        context.stroke();
        const icon = formatIconImages.get(particle.label);
        if (whiteIconContext && icon?.complete && icon.naturalWidth > 0) {
          whiteIconContext.clearRect(0, 0, 16, 16);
          whiteIconContext.globalCompositeOperation = 'source-over';
          whiteIconContext.drawImage(icon, 0, 0, 16, 16);
          whiteIconContext.globalCompositeOperation = 'source-in';
          whiteIconContext.fillStyle = '#fff';
          whiteIconContext.fillRect(0, 0, 16, 16);
          whiteIconContext.globalCompositeOperation = 'source-over';
          context.drawImage(whiteIconCanvas, labelX + 4, labelY + 4, 16, 16);
        }
        context.fillStyle = '#fff';
        context.fillText(particle.label, labelX + 27, labelY + 12);
        context.restore();
      }

      drawLabel(outgoingLabelParticle, 1 - transitionProgress);
      drawLabel(activeLabelParticle, transitionProgress);

      if (activeLabelParticle) {
        stage.dataset.activeFormatLabel = activeLabelParticle.label;
        stage.dataset.activeFormatColor = mainColor();
      } else {
        delete stage.dataset.activeFormatLabel;
        delete stage.dataset.activeFormatColor;
      }
      if (transitionRaw >= 1) outgoingLabelIndex = null;

      stage.style.cursor = hoveredParticle ? 'pointer' : 'crosshair';
    }

    function frame(now) {
      frameId = 0;
      if (!active || reducedMotion || !visible || document.hidden) return;
      tiltX += (pointerY - tiltX) * 0.055;
      tiltY += (pointerX - tiltY) * 0.055;
      draw(now - startTime, now);
      frameId = requestAnimationFrame(frame);
    }

    function startAnimation() {
      if (!active || reducedMotion || !visible || document.hidden || frameId) return;
      frameId = requestAnimationFrame(frame);
    }

    function stopAnimation() {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }

    function resize() {
      const rect = stage.getBoundingClientRect();
      const pixelRatio = Math.min(devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const now = performance.now();
      draw(now - startTime, now);
    }

    stage.addEventListener('pointermove', event => {
      const rect = stage.getBoundingClientRect();
      pointerInside = true;
      pointerLocalX = event.clientX - rect.left;
      pointerLocalY = event.clientY - rect.top;
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.7;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.5;
      if (reducedMotion) {
        tiltX = pointerY;
        tiltY = pointerX;
        draw(0, performance.now());
      }
    }, { signal });

    stage.addEventListener('pointerleave', () => {
      pointerInside = false;
      pointerX = 0;
      pointerY = 0;
      stage.style.cursor = 'crosshair';
    }, { signal });

    window.addEventListener('main-palette-change', () => draw(reducedMotion ? 0 : performance.now() - startTime), { signal });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    const intersectionObserver = new IntersectionObserver(entries => {
      const nextVisible = entries[0].isIntersecting;
      if (nextVisible && introStartedAt === null) introStartedAt = performance.now();
      if (nextVisible && !visible) {
        visible = true;
        scheduleAutoLabel();
        if (introStartedAt === null) introStartedAt = performance.now();
        startAnimation();
      } else {
        visible = nextVisible;
        if (!visible) {
          clearTimeout(autoLabelTimer);
          stopAnimation();
        }
      }
    }, { threshold: 0 });
    intersectionObserver.observe(stage);

    resize();
    scheduleAutoLabel();
    startAnimation();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearTimeout(autoLabelTimer);
        stopAnimation();
      } else {
        scheduleAutoLabel();
        startAnimation();
      }
    }, { signal });
    window.addEventListener('pagehide', stopAnimation, { once: true, signal });
    cleanups.push(() => {
      active = false;
      controller.abort();
      clearTimeout(autoLabelTimer);
      stopAnimation();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      delete canvas.dataset.formatGlobeOwned;
      delete stage.dataset.activeFormatLabel;
      delete stage.dataset.activeFormatColor;
      stage.style.removeProperty('cursor');
    });
  }
