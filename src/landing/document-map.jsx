import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import revenueChart from '../../assets/source-chart.png'
import marginAnalysis from '../../assets/source-margin.png'
import revenueAnalysis from '../../assets/source-revenue.png'
import revenueTable from '../../assets/source-table.png'
import { TextReveal } from '@/registry/magicui/text-reveal'

const MOBILE_PRODUCT_QUERY = '(max-width: 767px)'
const DESKTOP_PRODUCT_QUERY = '(min-width: 1200px)'
const PRODUCT_STICKY_TOP = 68
const PRODUCT_STAGE_COUNT = 5
const PRODUCT_STAGE_SCROLL_VH = 60
const DOCUMENT_OUTLINE_END_PROGRESS = 0.14
const DOCUMENT_EXTRACTION_START_PROGRESS = 0.08
const DOCUMENT_EXTRACTION_END_PROGRESS = 0.20
const DOCUMENT_SOURCES_START_PROGRESS = 0.18
const DOCUMENT_SOURCES_END_PROGRESS = 0.34
const CONNECTION_LINE_EXTENSION = 24
const SOURCE_REVEAL_CAMERA_SHIFT = 560
const HIERARCHY_REVEAL_CAMERA_SHIFT = 860
const SUMMARY_REVEAL_CAMERA_SHIFT = HIERARCHY_REVEAL_CAMERA_SHIFT + 80
const DOCUMENT_HIERARCHY_END_PROGRESS = 0.72

