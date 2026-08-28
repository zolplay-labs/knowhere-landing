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

    const SETTINGS = Object.freeze({
      cellSize: 6,
      fieldScale: .98,
      motionSpeed: 1.18,
      trailDecay: .925,
      brushRadius: 10,
      interactionStrength: .19,
      paperColor: '#fff',
      seed: 17
    });
    const currentPrimary = () => getComputedStyle(document.documentElement)
      .getPropertyValue('--page-primary').trim() || '#19A88B';
    const RED_FLOW_COLOR = '#FF634A';
    let primary500 = currentPrimary();
    const STAGE_COLORS = Array(5).fill(primary500);
    const LAYER_COLORS = STAGE_COLORS.slice(1);
    let heroInkColor = primary500;
    let heroShadowColor = primary500;
    const currentTextColor = (property, fallback) => getComputedStyle(document.documentElement)
      .getPropertyValue(property).trim() || fallback;
    let heroLabelTitleColor = currentTextColor('--mist-white-900', '#2E2E2C');
    let heroLabelSubtitleColor = currentTextColor('--mist-white-700', '#888A82');
    const syncPrimary = () => {
      primary500 = currentPrimary();
      STAGE_COLORS.fill(primary500);
      LAYER_COLORS.fill(primary500);
      heroInkColor = primary500;
      heroShadowColor = primary500;
      heroLabelTitleColor = currentTextColor('--mist-white-900', '#2E2E2C');
      heroLabelSubtitleColor = currentTextColor('--mist-white-700', '#888A82');
    };
    window.addEventListener('main-palette-change', syncPrimary, { signal });
    const vortexControls = {
      direction: 'counterclockwise',
      flowSpeed: .026,
      rotationSpeed: .03,
      mouthSpeed: .055,
      twistPerStage: 1.95,
      middleTwist: 1.35,
      speedVariation: .04,
      centerPosition: .55,
      fieldScale: .96,
      stageSpacing: .8,
      innerShell: .49,
      perspective: .11,
      orbitHeight: .15,
      cameraYaw: 0,
      cameraLift: 80,
      cameraRoll: 0,
      waistWidth: .095,
      firstExpansion: .29,
      finalExpansion: 1,
      fadeDistance: 108,
      mouthEnabled: false,
      mouthCount: 500,
      mouthDensity: 1.25,
      streamDensity: .85,
      ridgeFrequency: 2.4,
      ridgeStrength: .28,
      middleLayering: .52,
      depthDensity: .5,
      depthAlpha: .05,
      overallAlpha: .75,
      redFlowDelay: 0,
      redFlowDuration: 2.4,
      redFlowInterval: .45,
      redFlowLoopPause: 1,
      redFlowLine1ExtraDelay: 0,
      redFlowLine2ExtraDelay: 0,
      redFlowLine3ExtraDelay: 0,
      redFlowLine4ExtraDelay: 0,
      redFlowLine5ExtraDelay: 0,
      redFlowEntrySpread: .12,
      redFlowStartAngle: 135,
      redFlowAngleSpread: 22,
      enabled: false,
      count: 33,
      speed: .02,
      baseSpread: 1.7,
      spreadGrowth: 4.4,
      turns: 1,
      alpha: .42,
      allLabelsY: 50,
      hoverHeight: 150,
      originalDocumentY: 96,
      pageImagesY: 120,
      lightweightNotesY: 120,
      chapterMapY: 106
    };
    window.addEventListener('hero-vortex-controls', event => {
      const redFlow = event.detail?.redParticleFlow;
      const timingChanged = redFlow && [
        'redFlowDelay',
        'redFlowDuration',
        'redFlowInterval',
        'redFlowLoopPause',
        'redFlowLine1ExtraDelay',
        'redFlowLine2ExtraDelay',
        'redFlowLine3ExtraDelay',
        'redFlowLine4ExtraDelay',
        'redFlowLine5ExtraDelay'
      ].some(key => redFlow[key] !== vortexControls[key]);
      Object.values(event.detail || {}).forEach(group => {
        if (group && typeof group === 'object') Object.assign(vortexControls, group);
      });
      if (timingChanged) redFlowStartedAt = animationTime;
    }, { signal });
    const DATA = [
      { count: 176, width: 1 },
      { count: 112, width: .56 },
      { count: 72, width: .34 },
      { count: 40, width: .17 },
      { count: 16, width: .055 },
      { count: 48, width: .28 },
      { count: 112, width: .68 }
    ];
    const LAYERS = [
      { label: 'ORIGINAL DOCUMENT', detail: 'The document stays intact.' },
      { label: 'PAGE IMAGES', detail: 'Every page, ready to inspect.' },
      { label: 'LIGHTWEIGHT NOTES', detail: 'Topics stay tied to their chapters.' },
      { label: 'CHAPTER MAP', detail: 'A clear path back to the source.' }
    ];
    const LABEL_ICON_PATHS = [
      'M21 8V20.9932C21 21.5501 20.5552 22 20.0066 22H3.9934C3.44495 22 3 21.556 3 21.0082V2.9918C3 2.45531 3.4487 2 4.00221 2H14.9968L21 8ZM19 9H14V4H5V20H19V9ZM8 7H11V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z',
      'M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z',
      'M21 15L15 20.996L4.00221 21C3.4487 21 3 20.5551 3 20.0066V3.9934C3 3.44476 3.44495 3 3.9934 3H20.0066C20.5552 3 21 3.45576 21 4.00247V15ZM19 5H5V19H13V14C13 13.4872 13.386 13.0645 13.8834 13.0067L14 13L19 12.999V5ZM18.171 14.999L15 15V18.169L18.171 14.999Z',
      'M10 2C10.5523 2 11 2.44772 11 3V7C11 7.55228 10.5523 8 10 8H8V10H13V9C13 8.44772 13.4477 8 14 8H20C20.5523 8 21 8.44772 21 9V13C21 13.5523 20.5523 14 20 14H14C13.4477 14 13 13.5523 13 13V12H8V18H13V17C13 16.4477 13.4477 16 14 16H20C20.5523 16 21 16.4477 21 17V21C21 21.5523 20.5523 22 20 22H14C13.4477 22 13 21.5523 13 21V20H7C6.44772 20 6 19.5523 6 19V8H4C3.44772 8 3 7.55228 3 7V3C3 2.44772 3.44772 2 4 2H10ZM19 18H15V20H19V18ZM19 10H15V12H19V10ZM9 4H5V6H9V4Z'
    ].map(path => new Path2D(path));
    const FLOATING_FORMATS = [
      ['.docx', '/assets/file-icons/word.svg'],
      ['.pdf', '/assets/file-icons/pdf.svg'],
      ['.jpg', '/assets/file-icons/image.svg'],
      ['.pptx', '/assets/file-icons/powerpoint.svg'],
      ['.xlsx', '/assets/file-icons/table.svg'],
      ['.csv', '/assets/file-icons/table.svg'],
      ['.png', '/assets/file-icons/image.svg'],
      ['.md', '/assets/file-icons/markdown.svg'],
      ['.json', '/assets/file-icons/json.svg'],
      ['.txt', '/assets/file-icons/document.svg']
    ].map(([label, source]) => {
      const image = new Image();
      image.src = source;
      return { label, image };
    });
    const floatingFormatIconCanvas = document.createElement('canvas');
    floatingFormatIconCanvas.width = 16;
    floatingFormatIconCanvas.height = 16;
    const floatingFormatIconContext = floatingFormatIconCanvas.getContext('2d');
    const LABEL_Y_KEYS = ['originalDocumentY', 'pageImagesY', 'lightweightNotesY', 'chapterMapY'];
    const HERO_COPY_ACCENTS = [.16, .24, .12, .3, .18, .14, .2, .14, .22, .16, .22, .14, .28, .18, .24];
    const RED_FLOW_TRAILS = [
      { delayKey: 'redFlowLine1ExtraDelay', length: .16 },
      { delayKey: 'redFlowLine2ExtraDelay', length: .24 },
      { delayKey: 'redFlowLine3ExtraDelay', length: .19 },
      { delayKey: 'redFlowLine4ExtraDelay', length: .29 },
      { delayKey: 'redFlowLine5ExtraDelay', length: .22 }
    ];
    const displayLabel = label => label[0] + label.slice(1).toLowerCase();
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const unitCounts = DATA.map(stage => stage.count);
    const selectEvenly = (previous, count) => Array.from(
      { length: Math.min(count, previous.length) },
      (_, index) => previous[Math.min(previous.length - 1, Math.floor((index + .5) * previous.length / count))]
    );
    const allTracks = Array.from({ length: unitCounts[0] }, (_, index) => index);
    const stageTracks = [allTracks];
    for (let stage = 1; stage <= LAYERS.length; stage += 1) {
      stageTracks.push(selectEvenly(stageTracks[stage - 1], unitCounts[stage]));
    }
    for (let stage = LAYERS.length + 1; stage < DATA.length; stage += 1) {
      stageTracks.push(selectEvenly(allTracks, unitCounts[stage]));
    }
    const stageTrackSets = stageTracks.map(tracks => new Set(tracks));

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cell = SETTINGS.cellSize;
    let cols = 0;
    let rows = 0;
    let heat = new Float32Array(0);
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
    let redFlowStartedAt = null;
    const MORPH_DURATION = .46;
    const MORPH_POINT_COUNT = 680;

    const hash = (x, y) => {
      const value = Math.sin(x * 127.1 + y * 311.7 + SETTINGS.seed * .13) * 43758.5453;
      return value - Math.floor(value);
    };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
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
      const heroRect = hero.getBoundingClientRect();
      const visualLeft = visualRect.left - canvasRect.left;
      const visualTop = visualRect.top - canvasRect.top;
      const centerX = width < 1100
        ? visualLeft + visualRect.width * .5
        : visualLeft + visualRect.width * vortexControls.centerPosition;
      const maxWidth = (width < 1100
        ? visualRect.width * .96
        : Math.min(width * .92, 1080)) * vortexControls.fieldScale;
      const stageSpan = Math.min(visualRect.height * .98, 580) * 1.2;
      const isDesktopLayout = width >= 768;
      const navHeight = header?.getBoundingClientRect().height || 68;
      const topY = isDesktopLayout
        ? navHeight + 2
        : visualTop + Math.max(18, visualRect.height * .018);
      const stageGap = stageSpan / (LAYERS.length + .25) * vortexControls.stageSpacing;
      const heroBottom = heroRect.bottom - canvasRect.top;
      return {
        centerX,
        maxWidth,
        topY,
        stageGap,
        heroBottom,
        visualLeft,
        visualTop,
        visualWidth: visualRect.width,
        visualHeight: visualRect.height,
        isDesktopLayout
      };
    }

    function pointAtStage(layout, trackId, stagePosition, rotationPhase = null, phaseOverride = null) {
      const finalStage = DATA.length - 1;
      const exitProgress = Math.max(0, stagePosition - finalStage);
      const clampedStage = Math.max(0, Math.min(finalStage, stagePosition));
      const lowerStage = Math.min(DATA.length - 2, Math.floor(clampedStage));
      const stageMix = clampedStage - lowerStage;
      const eased = stageMix * stageMix * (3 - 2 * stageMix);
      const widthRatioAt = stageIndex => {
        if (stageIndex === LAYERS.length) return vortexControls.waistWidth;
        if (stageIndex === LAYERS.length + 1) return vortexControls.firstExpansion;
        if (stageIndex === LAYERS.length + 2) return vortexControls.finalExpansion;
        return DATA[stageIndex].width;
      };
      const widthRatioAtPosition = position => {
        const waistStage = LAYERS.length;
        if (position >= 2 && position <= waistStage) {
          const startWidth = widthRatioAt(2);
          const middleWidth = widthRatioAt(3);
          const waistWidth = vortexControls.waistWidth;
          const middleRatio = Math.max(.001, Math.min(.999,
            (middleWidth - waistWidth) / Math.max(.001, startWidth - waistWidth)
          ));
          const exponent = Math.log(middleRatio) / Math.log(.5);
          const remaining = (waistStage - position) / (waistStage - 2);
          return waistWidth + (startWidth - waistWidth) * remaining ** exponent;
        }
        if (position > waistStage) {
          const waistWidth = vortexControls.waistWidth;
          const firstExpansion = vortexControls.firstExpansion;
          const finalExpansion = vortexControls.finalExpansion;
          const middleRatio = Math.max(.001, Math.min(.999,
            (firstExpansion - waistWidth) / Math.max(.001, finalExpansion - waistWidth)
          ));
          const exponent = Math.log(middleRatio) / Math.log(.5);
          const progress = (position - waistStage) / 2;
          return waistWidth + (finalExpansion - waistWidth) * progress ** exponent;
        }
        return widthRatioAt(lowerStage)
          + (widthRatioAt(lowerStage + 1) - widthRatioAt(lowerStage)) * eased;
      };
      const widthAtPosition = clampedStage < 1 && layout.isDesktopLayout
        ? width + cell * 2 + (
          layout.maxWidth * widthRatioAt(1) - width - cell * 2
        ) * eased
        : layout.maxWidth * widthRatioAtPosition(clampedStage);
      const centerAt = stageIndex => stageIndex === 0 && layout.isDesktopLayout ? width / 2 : layout.centerX;
      const radius = widthAtPosition * .5;
      const localCenter = centerAt(lowerStage) + (centerAt(lowerStage + 1) - centerAt(lowerStage)) * eased;
      const shell = vortexControls.innerShell
        + hash(trackId + 17, 73) * (1 - vortexControls.innerShell);
      const trackPhase = phaseOverride
        ?? trackId / Math.max(1, unitCounts[0]) * Math.PI * 2;
      const direction = vortexControls.direction === 'counterclockwise' ? -1 : 1;
      const rotation = reducedMotion
        ? 0
        : rotationPhase ?? animationTime * vortexControls.rotationSpeed;
      const middleStart = 1.15;
      const middleEnd = LAYERS.length + .15;
      const middleLinear = Math.max(0, Math.min(1,
        (clampedStage - middleStart) / (middleEnd - middleStart)
      ));
      const middleProgress = middleLinear * middleLinear * (3 - 2 * middleLinear);
      const angle = trackPhase + direction * (
        clampedStage * vortexControls.twistPerStage
          + exitProgress * .55
          + middleProgress * vortexControls.middleTwist
          + rotation
      );
      const depth = (Math.sin(angle) + 1) * .5;
      const perspective = 1 - vortexControls.perspective + depth * vortexControls.perspective;
      const orbitHeight = Math.min(radius * vortexControls.orbitHeight, layout.stageGap * .3);
      const radialX = Math.cos(angle) * radius * shell * perspective
        + Math.sin(angle) * radius * shell * vortexControls.cameraYaw;
      const depthY = Math.sin(angle) * orbitHeight * shell
        + (depth - .5) * vortexControls.cameraLift;
      const roll = vortexControls.cameraRoll * Math.PI / 180;
      const rollCosine = Math.cos(roll);
      const rollSine = Math.sin(roll);
      const baseX = localCenter + radialX * rollCosine - depthY * rollSine;
      const baseY = layout.topY + layout.stageGap * clampedStage
        + radialX * rollSine + depthY * rollCosine;
      const exitDistance = exitProgress * Math.max(width * .6, layout.maxWidth * .68);
      const exitRadialX = Math.cos(angle) * exitDistance;
      const exitDepthY = Math.sin(angle) * exitProgress * layout.stageGap * .45;
      return {
        x: baseX + exitRadialX * rollCosine - exitDepthY * rollSine,
        y: baseY + exitRadialX * rollSine + exitDepthY * rollCosine
          + exitProgress * layout.stageGap * .95,
        depth,
        shell,
        angle,
        stagePosition
      };
    }

    function pointOnSegment(layout, trackId, stage, progress) {
      return pointAtStage(layout, trackId, stage + progress);
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
      for (let stage = 0; stage < DATA.length - 1; stage += 1) {
        stageTracks[stage + 1].forEach(trackId => {
          for (let sample = 0; sample < 4; sample += 1) {
            const point = pointOnSegment(layout, trackId, stage, sample / 4);
            points.push({ ...point, alpha: .56 + hash(trackId + 1409, stage * 7 + sample) * .38 });
          }
        });
      }
      return normalizeMorphPoints(points);
    }

    function modeMorphPoints(layout, layerIndex) {
      if (layerIndex === null) return funnelMorphPoints(layout);
      const shape = PIXEL_SHAPES[layerIndex];
      const centerY = layout.visualTop + layout.visualHeight / 2;
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
      if (bounds) drawShapeAmbientRectangles(bounds, state.to, time, opacity);
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

    function drawShapeAmbientRectangles(bounds, layerIndex, time, visibility) {
      const horizontalPadding = Math.max(34, (bounds.maxX - bounds.minX) * .16);
      const verticalPadding = Math.max(28, (bounds.maxY - bounds.minY) * .14);
      ctx.save();
      ctx.fillStyle = LAYER_COLORS[layerIndex];
      for (let index = 0; index < 18; index += 1) {
        const flash = randomGridFlash(time, index, layerIndex * 101 + 1901);
        if (flash.alpha <= 0) continue;
        const seed = index + flash.generation * 37;
        const side = Math.floor(hash(seed + 1913, layerIndex + 1931) * 4);
        const progress = .06 + hash(seed + 1933, layerIndex + 1949) * .88;
        const offset = cell * (1 + Math.floor(hash(seed + 1951, layerIndex + 1973) * 5));
        let x;
        let y;
        if (side === 0 || side === 2) {
          x = bounds.minX + (bounds.maxX - bounds.minX) * progress;
          y = side === 0 ? bounds.minY - verticalPadding - offset : bounds.maxY + verticalPadding + offset;
        } else {
          x = side === 1 ? bounds.maxX + horizontalPadding + offset : bounds.minX - horizontalPadding - offset;
          y = bounds.minY + (bounds.maxY - bounds.minY) * progress;
        }
        ctx.globalAlpha = Math.min(.2, visibility * flash.alpha);
        fillGridBlock(
          Math.round(x / cell) * cell,
          Math.round(y / cell) * cell,
          1,
          1
        );
      }
      ctx.restore();
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
      const rightInset = width < 768 ? 12 : 50;
      const cardWidth = Math.min(273, width - rightInset * 2);
      const cardHeight = 95;
      const rightLimit = width - cardWidth - rightInset;
      const targetX = rightLimit;
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
      ctx.fillStyle = RED_FLOW_COLOR;
      ctx.font = '500 14px "Fellix-TRIAL", "ABC Schengen Greek Variable Trial", Arial, sans-serif';
      ctx.fillText(displayLabel(layer.label), textX, 16);
      ctx.fillStyle = RED_FLOW_COLOR;
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
        cell - 2,
        cell - 2
      );
    }

    function drawLabelIcon(x, y, layerIndex) {
      const iconSize = 18;
      ctx.save();
      ctx.translate(Math.round(x), Math.round(y));
      ctx.scale(iconSize / 24, iconSize / 24);
      ctx.fillStyle = RED_FLOW_COLOR;
      ctx.fill(LABEL_ICON_PATHS[layerIndex]);
      ctx.restore();
    }

    function drawFloatingFormatBadge(layout, time) {
      if (width < 768 || selectedLayer !== null) return;
      const spawnInterval = 1.8;
      const lifetime = 2.4;
      const latestIndex = Math.floor(time / spawnInterval);

      for (let instanceIndex = latestIndex - 1; instanceIndex <= latestIndex; instanceIndex += 1) {
        if (instanceIndex < 0) continue;
        const age = time - instanceIndex * spawnInterval;
        if (age < 0 || age > lifetime) continue;
        const enterOpacity = easeOutCubic(age / .36);
        const exitOpacity = 1 - easeOutCubic((age - (lifetime - .6)) / .6);
        const opacity = enterOpacity * exitOpacity;
        if (opacity <= .001) continue;

        const format = FLOATING_FORMATS[
          Math.floor(hash(instanceIndex * 17 + 2203, 2213) * FLOATING_FORMATS.length)
        ];
        const side = instanceIndex % 2 === 0 ? -1 : 1;
        const motionLinear = Math.min(1, age / lifetime);
        const motionProgress = motionLinear * motionLinear * (3 - 2 * motionLinear);
        const verticalOffset = reducedMotion ? 0 : -10 + motionProgress * 28;
        const waistY = layout.topY + layout.stageGap * LAYERS.length;
        const randomY = (hash(instanceIndex * 23 + 2243, 2251) - .5) * layout.stageGap * .82;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.font = '500 15px "ABC Schengen Greek Variable Trial", Arial, sans-serif';
        ctx.textBaseline = 'middle';
        const textWidth = ctx.measureText(format.label).width;
        const labelWidth = textWidth + 36;
        const labelHeight = 24;
        const waistRadius = layout.maxWidth * vortexControls.waistWidth * .5;
        const laneDistance = 44 + hash(instanceIndex * 29 + 2267, 2273) * 72;
        const unclampedX = side < 0
          ? layout.centerX - waistRadius - laneDistance - labelWidth
          : layout.centerX + waistRadius + laneDistance;
        const labelX = Math.max(
          layout.visualLeft + 12,
          Math.min(width - labelWidth - 272, unclampedX)
        );
        const labelY = waistY + randomY + verticalOffset - labelHeight / 2;

        if (floatingFormatIconContext && format.image.complete && format.image.naturalWidth > 0) {
          floatingFormatIconContext.clearRect(0, 0, 16, 16);
          floatingFormatIconContext.globalCompositeOperation = 'source-over';
          floatingFormatIconContext.drawImage(format.image, 0, 0, 16, 16);
          floatingFormatIconContext.globalCompositeOperation = 'source-in';
          floatingFormatIconContext.fillStyle = primary500;
          floatingFormatIconContext.fillRect(0, 0, 16, 16);
          floatingFormatIconContext.globalCompositeOperation = 'source-over';
          ctx.drawImage(floatingFormatIconCanvas, labelX + 4, labelY + 4, 16, 16);
        }
        ctx.fillStyle = primary500;
        ctx.fillText(format.label, labelX + 27, labelY + labelHeight / 2);
        ctx.restore();
      }
    }

    function fillGridBlock(x, y, columns, rows) {
      ctx.fillRect(
        x + 1,
        y + 1,
        columns * cell - 2,
        rows * cell - 2
      );
    }

    function randomGridFlash(time, index, salt) {
      if (reducedMotion) return { alpha: .12, generation: 0 };
      const visibleDuration = .32 + hash(index + salt, 2081) * .34;
      const hiddenDuration = .72 + hash(index + salt, 2083) * 1.1;
      const cycleDuration = visibleDuration + hiddenDuration;
      const shiftedTime = time + hash(index + salt, 2087) * cycleDuration;
      const generation = Math.floor(shiftedTime / cycleDuration);
      const cycleTime = shiftedTime - generation * cycleDuration;
      const progress = cycleTime / visibleDuration;
      return {
        alpha: progress >= 0 && progress <= 1
          ? Math.sin(progress * Math.PI) ** 2 * .2
          : 0,
        generation,
      };
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
      const start = layout.heroBottom - vortexControls.fadeDistance;
      const end = layout.heroBottom - cell * 2;
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

    function drawHeroCopyAccents(layout, time) {
      ctx.fillStyle = primary500;
      HERO_COPY_ACCENTS.forEach((strength, index) => {
        const flash = randomGridFlash(time, index, 1831);
        if (flash.alpha <= 0) return;
        const seed = index + flash.generation * 41;
        const maxX = Math.max(cell, layout.visualLeft - cell * 2);
        const maxY = Math.max(layout.visualTop, layout.visualTop + layout.visualHeight - cell);
        const x = Math.round((cell + hash(seed + 1889, 1901) * (maxX - cell)) / cell) * cell;
        const y = Math.round((layout.visualTop + hash(seed + 1913, 1931)
          * (maxY - layout.visualTop)) / cell) * cell;
        ctx.globalAlpha = Math.min(.2, flash.alpha * (.65 + strength));
        fillGridBlock(x, y, 1, 1);
      });
      ctx.globalAlpha = 1;
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

    function drawVortexMouth(layout, funnelOpacity) {
      if (!vortexControls.mouthEnabled) return;
      const particleCount = width < 768
        ? Math.round(vortexControls.mouthCount * .46)
        : Math.round(vortexControls.mouthCount);
      const outerRadius = layout.isDesktopLayout ? width * .51 : layout.maxWidth * .47;
      const innerRadius = outerRadius * .16;
      const mouthY = layout.topY + cell * 4;
      const direction = vortexControls.direction === 'counterclockwise' ? -1 : 1;
      const rotation = reducedMotion ? 0 : animationTime * vortexControls.mouthSpeed * direction;
      const centerX = layout.isDesktopLayout ? width / 2 : layout.centerX;
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));

      for (let index = 0; index < particleCount; index += 1) {
        const progress = (index + .5) / particleCount;
        const radius = innerRadius + (outerRadius - innerRadius) * Math.sqrt(progress);
        const angle = index * goldenAngle + direction * radius / outerRadius * 2.3 + rotation;
        const depth = (Math.sin(angle) + 1) * .5;
        const density = (.26 + depth * .62) * vortexControls.mouthDensity;
        if (hash(index + 607, 977) > density) continue;
        const x = centerX + Math.cos(angle) * radius * (.76 + depth * .24);
        const y = mouthY + Math.sin(angle) * radius * .18;
        const reveal = entranceAt(layout, y, index + 1049);
        drawPixel(
          x,
          y,
          (.16 + depth * .52) * reveal * funnelOpacity * vortexControls.overallAlpha,
          primary500
        );
      }
    }

    function layerLabelY(layout, layerIndex) {
      const layerProgress = layerIndex === 0 && layout.isDesktopLayout ? .72 : .5;
      return layout.topY + layout.stageGap * (layerIndex + layerProgress)
        + vortexControls.allLabelsY + vortexControls[LABEL_Y_KEYS[layerIndex]];
    }

    function layerAtPoint(layout, x, y) {
      const isInsidePipeline = x >= layout.visualLeft - cell * 2
        && x <= width - 8;
      if (!isInsidePipeline) return null;

      let nearestLayer = null;
      let nearestDistance = Infinity;
      LAYERS.forEach((_, layerIndex) => {
        const distance = Math.abs(y - layerLabelY(layout, layerIndex));
        if (distance < nearestDistance) {
          nearestLayer = layerIndex;
          nearestDistance = distance;
        }
      });
      return nearestDistance <= vortexControls.hoverHeight * .5 ? nearestLayer : null;
    }

    function drawLayerOutflows(layout, time, funnelOpacity) {
      if (width < 768 || !vortexControls.enabled || vortexControls.count < 1) return;
      const labelWidth = Math.min(230, width - 24);
      const labelX = width - labelWidth - Math.max(20, width * .018);

      LAYERS.forEach((_, layerIndex) => {
        const y = layerLabelY(layout, layerIndex);
        const stagePosition = (y - layout.topY) / layout.stageGap;
        const rightEdge = stageTracks[layerIndex + 1].reduce((edge, trackId) => (
          Math.max(edge, pointAtStage(layout, trackId, stagePosition).x)
        ), layout.centerX);
        const sourceX = Math.min(labelX - cell * 12, rightEdge + cell);
        const endX = labelX - cell * 2.5;
        const visibility = layerCardVisibility(layerIndex, time) * funnelFadeAt(layout, y) * funnelOpacity;

        const direction = vortexControls.direction === 'counterclockwise' ? -1 : 1;
        for (let index = 0; index < Math.round(vortexControls.count); index += 1) {
          const offset = hash(index + layerIndex * 37, 1087);
          const progress = reducedMotion
            ? offset
            : (time * vortexControls.speed * (1 + layerIndex * .04) + offset) % 1;
          const phase = index * 1.73
            + direction * (progress * Math.PI * 2 * vortexControls.turns + layerIndex * .9);
          const spread = cell * (vortexControls.baseSpread + progress * vortexControls.spreadGrowth);
          const x = sourceX + (endX - sourceX) * progress + Math.cos(phase) * spread;
          const particleY = y + Math.sin(phase) * spread * .72;
          const envelope = Math.sin(progress * Math.PI);
          drawPixel(
            x,
            particleY,
            envelope * (.5 + hash(index + 733, layerIndex + 1103) * .5)
              * vortexControls.alpha * visibility,
            primary500
          );
        }
      });
    }

    function drawRedFlowTrails(layout, time, funnelOpacity) {
      if (redFlowStartedAt === null) redFlowStartedAt = time;
      const activeDuration = Math.min(8, Math.max(.6, vortexControls.redFlowDuration));
      const appearanceDelay = Math.min(10, Math.max(0, vortexControls.redFlowDelay));
      const trailDelayAt = (trail, index) => index * vortexControls.redFlowInterval
        + vortexControls[trail.delayKey];
      const finalDelay = Math.max(...RED_FLOW_TRAILS.map(trailDelayAt));
      const loopPause = Math.min(5, Math.max(0, vortexControls.redFlowLoopPause));
      const cycleDuration = appearanceDelay + activeDuration + finalDelay + loopPause;
      const cycleTime = (time - redFlowStartedAt) % cycleDuration;

      RED_FLOW_TRAILS.forEach((trail, index) => {
        const centerAngle = vortexControls.redFlowStartAngle
          + (index - (RED_FLOW_TRAILS.length - 1) / 2) * vortexControls.redFlowAngleSpread;
        const centerPhase = centerAngle * Math.PI / 180;
        const trackId = allTracks.reduce((nearest, candidate) => {
          const candidatePhase = candidate / unitCounts[0] * Math.PI * 2;
          const candidateDistance = Math.abs(Math.atan2(
            Math.sin(candidatePhase - centerPhase),
            Math.cos(candidatePhase - centerPhase)
          ));
          return candidateDistance < nearest.distance
            ? { trackId: candidate, distance: candidateDistance }
            : nearest;
        }, { trackId: 0, distance: Infinity }).trackId;
        const localTime = cycleTime - appearanceDelay - trailDelayAt(trail, index);
        const travelProgress = Math.max(0, localTime / activeDuration) ** 1.35;
        const entryProgress = index / (RED_FLOW_TRAILS.length - 1)
          * vortexControls.redFlowEntrySpread;
        const head = reducedMotion
          ? entryProgress + .36 + index * .08
          : localTime < 0 || localTime > activeDuration
            ? -1
            : entryProgress + travelProgress * (1 + trail.length - entryProgress);
        if (head < 0) return;

        const start = Math.max(entryProgress, head - trail.length);
        const end = Math.min(1.18, head);
        const entryStage = entryProgress * (DATA.length - 1);
        const direction = vortexControls.direction === 'counterclockwise' ? -1 : 1;
        const lineStartedAt = time - Math.max(0, localTime);
        const entryRotation = reducedMotion
          ? 0
          : lineStartedAt * vortexControls.rotationSpeed;
        const entryAngle = Math.PI
          + (vortexControls.redFlowStartAngle - 135) * Math.PI / 180
          + (index - (RED_FLOW_TRAILS.length - 1) / 2)
            * vortexControls.redFlowAngleSpread * Math.PI / 180 * .1;
        const entryPhase = entryAngle - direction * (
          entryStage * vortexControls.twistPerStage + entryRotation
        );
        const sampleCount = Math.max(5, Math.ceil(
          (end - start) * layout.stageGap * (DATA.length - 1) / (cell * .55)
        ));
        for (let sample = 0; sample <= sampleCount; sample += 1) {
          const progress = start + (end - start) * sample / sampleCount;
          const stagePosition = progress * (DATA.length - 1);
          const point = pointAtStage(layout, trackId, stagePosition, null, entryPhase);
          const pathSample = Math.round(stagePosition * layout.stageGap / (cell * .55));
          if (stagePosition - entryStage > .5 && hash(trackId * 97 + pathSample, 293) < .06) continue;
          const depthVisibility = easeOutCubic((point.depth - .48) / .24);
          const entryVisibility = 1 - easeOutCubic((stagePosition - entryStage) / .8);
          const frontVisibility = entryVisibility
            + (1 - entryVisibility) * depthVisibility;
          if (frontVisibility <= .001) continue;
          const spiralRidge = ((Math.sin(
            point.angle * vortexControls.ridgeFrequency + point.stagePosition * .72
          ) + 1) * .5) ** 2;
          const tailFade = easeOutCubic(Math.min(1, sample / Math.max(1, sampleCount * .3)));
          const exitReveal = easeOutCubic(
            (point.stagePosition - (DATA.length - 1)) / .18
          );
          const verticalVisibility = funnelFadeAt(layout, point.y)
            + (1 - funnelFadeAt(layout, point.y)) * exitReveal;
          drawPixel(
            point.x,
            point.y,
            (.56 + point.depth * .3 + spiralRidge * .14)
              * frontVisibility * tailFade * funnelOpacity
              * verticalVisibility * vortexControls.overallAlpha,
            RED_FLOW_COLOR
          );
        }
      });
    }

    function drawDataStream(layout, time, funnelOpacity = 1) {
      const trailAlpha = .48 + (SETTINGS.trailDecay - .75) / .22 * .08;

      ctx.save();
      ctx.font = '600 9px "ABC Schengen Greek Variable Trial", Arial, sans-serif';
      ctx.textBaseline = 'bottom';
      drawVortexMouth(layout, funnelOpacity);

      stageTracks[0].forEach(trackId => {
        const totalStages = DATA.length - 1;
        const sampleCount = Math.max(24, Math.round(layout.stageGap * totalStages / cell));
        const flowOffset = reducedMotion
          ? 0
          : (time * vortexControls.flowSpeed * (
            1 + (hash(trackId + 811, 1129) - .5) * 2 * vortexControls.speedVariation
          )) % 1;
        for (let sample = 0; sample < sampleCount; sample += 1) {
          const gapChance = .035 + hash(trackId + 83, 271) * .065;
          if (hash(trackId * 97 + sample, 293) < gapChance) continue;
          const streamProgress = (sample / sampleCount + flowOffset) % 1;
          const point = pointAtStage(layout, trackId, streamProgress * totalStages);
          const destinationStage = Math.min(DATA.length - 1, Math.floor(point.stagePosition) + 1);
          if (!stageTrackSets[destinationStage].has(trackId)) continue;
          const spiralRidge = ((Math.sin(
            point.angle * vortexControls.ridgeFrequency + point.stagePosition * .72
          ) + 1) * .5) ** 2;
          const middleDistance = (point.stagePosition - 2.75) / 1.45;
          const middleEnvelope = Math.exp(-(middleDistance ** 2));
          const middleRidge = spiralRidge ** 2 * middleEnvelope * vortexControls.middleLayering;
          const surfaceDensity = (.08 + point.depth * vortexControls.depthDensity
            + spiralRidge * vortexControls.ridgeStrength + middleRidge
            + (1 - point.shell) * .04)
            * vortexControls.streamDensity;
          if (hash(trackId * 131 + sample, 337) > surfaceDensity) continue;
          const reveal = entranceAt(layout, point.y, trackId + sample);
          const surfaceAlpha = .48 + point.depth * vortexControls.depthAlpha
            + spiralRidge * .34 + middleRidge * .5;
          const particleAlpha = trailAlpha * (.55 + hash(trackId + 211, sample + 419) * .72);
          drawPixel(
            point.x,
            point.y,
            particleAlpha * surfaceAlpha * reveal * funnelOpacity * funnelFadeAt(layout, point.y)
              * vortexControls.overallAlpha,
            primary500
          );
        }
      });

      drawRedFlowTrails(layout, time, funnelOpacity);
      drawLayerOutflows(layout, time, funnelOpacity);
      drawFloatingFormatBadge(layout, time);

      if (width >= 768) LAYERS.forEach((layer, layerIndex) => {
        const y = layerLabelY(layout, layerIndex);
        const isSelected = selectedLayer === layerIndex;
        const isActive = hoveredLayer === layerIndex || isSelected;
        const labelWidth = Math.min(230, width - 24);
        const labelX = width - labelWidth - Math.max(20, width * .018);
        const labelReveal = entranceAt(layout, y, layerIndex + 701);
        const cardVisibility = layerCardVisibility(layerIndex, time);
        const layerFade = funnelFadeAt(layout, y);
        const labelOffsetX = (1 - cardVisibility) * cell * 1.8;

        const markerX = labelX + labelOffsetX;
        ctx.globalAlpha = (isSelected ? 1 : isActive ? .9 : .74) * labelReveal * cardVisibility * layerFade;
        drawLabelIcon(markerX - 28, y - 10, layerIndex);

        const titleX = markerX;
        ctx.textBaseline = 'alphabetic';
        ctx.globalAlpha = (isActive ? 1 : .88) * labelReveal * cardVisibility * layerFade;
        ctx.fillStyle = isSelected ? primary500 : heroLabelTitleColor;
        ctx.font = '500 13px "ABC Schengen Greek Variable Trial", Arial, sans-serif';
        ctx.fillText(layer.label, titleX, y + 5);
        ctx.globalAlpha = (isActive ? .76 : .68) * labelReveal * cardVisibility * layerFade;
        ctx.fillStyle = heroLabelSubtitleColor;
        ctx.font = '400 13px "ABC Schengen Greek Variable Trial", Arial, sans-serif';
        ctx.fillText(layer.detail, markerX - 28, y + 31);
      });
      drawShapeAnnotation(layout, time);
      ctx.restore();
    }

    function drawGridFlowPass(layout, time, layerIndex, started) {
      if (layerIndex === null) return false;
      const centerY = layerLabelY(layout, layerIndex);
      const top = centerY - vortexControls.hoverHeight * .5;
      const bottom = centerY + vortexControls.hoverHeight * .5;
      const firstRow = Math.ceil(top / cell);
      const lastRow = Math.floor(bottom / cell);
      const centerColumn = layout.centerX / cell;
      const maxColumnDistance = Math.max(centerColumn, cols - centerColumn);
      const age = time - started;
      const duration = 1.85;

      if (reducedMotion && hoveredLayer === null) return false;
      if (!reducedMotion && (age < 0 || age > duration)) return false;
      ctx.fillStyle = primary500;

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
      const layerIndex = layerAtPoint(layout, x, y);
      const visibleLayer = selectedLayer === null || selectedLayer === layerIndex;
      const nextHoveredLayer = layerIndex !== null && visibleLayer ? layerIndex : null;
      if (nextHoveredLayer !== null && nextHoveredLayer !== hoveredLayer) {
        hoverFlowLayer = nextHoveredLayer;
        hoverFlowStarted = animationTime;
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
      if (!reducedMotion) animationTime += delta;
      const time = animationTime;
      const layout = buildLayout();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = SETTINGS.paperColor;
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      drawGrid();
      drawHeroCopyAccents(layout, animationTime);
      drawSelectedPointerField(time, delta);
      drawScanTrail();
      drawHoverGridFlow(layout, time);
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
      const clickedLayer = layerAtPoint(layout, localX, localY);
      if (clickedLayer !== null) {
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

    function formatBaseColor() {
      const color = getComputedStyle(document.documentElement).getPropertyValue('--mineral-green-500').trim();
      return /^#[0-9a-f]{6}$/i.test(color) ? color : '#19A88B';
    }

    function formatBaseColorWithAlpha(alpha) {
      return colorWithAlpha(formatBaseColor(), alpha);
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
      context.shadowColor = formatBaseColorWithAlpha(0.55);
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
        context.strokeStyle = formatBaseColorWithAlpha((0.12 + strength * 0.88) * opacity);
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
          context.strokeStyle = formatBaseColorWithAlpha(0.78);
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
            ? formatBaseColorWithAlpha(0.18 + colorStrength * 0.78)
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
        const isColored = particle.index === 0 || particle.index === 5;
        context.beginPath();
        context.arc(particle.x, particle.y, isHovered ? 4.8 : particle.radius, 0, Math.PI * 2);
        context.fillStyle = isHovered || isColored
          ? colorWithAlpha(formatBaseColor(), (0.62 + (particle.z + 1) * 0.16) * particle.introAlpha)
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
        const labelColor = formatBaseColor();
        context.fillStyle = labelColor;
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
        context.strokeStyle = labelColor;
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
        stage.dataset.activeFormatColor = formatBaseColor();
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
