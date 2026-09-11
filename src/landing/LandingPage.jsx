import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CatenoidFieldTuner } from './catenoid-field-embed'
import { CTA_HELIX_FALLBACK, ConvergingHelixEmbed } from './converging-helix-embed'
import { EnterpriseIllustration } from './enterprise-illustrations'
import { initializeLandingCanvases } from './landing-canvas'
import { initializeLandingInteractions } from './landing-interactions'
import { ProductStage } from './document-map'
import ShinyText from './ShinyText'
import { SiteHeader } from '../../shared/site-chrome/SiteHeader'
import { SiteFooter } from '../../shared/site-chrome/SiteFooter'

function SectionShinyText({ text }) {
  return (
    <ShinyText
      text={text}
      speed={2}
      delay={0}
      color="currentColor"
      shineColor="var(--figma-primary)"
      spread={120}
      direction="left"
      yoyo={false}
      pauseOnHover={false}
    />
  )
}

function TokenIcon({ src, className = '' }) {
  return (
    <span
      className={`token-icon ${className}`.trim()}
      style={{ '--token-icon-source': `url("${src}")` }}
      aria-hidden="true"
    />
  )
}

const structureTreeRows = [
  { label: 'Document map', level: 0, open: false },
  { label: 'Headings', level: 0, open: false },
  { label: 'Structure map', level: 0, open: true },
  { label: 'Annual report', level: 1, open: true },
  { label: 'Executive summary', level: 2, open: true },
  { label: 'Market findings', level: 3, leaf: true },
  { label: 'Revenue by region', level: 3, leaf: true },
  { label: 'Forecast formulas', level: 2, open: false },
  { label: 'Page relationships', level: 1, open: false },
  { label: 'Tables', level: 0, open: false },
  { label: 'Visual regions', level: 0, open: false },
]

function CapabilityTree({ className = '', rows }) {
  return (
    <div className={`capability-figma-tree ${className}`.trim()}>
      {rows.map((row, rowIndex) => (
        <div className="capability-tree-row" data-level={row.level} key={row.label}>
          {Array.from({ length: row.level }, (_, depth) => (
            <span
              className="capability-tree-trail"
              style={{
                '--tree-depth': depth,
                '--tree-bottom': (rows[rowIndex + 1]?.level ?? 0) > depth ? '-50%' : '50%',
              }}
              aria-hidden="true"
              key={depth}
            />
          ))}
          {row.level > 0 ? (
            <span
              className="capability-tree-branch"
              style={{ '--tree-depth': row.level - 1 }}
              aria-hidden="true"
            />
          ) : null}
          <span className="capability-tree-leading"><TokenIcon src={row.leaf ? '/assets/process-checkbox.svg' : row.open ? '/assets/process-arrow-down.svg' : '/assets/process-arrow-right.svg'} /></span>
          <span className="capability-tree-label">{row.label}</span>
          <span className="capability-tree-actions"><TokenIcon src="/assets/process-check.svg" /><TokenIcon src="/assets/process-more.svg" /><TokenIcon src="/assets/process-action-arrow.svg" /></span>
        </div>
      ))}
    </div>
  )
}

function CapabilityCodeCard({ variant }) {
  const snippets = {
    left: [
      '// preserve page provenance',
      'const page = document.pages[12]',
      'const region = page.regions.revenue',
      'const source = region.source',
      'const bounds = region.boundingBox',
      'const content = region.content',
      'return { source, bounds, content }',
    ],
    center: [
      '// traceable document context',
      'const context = {',
      "  type: 'structured',",
      '  page: 12,',
      "  region: 'revenue',",
      "  source: 'annual-report.pdf',",
      "  path: 'tables/revenue-by-region'",
      '}',
      'return context.source',
    ],
    right: [
      '// return agent-ready context',
      'export function getContext(result) {',
      '  return {',
      '    content: result.content,',
      '    citations: result.sources,',
      '    documentMap: result.map',
      '  }',
      '}',
    ],
  }

  return (
    <div className={`capability-code-card capability-code-card--${variant}`}>
      <span className="capability-code-corner capability-code-corner--tl" />
      <span className="capability-code-corner capability-code-corner--tr" />
      <span className="capability-code-corner capability-code-corner--bl" />
      <span className="capability-code-corner capability-code-corner--br" />
      <code>
        {snippets[variant].map((line, index) => <span key={`${variant}-${index}`}>{line}</span>)}
      </code>
    </div>
  )
}