const themes = [
  {
    id: 'growth',
    label: 'Q4 performance summary',
    documents: [
      {
        name: 'Q4 Market Update.pdf',
        sections: [
          {
            name: 'Revenue and operating performance',
            pages: [
              { number: '06', image: revenueTable },
              { number: '08', image: revenueChart },
            ],
          },
          {
            name: 'Margin development',
            pages: [
              { number: '09', image: marginAnalysis },
              { number: '10', image: revenueAnalysis },
            ],
          },
        ],
      },
      {
        name: 'Financial Summary.pdf',
        sections: [
          {
            name: 'Operating outlook',
            pages: [
              { number: '12', image: revenueChart },
              { number: '14', image: marginAnalysis },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'regional',
    label: 'Regional performance',
    documents: [
      {
        name: 'Regional review.pdf',
        sections: [
          {
            name: 'Revenue by market',
            pages: [
              { number: '04', image: revenueTable },
              { number: '05', image: revenueChart },
              { number: '07', image: revenueAnalysis },
            ],
          },
        ],
      },
      {
        name: 'EMEA forecast.xlsx',
        sections: [
          {
            name: 'EMEA forecast',
            pages: [
              { number: '02', image: revenueTable },
              { number: '03', image: marginAnalysis },
            ],
          },
        ],
      },
      {
        name: 'APAC briefing.pptx',
        sections: [
          {
            name: 'APAC momentum',
            pages: [
              { number: '11', image: revenueChart },
              { number: '13', image: revenueAnalysis },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'efficiency',
    label: 'Operating efficiency',
    documents: [
      {
        name: 'Operating model.pdf',
        sections: [
          {
            name: 'Margin and cost efficiency',
            pages: [
              { number: '08', image: marginAnalysis },
              { number: '09', image: revenueAnalysis },
              { number: '12', image: revenueChart },
            ],
          },
          {
            name: 'Regional contribution',
            pages: [
              { number: '15', image: revenueTable },
              { number: '16', image: revenueChart },
            ],
          },
        ],
      },
    ],
  },
]

const performanceCopy = [
  'Global enterprise software revenue increased 18.4% year over year in Q4 2025 to $4.8B, driven by continued demand for cloud, security, and data platforms. Subscription and support revenue represented 77% of total revenue, up from 74% in Q4 2024, reflecting the ongoing shift to recurring, high-margin business models.',
  'Operating income grew 21.7% year over year to $1.1B, resulting in an operating margin of 22.9%, compared with 21.3% in the prior year. Margin expansion was supported by disciplined cost management and improved efficiency in sales and customer success operations.',
]

const themeSourcesMap = {
  growth: [
    {
      id: 'src-growth-1',
      format: 'PDF',
      page: 'PAGE 06 & 08',
      type: 'table',
      title: 'Revenue by region',
      widths: [26, 23, 29, 22],
      columns: ['Region', 'Metric', 'Result', 'Signal'],
      rows: [
        ['North America', 'Revenue', 'Largest contributor', 'Positive'],
        ['Europe', 'YoY growth', '+19.4%', 'Positive'],
        ['APAC', 'YoY growth', '+21.6%', 'Fastest growth'],
      ],
      image: revenueTable,
      alt: 'Revenue by region table',
    },
    {
      id: 'src-growth-2',
      format: 'PDF',
      page: 'PAGE 09 & 10',
      type: 'document',
      kicker: 'Operating review · PAGE 09 & 10',
      title: 'Operating margin expansion',
      copy: 'Operating income grew 21.7% year over year to $1.1B.',
      note: 'Operating margin reached 22.9%, up from 21.3% a year earlier.',
      image: marginAnalysis,
      alt: 'Operating margin review',
    },
    {
      id: 'src-growth-3',
      format: 'PDF',
      page: 'PAGE 12 & 14',
      type: 'line',
      title: 'Six-month active-seat utilization',
      chart: 'usage',
      image: revenueChart,
      alt: 'Financial summary source chart excerpt',
    },
  ],
  regional: [
    {
      id: 'src-reg-1',
      format: 'PDF',
      page: 'PAGE 04, 05, 07',
      type: 'table',
      title: 'Rollout tracker · 14 / 17 on plan',
      widths: [30, 24, 24, 22],
      columns: ['Workstream', 'Owner', 'Status', 'Due'],
      rows: [
        ['Identity map', 'Eng', 'At risk', '25 Jul'],
        ['Legal review', 'Legal', 'Blocked', '31 Jul'],
        ['User testing', 'Ops', 'On plan', '08 Aug'],
      ],
      image: revenueTable,
      alt: 'Regional review source table',
    },
    {
      id: 'src-reg-2',
      format: 'XLSX',
      page: 'PAGE 02 & 03',
      type: 'document',
      kicker: 'Implementation SOW · §4.1',
      title: 'Delivery milestones',
      copy: 'Production launch is scheduled for 18 August after configuration review and migration validation.',
      note: 'Both acceptance gates require written customer approval.',
      image: marginAnalysis,
      alt: 'EMEA forecast sheet',
    },
    {
      id: 'src-reg-3',
      format: 'PPTX',
      page: 'PAGE 11 & 13',
      type: 'line',
      title: 'Forecast migration volume',
      chart: 'migration',
      image: revenueChart,
      alt: 'APAC briefing slide',
    },
  ],
  efficiency: [
    {
      id: 'src-eff-1',
      format: 'PDF',
      page: 'PAGE 08, 09, 12',
      type: 'document',
      kicker: 'Security architecture standard · §3',
      title: 'Encryption baseline',
      copy: 'Production data is encrypted with AES-256 at rest and TLS 1.3 for service-to-service traffic.',
      note: 'Keys are isolated by environment and rotated every 90 days.',
      image: marginAnalysis,
      alt: 'Operating model breakdown',
    },
    {
      id: 'src-eff-2',
      format: 'PDF',
      page: 'PAGE 15 & 16',
      type: 'table',
      title: 'Data residency control matrix',
      widths: [34, 33, 33],
      columns: ['Data class', 'Primary', 'Backup'],
      rows: [
        ['EU customer', 'Frankfurt', 'Dublin'],
        ['US customer', 'Virginia', 'Oregon'],
        ['EU audit logs', 'Frankfurt', 'Dublin'],
      ],
      image: revenueTable,
      alt: 'Regional contribution table',
    },
  ],
}

const themeSummaries = {
  growth: {
    topic: 'Q4 performance brief',
    hierarchy: [
      { source: 'Q4 Market Update.pdf', location: 'Revenue by region', type: 'doc', isActive: true },
      { source: 'Q4 Market Update.pdf', location: 'Operating margin', type: 'table', isActive: false },
      { source: 'Financial Summary.pdf', location: 'Seat utilization trend', type: 'chart', isActive: false },
    ],
  },
  regional: {
    topic: 'Implementation readiness',
    hierarchy: [
      { source: 'Implementation SOW.docx', location: '4.1 and 7', type: 'doc', isActive: true },
      { source: 'Rollout tracker.xlsx', location: 'Readiness', type: 'table', isActive: false },
      { source: 'Migration forecast.csv', location: 'Daily volume', type: 'chart', isActive: false },
    ],
  },
  efficiency: {
    topic: 'Evidence and open controls',
    hierarchy: [
      { source: 'Security architecture.pdf', location: 'Chapter 3', type: 'doc', isActive: true },
      { source: 'Residency matrix.xlsx', location: 'Regions', type: 'table', isActive: false },
      { source: 'SOC 2 Type II.pdf', location: 'Findings', type: 'chart', isActive: false },
    ],
  },
}

function clamp(val, min = 0, max = 1) {
  return Math.max(min, Math.min(max, val))
}

function TracePixelReveal({ active, delay = 0, duration = 800 }) {
  const canvasRef = useRef(null)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return undefined

    const context = canvas.getContext('2d')
    if (!context) return undefined

    let animationFrame = 0
    const clear = () => {
      window.cancelAnimationFrame(animationFrame)
      context.clearRect(0, 0, canvas.width, canvas.height)
    }

    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      host.style.removeProperty('--trace-content-clip')
      canvas.dataset.pixelState = 'idle'
      clear()
      return clear
    }

    const rect = canvas.getBoundingClientRect()
    const width = Math.max(1, Math.round(rect.width))
    const height = Math.max(1, Math.round(rect.height))
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    context.setTransform(dpr, 0, 0, dpr, 0, 0)

    const colors = ['#E1F4EF', '#19A88B', '#0A6351']
    const gap = 6
    const pixels = []
    let colorIndex = 0
    for (let x = gap / 2; x < width; x += gap) {
      for (let y = gap / 2; y < height; y += gap) {
        pixels.push({
          x,
          y,
          color: colors[colorIndex++ % colors.length],
          maxSize: .65 + Math.random() * 2.05,
          phase: Math.random() * Math.PI * 2,
          noise: Math.random(),
          settleDelay: (Math.random() - .35) * 50,
        })
      }
    }

    host.style.setProperty('--trace-content-clip', 'inset(0 0 100% 0)')
    canvas.dataset.pixelState = 'running'
    const startedAt = performance.now() + delay

    const renderPixels = now => {
      const elapsed = now - startedAt
      context.clearRect(0, 0, width, height)
      if (elapsed < 0) {
        animationFrame = window.requestAnimationFrame(renderPixels)
        return
      }

      const travel = Math.min(1, elapsed / duration)
      const eased = travel < .5
        ? 2 * travel * travel
        : 1 - Math.pow(-2 * travel + 2, 2) / 2
      const headY = -18 + eased * (height + 50)
      const trailWidth = Math.min(118, height * .55)
      const revealed = Math.max(0, Math.min(1, (headY - 6) / height))
      host.style.setProperty('--trace-content-clip', `inset(0 0 ${(1 - revealed) * 100}% 0)`)

      const fade = elapsed < duration ? 1 : Math.max(0, 1 - (elapsed - duration) / 78)
      pixels.forEach(pixel => {
        const distance = headY - pixel.y
        if (distance < -24 || distance > trailWidth) return
        const leading = distance < 0 ? (distance + 24) / 24 : 1
        const trailing = distance <= 0 ? 1 : 1 - distance / trailWidth
        const envelope = Math.max(0, leading * Math.pow(trailing, .72))
        if (pixel.noise > Math.min(1, envelope * 1.42)) return
        const shimmer = .72 + Math.sin(elapsed * .036 + pixel.phase) * .28
        const size = pixel.maxSize * (.65 + envelope * .7) * shimmer
        context.globalAlpha = fade * (.4 + envelope * .6)
        context.fillStyle = pixel.color
        context.fillRect(pixel.x - size / 2, pixel.y - size / 2, size, size)
      })
      context.globalAlpha = 1

      if (elapsed < duration + 78) {
        animationFrame = window.requestAnimationFrame(renderPixels)
      } else {
        host.style.removeProperty('--trace-content-clip')
        context.clearRect(0, 0, width, height)
        canvas.dataset.pixelState = 'complete'
      }
    }

    animationFrame = window.requestAnimationFrame(renderPixels)
    return () => {
      clear()
      host.style.removeProperty('--trace-content-clip')
    }
  }, [active, delay, duration])

  return <canvas className="trace-pixel-reveal" data-pixel-state="idle" ref={canvasRef} aria-hidden="true" />
}

function getPageMedia(page, showExpandedMedia = false) {
  if (page.image === revenueTable) {
    return {
      alt: 'Regional revenue table',
      caption: showExpandedMedia
        ? 'Q4 2025 revenue increased across all regions.'
        : 'Q4 2025 revenue increases across all regions, led by APAC (+21.6%) and Europe (+19.4%).',
    }
  }

  if (page.image === revenueChart) {
    return {
      alt: 'Revenue trend and operating income charts',
      caption: 'Revenue trend shows consistent quarter-over-quarter growth.',
    }
  }

  if (showExpandedMedia && page.image === marginAnalysis) {
    return {
      alt: 'Operating margin analysis',
      caption: 'Margin expansion was supported by disciplined cost management.',
    }
  }

  if (showExpandedMedia && page.image === revenueAnalysis) {
    return {
      alt: 'Revenue and operating income analysis',
      caption: 'Operating income grew 21.7% year over year to $1.1B.',
    }
  }

  return null
}

function SectionPageContent({ page, showExpandedMedia = false }) {
  const media = getPageMedia(page, showExpandedMedia)

  if (!media) {
    return <p className="section-source-line"><span className="section-page-reference">PAGE {page.number}</span></p>
  }

  return (
    <figure className="section-page">
      <img src={page.image} alt={media.alt} />
      <figcaption><span>PAGE {page.number}</span>{media.caption}</figcaption>
    </figure>
  )
}

function useProductLayoutQuery(query) {
  const [matches, setMatches] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia(query).matches
  ))

  useEffect(() => {
    const media = window.matchMedia(query)
    const sync = () => setMatches(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [query])

  return matches
}

function useMobileProductLayout() {
  return useProductLayoutQuery(MOBILE_PRODUCT_QUERY)
}

function MapFlowSvg({ className, viewBox, path, dots = [], clipProgress = 1, direction = 'vertical' }) {
  const clipStyle = clipProgress < 1
    ? (direction === 'horizontal'
      ? { clipPath: `inset(0 ${(1 - clipProgress) * 100}% 0 0)` }
      : { clipPath: `inset(0 0 ${(1 - clipProgress) * 100}% 0)` })
    : undefined

  return (
    <svg className={className} viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true" style={clipStyle}>
      <path className="map-flow-stroke" d={path} />
      {dots.map(([x, y]) => (
        <circle
          className="map-flow-dot"
          cx={x}
          cy={y}
          r="2"
          key={`${x}-${y}`}
          style={{ opacity: clipProgress >= 0.85 ? 1 : 0 }}
        />
      ))}
    </svg>
  )
}

function DocumentBranchLine({ sectionCount, clipProgress = 1 }) {
  const forked = sectionCount >= 2
  const height = 37 + CONNECTION_LINE_EXTENSION
  const stem = (
    <MapFlowSvg
      className="document-branch-line-svg is-stem"
      viewBox={`0 0 10 ${height}`}
      path={`M5 0 V${height}`}
      dots={[[5, height]]}
      clipProgress={clipProgress}
    />
  )

  if (!forked) {
    return <div className="document-branch-line" aria-hidden="true">{stem}</div>
  }

  const card = 380.62
  const gap = 33
  const width = card * 2 + gap
  const left = card / 2
  const right = card + gap + card / 2
  const mid = width / 2
  const forkY = 16

  return (
    <div className="document-branch-line is-fork" aria-hidden="true">
      <MapFlowSvg
        className="document-branch-line-svg is-fork-path"
        viewBox={`0 0 ${width} ${height}`}
        path={`M${mid} 0 V${forkY} M${left} ${forkY} H${right} M${left} ${forkY} V${height} M${right} ${forkY} V${height}`}
        dots={[[left, height], [right, height]]}
        clipProgress={clipProgress}
      />
      {stem}
    </div>
  )
}

function SectionToSourceLines({
  clipProgress = 1,
  opacity = 1,
  sourceCount = 3,
  documentCount = 2,
  className = '',
  mobileReveal = false,
  revealKey,
}) {
  const height = 32 + CONNECTION_LINE_EXTENSION
  const rootRef = useRef(null)
  const rootClassName = `stage-flow-row is-section-to-source${className ? ` ${className}` : ''}`

  useEffect(() => {
    if (!mobileReveal || !rootRef.current) return undefined
    const line = rootRef.current
    line.classList.remove('is-visible')

    if (
      typeof IntersectionObserver === 'undefined'
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      line.classList.add('is-visible')
      return undefined
    }

    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      line.classList.add('is-visible')
      observer.disconnect()
    }, { threshold: 0.8 })

    observer.observe(line)
    return () => observer.disconnect()
  }, [mobileReveal, revealKey])

  if (sourceCount === 2) {
    return (
      <div
        ref={rootRef}
        className={rootClassName}
        aria-hidden="true"
        style={{ opacity }}
      >
        <div className="flow-line-slot" style={{ width: 381 }}>
          <MapFlowSvg
            className="stage-flow-line-svg"
            viewBox={`0 0 10 ${height}`}
            path={`M5 0 V${height}`}
            dots={[[5, 0], [5, height]]}
            clipProgress={clipProgress}
          />
        </div>
        <div className="flow-line-gap" style={{ width: 33 }} />
        <div className="flow-line-slot" style={{ width: 381 }}>
          <MapFlowSvg
            className="stage-flow-line-svg"
            viewBox={`0 0 10 ${height}`}
            path={`M5 0 V${height}`}
            dots={[[5, 0], [5, height]]}
            clipProgress={clipProgress}
          />
        </div>
      </div>
    )
  }

  const gapBetweenDocs = documentCount === 3 ? 33 : 101

  return (
    <div
      ref={rootRef}
      className={rootClassName}
      aria-hidden="true"
      style={{ opacity }}
    >
      <div className="flow-line-slot" style={{ width: 381 }}>
        <MapFlowSvg
          className="stage-flow-line-svg"
          viewBox={`0 0 10 ${height}`}
          path={`M5 0 V${height}`}
          dots={[[5, 0], [5, height]]}
          clipProgress={clipProgress}
        />
      </div>
      <div className="flow-line-gap" style={{ width: 33 }} />
      <div className="flow-line-slot" style={{ width: 381 }}>
        <MapFlowSvg
          className="stage-flow-line-svg"
          viewBox={`0 0 10 ${height}`}
          path={`M5 0 V${height}`}
          dots={[[5, 0], [5, height]]}
          clipProgress={clipProgress}
        />
      </div>
      <div className="flow-line-gap" style={{ width: gapBetweenDocs }} />
      <div className="flow-line-slot" style={{ width: 381 }}>
        <MapFlowSvg
          className="stage-flow-line-svg"
          viewBox={`0 0 10 ${height}`}
          path={`M5 0 V${height}`}
          dots={[[5, 0], [5, height]]}
          clipProgress={clipProgress}
        />
      </div>
    </div>
  )
}

function ConvergenceLine({ clipProgress = 1, sourceCount = 3, documentCount = 2 }) {
  const height = 40 + CONNECTION_LINE_EXTENSION
  const width = sourceCount === 2 ? 795 : (documentCount === 3 ? 1209 : 1277)
  const midY = 18
  const cx1 = 190.5
  const cx2 = 604.5
  const cx3 = documentCount === 3 ? 1018.5 : 1086.5
  const centerTarget = width / 2

  const path = sourceCount === 2
    ? `M${cx1} 0 V${midY} H${cx2} M${cx2} 0 V${midY} M${(cx1 + cx2) / 2} ${midY} V${height}`
    : `M${cx1} 0 V${midY} H${cx3} M${cx2} 0 V${midY} M${cx3} 0 V${midY} M${centerTarget} ${midY} V${height}`

  const dots = sourceCount === 2
    ? [[cx1, 0], [cx2, 0], [(cx1 + cx2) / 2, height]]
    : [[cx1, 0], [cx2, 0], [cx3, 0], [centerTarget, height]]

  return (
    <div className="stage-convergence-row" aria-hidden="true">
      <MapFlowSvg
        className="stage-convergence-line-svg"
        viewBox={`0 0 ${width} ${height}`}
        path={path}
        dots={dots}
        clipProgress={clipProgress}
      />
    </div>
  )
}

function SourcePreviewContent({ source }) {
  if (source.type === 'table') {
    return (
      <>
        <p className="trace-source-table-title">{source.title}</p>
        <table className="trace-source-mini-table">
          <colgroup>
            {source.widths.map((w, idx) => (
              <col key={idx} style={{ width: `${w}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {source.columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {source.rows.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((val, cIdx) => (
                  <td key={cIdx}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )
  }

  if (source.type === 'line') {
    if (source.chart === 'migration') {
      return (
        <>
          <p className="trace-source-chart-title">{source.title}</p>
          <div className="trace-source-chart">
            <svg viewBox="0 0 300 105" role="img" aria-label="Migration volume peaks at 310 thousand records per day">
              <g className="trace-source-chart-grid">
                <line x1="36" y1="14" x2="294" y2="14" />
                <line x1="36" y1="50" x2="294" y2="50" />
                <line x1="36" y1="86" x2="294" y2="86" />
              </g>
              <g className="trace-source-chart-axis">
                <text x="0" y="18">300k</text>
                <text x="0" y="54">200k</text>
                <text x="0" y="90">100k</text>
                <text x="36" y="103">11 Aug</text>
                <text x="164" y="103" textAnchor="middle">14 Aug</text>
                <text x="294" y="103" textAnchor="end">16 Aug</text>
              </g>
              <path className="trace-source-chart-area" d="M40 90 L90 72 L140 44 L190 14 L240 22 L290 58 L290 90 L40 90 Z" />
              <polyline className="trace-source-chart-line" points="40,90 90,72 140,44 190,14 240,22 290,58" />
              <g>
                <circle className="trace-source-chart-point" cx="40" cy="90" r="3" />
                <circle className="trace-source-chart-point" cx="90" cy="72" r="3" />
                <circle className="trace-source-chart-point" cx="140" cy="44" r="3" />
                <circle className="trace-source-chart-point" cx="190" cy="14" r="3" />
                <circle className="trace-source-chart-point" cx="240" cy="22" r="3" />
                <circle className="trace-source-chart-point" cx="290" cy="58" r="3" />
              </g>
              <text className="trace-source-chart-end" x="198" y="13">310k</text>
            </svg>
          </div>
        </>
      )
    }

    return (
      <>
        <p className="trace-source-chart-title">{source.title}</p>
        <div className="trace-source-chart">
          <svg viewBox="0 0 300 105" role="img" aria-label="Active-seat utilization averages 78 percent over six months">
            <g className="trace-source-chart-grid">
              <line x1="32" y1="14" x2="294" y2="14" />
              <line x1="32" y1="50" x2="294" y2="50" />
              <line x1="32" y1="86" x2="294" y2="86" />
            </g>
            <g className="trace-source-chart-axis">
              <text x="0" y="18">80%</text>
              <text x="0" y="54">75%</text>
              <text x="0" y="90">70%</text>
              <text x="32" y="103">Jan</text>
              <text x="163" y="103" textAnchor="middle">Apr</text>
              <text x="294" y="103" textAnchor="end">Jun</text>
            </g>
            <path className="trace-source-chart-area" d="M36 72 L87 61 L138 50 L189 43 L240 29 L290 36 L290 86 L36 86 Z" />
            <polyline className="trace-source-chart-line" points="36,72 87,61 138,50 189,43 240,29 290,36" />
            <g>
              <circle className="trace-source-chart-point" cx="36" cy="72" r="3" />
              <circle className="trace-source-chart-point" cx="87" cy="61" r="3" />
              <circle className="trace-source-chart-point" cx="138" cy="50" r="3" />
              <circle className="trace-source-chart-point" cx="189" cy="43" r="3" />
              <circle className="trace-source-chart-point" cx="240" cy="29" r="3" />
              <circle className="trace-source-chart-point" cx="290" cy="36" r="3" />
            </g>
            <text className="trace-source-chart-end" x="256" y="29">78%</text>
          </svg>
        </div>
      </>
    )
  }

  return (
    <article className="trace-source-document">
      <p className="trace-source-document-kicker">{source.kicker}</p>
      <strong className="trace-source-document-title">{source.title}</strong>
      <p className="trace-source-passage">{source.copy}</p>
      <p className="trace-source-document-note">{source.note}</p>
    </article>
  )
}

function CrossDocumentHierarchyCard({ activeThemeId, opacity = 1, translateY = 0, motionActive = false }) {
  const summary = themeSummaries[activeThemeId] ?? themeSummaries.growth
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <aside
      className="trace-summary-card"
      data-trace-summary-card
      data-motion-active={motionActive ? 'true' : undefined}
      aria-label="Source-backed context for the selected source"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: reducedMotion ? 'none' : 'opacity 0.15s ease-out, transform 0.15s ease-out',
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      }}
    >
      <div className="trace-card-content">
        <span className="trace-summary-label">Source-backed context</span>
        <div className="trace-hierarchy" data-trace-summary>
          <div className="trace-hierarchy-topic" data-trace-hierarchy-topic>{summary.topic}</div>
          <ul className="trace-hierarchy-list">
            {summary.hierarchy.map((item, index) => (
              <li
                className={`trace-hierarchy-node${item.isActive ? ' is-active' : ''}`}
                data-trace-hierarchy-index={index}
                key={index}
              >
                {item.type === 'table' ? (
                  <svg className="trace-hierarchy-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M2.85858 2.87732L15.4293 1.0815C15.7027 1.04245 15.9559 1.2324 15.995 1.50577C15.9983 1.52919 16 1.55282 16 1.57648V22.4235C16 22.6996 15.7761 22.9235 15.5 22.9235C15.4763 22.9235 15.4527 22.9218 15.4293 22.9184L2.85858 21.1226C2.36593 21.0522 2 20.6303 2 20.1327V3.86727C2 3.36962 2.36593 2.9477 2.85858 2.87732ZM4 4.73457V19.2654L14 20.694V3.30599L4 4.73457ZM17 19H20V4.99997H17V2.99997H21C21.5523 2.99997 22 3.44769 22 3.99997V20C22 20.5523 21.5523 21 21 21H17V19ZM10.2 12L13 16H10.6L9 13.7143L7.39999 16H5L7.8 12L5 7.99997H7.39999L9 10.2857L10.6 7.99997H13L10.2 12Z" />
                  </svg>
                ) : item.type === 'chart' ? (
                  <svg className="trace-hierarchy-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M13 21V23H11V21H3C2.44772 21 2 20.5523 2 20V6H22V20C22 20.5523 21.5523 21 21 21H13ZM4 19H20V8H4V19ZM13 10H18V12H13V10ZM13 14H18V16H13V14ZM9 10V13H12C12 14.6569 10.6569 16 9 16C7.34315 16 6 14.6569 6 13C6 11.3431 7.34315 10 9 10ZM2 3H22V5H2V3Z" />
                  </svg>
                ) : (
                  <svg className="trace-hierarchy-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M21 8V20.9932C21 21.5501 20.5552 22 20.0066 22H3.9934C3.44495 22 3 21.556 3 21.0082V2.9918C3 2.45531 3.4487 2 4.00221 2H14.9968L21 8ZM19 9H14V4H5V20H19V9ZM8 7H11V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z" />
                  </svg>
                )}
                <span className="trace-hierarchy-content">
                  <span data-trace-hierarchy-label>{item.source}</span>
                  <span className="trace-hierarchy-detail" data-trace-hierarchy-detail>{item.location}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <TracePixelReveal active={motionActive} delay={400} />
    </aside>
  )
}

const AI_OUTPUT_TEXT = `Enterprise software revenue reached $4.8B in Q4 2025, up 18.4% year over year. Growth was broad-based, led by APAC at 21.6% and Europe at 19.4%, while North America remained the largest contributor. Operating income rose to $1.1B and operating margin improved to 22.9%. Active-seat utilization averaged 78% over the past six months, supporting a positive outlook.`

const AI_OUTPUT_HIGHLIGHTS = [
  { startWord: 5, endWord: 10 },
  { startWord: 19, endWord: 25 },
  { startWord: 37, endWord: 37 },
  { startWord: 43, endWord: 43 },
  { startWord: 47, endWord: 47 },
]

function AIOutputReport({
  documentCount = 0,
  opacity = 1,
  translateY = 0,
  motionActive = false,
  inkProgress = 1,
  sourceCount = 0,
}) {
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const documentLabel = `${documentCount} document${documentCount === 1 ? '' : 's'}`
  const sourceLabel = `${sourceCount} source region${sourceCount === 1 ? '' : 's'}`

  return (
    <section
      className="ai-output-report"
      data-ai-summary-document
      data-motion-active={motionActive ? 'true' : undefined}
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: reducedMotion ? 'none' : 'opacity 0.15s ease-out, transform 0.15s ease-out',
      }}
    >
      <TextReveal
        className="ai-output-text-reveal"
        highlights={AI_OUTPUT_HIGHLIGHTS}
        progress={inkProgress}
      >
        {AI_OUTPUT_TEXT}
      </TextReveal>
      <div className="ai-output-attribution">
        <p className="ai-output-attribution-title">AI-generated brief</p>
        <p>Synthesized from {sourceLabel} across {documentLabel}</p>
      </div>
    </section>
  )
}

function DocumentMap({
  activeThemeId,
  onOpenTrace,
  inactive = false,
  scrollProgress = 1,
}) {
  const isMobile = useMobileProductLayout()
  const isDesktop = useProductLayoutQuery(DESKTOP_PRODUCT_QUERY)
  const interactive = typeof onOpenTrace === 'function'
  const [selectedName, setSelectedName] = useState(null)
  const [mobileSequenceIndex, setMobileSequenceIndex] = useState(0)
  const openTimer = useRef(0)
  const mobileMapRef = useRef(null)
  const mobileSequenceIndexRef = useRef(0)
  const activeTheme = themes.find(theme => theme.id === activeThemeId) ?? themes[0]
  const currentSources = themeSourcesMap[activeTheme.id] ?? themeSourcesMap.growth
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const showCrossDocumentLink = activeTheme.documents.length === 2
    && activeTheme.documents[0].sections.length >= 2
  const mobileSequenceItemCount = activeTheme.documents.length + currentSources.length + 1
  const mobileSequenceEnabled = isMobile && !reducedMotion && mobileSequenceItemCount > 1

  useEffect(() => () => window.clearTimeout(openTimer.current), [])

  useEffect(() => {
    window.clearTimeout(openTimer.current)
    setSelectedName(null)
    mobileSequenceIndexRef.current = 0
    setMobileSequenceIndex(0)
  }, [activeThemeId])

  useEffect(() => {
    const root = mobileMapRef.current
    const stage = root?.querySelector('.mobile-narrative-stage')
    if (!root || !stage || !mobileSequenceEnabled) return undefined

    let animationTimer = 0
    let wheelGestureTimer = 0
    let wheelGestureActive = false
    let wheelGestureEligible = false
    let wheelGestureResolved = false
    let wheelGestureConsumed = false
    let touchStartY = null
    let touchGestureEligible = false
    let touchGestureResolved = false
    let touchGestureConsumed = false
    let animationLocked = false

    const isStageActive = () => {
      const rect = stage.getBoundingClientRect()
      const activationTop = Math.min(96, window.innerHeight * 0.12)
      return rect.top <= activationTop && rect.bottom >= window.innerHeight * 0.42
    }

    const canAdvance = direction => (
      direction > 0
        ? mobileSequenceIndexRef.current < mobileSequenceItemCount - 1
        : mobileSequenceIndexRef.current > 0
    )

    const advance = direction => {
      if (animationLocked || !canAdvance(direction)) return
      const nextIndex = clamp(
        mobileSequenceIndexRef.current + direction,
        0,
        mobileSequenceItemCount - 1,
      )
      mobileSequenceIndexRef.current = nextIndex
      setMobileSequenceIndex(nextIndex)
      animationLocked = true
      window.clearTimeout(animationTimer)
      animationTimer = window.setTimeout(() => {
        animationLocked = false
      }, 320)
    }

    const onWheel = event => {
      if (Math.abs(event.deltaY) < 0.5) return

      if (!wheelGestureActive) {
        wheelGestureActive = true
        wheelGestureEligible = isStageActive()
        wheelGestureResolved = false
        wheelGestureConsumed = false
      }

      window.clearTimeout(wheelGestureTimer)
      wheelGestureTimer = window.setTimeout(() => {
        wheelGestureActive = false
        wheelGestureEligible = false
        wheelGestureResolved = false
        wheelGestureConsumed = false
      }, 160)

      if (wheelGestureResolved) {
        if (wheelGestureConsumed) event.preventDefault()
        return
      }

      const direction = event.deltaY > 0 ? 1 : -1
      const shouldConsume = wheelGestureEligible && canAdvance(direction)
      if (shouldConsume) event.preventDefault()
      if (Math.abs(event.deltaY) < 8) return

      wheelGestureResolved = true
      if (!wheelGestureEligible) return

      if (animationLocked) {
        wheelGestureConsumed = true
        event.preventDefault()
        return
      }

      if (!canAdvance(direction)) return

      wheelGestureConsumed = true
      advance(direction)
    }

    const onTouchStart = event => {
      touchStartY = event.touches[0]?.clientY ?? null
      touchGestureEligible = isStageActive()
      touchGestureResolved = false
      touchGestureConsumed = false
    }

    const onTouchMove = event => {
      if (touchStartY === null) return
      const currentY = event.touches[0]?.clientY
      if (typeof currentY !== 'number') return

      if (touchGestureResolved) {
        if (touchGestureConsumed) event.preventDefault()
        return
      }

      const delta = touchStartY - currentY
      if (Math.abs(delta) < 0.5) return
      const direction = delta > 0 ? 1 : -1
      const shouldConsume = touchGestureEligible && canAdvance(direction)
      if (shouldConsume) event.preventDefault()
      if (Math.abs(delta) < 24) return
      touchGestureResolved = true
      if (!touchGestureEligible) return

      if (animationLocked) {
        touchGestureConsumed = true
        event.preventDefault()
        return
      }

      if (!canAdvance(direction)) return

      touchGestureConsumed = true
      advance(direction)
    }

    const onTouchEnd = () => {
      touchStartY = null
      touchGestureEligible = false
      touchGestureResolved = false
      touchGestureConsumed = false
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.clearTimeout(animationTimer)
      window.clearTimeout(wheelGestureTimer)
    }
  }, [activeThemeId, mobileSequenceEnabled, mobileSequenceItemCount])

  const getMobileSequenceClass = itemIndex => {
    if (!mobileSequenceEnabled) return ''
    if (itemIndex === mobileSequenceIndex) return ' is-mobile-active'
    return itemIndex < mobileSequenceIndex ? ' is-mobile-before' : ' is-mobile-after'
  }

  const isMobileSequenceItemHidden = itemIndex => (
    mobileSequenceEnabled && itemIndex !== mobileSequenceIndex
  )

  const openTrace = document => {
    if (!interactive) return
    const delay = reducedMotion ? 0 : 280
    setSelectedName(document.name)
    window.clearTimeout(openTimer.current)
    openTimer.current = window.setTimeout(() => onOpenTrace?.(document), delay)
  }

  // Desktop narrative stages remain scroll-linked; mobile document switching uses
  // the discrete gesture state above.
  const p = reducedMotion ? 1 : scrollProgress
  const progressBetween = (start, end) => clamp((p - start) / (end - start))
  const smoothProgressBetween = (start, end) => {
    const progress = progressBetween(start, end)
    return progress * progress * (3 - 2 * progress)
  }
  const pDocumentOutline = progressBetween(0, DOCUMENT_OUTLINE_END_PROGRESS)
  const pSecToSourceLine = progressBetween(
    DOCUMENT_EXTRACTION_START_PROGRESS,
    DOCUMENT_EXTRACTION_END_PROGRESS,
  )
  const pSourceCards = progressBetween(
    DOCUMENT_SOURCES_START_PROGRESS,
    DOCUMENT_SOURCES_END_PROGRESS,
  )
  const pSourceCamera = smoothProgressBetween(0.12, 0.30)
  const pHierarchyCamera = smoothProgressBetween(0.34, 0.54)
  const pSummaryCamera = smoothProgressBetween(0.56, 0.74)
  const cameraScale = isDesktop ? 1 : 903 / SUMMARY_REVEAL_CAMERA_SHIFT
  const scrollLinkedCameraShift = (
    SOURCE_REVEAL_CAMERA_SHIFT * pSourceCamera
    + (HIERARCHY_REVEAL_CAMERA_SHIFT - SOURCE_REVEAL_CAMERA_SHIFT) * pHierarchyCamera
    + (SUMMARY_REVEAL_CAMERA_SHIFT - HIERARCHY_REVEAL_CAMERA_SHIFT) * pSummaryCamera
  ) * cameraScale
  const cameraShiftY = (reducedMotion || isMobile)
    ? 0
    : scrollLinkedCameraShift

  const pConvergenceLine = progressBetween(0.34, 0.46)
  const pHierarchyCard = progressBetween(0.42, 0.58)
  const pSummaryConnection = progressBetween(0.56, 0.66)
  const pSummaryDocument = progressBetween(0.62, DOCUMENT_HIERARCHY_END_PROGRESS)
  const pSummaryInk = progressBetween(DOCUMENT_HIERARCHY_END_PROGRESS, 1)
  const activeStageIndex = Math.min(PRODUCT_STAGE_COUNT, Math.floor(p * PRODUCT_STAGE_COUNT))

  return (
    <section
      className="document-map reveal"
      ref={mobileMapRef}
      data-mobile-sequence-index={mobileSequenceEnabled ? mobileSequenceIndex : undefined}
      data-mobile-sequence-complete={mobileSequenceEnabled
        ? mobileSequenceIndex === mobileSequenceItemCount - 1 ? 'true' : 'false'
        : undefined}
      data-product-stage-index={activeStageIndex}
      style={{ '--document-outline-clip': `${(1 - pDocumentOutline) * 100}%` }}
      aria-labelledby="document-map-title"
      inert={inactive ? '' : undefined}
    >
      <span className="sr-only" id="document-map-title">Document map</span>
      <div className="document-map-hierarchy">
        <div className="document-map-hierarchy-canvas" data-document-count={activeTheme.documents.length} style={{ '--document-count': activeTheme.documents.length }}>
          <div
            className="document-map-content"
            key={activeTheme.id}
            aria-live="polite"
            style={{
              transform: `translateY(-${cameraShiftY}px)`,
              transition: 'none',
            }}
          >
            <div className={`mobile-narrative-stage${mobileSequenceEnabled ? ' is-mobile-sequence' : ''}`}>
              {/* STAGE 1: Full-height source documents */}
              <div
                className="document-map-documents"
                data-document-count={activeTheme.documents.length}
                data-cross-link={showCrossDocumentLink ? 's2-s1' : undefined}
              >
              {activeTheme.documents.map((document, documentIndex) => (
                <article
                  className={`document-branch${selectedName === document.name ? ' is-selected' : ''}${getMobileSequenceClass(documentIndex)}`}
                  key={document.name}
                  aria-hidden={isMobileSequenceItemHidden(documentIndex) ? 'true' : undefined}
                  inert={isMobileSequenceItemHidden(documentIndex) ? '' : undefined}
                >
                  <header className="document-node">
                    <span>DOCUMENT {documentIndex + 1}</span>
                    <strong>{document.name}</strong>
                  </header>
                  <DocumentBranchLine
                    sectionCount={document.sections.length}
                    clipProgress={1}
                  />
                  <div
                    className="document-sections"
                    data-section-count={document.sections.length}
                    style={{
                      '--section-count': document.sections.length,
                    }}
                  >
                    {document.sections.map((section, sectionIndex) => {
                      const [firstPage, ...remainingPages] = section.pages
                      const firstPageMedia = getPageMedia(firstPage, isDesktop)
                      const SectionTag = interactive ? 'button' : 'section'

                      return (
                        <SectionTag
                          className="section-node"
                          key={section.name}
                          {...(interactive
                            ? {
                                type: 'button',
                                onClick: () => openTrace(document),
                                'aria-label': `Open ${document.name}`,
                              }
                            : {})}
                        >
                          <div className="section-node-head">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M6 2.75h8.5L19 7.25v14H6z" />
                              <path d="M14.5 2.75v4.5H19M9 11h7M9 14.5h7M9 18h4.5" />
                            </svg>
                            <span>SECTION {sectionIndex + 1}</span>
                            <strong>{section.name}</strong>
                          </div>
                          <div className="section-body">
                            <p>
                              {performanceCopy[0]}
                              {!firstPageMedia && <span className="section-page-reference">PAGE {firstPage.number}</span>}
                            </p>
                            {firstPageMedia && <SectionPageContent page={firstPage} showExpandedMedia={isDesktop} />}
                            <p>{performanceCopy[1]}</p>
                            {remainingPages.map(page => <SectionPageContent page={page} key={page.number} showExpandedMedia={isDesktop} />)}
                          </div>
                        </SectionTag>
                      )
                    })}
                  </div>
                  <span className="mobile-sequence-connector" aria-hidden="true" />
                </article>
              ))}
              {showCrossDocumentLink && (
                <div
                  className="cross-document-link"
                  aria-label="Relationship"
                >
                  <MapFlowSvg
                    className="cross-document-link-rail"
                    viewBox="0 0 101 20"
                    path="M0 10 H101 M0.5 0 V20 M100.5 0 V20"
                    clipProgress={1}
                    direction="horizontal"
                  />
                  <span>
                    Relationship
                  </span>
                </div>
              )}
              </div>

              {/* STAGE 2: Extraction lines from the source documents */}
              <SectionToSourceLines
                clipProgress={pSecToSourceLine}
                opacity={1}
                sourceCount={currentSources.length}
                documentCount={activeTheme.documents.length}
                className={isMobile ? 'mobile-source-connection' : ''}
                mobileReveal={isMobile}
                revealKey={activeTheme.id}
              />

              {/* STAGES 2–4: Extracted source-region cards and relationship */}
              <div
                className="source-sections"
                data-source-count={currentSources.length}
                data-document-count={activeTheme.documents.length}
                style={{
                  opacity: pSourceCards,
                  transform: `translateY(${(1 - pSourceCards) * 18}px)`,
                  transition: 'none',
                  pointerEvents: pSourceCards > 0.5 ? 'auto' : 'none',
                }}
              >
              {currentSources.map((source, index) => {
                const isPrimary = index === 0
                const slot = isPrimary ? 'primary' : index === 1 ? 'secondary-one' : 'secondary-two'
                const sequenceIndex = activeTheme.documents.length + index
                return (
                  <figure
                    className={`trace-source-card${getMobileSequenceClass(sequenceIndex)}`}
                    key={source.id}
                    data-source-slot={slot}
                    data-region={source.type}
                    data-motion-active={pSourceCards > 0.05 ? 'true' : undefined}
                    style={{ '--trace-motion-delay': `${index * 70}ms` }}
                    aria-hidden={isMobileSequenceItemHidden(sequenceIndex) ? 'true' : undefined}
                    inert={isMobileSequenceItemHidden(sequenceIndex) ? '' : undefined}
                  >
                    <div className="trace-card-content">
                      <figcaption>
                        <span className="trace-folder-tab">
                          Original file<span className="mobile-source-index"> {String(index + 1).padStart(2, '0')}</span>
                        </span>
                        <span data-trace-coordinate>{source.format} · {source.page}</span>
                      </figcaption>
                      <div className="trace-source-thumb">
                        <div className="trace-source-frame">
                          <div className="trace-source-media">
                            <img className="trace-source-image" src={source.image} alt={source.alt} />
                            <div className="trace-source-preview" aria-hidden="true">
                              <SourcePreviewContent source={source} />
                            </div>
                            <span className="trace-document-scanner" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <TracePixelReveal
                      active={pSourceCards > 0.05}
                      delay={index * 70}
                    />
                    <span className="mobile-sequence-connector" aria-hidden="true" />
                  </figure>
                )
              })}
              </div>

              {/* STAGE 3: 3-to-1 convergence and cross-document hierarchy */}
              <ConvergenceLine
                clipProgress={pConvergenceLine}
                sourceCount={currentSources.length}
                documentCount={activeTheme.documents.length}
              />

              <div
                className={`mobile-summary-sequence-item${getMobileSequenceClass(mobileSequenceItemCount - 1)}`}
                aria-hidden={isMobileSequenceItemHidden(mobileSequenceItemCount - 1) ? 'true' : undefined}
                inert={isMobileSequenceItemHidden(mobileSequenceItemCount - 1) ? '' : undefined}
              >
                <CrossDocumentHierarchyCard
                  activeThemeId={activeTheme.id}
                  opacity={pHierarchyCard}
                  translateY={(1 - pHierarchyCard) * 18}
                  motionActive={pHierarchyCard > 0.05}
                />
                <span className="mobile-sequence-connector" aria-hidden="true" />
              </div>

              <MapFlowSvg
                className="hierarchy-summary-connection"
                viewBox={`0 0 10 ${48 + CONNECTION_LINE_EXTENSION}`}
                path={`M5 0 V${48 + CONNECTION_LINE_EXTENSION}`}
                dots={[[5, 0], [5, 48 + CONNECTION_LINE_EXTENSION]]}
                clipProgress={pSummaryConnection}
              />
            </div>

            <AIOutputReport
              documentCount={activeTheme.documents.length}
              opacity={pSummaryDocument}
              translateY={(1 - pSummaryDocument) * 18}
              motionActive={pSummaryDocument > 0.05}
              inkProgress={pSummaryInk}
              sourceCount={currentSources.length}
            />

          </div>
        </div>
      </div>
    </section>
  )
}

function DocumentMapSwitcher({ activeThemeId, onChange }) {
  return (
    <div className="document-map-switcher" aria-label="Choose a document theme">
      {themes.map((theme, index) => (
        <button
          type="button"
          key={theme.id}
          aria-pressed={theme.id === activeThemeId}
          onClick={() => onChange(theme.id)}
        >
          <span>{String(index + 1).padStart(2, '0')} {theme.label}</span>
        </button>
      ))}
    </div>
  )
}

const SCAN_DEMO_CROP_CSS = `
html, body {
  margin: 0 !important;
  height: auto !important;
  min-height: 0 !important;
  overflow: hidden !important;
  background: #fff !important;
}
.skip-link,
.site-header,
.mobile-menu,
footer,
.toast,
.layout-grid-overlay,
.trace-debug,
.trace-debug-panel,
.trace-debug-toggle {
  display: none !important;
}
#main {
  padding: 0 !important;
  margin: 0 !important;
}
#main > *:not(#top) {
  display: none !important;
}
#top.hero,
.hero {
  display: block !important;
  width: 100% !important;
  max-width: none !important;
  min-height: 0 !important;
  height: auto !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  gap: 0 !important;
  grid-template: none !important;
}
.hero-copy,
.hero-support,
.hero-center-divider,
.hero-primary {
  display: none !important;
}
.hero-visual {
  display: block !important;
  width: 100% !important;
  min-width: 0 !important;
  height: var(--trace-stage-height, 600px) !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
}
[data-trace-demo] {
  width: 100% !important;
  height: var(--trace-stage-height, 600px) !important;
  min-height: 0 !important;
  max-height: none !important;
}
`

function syncScanFrameHeight(frame) {
  const demo = frame?.contentDocument?.querySelector('[data-trace-demo]')
  if (!demo) return
  const height = Math.ceil(demo.getBoundingClientRect().height)
  if (height < 1) return
  frame.style.height = `${height}px`
  frame.parentElement?.style.setProperty('--scan-demo-height', `${height}px`)
}

function cropScanDemo(frame) {
  const doc = frame?.contentDocument
  if (!doc?.head) return
  if (!doc.getElementById('knowhere-scan-crop')) {
    const style = doc.createElement('style')
    style.id = 'knowhere-scan-crop'
    style.textContent = SCAN_DEMO_CROP_CSS
    doc.head.appendChild(style)
  }
  syncScanFrameHeight(frame)
}

export function ProductStage({ heading }) {
  const isMobile = useMobileProductLayout()
  const [activeThemeId, setActiveThemeId] = useState(themes[0].id)
  const [scrollProgress, setScrollProgress] = useState(0)
  const trackRef = useRef(null)
  const iframeRef = useRef(null)
  const scanFrameRef = useRef(null)
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: [`start ${PRODUCT_STICKY_TOP}px`, 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', latest => {
    setScrollProgress(reducedMotion || isMobile ? 1 : clamp(latest))
  })

  useEffect(() => {
    setScrollProgress(reducedMotion || isMobile ? 1 : clamp(scrollYProgress.get()))
  }, [isMobile, reducedMotion, scrollYProgress])

  useEffect(() => {
    const frame = iframeRef.current
    if (!frame) return undefined
    let resizeObserver
    const crop = () => {
      cropScanDemo(frame)
      const demo = frame.contentDocument?.querySelector('[data-trace-demo]')
      if (demo && typeof ResizeObserver !== 'undefined') {
        resizeObserver?.disconnect()
        resizeObserver = new ResizeObserver(() => syncScanFrameHeight(frame))
        resizeObserver.observe(demo)
      }
    }
    crop()
    frame.addEventListener('load', crop)
    return () => {
      frame.removeEventListener('load', crop)
      resizeObserver?.disconnect()
    }
  }, [])

  const revealTrace = () => {
    const frame = iframeRef.current
    try {
      frame?.contentWindow?.postMessage({ type: 'knowhere-play-trace' }, window.location.origin)
    } catch {
      // Same-origin preview only; a missing iframe must not block the stage change.
    }
    scanFrameRef.current?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <div
      className="playground-scroll-track"
      ref={trackRef}
      style={{ '--product-stage-scroll-distance': `${PRODUCT_STAGE_COUNT * PRODUCT_STAGE_SCROLL_VH}svh` }}
    >
      <div className="playground-sticky">
        {heading}
        <div className="product-stage-switcher-row">
          <DocumentMapSwitcher activeThemeId={activeThemeId} onChange={setActiveThemeId} />
        </div>
        <div className={`product-stage${isMobile ? ' is-stacked' : ''}`}>
          <div className="product-stage-track">
            <DocumentMap
              activeThemeId={activeThemeId}
              onOpenTrace={revealTrace}
              scrollProgress={scrollProgress}
            />
            <div className="section-scan-frame" ref={scanFrameRef} hidden>
              <iframe
                ref={iframeRef}
                src="document-scan-section.html"
                title="Document scan and source traceability demonstration"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
