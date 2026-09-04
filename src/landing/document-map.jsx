import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { TextReveal } from '@/registry/magicui/text-reveal'

const MOBILE_PRODUCT_QUERY = '(max-width: 767px)'
const DESKTOP_PRODUCT_QUERY = '(min-width: 1440px) and (min-height: 1100px)'
const PRODUCT_STICKY_TOP = 68
const PRODUCT_STAGE_COUNT = 5
const PRODUCT_STAGE_SCROLL_VH = 60
const DOCUMENT_OUTLINE_END_PROGRESS = 0.14
const DOCUMENT_EXTRACTION_START_PROGRESS = 0.08
const DOCUMENT_EXTRACTION_END_PROGRESS = 0.20
const DOCUMENT_SOURCES_START_PROGRESS = 0.18
const DOCUMENT_SOURCES_END_PROGRESS = 0.34
const CONNECTION_LINE_EXTENSION = 24
const DESKTOP_SOURCE_CONNECTION_EXTENSION = 40
const SOURCE_REVEAL_CAMERA_SHIFT = 560 + DESKTOP_SOURCE_CONNECTION_EXTENSION
const HIERARCHY_REVEAL_CAMERA_SHIFT = 860 + DESKTOP_SOURCE_CONNECTION_EXTENSION * 2
// Hold Source-backed context 64px below the top of the illustration stage.
const SUMMARY_REVEAL_CAMERA_SHIFT = HIERARCHY_REVEAL_CAMERA_SHIFT + 146
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
            name: 'Revenue by region',
            copy: [
              'Q4 revenue reached $4.8B, up 19.1% year over year. North America contributed $2.302B, while APAC recorded the fastest growth at 21.6%.',
              'Subscription and support revenue represented 77% of the total, up from 74% a year earlier, extending the mix shift toward recurring revenue.',
              'Europe contributed $1.276B after 19.4% growth. APAC added $963M, making it the fastest-growing region even as North America remained the largest contributor.',
              'Cloud platform contracts remained the largest source of expansion, followed by security and data services. New bookings were balanced between existing-account expansion and first-time enterprise customers.',
              'North America added $358M year over year, Europe added $207M, and APAC added $171M. Together, the three regions accounted for nearly all of the quarter’s absolute revenue increase.',
              'Foreign-exchange movement reduced reported international growth by roughly 0.6 percentage points. On a constant-currency basis, both Europe and APAC finished modestly above the operating plan.',
              'Management expects the recurring mix and regional diversification to support durable growth, while monitoring procurement timing among larger public-sector and regulated-industry accounts.',
            ],
            pages: [{ label: 'PAGE 06', sourceId: 'src-growth-1' }],
          },
          {
            name: 'Operating margin',
            copy: [
              'Operating income increased to $1.094B from $899M, lifting operating margin to 22.9% from 21.3% in the prior year.',
              'Revenue growth continued to outpace operating expenses. Sales and customer-success costs grew more slowly as coverage and support workflows became more efficient.',
              'The 1.6-point margin improvement gives the business more room to fund product development while maintaining disciplined operating leverage.',
              'Gross margin remained stable despite higher inference and storage usage, as infrastructure commitments and workload scheduling offset most of the increase in variable processing demand.',
              'Research and development spending increased 14% year over year, primarily in document intelligence, reliability, and enterprise administration. The investment rate remained below revenue growth.',
              'General and administrative expense declined as a share of revenue after finance and compliance teams consolidated several reporting and approval workflows.',
              'The company enters the next quarter with capacity to increase product investment without moving outside its full-year operating-margin range.',
              'Cash conversion remained strong, leaving the margin plan supported by both operating discipline and the quality of recurring revenue rather than by deferred investment.',
            ],
            pages: [{ label: 'PAGE 10', sourceId: 'src-growth-2' }],
          },
        ],
      },
      {
        name: 'Financial Summary.pdf',
        sections: [
          {
            name: 'Capacity and adoption',
            copy: [
              'Active-seat utilization averaged 78% over the six-month period, showing that renewed contracts were converting into deployed product usage.',
              'Utilization rose through the first five readings before easing slightly in June, while still ending materially above the January baseline.',
              'The pattern indicates that customer provisioning and adoption kept pace with contracted capacity rather than leaving renewal growth unused.',
              'Customers with guided onboarding reached steady-state usage approximately three weeks faster than self-directed accounts, with the strongest gains among multi-team deployments.',
              'Security review completion and identity-provider setup remained the most common prerequisites for moving contracted seats into active use.',
              'Expansion cohorts retained higher utilization after month three, suggesting that usage breadth—not only initial activation—was supporting renewal confidence.',
              'The operations team will continue tracking seat depth, weekly active teams, and workflow frequency to distinguish durable adoption from short-term launch activity.',
              'Together, these measures indicate that the installed base is expanding in both breadth and frequency, creating a healthier foundation for future renewals.',
            ],
            pages: [{ label: 'PAGE 14', sourceId: 'src-growth-3' }],
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
            name: 'North America contribution',
            copy: [
              'North America generated $2.302B in Q4 revenue, remaining the largest market and contributing 48% of the global total.',
              'Revenue increased 18.4% year over year, supported by continued enterprise demand across cloud, security, and data-platform products.',
              'The region remains the company’s scale base, but its contribution is becoming more balanced as Europe and APAC grow at faster rates.',
              'Large enterprise accounts produced 62% of regional revenue, while mid-market customers delivered the highest net expansion rate during the quarter.',
              'Financial services and healthcare led new annual contract value. Public-sector bookings were stable but remained sensitive to procurement calendars.',
              'Retention stayed above the company average, supported by broader adoption across compliance, operations, and customer-support teams within existing accounts.',
              'The next-quarter plan emphasizes deeper product adoption in strategic accounts while protecting the region’s support response and implementation capacity.',
              'Regional performance therefore remains dependable: North America supplies the largest absolute contribution while leaving room for international mix to expand.',
            ],
            pages: [{ label: 'PAGE 04', sourceId: 'src-reg-1' }],
          },
        ],
      },
      {
        name: 'EMEA forecast.xlsx',
        sections: [
          {
            name: 'Europe renewal pipeline',
            copy: [
              'Europe grew 19.4% year over year. Enterprise renewal pipeline coverage reached 1.24×, with public-sector accounts tracking ahead of plan.',
              'Mid-market coverage remains the main watch area at 1.11×, while public-sector coverage of 1.32× provides additional support for the regional forecast.',
              'The pipeline mix points to steady renewal performance, with the strongest coverage concentrated in larger and public-sector accounts.',
              'Sixty-eight percent of forecast value is already in legal review or later stages. The remaining exposure is concentrated in mid-market renewals scheduled near quarter end.',
              'Enterprise coverage is supported by multi-year extensions in Germany, France, and the Netherlands, where product adoption expanded beyond the initial workflow.',
              'Public-sector timing remains favorable, although individual contracts can shift between quarters as security and purchasing approvals are completed.',
              'Regional leaders are prioritizing executive sponsorship and implementation readiness for the small set of renewals that account for most downside risk.',
              'With late-stage coverage above plan, the forecast remains balanced between a visible enterprise base and clearly identified mid-market execution risk.',
            ],
            pages: [{ label: 'SHEET 02', sourceId: 'src-reg-2' }],
          },
        ],
      },
      {
        name: 'APAC briefing.pptx',
        sections: [
          {
            name: 'APAC quarterly momentum',
            copy: [
              'APAC revenue reached $963M, up 21.6% year over year. Quarterly gains were sustained across cloud, security, and data-platform accounts.',
              'Revenue advanced in each reported quarter, with the curve steepening in the second half as enterprise deployments expanded across the region.',
              'APAC is still smaller than North America and Europe, but its faster growth makes it the largest contributor to incremental regional momentum.',
              'Japan and Australia remained the largest markets, while Singapore and South Korea generated the fastest percentage growth from a smaller base.',
              'Partner-led implementations represented 37% of new regional deployments and helped reduce onboarding time for customers with local data requirements.',
              'Currency effects were broadly neutral for the quarter. Growth was driven primarily by volume, higher seat adoption, and expansion into adjacent document workflows.',
              'The outlook assumes continued enterprise demand with measured hiring in solutions engineering and customer success to maintain delivery quality.',
              'The region’s growth profile is increasingly broad-based, combining mature-market scale with faster adoption in the newer Southeast Asian markets.',
            ],
            pages: [{ label: 'SLIDE 11', sourceId: 'src-reg-3' }],
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
            name: 'Margin and infrastructure cost',
            copy: [
              'Operating margin improved to 22.9% as revenue grew faster than operating expenses. Infrastructure cost per active seat declined 11.2%.',
              'Higher seat utilization spread platform and support costs across a broader active base, improving unit economics without reducing service coverage.',
              'The combined margin and unit-cost movement shows that the operating model is absorbing growth with less incremental infrastructure spend.',
              'Reserved compute coverage increased to 71% of predictable workloads, reducing exposure to on-demand pricing while preserving headroom for peak processing periods.',
              'Storage tiering and document-lifecycle policies lowered average retained-data cost, with no change to customer recovery objectives or audit availability.',
              'Model-routing updates shifted routine extraction work to lower-cost capacity and reserved higher-cost inference for visually complex pages and exception handling.',
              'Efficiency gains are being reinvested in reliability, observability, and enterprise controls rather than treated solely as short-term expense reductions.',
              'This approach preserves the operating leverage already achieved while maintaining the technical capacity required for larger and more complex document workloads.',
            ],
            pages: [{ label: 'PAGE 08', sourceId: 'src-eff-1' }],
          },
          {
            name: 'Support productivity by region',
            copy: [
              'Support cost per seat fell in every region. APAC recorded the lowest case volume and the largest improvement in first-response time.',
              'North America handled 42 cases per 1,000 seats, while Europe and APAC operated at 39 and 35 respectively as self-service coverage expanded.',
              'Faster first responses and lower cost per seat indicate that regional support teams are resolving more demand without proportional staffing growth.',
              'Knowledge-assisted resolution covered 46% of inbound questions, up from 31% a year earlier, with billing and access requests showing the highest deflection.',
              'Europe recorded a 17% faster first response after consolidating queues and extending follow-the-sun coverage with the APAC support organization.',
              'Escalation rates were stable even as case volume grew, indicating that faster handling did not shift unresolved work into engineering or customer-success teams.',
              'The next phase focuses on improving resolution quality for complex configuration issues while maintaining regional language and compliance coverage.',
              'Quality audits will continue to compare first-contact resolution, customer satisfaction, and transfer rates so productivity gains remain service-led.',
            ],
            pages: [{ label: 'PAGE 15', sourceId: 'src-eff-2' }],
          },
        ],
      },
      {
        name: 'Automation Review.xlsx',
        sections: [
          {
            name: 'Case routing automation',
            copy: [
              'Automated case routing reached 34% in June, reducing manual triage and shortening the median first-response time by 17%.',
              'Routing coverage increased in every month shown as classification rules expanded from common billing cases into provisioning and access requests.',
              'The higher automation rate directs more cases to the correct team on first assignment, reducing transfers and preserving specialist capacity.',
              'Confidence thresholds were calibrated by request type so ambiguous security and data-residency questions continue to receive human review before assignment.',
              'Billing classification achieved 93% precision, access requests reached 89%, and provisioning cases reached 86% after the June rule update.',
              'Cases below threshold enter the shared triage queue with suggested labels, preserving operator control while still reducing repetitive classification work.',
              'The July plan expands automation to renewal and integration questions after quality checks confirm that the current routing gains remain stable.',
              'Operators will retain final control over low-confidence cases, while reporting separates automated assignment from suggestions that still require review.',
            ],
            pages: [{ label: 'SHEET 04', sourceId: 'src-eff-3' }],
          },
        ],
      },
    ],
  },
]