function CapabilityProductPreview({ story }) {
  if (story === 'structure') {
    return (
      <div className="capability-product-preview capability-product-preview--ingest" aria-hidden="true">
        <div className="capability-figma-upload">
          <span className="capability-corner capability-corner--top" />
          <div className="capability-upload-header"><div><strong>Ingest documents</strong><small>Add supported formats securely.</small></div><TokenIcon src="/assets/process-close.svg" /></div>
          <div className="capability-upload-drop"><img className="capability-upload-icon" src="/assets/process-upload-file.svg" alt="" /><div className="capability-upload-drop-copy"><strong>Drag and drop documents</strong><small>PDF, XLSX, PPTX, scans, and more</small></div><button type="button" tabIndex={-1}>Select file</button></div>
          <div className="capability-upload-files"><strong>Ingested files</strong><div><img className="capability-file-icon" src="/assets/process-upload-file.svg" alt="" /><span><b>Annual report.pdf</b><small>48 pages · Processing</small></span><button type="button" tabIndex={-1}>×</button></div><div><img className="capability-file-icon" src="/assets/process-upload-file.svg" alt="" /><span><b>Forecast.xlsx</b><small>6 sheets · Ready</small></span><button type="button" tabIndex={-1}>×</button></div></div>
          <div className="capability-upload-actions"><button type="button" tabIndex={-1}>Cancel</button><button type="button" tabIndex={-1}>Attach file</button></div>
        </div>
      </div>
    )
  }

  if (story === 'visual') {
    return (
      <div className="capability-product-preview capability-product-preview--capture" aria-hidden="true">
        <div className="capability-capture-stack">
          <article className="capability-capture-card capability-capture-card--table">
            <span className="capability-capture-corner capability-capture-corner--tl" /><span className="capability-capture-corner capability-capture-corner--tr" /><span className="capability-capture-corner capability-capture-corner--bl" /><span className="capability-capture-corner capability-capture-corner--br" />
            <header className="capability-capture-card-header"><strong>Tables</strong><p>Rows, columns, and headers stay connected to the page.</p></header>
            <div className="capability-capture-table">
              <div className="capability-capture-table-row capability-capture-table-row--head"><span>Region</span><span>Captured</span></div>
              <div className="capability-capture-table-row"><span>NA</span><span>48%</span></div>
              <div className="capability-capture-table-row"><span>EU</span><span>34%</span></div>
              <div className="capability-capture-table-row"><span>APAC</span><span>29%</span></div>
            </div>
          </article>

          <article className="capability-capture-card capability-capture-card--chart">
            <span className="capability-capture-corner capability-capture-corner--tl" /><span className="capability-capture-corner capability-capture-corner--tr" /><span className="capability-capture-corner capability-capture-corner--bl" /><span className="capability-capture-corner capability-capture-corner--br" />
            <header className="capability-capture-card-header"><strong>Charts</strong><p>Labels, legends, and visual relationships are preserved.</p></header>
            <div className="capability-capture-chart-title"><strong>Revenue by region</strong><span><i /> 2025</span></div>
            <div className="capability-capture-chart">
              <span style={{ '--bar-height': '44%' }} /><span style={{ '--bar-height': '62%' }} />
              <span style={{ '--bar-height': '53%' }} /><span style={{ '--bar-height': '76%' }} />
              <span style={{ '--bar-height': '68%' }} /><span style={{ '--bar-height': '84%' }} />
              <span style={{ '--bar-height': '71%' }} /><span style={{ '--bar-height': '92%' }} />
              <span style={{ '--bar-height': '79%' }} /><span style={{ '--bar-height': '88%' }} />
              <span style={{ '--bar-height': '73%' }} /><span style={{ '--bar-height': '96%' }} />
            </div>
          </article>

          <article className="capability-capture-card capability-capture-card--layout">
            <span className="capability-capture-corner capability-capture-corner--tl" /><span className="capability-capture-corner capability-capture-corner--tr" /><span className="capability-capture-corner capability-capture-corner--bl" /><span className="capability-capture-corner capability-capture-corner--br" />
            <header className="capability-capture-card-header"><strong>Layouts</strong><p>Text and visual regions retain their original positions.</p></header>
            <div className="capability-capture-layout-page">
              <span className="capability-capture-layout-heading" />
              <span className="capability-capture-layout-line capability-capture-layout-line--long" />
              <span className="capability-capture-layout-line" />
              <div className="capability-capture-layout-columns"><span /><span><i /><i /><i /></span></div>
              <span className="capability-capture-layout-line capability-capture-layout-line--long" />
              <span className="capability-capture-layout-line" />
            </div>
          </article>
        </div>
      </div>
    )
  }

  if (story === 'source') {
    return (
      <div className="capability-product-preview capability-product-preview--outline" aria-hidden="true">
        <CapabilityTree className="capability-figma-tree--focus" rows={structureTreeRows} />
      </div>
    )
  }

  return (
    <div className="capability-product-preview capability-product-preview--trace" aria-hidden="true">
      <div className="capability-code-cascade">
        <CapabilityCodeCard variant="left" />
        <span className="capability-code-connector capability-code-connector--left" />
        <CapabilityCodeCard variant="center" />
        <span className="capability-code-connector capability-code-connector--right" />
        <CapabilityCodeCard variant="right" />
      </div>
    </div>
  )
}

function FinalCtaHelix({ theme }) {
  const accentColor = theme === 'dark' ? 'var(--mineral-green-600)' : 'var(--mineral-green-300)'
  const embedProps = { ...CTA_HELIX_FALLBACK, accentColor }

  return (
    <>
      <div className="converging-helix-pair" aria-hidden="true" style={{ '--converging-helix-y': `${CTA_HELIX_FALLBACK.yPosition}px` }}>
        <ConvergingHelixEmbed {...embedProps} className="converging-helix-embed--left" />
        <ConvergingHelixEmbed {...embedProps} className="converging-helix-embed--right" mirror />
      </div>
    </>
  )
}

