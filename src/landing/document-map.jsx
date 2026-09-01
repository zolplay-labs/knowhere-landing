import { useEffect, useRef, useState } from 'react'
import revenueChart from '../../assets/source-chart.png'
import marginAnalysis from '../../assets/source-margin.png'
import revenueAnalysis from '../../assets/source-revenue.png'
import revenueTable from '../../assets/source-table.png'

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

function DocumentMap({ activeThemeId, onOpenTrace, inactive = false }) {
  const interactive = typeof onOpenTrace === 'function'
  const [selectedName, setSelectedName] = useState(null)
  const openTimer = useRef(0)
  const activeTheme = themes.find(theme => theme.id === activeThemeId) ?? themes[0]
  const NodeTag = interactive ? 'button' : 'header'
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

  return (
    <section className="document-map reveal" aria-labelledby="document-map-title" inert={inactive ? '' : undefined}>
      <span className="sr-only" id="document-map-title">Document map</span>
      <div className="document-map-hierarchy">
        <div className="document-map-hierarchy-canvas" data-document-count={activeTheme.documents.length} style={{ '--document-count': activeTheme.documents.length }}>
          <div className="document-map-content" key={activeTheme.id} aria-live="polite">
            <div className="document-map-documents" data-document-count={activeTheme.documents.length}>
              {activeTheme.documents.map((document, documentIndex) => (
                <article
                  className={`document-branch${selectedName === document.name ? ' is-selected' : ''}`}
                  key={document.name}
                >
                  <NodeTag
                    className="document-node"
                    {...(interactive
                      ? {
                          type: 'button',
                          onClick: () => openTrace(document),
                          'aria-label': `Open ${document.name}`,
                        }
                      : {})}
                  >
                    <span>DOCUMENT {documentIndex + 1}</span>
                    <strong>{document.name}</strong>
                  </NodeTag>
                  <div className="document-branch-line" aria-hidden="true" />
                  <div
                    className="document-sections"
                    data-section-count={document.sections.length}
                    style={{ '--section-count': document.sections.length }}
                  >
                    {document.sections.map((section, sectionIndex) => {
                      const [firstPage, ...remainingPages] = section.pages
                      const firstPageMedia = getPageMedia(firstPage)

                      return (
                        <section className="section-node" key={section.name}>
                          <header>
                            <span>SECTION {sectionIndex + 1}</span>
                            <strong>{section.name}</strong>
                          </header>
                          <div className="section-body">
                            <p>
                              {performanceCopy[0]}
                              {!firstPageMedia && <span className="section-page-reference">PAGE {firstPage.number}</span>}
                            </p>
                            {firstPageMedia && <SectionPageContent page={firstPage} />}
                            <p>{performanceCopy[1]}</p>
                            {remainingPages.map(page => <SectionPageContent page={page} key={page.number} />)}
                          </div>
                        </section>
                      )
                    })}
                  </div>
                </article>
              ))}
            </div>
            {activeTheme.documents.length > 1 && (
              <div className="cross-document-link" aria-label="Sections connected across documents"><span>Cross-document relationship</span></div>
            )}
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

export function ProductStage() {
  const isMobile = useMobileProductLayout()
  const [stage, setStage] = useState('map')
  const [activeThemeId, setActiveThemeId] = useState(themes[0].id)
  const iframeRef = useRef(null)
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const revealTrace = () => {
    const frame = iframeRef.current
    try {
      frame?.contentWindow?.postMessage({ type: 'knowhere-play-trace' }, window.location.origin)
    } catch {
      // Same-origin preview only; a missing iframe must not block the stage change.
    }
    setStage('trace')
  }

  return (
    <>
      <div className="product-stage-switcher-row">
        <DocumentMapSwitcher activeThemeId={activeThemeId} onChange={setActiveThemeId} />
      </div>
      <div className={`product-stage${stage === 'trace' ? ' is-trace' : ''}${isMobile ? ' is-stacked' : ''}`}>
        <div
          className="product-stage-track"
          style={reducedMotion && stage === 'trace' ? { transition: 'none' } : undefined}
        >
          <DocumentMap
            activeThemeId={activeThemeId}
            inactive={!isMobile && stage === 'trace'}
            onOpenTrace={isMobile ? undefined : revealTrace}
          />
          <div className="section-scan-frame" inert={!isMobile && stage === 'map' ? '' : undefined}>
            <iframe
              ref={iframeRef}
              src="document-scan-section.html"
              title="Document scan and source traceability demonstration"
              loading="eager"
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
        </div>
        {!isMobile && stage === 'trace' && (
          <button
            type="button"
            className="product-stage-back"
            onClick={() => setStage('map')}
          >
            Back to document map
          </button>
        )}
      </div>
    </>
  )
}