const themeSourcesMap = {
  growth: [
    {
      id: 'src-growth-1',
      format: 'PDF',
      location: 'PAGE 06',
      type: 'table',
      eyebrow: 'CONSOLIDATED RESULTS · USD MILLIONS',
      title: 'Revenue by region',
      badge: '+19.1% TOTAL',
      caption: 'Regional revenue totals and year-over-year growth.',
      widths: [31, 23, 23, 23],
      columns: ['Region', 'Q4 2025', 'Q4 2024', 'YoY'],
      rows: [
        ['North America', '$2,302M', '$1,944M', '+18.4%'],
        ['Europe', '$1,276M', '$1,069M', '+19.4%'],
        ['APAC', '$963M', '$792M', '+21.6%'],
        ['Total', '$4,800M', '$4,030M', '+19.1%'],
      ],
    },
    {
      id: 'src-growth-2',
      format: 'PDF',
      location: 'PAGE 10',
      type: 'document',
      kicker: 'Q4 Market Update · PAGE 10',
      title: 'Operating margin expansion',
      copy: 'Operating income increased to $1.094B from $899M.',
      note: 'Operating margin reached 22.9%, compared with 21.3% a year earlier.',
      facts: [
        { label: 'Revenue', value: '$4.8B' },
        { label: 'Op. income', value: '$1.094B' },
        { label: 'Margin', value: '22.9%' },
      ],
      caption: 'Operating income and margin comparison.',
    },
    {
      id: 'src-growth-3',
      format: 'PDF',
      location: 'PAGE 14',
      type: 'metrics',
      kicker: 'ADOPTION COHORT REVIEW · SIX MONTHS',
      title: 'Six-month active-seat utilization',
      caption: 'Monthly utilization across contracted enterprise seats.',
      metrics: [
        { label: 'JAN', value: '72%', note: 'Baseline' },
        { label: 'APR', value: '76%', note: '+4 pts' },
        { label: 'JUN', value: '78%', note: '+6 pts' },
      ],
      signal: { label: 'Six-month average', value: '78%', note: 'Renewed seats converting into active use' },
    },
  ],
  regional: [
    {
      id: 'src-reg-1',
      format: 'PDF',
      location: 'PAGE 04',
      type: 'bars',
      kicker: 'REGIONAL MIX · Q4 2025',
      title: 'North America remains the base',
      total: '$4.8B GLOBAL REVENUE',
      bars: [
        { label: 'North America', value: '48%', width: 100 },
        { label: 'Europe', value: '27%', width: 56 },
        { label: 'APAC', value: '20%', width: 42 },
        { label: 'Other', value: '5%', width: 14 },
      ],
      note: 'North America grew 18.4% year over year while international markets gained share.',
      caption: 'North America revenue contribution.',
    },
    {
      id: 'src-reg-2',
      format: 'XLSX',
      location: 'SHEET 02',
      type: 'table',
      eyebrow: 'RENEWAL PIPELINE · FORECAST MODEL',
      title: 'Europe renewal forecast',
      badge: '1.22× BLENDED',
      caption: 'Pipeline coverage by customer segment.',
      widths: [32, 26, 22, 20],
      columns: ['Segment', 'Pipeline', 'Coverage', 'Signal'],
      rows: [
        ['Enterprise', '$1.18B', '1.24×', 'On plan'],
        ['Mid-market', '$420M', '1.11×', 'Watch'],
        ['Public sector', '$260M', '1.32×', 'Ahead'],
        ['All segments', '$1.86B', '1.22×', 'On plan'],
      ],
    },
    {
      id: 'src-reg-3',
      format: 'PPTX',
      location: 'SLIDE 11',
      type: 'presentation',
      kicker: 'APAC BUSINESS REVIEW · Q4 2025',
      title: 'APAC quarterly revenue',
      caption: 'APAC revenue increased through Q4 2025.',
      value: '$963M',
      valueLabel: 'Q4 REVENUE · +21.6% YOY',
      copy: 'Quarterly gains accelerated as enterprise deployments expanded across Japan, Australia, Singapore, and South Korea.',
      bullets: ['37% partner-led deployments', 'Fastest-growing global region'],
    },
  ],
  efficiency: [
    {
      id: 'src-eff-1',
      format: 'PDF',
      location: 'PAGE 08',
      type: 'metrics',
      kicker: 'UNIT ECONOMICS · OPERATING MODEL',
      title: 'Margin and unit-cost bridge',
      metrics: [
        { label: 'Q4 2024', value: '21.3%', note: 'Margin' },
        { label: 'Q4 2025', value: '22.9%', note: '+1.6 pts' },
        { label: 'UNIT COST', value: '−11.2%', note: 'YoY' },
      ],
      signal: { label: 'Primary driver', value: '71%', note: 'Predictable workloads on reserved compute' },
      caption: 'Margin expansion and infrastructure unit cost.',
    },
    {
      id: 'src-eff-2',
      format: 'PDF',
      location: 'PAGE 15',
      type: 'scorecard',
      kicker: 'SUPPORT OPERATIONS · REGIONAL BENCHMARK',
      title: 'Regional support productivity',
      caption: 'Support demand and response-time movement by region.',
      items: [
        { label: 'NORTH AMERICA', value: '42 / 1K', delta: 'FRT −14% · COST −6.1%' },
        { label: 'EUROPE', value: '39 / 1K', delta: 'FRT −17% · COST −7.4%' },
        { label: 'APAC', value: '35 / 1K', delta: 'FRT −21% · COST −9.3%' },
      ],
      note: 'Every region improved response time and cost per active seat.',
    },
    {
      id: 'src-eff-3',
      format: 'XLSX',
      location: 'SHEET 04',
      type: 'timeline',
      kicker: 'ROUTING COVERAGE · RULE RELEASES',
      title: 'Automated case routing',
      caption: 'Share of support cases routed without manual triage.',
      steps: [
        { label: 'JAN', title: 'Billing', detail: '18% routed' },
        { label: 'MAR', title: 'Access', detail: '24% routed' },
        { label: 'MAY', title: 'Provisioning', detail: '31% routed' },
        { label: 'JUN', title: 'Quality gate', detail: '34% routed' },
      ],
      note: 'Median first response improved 17% with confidence-gated automation.',
    },
  ],
}