export function LandingPage() {
  const rootRef = useRef(null)
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')

  useEffect(() => {
    // Cross-page fragments arrive before the client-rendered sections exist.
    // Reloads and history traversal should retain the browser's saved position.
    const navigation = performance.getEntriesByType('navigation')[0]
    if (navigation?.type === 'reload' || navigation?.type === 'back_forward') return undefined
    const hash = window.location.hash
    if (!hash) return undefined
    let cancelled = false
    let frame
    document.fonts.ready.then(() => {
      if (cancelled) return
      frame = requestAnimationFrame(() => {
        if (window.location.hash === hash) {
          document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
        }
      })
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const cleanupCanvases = initializeLandingCanvases(root)
    const cleanupInteractions = initializeLandingInteractions(root)
    return () => {
      cleanupCanvases()
      cleanupInteractions()
    }
  }, [])

  useLayoutEffect(() => {
    const root = document.documentElement
    const scanFrame = rootRef.current?.querySelector('.section-scan-frame iframe')
    const applyTheme = (targetDocument) => {
      if (!targetDocument?.documentElement) return
      targetDocument.documentElement.dataset.theme = theme
      targetDocument.documentElement.style.colorScheme = theme
      targetDocument.defaultView?.dispatchEvent(new CustomEvent('main-palette-change'))
    }
    const syncTheme = () => {
      applyTheme(document)
      try {
        applyTheme(scanFrame?.contentDocument)
      } catch {
        // A future cross-origin preview must not block the main page theme.
      }
    }

    syncTheme()
    scanFrame?.addEventListener('load', syncTheme)
    return () => scanFrame?.removeEventListener('load', syncTheme)
  }, [theme])

  return (
<div className="landing-page" ref={rootRef}>
  <div className="layout-grid-overlay" aria-hidden="true" />
  <a className="skip-link" href="#main">Skip to content</a>
  <SiteHeader onThemeChange={setTheme} />
  <main id="main" tabIndex={-1}>
    <section className="hero shell hero-b-layout" id="top" aria-labelledby="hero-title">
      <canvas id="hero-b-pixel-field" aria-hidden="true" />
      <div className="hero-copy">
        <h1 id="hero-title" data-heading-primary="agents can use">Turn complex documents into context your agents can use.</h1>
        <p className="lede">Knowhere preserves structure, visual context, and source links, giving agents information they can navigate, retrieve, and verify.</p>
        <div className="button-row"><a className="button" href="https://knowhere-login.knowhere-landing.workers.dev">Start free trial</a><a className="button button-secondary" href="https://docs.knowhereto.ai/">Read the docs</a></div>
      </div>
      <div className="hero-visual" aria-label="Interactive four-stage document processing pipeline from original document to RAG structure">
        <article className="hero-b-chart">
          <div className="hero-b-chart-shell" aria-hidden="true" />
        </article>
      </div>
    </section>
    <canvas className="hero-scan-overlay" aria-hidden="true" />
    <div className="hero-b-pixel-tooltip" id="hero-b-pixel-tooltip" role="status" aria-live="polite" />
    <section className="section shell" id="playground" aria-labelledby="playground-title">
      <ProductStage heading={(
        <div className="section-heading"><p className="section-no"><SectionShinyText text="[ PRODUCT ]" /></p><h2 id="playground-title"><SectionShinyText text="See how Knowhere turns documents into structured, traceable context." /></h2><p>Explore page-level evidence, text content, and spreadsheet tables across PDF, Word, and Excel.<a className="product-formats-link" href="#formats">View all supported formats</a></p></div>
      )} />
      <aside className="sample-panel sample-panel--standalone" aria-label="Preset source documents" hidden>
        <ol className="sample-list" role="listbox" aria-label="Preset documents">
          <li role="presentation"><button role="option" aria-selected="true" draggable="true" data-sample="research"><span className="sample-spine-num">01</span><span className="sample-file-name">Tesla Q4 2025 Update.pdf</span><span className="sample-file-type">PDF</span><span className="sample-spine-dot" aria-hidden="true" /><span className="sample-spine-progress" aria-hidden="true"><span /></span><span className="sample-drag">Drag ↗</span></button></li>
          <li role="presentation"><button role="option" aria-selected="false" draggable="true" data-sample="sales"><span className="sample-spine-num">02</span><span className="sample-file-name">Product strategy deck.pptx</span><span className="sample-file-type">PPTX</span><span className="sample-spine-dot" aria-hidden="true" /><span className="sample-spine-progress" aria-hidden="true"><span /></span><span className="sample-drag">Drag ↗</span></button></li>
          <li role="presentation"><button role="option" aria-selected="false" draggable="true" data-sample="finance"><span className="sample-spine-num">03</span><span className="sample-file-name">Financial model.xlsx</span><span className="sample-file-type">XLSX</span><span className="sample-spine-dot" aria-hidden="true" /><span className="sample-spine-progress" aria-hidden="true"><span /></span><span className="sample-drag">Drag ↗</span></button></li>
          <li role="presentation"><button role="option" aria-selected="false" draggable="true" data-sample="atlas"><span className="sample-spine-num">04</span><span className="sample-file-name">Architectural atlas.pdf</span><span className="sample-file-type">PDF</span><span className="sample-spine-dot" aria-hidden="true" /><span className="sample-spine-progress" aria-hidden="true"><span /></span><span className="sample-drag">Drag ↗</span></button></li>
        </ol>
      </aside>
      <div className="playground preset-workspace" hidden>
        <div className="workbench-zone" data-workbench-drop tabIndex={0} aria-label="Structured document workspace">
          <div className="workbench-topbar"><span className="workbench-kicker">Knowhere <span aria-hidden="true">·</span> Agent</span><span className="workbench-state" data-workbench-state>Awaiting preset document</span></div>
          <div className="workbench-shell">
            <nav className="workbench-sidebar"><p className="workbench-source">SOURCE</p><strong data-workbench-file>Drop a preset document</strong><div className="tabs workbench-tabs" role="tablist" aria-label="Structured document views"><button role="tab" id="workbench-tab-data" aria-selected="true" aria-controls="workbench-panel-data">Document Data</button><button role="tab" id="workbench-tab-text" aria-selected="false" aria-controls="workbench-panel-text" tabIndex={-1}>Full Text</button><button role="tab" id="workbench-tab-outline" aria-selected="false" aria-controls="workbench-panel-outline" tabIndex={-1}>Document Outline</button><button role="tab" id="workbench-tab-structure" aria-selected="false" aria-controls="workbench-panel-structure" tabIndex={-1}>Structure</button><button role="tab" id="workbench-tab-images" aria-selected="false" aria-controls="workbench-panel-images" tabIndex={-1}>Vision Map</button></div></nav>
            <div className="workbench-content"><div className="workbench-drop-overlay" data-workbench-overlay><span>↓</span><strong>Drag a preset document here</strong><p>Prepared examples only. Local file upload is not available in this prototype.</p></div><div role="tabpanel" id="workbench-panel-data" aria-labelledby="workbench-tab-data"><pre className="structured-json" tabIndex={0}><code data-workbench-code>{"{"}{"\n"}{"  "}"document": "Awaiting preset document",{"\n"}{"  "}"status": "drop a prepared example to begin"{"\n"}{"}"}</code></pre></div><div role="tabpanel" id="workbench-panel-text" aria-labelledby="workbench-tab-text" hidden><p className="panel-label">Clean text</p><p data-workbench-text>Structured text will appear after a preset document is dropped here.</p></div><div role="tabpanel" id="workbench-panel-outline" aria-labelledby="workbench-tab-outline" hidden><p className="panel-label">Document outline</p><ol className="workbench-outline" data-workbench-outline><li>Awaiting document</li></ol></div><div role="tabpanel" id="workbench-panel-structure" aria-labelledby="workbench-tab-structure" hidden><p className="panel-label">Parsed structure</p><div className="workbench-tree" data-workbench-tree>Choose a preset document to inspect its sections, tables, and source regions.</div></div><div role="tabpanel" id="workbench-panel-images" aria-labelledby="workbench-tab-images" hidden><p className="panel-label">Original pages &amp; visual regions</p><div className="workbench-assets" data-workbench-assets>Choose a document to inspect its page-native visual map.</div></div></div>
          </div>
          <div className="workbench-composer" aria-hidden="true"><span>Ask about this document...</span><span className="workbench-composer-meta">KNOWHERE / STRUCTURED</span></div>
        </div>
        <aside className="playground-status-card playground-status-card--connections" aria-label="Document connections"><p className="playground-card-label">prepared_source_preview</p><div className="playground-status-row"><span>Prepared document</span><small className="playground-status-ok">Illustrative</small></div><div className="playground-status-row"><span>Source-region preview</span><small className="playground-status-ok">Illustrative</small></div><div className="playground-status-row"><span>Visual-context preview</span><small>Prepared</small></div></aside>
        <aside className="playground-status-card playground-status-card--trace" aria-label="Traceable output status"><p className="playground-card-label">prepared_result_preview</p><div className="playground-trace-code"><span>PAGE_REGION  /  illustrated</span><span>TABLE_CELL   /  prepared</span><span>SOURCE_PATH  /  preview</span><span>STATUS       /  illustrative</span></div></aside>
        <aside className="playground-status-card playground-status-card--config" aria-label="Agent configuration"><p className="playground-card-label">demo_config</p><div className="playground-status-row"><small>Agent</small><span>Example agent</span></div><div className="playground-status-row"><small>Output</small><span>Illustrative structure</span></div><div className="playground-status-row"><small>Trace</small><span>Source preview</span></div></aside>
        <aside className="playground-status-card playground-status-card--left playground-status-card--connections" aria-hidden="true"><p className="playground-card-label">prepared_source_preview</p><div className="playground-status-row"><span>Prepared document</span><small className="playground-status-ok">Illustrative</small></div><div className="playground-status-row"><span>Source-region preview</span><small className="playground-status-ok">Illustrative</small></div><div className="playground-status-row"><span>Visual-context preview</span><small>Prepared</small></div></aside>
        <aside className="playground-status-card playground-status-card--left playground-status-card--trace" aria-hidden="true"><p className="playground-card-label">prepared_result_preview</p><div className="playground-trace-code"><span>PAGE_REGION  /  illustrated</span><span>TABLE_CELL   /  prepared</span><span>SOURCE_PATH  /  preview</span><span>STATUS       /  illustrative</span></div></aside>
        <aside className="playground-status-card playground-status-card--left playground-status-card--config" aria-hidden="true"><p className="playground-card-label">demo_config</p><div className="playground-status-row"><small>Agent</small><span>Example agent</span></div><div className="playground-status-row"><small>Output</small><span>Illustrative structure</span></div><div className="playground-status-row"><small>Trace</small><span>Source preview</span></div></aside>
      </div>
    </section>
    <div className="capabilities-scroll-track">
      <section className="section shell narrative reveal" id="capabilities" aria-labelledby="capabilities-title">
        <div className="capabilities-sticky">
          <div className="section-heading"><p className="section-no"><SectionShinyText text="[ PROCESS ]" /></p><h2 id="capabilities-title"><SectionShinyText text="A document pipeline that keeps context connected." /></h2><p>From ingestion to structured output, every step keeps the document connected to its original source.</p></div>
          <div className="narrative-grid">
            <div className="story-card-stack">
              <article className="story-canvas story-card" id="story-panel-structure" data-story="structure">
                <div className="capability-frame"><div className="capability-media" role="img" aria-label="Converging document streams with a document upload queue"><CapabilityProductPreview story="structure" /></div></div>
                <div className="capability-copy"><div className="capability-copy-main"><div className="capability-copy-title"><span className="capability-copy-index">01</span><h3 data-story-heading>Ingest documents</h3></div><p data-story-summary>Upload PDFs, spreadsheets, presentations, scans, and other supported formats.</p></div></div>
              </article>
              <article className="story-canvas story-card" id="story-panel-visual" data-story="visual">
                <div className="capability-frame"><div className="capability-media" role="img" aria-label="Projected page capture field with detected page regions"><CapabilityProductPreview story="visual" /></div></div>
                <div className="capability-copy"><div className="capability-copy-main"><div className="capability-copy-title"><span className="capability-copy-index">02</span><h3 data-story-heading>Capture every page</h3></div><p data-story-summary>Extract text and visual regions while preserving the original page layout.</p></div></div>
              </article>
              <article className="story-canvas story-card" id="story-panel-source" data-story="source">
                <div className="capability-frame"><div className="capability-media" role="img" aria-label="Layered document structure grid with a document outline"><CapabilityProductPreview story="source" /></div></div>
                <div className="capability-copy"><div className="capability-copy-main"><div className="capability-copy-title"><span className="capability-copy-index">03</span><h3 data-story-heading>Map document structure</h3></div><p data-story-summary>Identify headings, tables, formulas, layouts, and relationships across the document.</p></div></div>
              </article>
              <article className="story-canvas story-card" id="story-panel-relations" data-story="relations">
                <div className="capability-frame"><div className="capability-media" role="img" aria-label="Traceable source relationship field with structured JSON and a source path"><CapabilityProductPreview story="relations" /></div></div>
                <div className="capability-copy"><div className="capability-copy-main"><div className="capability-copy-title"><span className="capability-copy-index">04</span><h3 data-story-heading>Return traceable context</h3></div><p data-story-summary>Receive structured JSON, navigable document maps, and source-linked pages for agents.</p></div></div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div className="formats-scroll-track">
      <section className="section shell reveal" id="formats" aria-labelledby="formats-title">
        <div className="section-heading"><p className="section-no"><SectionShinyText text="[ CAPABILITIES ]" /></p><h2 id="formats-title"><SectionShinyText text="Built for documents that plain text cannot capture." /></h2><p>Preserve page structure, visual meaning, formulas, and source relationships across complex file formats.</p></div>
        <div className="formats-grid">
          <article className="format-feature format-feature--formats">
            <div className="format-orbit-layout format-intro-ready">
              <span className="format-orbit-halo format-orbit-halo--supported" aria-hidden="true" />
              <span className="format-orbit-halo format-orbit-halo--coming" aria-hidden="true" />
              <div className="format-orbit-copy format-orbit-copy--supported">
                <p>Works with common document, presentation,<br /> spreadsheet, image, and text formats:</p>
                <p>DOCX, PDF, JPG, PPTX, XLSX, CSV, PNG, MD, JSON, and TXT.</p>
              </div>
              <div className="format-orbit-stage format-orbit-stage--thread-globe" aria-label="Illustrative formats">
                <canvas className="format-globe-canvas" data-format-globe aria-hidden="true" />
                <span className="format-orbit-ring format-orbit-ring--inner" aria-hidden="true" />
                <span className="format-orbit-ring format-orbit-ring--middle" aria-hidden="true" />
                <span className="format-orbit-ring format-orbit-ring--outer" aria-hidden="true" />
                <span className="format-orbit-center" aria-hidden="true">KNOWHERE</span>
                <div className="format-orbit-shell format-orbit-shell--inner">
                  <div className="format-chips format-orbit-track">
                    <span className="format-orbit-item" style={{'--orbit-x': '100%', '--orbit-y': '50%'}}><span className="format-orbit-counter"><button className="format-orbit-chip" data-format="documents">PDF</button></span></span>
                    <span className="format-orbit-item" style={{'--orbit-x': '0%', '--orbit-y': '50%'}}><span className="format-orbit-counter"><button className="format-orbit-chip" data-format="documents">DOCX</button></span></span>
                  </div>
                </div>
                <div className="format-orbit-shell format-orbit-shell--middle">
                  <div className="format-chips format-orbit-track">
                    <span className="format-orbit-item" style={{'--orbit-x': '100%', '--orbit-y': '50%'}}><span className="format-orbit-counter"><button className="format-orbit-chip" data-format="presentations">PPTX</button></span></span>
                    <span className="format-orbit-item" style={{'--orbit-x': '25%', '--orbit-y': '93.3%'}}><span className="format-orbit-counter"><button className="format-orbit-chip" data-format="data">XLSX</button></span></span>
                    <span className="format-orbit-item" style={{'--orbit-x': '25%', '--orbit-y': '6.7%'}}><span className="format-orbit-counter"><button className="format-orbit-chip" data-format="data">CSV</button></span></span>
                  </div>
                </div>
                <div className="format-orbit-shell format-orbit-shell--outer">
                  <div className="format-chips format-orbit-track">
                    <span className="format-orbit-item" style={{'--orbit-x': '100%', '--orbit-y': '50%'}}><span className="format-orbit-counter"><button className="format-orbit-chip" data-format="documents">Markdown</button></span></span>
                    <span className="format-orbit-item" style={{'--orbit-x': '25%', '--orbit-y': '93.3%'}}><span className="format-orbit-counter"><button className="format-orbit-chip" data-format="visual">JPG / PNG</button></span></span>
                    <span className="format-orbit-item" style={{'--orbit-x': '25%', '--orbit-y': '6.7%'}}><span className="format-orbit-counter"><button className="format-orbit-chip" data-format="data">TXT / JSON</button></span></span>
                  </div>
                </div>
              </div>
              <div className="format-orbit-copy format-orbit-copy--coming">
                <p>Support for EPUB, HTML, XML, MP4,<br />MP3, and SKILL.md is <span>coming soon.</span></p>
              </div>
            </div>
          </article>
          <div className="formats-secondary-scroll">
            <div className="formats-secondary-sticky">
              <div className="formats-secondary-viewport">
                <div className="formats-secondary-grid">
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-file-search-line" /></div><div><h3>Page-native understanding</h3><p>Preserve layouts, diagrams, and spatial relationships so agents can inspect the original page when text is not enough.</p></div></article>
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-node-tree" /></div><div><h3>Agent-ready structure</h3><p>Turn flat text into hierarchical context that agents can scan first and expand when needed.</p></div></article>
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-flask-line" /></div><div><h3>Formula recognition</h3><p>Extract mathematical formulas and chemical structures in formats agents and downstream systems can use.</p></div></article>
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-route-line" /></div><div><h3>Source-level tracing</h3><p>Trace extracted content back to its page and source region for easier verification.</p></div></article>
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-server-line" /></div><div><h3>On-premise deployment</h3><p>Deploy Knowhere locally when document privacy, compliance requirements, or infrastructure control matters.</p></div></article>
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-code-s-slash-line" /></div><div><h3>API-first integration</h3><p>Connect Knowhere to existing workflows through REST APIs, webhooks, SDKs, or MCP.</p></div></article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <section className="section shell reveal" id="comparison" aria-labelledby="comparison-title">
      <div className="section-heading">
        <p className="section-no"><SectionShinyText text="[ COMPARISON ]" /></p>
        <h2 id="comparison-title"><SectionShinyText text="Compare document understanding across structure, accuracy, and traceability." /></h2>
        <p>See how Knowhere and other document-processing tools compare across efficiency, accuracy, structure, and source tracing.</p>
      </div>
      <div className="comparison-frame" aria-label="Illustrative document pipeline comparison">
        <div className="comparison-dashboard">
          <div className="comparison-chart">
            <div className="comparison-chart-header">
              <p className="comparison-chart-note">Performance comparison</p>
              <div className="comparison-legend" aria-label="Compared document processing tools"><span><i />Raw Docs</span><span><i className="unstructured-key" />Unstructured</span><span><i className="knowhere-key" />Knowhere</span><span><i className="mineru-key" />MinerU</span><span><i className="markitdown-key" />Markitdown</span></div>
            </div>
            <div className="comparison-plot">
              <div className="comparison-axis-y comparison-axis-y--left" aria-hidden="true"><strong>Tokens used</strong><div className="comparison-axis-ticks"><span>2000</span><span>1500</span><span>1000</span><span>500</span><span>0</span></div></div>
              <div className="comparison-plot-body">
                <div className="comparison-metrics" aria-hidden="true">
                  <div className="comparison-metric"><i data-value={1630} style={{height: '81.5%'}} /><i data-value={1886} style={{height: '94.3%'}} /><i data-value={1574} style={{height: '78.7%'}} /><i data-value={1670} style={{height: '83.5%'}} /><i data-value={1503} style={{height: '75.15%'}} /></div>
                  <div className="comparison-metric"><i data-value="20.57" style={{height: '82.28%'}} /><i data-value="16.61" style={{height: '66.44%'}} /><i data-value="15.25" style={{height: '61%'}} /><i data-value="17.48" style={{height: '69.92%'}} /><i data-value="15.2" style={{height: '60.8%'}} /></div>
                  <div className="comparison-metric"><i data-value="2.61" style={{height: '52.2%'}} /><i data-value="2.34" style={{height: '46.8%'}} /><i data-value="2.14" style={{height: '42.8%'}} /><i data-value="2.20" style={{height: '44%'}} /><i data-value="2.18" style={{height: '43.6%'}} /></div>
                  <div className="comparison-metric"><i data-value="0.50" style={{height: '50%'}} /><i data-value="0.61" style={{height: '61%'}} /><i data-value="0.68" style={{height: '68%'}} /><i data-value="0.66" style={{height: '66%'}} /><i data-value="0.59" style={{height: '59%'}} /></div>
                  <div className="comparison-metric"><i data-value="0.53" style={{height: '53%'}} /><i data-value="0.69" style={{height: '69%'}} /><i data-value="0.79" style={{height: '79%'}} /><i data-value="0.64" style={{height: '64%'}} /><i data-value="0.54" style={{height: '54%'}} /></div>
                  <div className="comparison-metric"><i data-value="0.74" style={{height: '74%'}} /><i data-value="0.77" style={{height: '77%'}} /><i data-value="0.82" style={{height: '82%'}} /><i data-value="0.78" style={{height: '78%'}} /><i data-value="0.76" style={{height: '76%'}} /></div>
                </div>
                <div className="comparison-metric-labels"><span>Tokens used</span><span>Processing time</span><span>Agent iterations</span><span>First-pass accuracy</span><span>Accuracy after feedback</span><span>Recall</span></div>
              </div>
              <div className="comparison-axis-y comparison-axis-y--right" aria-hidden="true"><div className="comparison-axis-ticks"><span>25</span><span>20</span><span>15</span><span>10</span><span>5</span><span>0</span></div><strong>Processing time (s)</strong></div>
              <div className="comparison-axis-y comparison-axis-y--right comparison-axis-y--outer" aria-hidden="true"><div className="comparison-axis-ticks"><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span></div><strong>Agent iterations</strong></div>
            </div>
          </div>
        </div>
        <div className="comparison-scoreboard is-expanded" role="group" aria-label="Document understanding capability matrix">
          <div className="comparison-scoreboard-head"><strong>Capability matrix</strong></div>
          <div className="comparison-scoreboard-body" id="comparison-table" aria-hidden="false"><div className="comparison-scoreboard-grid">
              <div className="scoreboard-cell scoreboard-head-cell">Feature</div><div className="scoreboard-cell scoreboard-head-cell scoreboard-knowhere">Knowhere</div><div className="scoreboard-cell scoreboard-head-cell">Typical document parsers</div>
              <div className="scoreboard-cell scoreboard-feature">Document hierarchy</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-fill" aria-hidden="true" />Supported</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--bad"><i className="ri-error-warning-fill" aria-hidden="true" />Limited</span></div>
              <div className="scoreboard-cell scoreboard-feature">Complex merged cells</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-fill" aria-hidden="true" />Supported</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--bad"><i className="ri-error-warning-fill" aria-hidden="true" />Limited</span></div>
              <div className="scoreboard-cell scoreboard-feature">Table boundaries</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-fill" aria-hidden="true" />Supported</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--no"><i className="ri-close-circle-fill" aria-hidden="true" />Not supported</span></div>
              <div className="scoreboard-cell scoreboard-feature">Source tracing</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-fill" aria-hidden="true" />Supported</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--bad"><i className="ri-error-warning-fill" aria-hidden="true" />Limited</span></div>
              <div className="scoreboard-cell scoreboard-feature">Progressive context</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-fill" aria-hidden="true" />Supported</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--no"><i className="ri-close-circle-fill" aria-hidden="true" />Not supported</span></div>
              <div className="scoreboard-cell scoreboard-feature">Visual understanding</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-fill" aria-hidden="true" />Supported</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--limited"><i className="ri-subtract-fill" aria-hidden="true" />Limited</span></div>
            </div></div>
        </div>
      </div>
    </section>
    <section className="section shell reveal" id="integration" aria-labelledby="integration-title">
      <div className="section-heading"><p className="section-no"><SectionShinyText text="[ INTEGRATION ]" /></p><h2 id="integration-title"><SectionShinyText text="Add document understanding to your workflow in minutes." /></h2><p>Submit a document through the API, receive structured results, and connect them to your existing agent workflow.</p></div>
      <div className="integration-grid">
        <ol className="steps"><li><div><h3><span className="integration-step-number">01</span>Get an API key</h3><p>Sign up and generate your API key from the dashboard.</p></div></li><li><div><h3><span className="integration-step-number">02</span>Submit a document</h3><p>Send a URL or upload a file to the processing queue.</p></div></li><li><div><h3><span className="integration-step-number">03</span>Receive structured results</h3><p>Get structured JSON through webhook or polling.</p></div></li></ol>
        <div className="integration-plinth">
          <CatenoidFieldTuner />
        </div>
        <div className="code-card"><div className="code-head"><span>Illustrative flow · interface details unconfirmed</span><button type="button" className="copy-code">Copy</button></div><div className="tabs compact" role="tablist" aria-label="Code examples"><button role="tab" id="code-python" aria-selected="true" aria-controls="code-panel-python">Python</button><button role="tab" id="code-node" aria-selected="false" aria-controls="code-panel-node" tabIndex={-1}>Node.js</button><button role="tab" id="code-curl" aria-selected="false" aria-controls="code-panel-curl" tabIndex={-1}>cURL</button></div><div className="code-panels"><pre role="tabpanel" tabIndex={0} id="code-panel-python" aria-labelledby="code-python"><code># Illustrative only — no real endpoint{"\n"}result = knowhere.process("sample.pdf"){"\n"}print(result.structure)</code></pre><pre role="tabpanel" tabIndex={0} id="code-panel-node" aria-labelledby="code-node"><code>// Illustrative only — no real endpoint{"\n"}const result = await knowhere.process("sample.pdf"){"\n"}console.log(result.structure)</code></pre><pre role="tabpanel" tabIndex={0} id="code-panel-curl" aria-labelledby="code-curl"><code># Illustrative only — no real endpoint{"\n"}curl -X POST "[endpoint-to-be-confirmed]" \{"\n"}{"  "}-F "file=@sample.pdf"</code></pre></div><p className="sr-only" aria-live="polite" data-copy-live /></div>
        <div className="mcp"><div className="mcp-copy"><h3>Use Knowhere through MCP</h3><p>Bring structured document context into Cursor, VS Code, Claude, or Codex.</p></div><a href="https://docs.knowhereto.ai/mcp" className="text-link">Read the MCP docs <i className="ri-arrow-right-s-line" aria-hidden="true" /></a></div>
      </div>
    </section>
    <section className="section shell reveal" id="pricing" aria-labelledby="pricing-title">
      <div className="pricing-card">
        <div className="pricing-heading"><p className="section-no"><SectionShinyText text="[ PRICING ]" /></p><h2 id="pricing-title"><SectionShinyText text="Simple, transparent pricing." /></h2><p>Pay only for what you use. No hidden fees, no complex tiers.</p></div>
        <div className="pricing-calculator">
          <div className="pricing-result-card">
            <div className="pricing-result-value">
              <div className="pricing-result-estimate">
                <span>Estimated cost ($0.015 per page)</span>
                <output data-pricing-price aria-live="polite">$9.00</output>
              </div>
              <div className="pricing-result-config">
                <label htmlFor="pricing-page-count">Number of pages</label>
                <div className="pricing-result-pages"><input id="pricing-page-count" type="number" min={100} max={10000} step={100} defaultValue={600} /></div>
              </div>
            </div>
          </div>
          <dl className="pricing-facts"><div><dt>Estimated budget</dt><dd data-pricing-price>$9.00</dd></div><div><dt>100-page PDFs</dt><dd data-pricing-pdf>6 documents</dd></div><div><dt>500-page documents</dt><dd data-pricing-large>1 document</dd></div><div><dt>Commitment</dt><dd>No minimum</dd></div></dl>
          <div className="pricing-control-card"><label className="sr-only" htmlFor="pricing-pages">Pages to process</label><div className="pricing-range-control" style={{'--pricing-progress': '5.0505%'}}>
            <div className="pricing-range-ticks" aria-hidden="true">
              {Array.from({ length: 81 }, (_, index) => <span key={index} className={`pricing-range-tick${index % 20 === 0 ? ' is-major' : index % 4 === 0 ? ' is-medium' : ''}`} style={{ left: `${index * 1.25}%` }} />)}
            </div>
            <span className="pricing-range-selection" aria-hidden="true" /><span className="pricing-range-handle" data-pricing-range-handle style={{'--pricing-progress': '5.0505%'}} aria-hidden="true"><span className="pricing-range-handle-visual"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12H21M7 8L3 12L7 16M17 8L21 12L17 16" /></svg></span></span><span className="pricing-range-budget" data-pricing-range-budget style={{'--pricing-progress': '5.0505%'}}><strong data-pricing-price>$9.00</strong></span><input className="pricing-range" id="pricing-pages" type="range" min={100} max={10000} step={100} defaultValue={600} aria-label="Pages to process" /></div>
            <div className="pricing-range-labels"><span>100 pages</span><span>2,500</span><span>5,000</span><span>7,500</span><span>10,000</span></div>
          </div>
        </div>
        <section className="pricing-file-limits" aria-labelledby="pricing-file-limits-title">
          <div className="pricing-file-limits-head"><h3 id="pricing-file-limits-title">File Size Limits</h3><p>Need higher limits? Contact <a href="mailto:team@knowhereto.ai">team@knowhereto.ai</a><br />for enterprise pricing with custom limits.</p></div>
          <dl><div><dt>.pdf</dt><dd>100M</dd></div><div><dt>.docx</dt><dd>50M</dd></div><div><dt>.xlsx</dt><dd>100M</dd></div><div><dt>.pptx</dt><dd>100M</dd></div></dl>
        </section>
      </div>
    </section>
    <section className="section shell reveal" id="enterprise" aria-labelledby="enterprise-title">
      <div className="enterprise-content">
        <p className="section-no enterprise-label"><SectionShinyText text="[ ENTERPRISE ]" /></p>
        <div className="enterprise-copy"><h2 id="enterprise-title"><SectionShinyText text="Need custom limits or deployment support?" /></h2><div className="enterprise-copy-detail"><p className="lede">Custom limits, deployment, support, and SLAs.</p><a className="button sales-link" href="mailto:team@knowhereto.ai">Talk to our team</a></div></div>
        <ul className="enterprise-metrics">
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><EnterpriseIllustration type="limits" /></div><div className="enterprise-metric-copy"><strong>Custom rate limits</strong><p>Discuss throughput limits for your production traffic.</p></div></li>
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><EnterpriseIllustration type="priority" /></div><div className="enterprise-metric-copy"><strong>Priority processing</strong><p>Plan priority handling for time-sensitive workloads.</p></div></li>
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><EnterpriseIllustration type="deployment" /></div><div className="enterprise-metric-copy"><strong>Deployment options</strong><p>Review managed, dedicated, or self-hosted options.</p></div></li>
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><EnterpriseIllustration type="support" /></div><div className="enterprise-metric-copy"><strong>Support requirements</strong><p>Align support channels and response expectations.</p></div></li>
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><EnterpriseIllustration type="sla" /></div><div className="enterprise-metric-copy"><strong>SLA requirements</strong><p>Define your uptime and service-level needs.</p></div></li>
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><EnterpriseIllustration type="commercial" /></div><div className="enterprise-metric-copy"><strong>Commercial terms</strong><p>Discuss billing and terms for your usage.</p></div></li>
        </ul>
      </div>
    </section>
    <section className="section shell reveal" id="faq" aria-labelledby="faq-title">
        <div className="section-heading"><p className="section-no"><SectionShinyText text="[ FAQ ]" /></p><h2 id="faq-title"><SectionShinyText text="Frequently asked questions." /></h2></div>
        <div className="faq-list">
          <details open><summary aria-expanded="true" aria-controls="faq-answer-1">When am I charged?<span aria-hidden="true">↓</span></summary><p id="faq-answer-1">Page credits are deducted when a job completes successfully. Failed jobs do not consume credits.</p></details>
          <details><summary aria-expanded="false" aria-controls="faq-answer-2">Do unused pages roll over?<span aria-hidden="true">↓</span></summary><p id="faq-answer-2">Page credits expire 3 months after purchase.</p></details>
          <details><summary aria-expanded="false" aria-controls="faq-answer-3">Can I get a refund?<span aria-hidden="true">↓</span></summary><p id="faq-answer-3">Contact team@knowhereto.ai for refund requests within 14 days of purchase.</p></details>
          <details><summary aria-expanded="false" aria-controls="faq-answer-4">What payment methods are accepted?<span aria-hidden="true">↓</span></summary><p id="faq-answer-4">We accept all major credit cards through Stripe: Visa, Mastercard, American Express, and more.</p></details>
        </div>
        {/* BRAIN FAQ intentionally hidden pending public status confirmation. */}
    </section>
    <section className="section shell final-cta reveal" id="final-cta" aria-labelledby="final-title">
      <FinalCtaHelix theme={theme} />
      <div id="final-cta-copy">
        <p className="section-no"><SectionShinyText text="[ GET STARTED ]" /></p>
        <h2 id="final-title"><SectionShinyText text="Ready to build with better document context?" /></h2>
      </div>
      <div className="final-cta-detail">
        <p className="lede">Connect your agent workflow and see how Knowhere handles documents that plain text pipelines miss.</p>
        <div id="final-cta-actions"><a className="button" href="https://knowhere-login.knowhere-landing.workers.dev">Start free trial</a><a className="button button-secondary" href="mailto:team@knowhereto.ai">Book a demo</a></div>
        <ul className="final-cta-benefits" aria-label="Trial benefits">
          <li><svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M6.75 9 8.25 10.5 11.25 7.5M15.75 9c0 .886-.175 1.764-.514 2.583a6.75 6.75 0 0 1-3.653 3.653A6.75 6.75 0 0 1 9 15.75a6.75 6.75 0 0 1-2.583-.514 6.75 6.75 0 0 1-3.653-3.653A6.75 6.75 0 0 1 2.25 9a6.75 6.75 0 0 1 13.5 0Z" /></svg>Free 14-day trial</li>
          <li><svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M6.75 9 8.25 10.5 11.25 7.5M15.75 9c0 .886-.175 1.764-.514 2.583a6.75 6.75 0 0 1-3.653 3.653A6.75 6.75 0 0 1 9 15.75a6.75 6.75 0 0 1-2.583-.514 6.75 6.75 0 0 1-3.653-3.653A6.75 6.75 0 0 1 2.25 9a6.75 6.75 0 0 1 13.5 0Z" /></svg>No credit card required</li>
          <li><svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M6.75 9 8.25 10.5 11.25 7.5M15.75 9c0 .886-.175 1.764-.514 2.583a6.75 6.75 0 0 1-3.653 3.653A6.75 6.75 0 0 1 9 15.75a6.75 6.75 0 0 1-2.583-.514 6.75 6.75 0 0 1-3.653-3.653A6.75 6.75 0 0 1 2.25 9a6.75 6.75 0 0 1 13.5 0Z" /></svg>Cancel anytime</li>
        </ul>
      </div>
    </section>
  </main>
  <SiteFooter />
  <div className="toast" role="status" aria-live="polite" hidden><p data-toast-message /><button type="button" aria-label="Close notification">×</button></div>
</div>


  )
}
