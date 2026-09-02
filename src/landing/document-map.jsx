import { useEffect, useRef, useState } from 'react'
import revenueChart from '../../assets/source-chart.png'
import marginAnalysis from '../../assets/source-margin.png'
import revenueAnalysis from '../../assets/source-revenue.png'
import revenueTable from '../../assets/source-table.png'
import figmaDocumentLogo from '../../assets/figma-document-logo.svg'

const MOBILE_PRODUCT_QUERY = '(max-width: 767px)'

const themes = [
  {
    id: 'growth',
    label: 'Q4 growth & outlook',
    documents: [
      {
        name: 'Q4 market update.pdf',
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
        name: 'Financial summary.pdf',
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
      title: 'FY2026 commercial schedule',
      widths: [34, 22, 22, 22],
      columns: ['Item', 'Qty', 'FY25', 'FY26'],
      rows: [
        ['Platform seats', '1,200', '$402k', '$420k'],
        ['24×7 support', '1', '$48k', '$50k'],
        ['Total annual fee', '—', '$450k', '$470k'],
      ],
      image: revenueTable,
      alt: 'Original master service agreement excerpt',
    },
    {
      id: 'src-growth-2',
      format: 'XLSX',
      page: 'PAGE 09 & 10',
      type: 'document',
      kicker: 'Service schedule · §11.4',
      title: 'Availability credits & margin',
      copy: 'Monthly availability below 99.9% earns a 5% service credit; below 99.5% earns 10%.',
      note: 'Claims must be submitted within 30 days of the affected month.',
      image: marginAnalysis,
      alt: 'Operating margin review',
    },
    {
      id: 'src-growth-3',
      format: 'PDF',
      page: 'PAGE 12 & 14',
      type: 'line',
      title: 'Active-seat utilization (%)',
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
    topic: 'Renewal decision brief',
    hierarchy: [
      { source: 'Master service agreement.pdf', location: '8.2 and 11.4', type: 'doc', isActive: true },
      { source: 'Pricing schedule.xlsx', location: 'FY26 rates', type: 'table', isActive: false },
      { source: 'Seat utilization.csv', location: '6-month trend', type: 'chart', isActive: false },
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

function getPageMedia(page) {
  if (page.image === revenueTable) {
    return {
      alt: 'Regional revenue table',
      caption: 'Q4 2025 revenue increases across all regions, led by APAC (+21.6%) and Europe (+19.4%).',
    }
  }

  if (page.image === revenueChart) {
    return {
      alt: 'Revenue trend and operating income charts',
      caption: 'Revenue trend shows consistent quarter-over-quarter growth.',
    }
  }

  return null
}

function SectionPageContent({ page }) {
  const media = getPageMedia(page)

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

function RichDocumentPage({ section, pageIndex }) {
  const page = section.pages[pageIndex] ?? section.pages[0]
  const media = getPageMedia(page)

  return (
    <article className="source-document-page">
      <header className="source-document-page-head">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 2.75h8.5L19 7.25v14H6z" />
          <path d="M14.5 2.75v4.5H19M9 11h7M9 14.5h7M9 18h4.5" />
        </svg>
        <span>SECTION {pageIndex + 1}</span>
      </header>
      <strong>{section.name}</strong>
      <p>{performanceCopy[pageIndex % performanceCopy.length]}</p>
      {media ? (
        <figure>
          <img src={page.image} alt={media.alt} />
          <figcaption>PAGE {page.number} · {media.caption}</figcaption>
        </figure>
      ) : (
        <p className="source-document-page-reference">PAGE {page.number}</p>
      )}
    </article>
  )
}

function useMobileProductLayout() {
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia(MOBILE_PRODUCT_QUERY).matches
  ))

  useEffect(() => {
    const media = window.matchMedia(MOBILE_PRODUCT_QUERY)
    const sync = () => setIsMobile(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return isMobile
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
  const height = 37
  const stem = (
    <MapFlowSvg
      className="document-branch-line-svg is-stem"
      viewBox={`0 0 10 ${height}`}
      path="M5 0 V37"
      dots={[[5, height]]}
      clipProgress={clipProgress}
    />
  )

  if (!forked) {
    return <div className="document-branch-line" aria-hidden="true">{stem}</div>
  }

  const card = 381
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

function SectionToSourceLines({ clipProgress = 1, sourceCount = 3, documentCount = 2 }) {
  const height = 32
  if (sourceCount === 2) {
    return (
      <div className="stage-flow-row is-section-to-source" aria-hidden="true">
        <div className="flow-line-slot" style={{ width: 381 }}>
          <MapFlowSvg
            className="stage-flow-line-svg"
            viewBox={`0 0 10 ${height}`}
            path="M5 0 V32"
            dots={[[5, 0], [5, height]]}
            clipProgress={clipProgress}
          />
        </div>
        <div className="flow-line-gap" style={{ width: 33 }} />
        <div className="flow-line-slot" style={{ width: 381 }}>
          <MapFlowSvg
            className="stage-flow-line-svg"
            viewBox={`0 0 10 ${height}`}
            path="M5 0 V32"
            dots={[[5, 0], [5, height]]}
            clipProgress={clipProgress}
          />
        </div>
      </div>
    )
  }

  const gapBetweenDocs = documentCount === 3 ? 33 : 101

  return (
    <div className="stage-flow-row is-section-to-source" aria-hidden="true">
      <div className="flow-line-slot" style={{ width: 381 }}>
        <MapFlowSvg
          className="stage-flow-line-svg"
          viewBox={`0 0 10 ${height}`}
          path="M5 0 V32"
          dots={[[5, 0], [5, height]]}
          clipProgress={clipProgress}
        />
      </div>
      <div className="flow-line-gap" style={{ width: 33 }} />
      <div className="flow-line-slot" style={{ width: 381 }}>
        <MapFlowSvg
          className="stage-flow-line-svg"
          viewBox={`0 0 10 ${height}`}
          path="M5 0 V32"
          dots={[[5, 0], [5, height]]}
          clipProgress={clipProgress}
        />
      </div>
      <div className="flow-line-gap" style={{ width: gapBetweenDocs }} />
      <div className="flow-line-slot" style={{ width: 381 }}>
        <MapFlowSvg
          className="stage-flow-line-svg"
          viewBox={`0 0 10 ${height}`}
          path="M5 0 V32"
          dots={[[5, 0], [5, height]]}
          clipProgress={clipProgress}
        />
      </div>
    </div>
  )
}

function ConvergenceLine({ clipProgress = 1, sourceCount = 3, documentCount = 2 }) {
  const height = 40
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

function CrossDocumentHierarchyCard({ activeThemeId, opacity = 1, translateY = 0 }) {
  const summary = themeSummaries[activeThemeId] ?? themeSummaries.growth
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <aside
      className="trace-summary-card"
      data-trace-summary-card
      aria-label="Cross-document hierarchy for the selected source"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: reducedMotion ? 'none' : 'opacity 0.15s ease-out, transform 0.15s ease-out',
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      }}
    >
      <div className="trace-card-content">
        <span className="trace-summary-label">Cross-document hierarchy</span>
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
    </aside>
  )
}

function AIOutputReport({ opacity = 1, translateY = 0 }) {
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section
      className="ai-output-report"
      data-ai-summary-document
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: reducedMotion ? 'none' : 'opacity 0.15s ease-out, transform 0.15s ease-out',
      }}
    >
      <h3 className="ai-output-label">AI Output</h3>
      <div className="ai-output-stack">
        <span className="ai-output-sheet is-back-two" aria-hidden="true" />
        <span className="ai-output-sheet is-back-one" aria-hidden="true" />
        <article className="ai-output-document">
          <div className="ai-output-page-inner">
            <header className="ai-output-brand">
              <img src={figmaDocumentLogo} alt="Knowhere" />
              <time dateTime="2023-11-16">16/11/2023</time>
            </header>
            <div className="ai-output-rule" aria-hidden="true" />
            <p className="ai-output-eyebrow">Q4 2025 market report</p>
            <h4>Revenue performance</h4>
            <p className="ai-output-copy">
              Enterprise software revenue reached <span className="ai-output-mark">$4.8B, up 18.4% year over year</span>, supported by continued demand for cloud, security, and data platforms. Regional performance remained broad-based, with <span className="ai-output-mark">APAC growing 21.6% and Europe growing 19.4%</span>, while North America remained the largest contributor to revenue. Operating income rose to $1.1B as disciplined cost management lifted the <span className="ai-output-mark is-active">operating margin to 22.9%</span>. The underlying trend also remained consistently positive, with <span className="ai-output-mark">revenue increasing in every reported quarter since Q4 2023</span>.
            </p>
          </div>
          <span className="ai-output-anchor" aria-hidden="true" />
        </article>
      </div>
    </section>
  )
}

function DocumentMap({ activeThemeId, onOpenTrace, inactive = false, scrollProgress = 1 }) {
  const isMobile = useMobileProductLayout()
  const interactive = typeof onOpenTrace === 'function'
  const [selectedName, setSelectedName] = useState(null)
  const openTimer = useRef(0)
  const activeTheme = themes.find(theme => theme.id === activeThemeId) ?? themes[0]
  const currentSources = themeSourcesMap[activeTheme.id] ?? themeSourcesMap.growth
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const showCrossDocumentLink = activeTheme.documents.length === 2
    && activeTheme.documents[0].sections.length >= 2

  useEffect(() => () => window.clearTimeout(openTimer.current), [])

  useEffect(() => {
    window.clearTimeout(openTimer.current)
    setSelectedName(null)
  }, [activeThemeId])

  const openTrace = document => {
    if (!interactive) return
    const delay = reducedMotion ? 0 : 280
    setSelectedName(document.name)
    window.clearTimeout(openTimer.current)
    openTimer.current = window.setTimeout(() => onOpenTrace?.(document), delay)
  }

  // Animation Stage metrics calculated from scrollProgress (0 to 1)
  const p = reducedMotion ? 1 : scrollProgress

  // Stage 1: the intact rich-text documents remain fully readable on entry.
  const pStage1 = clamp((p - 0.12) / 0.12)
  const docScale = 1.15 - 0.15 * pStage1
  const pIntactDocumentsOut = clamp((p - 0.24) / 0.10)

  // Stage 2: extraction begins only after the intact-document hold.
  const pBranchLine = clamp((p - 0.30) / 0.12)
  const pSectionCards = clamp((p - 0.32) / 0.12)

  // Stage 3: Cross-document relationship (0.42 -> 0.56)
  const pCrossLine = clamp((p - 0.42) / 0.10)
  const pCrossBadge = clamp((p - 0.47) / 0.09)

  // Stage 4: Flow to extracted source regions (0.54 -> 0.72)
  const pSecToSourceLine = clamp((p - 0.54) / 0.10)
  const pSourceCards = clamp((p - 0.60) / 0.12)

  // Pan far enough to keep the hierarchy, its outgoing connection, and summary in view.
  const pCamera = clamp((p - 0.48) / 0.48)
  const cameraEase = pCamera * pCamera * (3 - 2 * pCamera)
  const cameraShiftY = (reducedMotion || isMobile) ? 0 : cameraEase * 830

  // Stage 5: source regions converge into hierarchy, then connect to AI summary.
  const pConvergenceLine = clamp((p - 0.70) / 0.08)
  const pHierarchyCard = clamp((p - 0.75) / 0.09)
  const pSummaryConnection = clamp((p - 0.84) / 0.06)
  const pSummaryDocument = clamp((p - 0.89) / 0.08)

  return (
    <section className="document-map reveal" aria-labelledby="document-map-title" inert={inactive ? '' : undefined}>
      <span className="sr-only" id="document-map-title">Document map</span>
      <div className="document-map-hierarchy">
        <div className="document-map-hierarchy-canvas" data-document-count={activeTheme.documents.length} style={{ '--document-count': activeTheme.documents.length }}>
          <div
            className="document-map-content"
            key={activeTheme.id}
            aria-live="polite"
            style={{
              transform: `translateY(-${cameraShiftY}px)`,
              transition: reducedMotion ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            <div
              className="source-document-groups"
              data-document-count={activeTheme.documents.length}
              data-intact-documents
              style={{
                opacity: 1 - pIntactDocumentsOut,
                transform: `translate(-50%, -${pIntactDocumentsOut * 12}px)`,
                pointerEvents: pIntactDocumentsOut < 0.5 ? 'auto' : 'none',
              }}
            >
              {activeTheme.documents.map((document, documentIndex) => (
                <section className="source-document-group" key={document.name}>
                  <header className="source-document-group-title">
                    <span>DOCUMENT {documentIndex + 1}</span>
                    <strong>{document.name}</strong>
                  </header>
                  <div className="source-document-pages">
                    {document.sections.map((section, sectionIndex) => (
                      <RichDocumentPage section={section} pageIndex={sectionIndex} key={section.name} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* STAGES 1, 2, 3: Documents, Branch Lines, Section Cards, Cross Link */}
            <div
              className="document-map-documents"
              data-document-count={activeTheme.documents.length}
              data-cross-link={showCrossDocumentLink ? 's2-s1' : undefined}
              style={{ opacity: pIntactDocumentsOut }}
            >
              {activeTheme.documents.map((document, documentIndex) => (
                <article
                  className={`document-branch${selectedName === document.name ? ' is-selected' : ''}`}
                  key={document.name}
                >
                  <header
                    className="document-node"
                    style={{
                      transform: `scale(${docScale})`,
                      transformOrigin: 'bottom center',
                      transition: reducedMotion ? 'none' : 'transform 0.1s ease-out',
                    }}
                  >
                    <span>DOCUMENT {documentIndex + 1}</span>
                    <strong>{document.name}</strong>
                  </header>
                  <DocumentBranchLine
                    sectionCount={document.sections.length}
                    clipProgress={pBranchLine}
                  />
                  <div
                    className="document-sections"
                    data-section-count={document.sections.length}
                    style={{
                      '--section-count': document.sections.length,
                      opacity: pSectionCards,
                      transform: `translateY(${(1 - pSectionCards) * 14}px)`,
                      transition: reducedMotion ? 'none' : 'opacity 0.15s ease-out, transform 0.15s ease-out',
                      pointerEvents: pSectionCards > 0.5 ? 'auto' : 'none',
                    }}
                  >
                    {document.sections.map((section, sectionIndex) => {
                      const [firstPage, ...remainingPages] = section.pages
                      const firstPageMedia = getPageMedia(firstPage)
                      const isCrossSource = showCrossDocumentLink && documentIndex === 0 && sectionIndex === 1
                      const isCrossTarget = showCrossDocumentLink && documentIndex === 1 && sectionIndex === 0
                      const SectionTag = interactive ? 'button' : 'section'

                      return (
                        <SectionTag
                          className={`section-node${isCrossSource ? ' is-cross-source' : ''}${isCrossTarget ? ' is-cross-target' : ''}`}
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
                            <span>SECTION {sectionIndex + 1}</span>
                            <strong>{section.name}</strong>
                          </div>
                          <div className="section-body">
                            <p>
                              {performanceCopy[0]}
                              {!firstPageMedia && <span className="section-page-reference">PAGE {firstPage.number}</span>}
                            </p>
                            {firstPageMedia && <SectionPageContent page={firstPage} />}
                            <p>{performanceCopy[1]}</p>
                            {remainingPages.map(page => <SectionPageContent page={page} key={page.number} />)}
                          </div>
                        </SectionTag>
                      )
                    })}
                  </div>
                </article>
              ))}
              {showCrossDocumentLink && (
                <div
                  className="cross-document-link"
                  aria-label="Cross-document relationship"
                  style={{
                    opacity: pCrossLine > 0.05 ? 1 : 0,
                  }}
                >
                  <MapFlowSvg
                    className="cross-document-link-rail"
                    viewBox="0 0 101 20"
                    path="M0 10 H101 M0.5 0 V20 M100.5 0 V20"
                    clipProgress={pCrossLine}
                    direction="horizontal"
                  />
                  <span
                    style={{
                      opacity: pCrossBadge,
                      transform: `translate(-50%, -50%) scale(${0.9 + 0.1 * pCrossBadge})`,
                      transition: reducedMotion ? 'none' : 'opacity 0.15s ease-out, transform 0.15s ease-out',
                    }}
                  >
                    Cross-document relationship
                  </span>
                </div>
              )}
            </div>

            {/* STAGE 4: Flow lines from Sections to Source Documents */}
            <SectionToSourceLines
              clipProgress={pSecToSourceLine}
              sourceCount={currentSources.length}
              documentCount={activeTheme.documents.length}
            />

            {/* STAGE 4: Source Document cards */}
            <div
              className="source-sections"
              data-source-count={currentSources.length}
              data-document-count={activeTheme.documents.length}
              style={{
                opacity: pSourceCards,
                transform: `translateY(${(1 - pSourceCards) * 14}px)`,
                transition: reducedMotion ? 'none' : 'opacity 0.15s ease-out, transform 0.15s ease-out',
                pointerEvents: pSourceCards > 0.5 ? 'auto' : 'none',
              }}
            >
              {currentSources.map((source, index) => {
                const isPrimary = index === 0
                const slot = isPrimary ? 'primary' : index === 1 ? 'secondary-one' : 'secondary-two'
                return (
                  <figure
                    className="trace-source-card"
                    key={source.id}
                    data-source-slot={slot}
                    data-region={source.type}
                  >
                    <div className="trace-card-content">
                      <figcaption>
                        <span className="trace-folder-tab">Original file</span>
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
                  </figure>
                )
              })}
            </div>

            {/* STAGE 5: 3-to-1 Convergence line */}
            <ConvergenceLine
              clipProgress={pConvergenceLine}
              sourceCount={currentSources.length}
              documentCount={activeTheme.documents.length}
            />

            {/* STAGE 5: Cross-document hierarchy */}
            <CrossDocumentHierarchyCard
              activeThemeId={activeTheme.id}
              opacity={pHierarchyCard}
              translateY={(1 - pHierarchyCard) * 14}
            />

            <MapFlowSvg
              className="hierarchy-summary-connection"
              viewBox="0 0 10 48"
              path="M5 0 V48"
              dots={[[5, 0], [5, 48]]}
              clipProgress={pSummaryConnection}
            />

            <AIOutputReport
              opacity={pSummaryDocument}
              translateY={(1 - pSummaryDocument) * 14}
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

export function ProductStage() {
  const isMobile = useMobileProductLayout()
  const [activeThemeId, setActiveThemeId] = useState(themes[0].id)
  const trackRef = useRef(null)
  const iframeRef = useRef(null)
  const scanFrameRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0.36)
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reducedMotion || isMobile) {
      setScrollProgress(1)
      return undefined
    }

    let rafId
    const updateProgress = () => {
      const track = trackRef.current
      if (!track) return

      const rect = track.getBoundingClientRect()
      const totalScroll = track.offsetHeight - window.innerHeight
      if (totalScroll <= 0) {
        setScrollProgress(1)
        return
      }

      // Keep the document branches visible on entry, then reveal the deeper source layers on scroll.
      const currentScroll = -rect.top
      const trackProgress = Math.max(0, Math.min(1, currentScroll / totalScroll))
      const p = 0.36 + trackProgress * 0.64
      setScrollProgress(p)
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reducedMotion, isMobile])

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
    <div className="playground-scroll-track" ref={trackRef}>
      <div className="playground-sticky">
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