const themeSummaries = {
  growth: {
    topic: 'Q4 performance brief',
    text: 'Q4 revenue reached $4.8B, up 19.1% year over year. North America remained the largest market, while APAC grew fastest at 21.6%. Operating income increased to $1.094B and operating margin improved to 22.9%. Active-seat utilization averaged 78% over six months, supporting a positive outlook.',
    highlights: [
      { startWord: 4, endWord: 7 },
      { startWord: 18, endWord: 22 },
      { startWord: 29, endWord: 35 },
      { startWord: 38, endWord: 41 },
    ],
  },
  regional: {
    topic: 'Regional performance brief',
    text: 'North America remained the largest region at $2.302B, while APAC grew fastest at 21.6% and Europe grew 19.4%. Europe enterprise renewal pipeline coverage reached 1.24×, and APAC quarterly revenue climbed to $963M. The strongest momentum came from APAC, with Europe also tracking ahead of plan.',
    highlights: [
      { startWord: 1, endWord: 8 },
      { startWord: 11, endWord: 15 },
      { startWord: 21, endWord: 27 },
      { startWord: 33, endWord: 36 },
    ],
  },
  efficiency: {
    topic: 'Operating efficiency brief',
    text: 'Operating margin improved to 22.9% from 21.3%, while infrastructure cost per active seat fell 11.2%. Support productivity improved across every region: APAC recorded 35 cases per 1,000 seats and a 21% faster first response. Automated case routing reached 34%, reducing manual triage and supporting further efficiency gains.',
    highlights: [
      { startWord: 1, endWord: 7 },
      { startWord: 9, endWord: 16 },
      { startWord: 23, endWord: 34 },
      { startWord: 37, endWord: 41 },
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

    const readColorToken = (token, fallback) => (
      getComputedStyle(document.documentElement).getPropertyValue(token).trim() || fallback
    )
    const resolveColors = () => document.documentElement.dataset.theme === 'dark'
      ? [
          readColorToken('--md-sys-color-primary-container', '#054437'),
          readColorToken('--md-sys-color-primary', '#23D6B1'),
          readColorToken('--md-sys-color-inverse-primary', '#12846C'),
        ]
      : [
          readColorToken('--mineral-green-50', '#CAFFEE'),
          readColorToken('--page-primary', '#19A88B'),
          readColorToken('--mineral-green-700', '#0A6351'),
        ]
    let colors = resolveColors()
    const syncColors = () => { colors = resolveColors() }
    window.addEventListener('main-palette-change', syncColors)
    const gap = 6
    const pixels = []
    let colorIndex = 0
    for (let x = gap / 2; x < width; x += gap) {
      for (let y = gap / 2; y < height; y += gap) {
        pixels.push({
          x,
          y,
          colorIndex: colorIndex++ % colors.length,
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
        context.fillStyle = colors[pixel.colorIndex]
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
      window.removeEventListener('main-palette-change', syncColors)
    }
  }, [active, delay, duration])

  return <canvas className="trace-pixel-reveal" data-pixel-state="idle" ref={canvasRef} aria-hidden="true" />
}

function SectionPageContent({ page, source }) {
  if (!source) {
    return <p className="section-source-line"><span className="section-page-reference">{page.label}</span></p>
  }

  return (
    <figure className="section-page" data-source-id={source.id}>
      <div className="trace-source-preview section-page-preview">
        <SourcePreviewContent source={source} />
      </div>
      <figcaption><span>{page.label}</span>{source.caption}</figcaption>
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
  heightExtension = 0,
}) {
  const height = 32 + CONNECTION_LINE_EXTENSION + heightExtension
  const rootClassName = `stage-flow-row is-section-to-source${className ? ` ${className}` : ''}`

  if (sourceCount === 2) {
    return (
      <div
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

function ConvergenceLine({
  clipProgress = 1,
  sourceCount = 3,
  documentCount = 2,
  heightExtension = 0,
}) {
  const height = 40 + CONNECTION_LINE_EXTENSION + heightExtension
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
      <article className="trace-source-layout trace-source-layout--table">
        <header className="trace-source-layout-head">
          <span>{source.eyebrow}</span>
          <p className="trace-source-table-title">{source.title}</p>
          <em>{source.badge}</em>
        </header>
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
      </article>
    )
  }

  if (source.type === 'metrics') {
    return (
      <article className="trace-source-layout trace-source-layout--metrics">
        <header className="trace-source-layout-head">
          <span>{source.kicker}</span>
          <p className="trace-source-chart-title">{source.title}</p>
        </header>
        <div className="trace-source-metric-grid">
          {source.metrics.map(metric => (
            <div key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.note}</small>
            </div>
          ))}
        </div>
        <div className="trace-source-signal">
          <span>{source.signal.label}</span>
          <strong>{source.signal.value}</strong>
          <small>{source.signal.note}</small>
        </div>
      </article>
    )
  }

  if (source.type === 'bars') {
    return (
      <article className="trace-source-layout trace-source-layout--bars">
        <header className="trace-source-layout-head">
          <span>{source.kicker}</span>
          <p className="trace-source-chart-title">{source.title}</p>
          <em>{source.total}</em>
        </header>
        <div className="trace-source-bars">
          {source.bars.map(bar => (
            <div className="trace-source-bar" key={bar.label}>
              <span>{bar.label}</span>
              <i><b style={{ width: `${bar.width}%` }} /></i>
              <strong>{bar.value}</strong>
            </div>
          ))}
        </div>
        <p className="trace-source-layout-note">{source.note}</p>
      </article>
    )
  }

  if (source.type === 'presentation') {
    return (
      <article className="trace-source-layout trace-source-layout--presentation">
        <span className="trace-source-presentation-kicker">{source.kicker}</span>
        <div className="trace-source-presentation-grid">
          <div>
            <p className="trace-source-chart-title">{source.title}</p>
            <strong className="trace-source-presentation-value">{source.value}</strong>
            <span className="trace-source-presentation-label">{source.valueLabel}</span>
          </div>
          <div>
            <p>{source.copy}</p>
            <ul>
              {source.bullets.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </article>
    )
  }

  if (source.type === 'scorecard') {
    return (
      <article className="trace-source-layout trace-source-layout--scorecard">
        <header className="trace-source-layout-head">
          <span>{source.kicker}</span>
          <p className="trace-source-chart-title">{source.title}</p>
        </header>
        <div className="trace-source-scorecards">
          {source.items.map(item => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.delta}</small>
            </div>
          ))}
        </div>
        <p className="trace-source-layout-note">{source.note}</p>
      </article>
    )
  }

  if (source.type === 'timeline') {
    return (
      <article className="trace-source-layout trace-source-layout--timeline">
        <header className="trace-source-layout-head">
          <span>{source.kicker}</span>
          <p className="trace-source-chart-title">{source.title}</p>
        </header>
        <ol className="trace-source-timeline">
          {source.steps.map(step => (
            <li key={step.label}>
              <span>{step.label}</span>
              <strong>{step.title}</strong>
              <small>{step.detail}</small>
            </li>
          ))}
        </ol>
        <p className="trace-source-layout-note">{source.note}</p>
      </article>
    )
  }

  if (source.type === 'line') {
    const { chart } = source
    const points = chart.points.map(([x, y]) => `${x},${y}`).join(' ')
    const [firstPoint] = chart.points
    const lastPoint = chart.points.at(-1)
    const areaPath = chart.points
      .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`)
      .join(' ')

    return (
      <>
        <p className="trace-source-chart-title">{source.title}</p>
        <div className="trace-source-chart">
          <svg viewBox="0 0 300 105" role="img" aria-label={chart.ariaLabel}>
            <g className="trace-source-chart-grid">
              <line x1="36" y1="14" x2="294" y2="14" />
              <line x1="36" y1="50" x2="294" y2="50" />
              <line x1="36" y1="86" x2="294" y2="86" />
            </g>
            <g className="trace-source-chart-axis">
              {chart.yLabels.map((label, index) => (
                <text x="0" y={[18, 54, 90][index]} key={label}>{label}</text>
              ))}
              {chart.xLabels.map((label, index) => (
                <text
                  x={[36, 165, 294][index]}
                  y="103"
                  textAnchor={['start', 'middle', 'end'][index]}
                  key={label}
                >
                  {label}
                </text>
              ))}
            </g>
            <path className="trace-source-chart-area" d={`${areaPath} L${lastPoint[0]} 86 L${firstPoint[0]} 86 Z`} />
            <polyline className="trace-source-chart-line" points={points} />
            <g>
              {chart.points.map(([x, y]) => (
                <circle className="trace-source-chart-point" cx={x} cy={y} r="3" key={`${x}-${y}`} />
              ))}
            </g>
            <text
              className="trace-source-chart-end"
              x={Math.max(36, lastPoint[0] - 40)}
              y={Math.max(13, lastPoint[1] - 7)}
            >
              {chart.endLabel}
            </text>
          </svg>
        </div>
      </>
    )
  }

  return (
    <article className={`trace-source-document${source.facts ? ' has-facts' : ''}`}>
      <p className="trace-source-document-kicker">{source.kicker}</p>
      <strong className="trace-source-document-title">{source.title}</strong>
      <p className="trace-source-passage">{source.copy}</p>
      {source.facts && (
        <dl className="trace-source-document-facts">
          {source.facts.map(fact => (
            <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
          ))}
        </dl>
      )}
      <p className="trace-source-document-note">{source.note}</p>
    </article>
  )
}

function getThemeHierarchy(theme) {
  return theme.documents.flatMap(document => (
    document.sections.map(section => {
      const page = section.pages[0]

      return {
        source: document.name,
        location: `${section.name} · ${page.label}`,
      }
    })
  )).map((item, index) => ({
    ...item,
    type: ['doc', 'table', 'chart'][index] ?? 'doc',
    isActive: index === 0,
  }))
}

function CrossDocumentHierarchyCard({ activeThemeId, opacity = 1, translateY = 0, motionActive = false }) {
  const theme = themes.find(item => item.id === activeThemeId) ?? themes[0]
  const hierarchy = getThemeHierarchy(theme)
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <>
      <span className="trace-summary-label" id="trace-summary-title">Source-backed context</span>
      <aside
        className="trace-summary-card"
        data-trace-summary-card
        data-motion-active={motionActive ? 'true' : undefined}
        aria-labelledby="trace-summary-title"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          transition: reducedMotion ? 'none' : 'opacity 0.15s ease-out, transform 0.15s ease-out',
          pointerEvents: opacity > 0.5 ? 'auto' : 'none',
        }}
      >
        <div className="trace-card-content">
          <div className="trace-hierarchy" data-trace-summary>
            <ul className="trace-hierarchy-list">
              {hierarchy.map((item, index) => (
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
    </>
  )
}

function AIOutputReport({
  documentCount = 0,
  opacity = 1,
  translateY = 0,
  motionActive = false,
  inkProgress = 1,
  sourceCount = 0,
  summary = themeSummaries.growth,
}) {
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const documentLabel = `${documentCount} document${documentCount === 1 ? '' : 's'}`
  const sourceLabel = `${sourceCount} source region${sourceCount === 1 ? '' : 's'}`

  return (
    <section
      className="ai-output-report"
      translate="no"
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
        highlights={summary.highlights}
        progress={inkProgress}
      >
        {summary.text}
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
  const openTimer = useRef(0)
  const activeTheme = themes.find(theme => theme.id === activeThemeId) ?? themes[0]
  const currentSources = themeSourcesMap[activeTheme.id] ?? themeSourcesMap.growth
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const showCrossDocumentLink = activeTheme.documents.length === 2
    && activeTheme.documents[0].sections.length >= 2
  const sourceConnectionHeightExtension = isDesktop ? DESKTOP_SOURCE_CONNECTION_EXTENSION : 0

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

  // The camera sequence needs desktop geometry; tablet and mobile use static evidence layouts.
  const p = reducedMotion || !isDesktop ? 1 : scrollProgress
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
  const cameraShiftY = (reducedMotion || !isDesktop)
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
            <div className="mobile-narrative-stage">
              {/* STAGE 1: Full-height source documents */}
              <div
                className="document-map-documents"
                data-document-count={activeTheme.documents.length}
                data-cross-link={showCrossDocumentLink ? 's2-s1' : undefined}
              >
              {activeTheme.documents.map((document, documentIndex) => {
                const documentSections = isMobile
                  ? document.sections.slice(0, 1)
                  : document.sections

                return (
                <article
                  className={`document-branch${selectedName === document.name ? ' is-selected' : ''}`}
                  key={document.name}
                >
                  <header className="document-node">
                    <span>DOCUMENT {documentIndex + 1}</span>
                    <strong>{document.name}</strong>
                  </header>
                  <DocumentBranchLine
                    sectionCount={documentSections.length}
                    clipProgress={1}
                  />
                  <div
                    className="document-sections"
                    data-section-count={documentSections.length}
                    style={{
                      '--section-count': documentSections.length,
                    }}
                  >
                    {documentSections.map((section, sectionIndex) => {
                      const visiblePages = isMobile ? section.pages.slice(0, 1) : section.pages
                      const [firstPage, ...remainingPages] = visiblePages
                      const firstPageSource = currentSources.find(source => source.id === firstPage.sourceId)
                      const [introCopy, ...supportingCopy] = Array.isArray(section.copy)
                        ? section.copy
                        : [section.copy]
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
                              {introCopy}
                              {!firstPageSource && <span className="section-page-reference">{firstPage.label}</span>}
                            </p>
                            {firstPageSource && <SectionPageContent page={firstPage} source={firstPageSource} />}
                            {supportingCopy.map((paragraph, index) => (
                              <p key={`${section.name}-copy-${index}`}>{paragraph}</p>
                            ))}
                            {remainingPages.map(page => (
                              <SectionPageContent
                                page={page}
                                source={currentSources.find(source => source.id === page.sourceId)}
                                key={page.sourceId}
                              />
                            ))}
                          </div>
                        </SectionTag>
                      )
                    })}
                  </div>
                </article>
                )
              })}
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
                heightExtension={sourceConnectionHeightExtension}
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
                return (
                  <figure
                    className="trace-source-card"
                    key={source.id}
                    data-source-slot={slot}
                    data-region={source.type}
                    data-motion-active={isDesktop && pSourceCards > 0.05 ? 'true' : undefined}
                    style={{ '--trace-motion-delay': `${index * 70}ms` }}
                  >
                    <div className="trace-card-content">
                      <figcaption>
                        <span className="trace-folder-tab">
                          Original file<span className="mobile-source-index"> {String(index + 1).padStart(2, '0')}</span>
                        </span>
                        <span data-trace-coordinate>{source.format} · {source.location}</span>
                      </figcaption>
                      <div className="trace-source-thumb">
                        <div className="trace-source-frame">
                          <div className="trace-source-media">
                            <div className="trace-source-preview">
                              <SourcePreviewContent source={source} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <TracePixelReveal
                      active={isDesktop && pSourceCards > 0.05}
                      delay={index * 70}
                    />
                  </figure>
                )
              })}
              </div>

              {/* STAGE 3: 3-to-1 convergence and cross-document hierarchy */}
              <ConvergenceLine
                clipProgress={pConvergenceLine}
                sourceCount={currentSources.length}
                documentCount={activeTheme.documents.length}
                heightExtension={sourceConnectionHeightExtension}
              />

              <div
                className="mobile-summary-item"
              >
                <CrossDocumentHierarchyCard
                  activeThemeId={activeTheme.id}
                  opacity={pHierarchyCard}
                  translateY={(1 - pHierarchyCard) * 18}
                  motionActive={isDesktop && pHierarchyCard > 0.05}
                />
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
              motionActive={isDesktop && pSummaryDocument > 0.05}
              inkProgress={pSummaryInk}
              sourceCount={currentSources.length}
              summary={themeSummaries[activeTheme.id] ?? themeSummaries.growth}
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
      {themes.map(theme => {
        const labelParts = theme.label.split(' ')
        const finalLabelPart = labelParts.pop()

        return (
          <button
            type="button"
            key={theme.id}
            aria-pressed={theme.id === activeThemeId}
            onClick={() => onChange(theme.id)}
          >
            <span>
              <span className="document-map-switcher-line">
                {labelParts.join(' ')}
              </span>
              <span className="document-map-switcher-line is-tail">{finalLabelPart}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

const SCAN_DEMO_CROP_CSS = `
html, body {
  margin: 0 !important;
  height: auto !important;
  min-height: 0 !important;
  overflow: hidden !important;
  background: var(--white-100, #fff) !important;
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
  const isDesktop = useProductLayoutQuery(DESKTOP_PRODUCT_QUERY)
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
    setScrollProgress(reducedMotion || !isDesktop ? 1 : clamp(latest))
  })

  useEffect(() => {
    setScrollProgress(reducedMotion || !isDesktop ? 1 : clamp(scrollYProgress.get()))
  }, [isDesktop, reducedMotion, scrollYProgress])

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
