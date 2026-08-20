import { useEffect, useRef } from 'react'
import { initializeLandingCanvases } from './landing-canvas'
import { initializeLandingInteractions } from './landing-interactions'

function FinalCtaPathFan({ convergenceX }) {
  const paths = [
    `M-28 20C42 22 84 62 126 132S210 300 ${convergenceX} 205`,
    `M-28 66C48 70 94 154 138 236S220 118 ${convergenceX} 205`,
    `M-28 112C52 116 98 258 146 292S228 148 ${convergenceX} 205`,
    `M-28 158C60 160 106 224 152 252S236 172 ${convergenceX} 205`,
    `M-28 205H${convergenceX}`,
    `M-28 252C60 250 106 186 152 158S236 238 ${convergenceX} 205`,
    `M-28 298C52 294 98 152 146 118S228 262 ${convergenceX} 205`,
    `M-28 344C48 340 94 256 138 174S220 292 ${convergenceX} 205`,
    `M-28 390C42 388 84 348 126 278S210 110 ${convergenceX} 205`,
  ]
  const animatedPaths = [...paths, paths[0], paths[paths.length - 1]]

  return (
    <g className="final-cta-path-fan">
      {animatedPaths.map((path, index) => (
        <path key={index} d={path} style={{'--final-cta-helix-phase': `${(-8 * index / animatedPaths.length).toFixed(3)}s`, transformOrigin: `${convergenceX}px 205px`}} />
      ))}
    </g>
  )
}

export function LandingPage({ finalCtaConvergence = 357 }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const cleanupInteractions = initializeLandingInteractions(root)
    const cleanupCanvases = initializeLandingCanvases(root)
    return () => {
      cleanupCanvases()
      cleanupInteractions()
    }
  }, [])

  return (
<div className="landing-page" ref={rootRef}>
  <a className="skip-link" href="#main">Skip to content</a>
  <header className="site-header" data-header>
    <nav className="nav shell" aria-label="Main navigation">
      <a className="wordmark" href="#top" aria-label="Knowhere, back to top"><img src="/assets/knowhere-back-to-top.svg" width={132} height={52} alt="" /></a>
      <div className="desktop-nav">
        <a href="#comparison">Comparison</a><a href="#pricing">Pricing</a><a href="https://docs.knowhereto.ai/" target="_blank" rel="noopener noreferrer">Docs</a><a href="https://blog.knowhereto.ai/" target="_blank" rel="noopener noreferrer">Blog</a>
      </div>
      <div className="nav-actions">
        <a className="github-link desktop-github" href="https://knowhereto.ai/github" aria-label="GitHub" title="GitHub"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.59 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.91-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.72c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.26C22 6.59 17.52 2 12 2Z" /></svg></a>
        <button className="language-toggle desktop-language" type="button" data-language-toggle aria-label="Switch to Chinese" title="Switch to Chinese"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><g fill="currentColor"><line x1="2.25" y1="4.25" x2="10.25" y2="4.25" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><line x1="6.25" y1="2.25" x2="6.25" y2="4.25" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><path d="M4.25,4.25c.091,2.676,1.916,4.981,4.5,5.684" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><path d="M8.25,4.25c-.4,5.625-6,6-6,6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><polyline points="9.25 15.75 12.25 7.75 12.75 7.75 15.75 15.75" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><line x1="10.188" y1="13.25" x2="14.813" y2="13.25" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></g></svg></button>
        <a className="button button-small" href="https://knowhereto.ai/login">Get API Key</a>
        <button className="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu"><span className="sr-only">Open menu</span><span aria-hidden="true">Menu</span></button>
      </div>
    </nav>
    <div className="mobile-menu" id="mobile-menu" hidden>
      <button className="menu-close" type="button">Close <span aria-hidden="true">×</span></button>
      <nav aria-label="Mobile navigation">
        <a href="#comparison">Comparison</a><a href="#pricing">Pricing</a><a href="https://docs.knowhereto.ai/">Docs</a><a href="https://knowhereto.ai/github">GitHub</a><a href="https://blog.knowhereto.ai/">Blog</a>
      </nav>
      <button className="language-toggle mobile-language" type="button" data-language-toggle aria-label="Switch to Chinese" title="Switch to Chinese"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><g fill="currentColor"><line x1="2.25" y1="4.25" x2="10.25" y2="4.25" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><line x1="6.25" y1="2.25" x2="6.25" y2="4.25" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><path d="M4.25,4.25c.091,2.676,1.916,4.981,4.5,5.684" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><path d="M8.25,4.25c-.4,5.625-6,6-6,6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><polyline points="9.25 15.75 12.25 7.75 12.75 7.75 15.75 15.75" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><line x1="10.188" y1="13.25" x2="14.813" y2="13.25" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></g></svg></button>
    </div>
  </header>
  <main id="main" tabIndex={-1}>
    <section className="hero shell hero-b-layout" id="top" aria-labelledby="hero-title">
      <canvas id="hero-b-pixel-field" aria-hidden="true" />
      <div className="hero-copy">
        <h1 id="hero-title">Turn complex documents into context your agents can use.</h1>
        <p className="lede">Knowhere preserves text, structure, visual context, and source links, so your agents can retrieve the right information and show where it came from.</p>
        <div className="button-row"><a className="button" href="https://knowhereto.ai/login">Start free trial</a><a className="button button-secondary" href="https://docs.knowhereto.ai/">Read the docs</a></div>
      </div>
      <div className="hero-visual" aria-label="Interactive four-stage document processing pipeline from original document to RAG structure">
        <article className="hero-b-chart">
          <div className="hero-b-chart-shell" aria-hidden="true" />
        </article>
      </div>
      <div className="hero-placeholder-texture" aria-hidden="true" />
      <span className="hero-placeholder-label">Placeholder image</span>
    </section>
    <div className="hero-b-pixel-tooltip" id="hero-b-pixel-tooltip" role="status" aria-live="polite" />
    <section className="section shell" id="playground" aria-labelledby="playground-title">
      <div className="section-heading"><p className="section-no">&gt;_PRODUCT</p><h2 id="playground-title">From messy files to agent-ready context.</h2><p>Knowhere turns PDFs, spreadsheets, presentations, scans, and other complex documents into structured, navigable data. Text, tables, formulas, page layouts, and visual regions stay connected, so agents can retrieve information without losing the document it came from.</p></div>
      <div className="section-scan-frame">
        <iframe src="document-scan-section.html" title="Interactive document scan and source traceability demonstration" loading="eager" tabIndex={-1} aria-hidden="true" />
        <span className="section-scan-placeholder">Placeholder image</span>
      </div>
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
          <div className="section-heading"><p className="section-no">&gt;_PROCESS</p><h2 id="capabilities-title">A document pipeline that keeps the important parts connected.</h2></div>
          <div className="narrative-grid">
            <div className="story-steps" role="tablist" aria-label="Data transformation stages">
              <div id="story-tab-structure" className="story-step is-active" data-story="structure" role="tab" aria-selected="true" aria-controls="story-panel-structure" tabIndex={0}><span>01</span><h3>Ingest the document</h3><p>Upload a PDF, DOCX, XLSX, presentation, image, or other supported format.</p><div className="mobile-story-visual" aria-hidden="true" /></div>
              <div id="story-tab-visual" className="story-step" data-story="visual" role="tab" aria-selected="false" aria-controls="story-panel-visual" tabIndex={-1}><span>02</span><h3>Capture text and visual context</h3><p>Read native text or apply OCR while preserving the original pages and visual regions.</p><div className="mobile-story-visual" aria-hidden="true" /></div>
              <div id="story-tab-source" className="story-step" data-story="source" role="tab" aria-selected="false" aria-controls="story-panel-source" tabIndex={-1}><span>03</span><h3>Understand the structure</h3><p>Map headings, tables, formulas, layouts, and relationships across the document.</p><div className="mobile-story-visual" aria-hidden="true" /></div>
              <div id="story-tab-relations" className="story-step" data-story="relations" role="tab" aria-selected="false" aria-controls="story-panel-relations" tabIndex={-1}><span>04</span><h3>Return traceable context</h3><p>Get structured JSON, a navigable document map, and source-linked pages for your agents.</p><div className="mobile-story-visual" aria-hidden="true" /></div>
            </div>
            <div className="story-card-stack">
              <div className="story-canvas story-card" id="story-panel-structure" data-story="structure" role="tabpanel" aria-labelledby="story-tab-structure">
                <div className="capability-copy"><div className="capability-copy-main"><div className="capability-copy-title"><h3 data-story-heading>Ingest the document</h3></div><p data-story-summary>Upload a PDF, DOCX, XLSX, presentation, image, or other supported format.</p></div></div>
                <div className="capability-media" role="img" aria-label="Data transformation image placeholder"><img src="/assets/capability-placeholder-ingest.png" alt="" loading="lazy" decoding="async" /></div>
              </div>
              <div className="story-canvas story-card" id="story-panel-visual" data-story="visual" role="tabpanel" aria-labelledby="story-tab-visual">
                <div className="capability-copy"><div className="capability-copy-main"><div className="capability-copy-title"><h3 data-story-heading>Capture text and visual context</h3></div><p data-story-summary>Read native text or apply OCR while preserving the original pages and visual regions.</p></div></div>
                <div className="capability-media" role="img" aria-label="Data transformation image placeholder"><img src="/assets/capability-placeholder-visual.png" alt="" loading="lazy" decoding="async" /></div>
              </div>
              <div className="story-canvas story-card" id="story-panel-source" data-story="source" role="tabpanel" aria-labelledby="story-tab-source">
                <div className="capability-copy"><div className="capability-copy-main"><div className="capability-copy-title"><h3 data-story-heading>Understand the structure</h3></div><p data-story-summary>Map headings, tables, formulas, layouts, and relationships across the document.</p></div></div>
                <div className="capability-media" role="img" aria-label="Data transformation image placeholder"><img src="/assets/capability-placeholder-structure.png" alt="" loading="lazy" decoding="async" /></div>
              </div>
              <div className="story-canvas story-card" id="story-panel-relations" data-story="relations" role="tabpanel" aria-labelledby="story-tab-relations">
                <div className="capability-copy"><div className="capability-copy-main"><div className="capability-copy-title"><h3 data-story-heading>Return traceable context</h3></div><p data-story-summary>Get structured JSON, a navigable document map, and source-linked pages for your agents.</p></div></div>
                <div className="capability-media" role="img" aria-label="Data transformation image placeholder"><img src="/assets/capability-placeholder-traceable.png" alt="" loading="lazy" decoding="async" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div className="formats-scroll-track">
      <section className="section shell reveal" id="formats" aria-labelledby="formats-title">
        <div className="section-heading"><p className="section-no">&gt;_SCOPE</p><h2 id="formats-title">Core capabilities.</h2></div>
        <div className="formats-grid">
          <article className="format-feature format-feature--formats">
            <div className="format-orbit-layout">
              <div className="format-orbit-copy format-orbit-copy--supported">
                <p>Works with common file formats, including</p>
                <p>DOCX, PDF, JPG, PPTX, XLSX, CSV, PNG, MD, JSON, and TXT.</p>
              </div>
              <span className="format-orbit-decoration format-orbit-decoration--supported" aria-hidden="true" />
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
              <span className="format-orbit-decoration format-orbit-decoration--coming" aria-hidden="true" />
              <div className="format-orbit-copy format-orbit-copy--coming">
                <p>Support for</p>
                <p><span>EPUB, HTML, XML, MP4, MP3, and skills.md</span> is coming soon.</p>
              </div>
            </div>
          </article>
          <div className="formats-secondary-scroll">
            <div className="formats-secondary-sticky">
              <div className="formats-secondary-viewport">
                <div className="formats-secondary-grid">
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-file-search-line" /></div><div><h3>Page-native visual understanding</h3><p>Preserve original pages, layouts, diagrams, and spatial relationships so agents can inspect visual context beyond extracted text.</p></div></article>
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-node-tree" /></div><div><h3>Agent-ready structure</h3><p>Return hierarchical, progressive context instead of flat text, so agents can start with an outline and reveal details when needed.</p></div></article>
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-flask-line" /></div><div><h3>Formula and chemical recognition</h3><p>Extract mathematical formulas and chemical structures into structured formats that agents and downstream systems can reliably use.</p></div></article>
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-route-line" /></div><div><h3>Full provenance tracing</h3><p>Trace every extracted element back to its page and source region, making AI-generated answers easier to inspect and verify.</p></div></article>
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-server-line" /></div><div><h3>On-premise deployment</h3><p>Deploy Knowhere locally when document privacy, regulatory compliance, or long-term infrastructure control matters most.</p></div></article>
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-code-s-slash-line" /></div><div><h3>API-first integration</h3><p>Process documents through REST APIs, webhooks, SDKs, or MCP, returning structured results for agent workflows.</p></div></article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <section className="section shell reveal" id="comparison" aria-labelledby="comparison-title">
      <div className="section-heading">
        <p className="section-no">&gt;_COMPARISON / EVALUATION</p>
        <h2 id="comparison-title">How we compare.</h2>
        <p>Send a document, receive structured results, and connect the output to the tools your agents already use.</p>
      </div>
      <div className="comparison-frame" aria-label="Illustrative document pipeline comparison">
        <div className="comparison-dashboard">
          <div className="comparison-chart">
            <div className="divider-hatch" aria-hidden="true" />
            <div className="comparison-chart-header">
              <p className="comparison-chart-note">Comparison performance</p>
              <div className="comparison-legend" aria-label="Compared document processing tools"><span><i />Raw Docs</span><span><i className="unstructured-key" />Unstructured</span><span><i className="knowhere-key" />Knowhere</span><span><i className="mineru-key" />MinerU</span><span><i className="markitdown-key" />Markitdown</span></div>
            </div>
            <div className="comparison-plot">
              <div className="comparison-axis-y comparison-axis-y--left" aria-hidden="true"><strong>token used</strong><div className="comparison-axis-ticks"><span>2000</span><span>1500</span><span>1000</span><span>500</span><span>0</span></div></div>
              <div className="comparison-plot-body">
                <div className="comparison-metrics" aria-hidden="true">
                  <div className="comparison-metric"><i data-value={1630} style={{height: '81.5%'}} /><i data-value={1574} style={{height: '78.7%'}} /><i data-value={1886} style={{height: '94.3%'}} /><i data-value={1670} style={{height: '83.5%'}} /><i data-value={1503} style={{height: '75.15%'}} /></div>
                  <div className="comparison-metric"><i data-value="20.57" style={{height: '82.28%'}} /><i data-value="15.25" style={{height: '61%'}} /><i data-value="16.61" style={{height: '66.44%'}} /><i data-value="17.48" style={{height: '69.92%'}} /><i data-value="15.2" style={{height: '60.8%'}} /></div>
                  <div className="comparison-metric"><i data-value="2.61" style={{height: '52.2%'}} /><i data-value="2.14" style={{height: '42.8%'}} /><i data-value="2.34" style={{height: '46.8%'}} /><i data-value="2.20" style={{height: '44%'}} /><i data-value="2.18" style={{height: '43.6%'}} /></div>
                  <div className="comparison-metric"><i data-value="0.50" style={{height: '50%'}} /><i data-value="0.68" style={{height: '68%'}} /><i data-value="0.61" style={{height: '61%'}} /><i data-value="0.66" style={{height: '66%'}} /><i data-value="0.59" style={{height: '59%'}} /></div>
                  <div className="comparison-metric"><i data-value="0.53" style={{height: '53%'}} /><i data-value="0.79" style={{height: '79%'}} /><i data-value="0.69" style={{height: '69%'}} /><i data-value="0.64" style={{height: '64%'}} /><i data-value="0.54" style={{height: '54%'}} /></div>
                  <div className="comparison-metric"><i data-value="0.74" style={{height: '74%'}} /><i data-value="0.82" style={{height: '82%'}} /><i data-value="0.77" style={{height: '77%'}} /><i data-value="0.78" style={{height: '78%'}} /><i data-value="0.76" style={{height: '76%'}} /></div>
                </div>
                <div className="comparison-metric-labels"><span>Token used</span><span>Time used</span><span>Agent loops</span><span>First-time accuracy</span><span>Accuracy with feedback</span><span>Recall</span></div>
              </div>
              <div className="comparison-axis-y comparison-axis-y--right" aria-hidden="true"><div className="comparison-axis-ticks"><span>25</span><span>20</span><span>15</span><span>10</span><span>5</span><span>0</span></div><strong>time used (s)</strong></div>
              <div className="comparison-axis-y comparison-axis-y--right comparison-axis-y--outer" aria-hidden="true"><div className="comparison-axis-ticks"><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span></div><strong>agent loops</strong></div>
            </div>
          </div>
        </div>
        <div className="divider-hatch divider-hatch--bottom" aria-hidden="true" />
        <div className="comparison-scoreboard" role="group" aria-label="Document understanding capability matrix">
          <div className="comparison-scoreboard-head"><strong>Capability matrix</strong><div className="comparison-scoreboard-head-actions"><button className="comparison-toggle" type="button" aria-expanded="false" aria-controls="comparison-table"><span className="sr-only">Toggle comparison details</span></button></div></div>
          <div className="comparison-scoreboard-body" id="comparison-table" aria-hidden="true"><div className="comparison-scoreboard-grid">
              <div className="scoreboard-cell scoreboard-head-cell">Feature</div><div className="scoreboard-cell scoreboard-head-cell scoreboard-knowhere">Knowhere</div><div className="scoreboard-cell scoreboard-head-cell">Others</div>
              <div className="scoreboard-cell scoreboard-feature">Hierarchy construction</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-line" aria-hidden="true" />Yes</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--bad"><i className="ri-error-warning-line" aria-hidden="true" />Bad</span></div>
              <div className="scoreboard-cell scoreboard-feature">Complex merged cells</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-line" aria-hidden="true" />Yes</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--bad"><i className="ri-error-warning-line" aria-hidden="true" />Bad</span></div>
              <div className="scoreboard-cell scoreboard-feature">Table boundary detection</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-line" aria-hidden="true" />Yes</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--no"><i className="ri-close-circle-line" aria-hidden="true" />No</span></div>
              <div className="scoreboard-cell scoreboard-feature">Source traceability</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-line" aria-hidden="true" />Yes</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--bad"><i className="ri-error-warning-line" aria-hidden="true" />Bad</span></div>
              <div className="scoreboard-cell scoreboard-feature">Hierarchical memory &amp; progressive disclosure</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-line" aria-hidden="true" />Yes</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--no"><i className="ri-close-circle-line" aria-hidden="true" />No</span></div>
              <div className="scoreboard-cell scoreboard-feature">Page-native visual understanding</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-line" aria-hidden="true" />Yes</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--limited"><i className="ri-subtract-line" aria-hidden="true" />Limited</span></div>
            </div></div>
        </div>
      </div>
    </section>
    <section className="section shell reveal" id="integration" aria-labelledby="integration-title">
      <div className="section-heading"><p className="section-no">&gt;_INTEGRATION</p><h2 id="integration-title">Add document understanding to your workflow in minutes.</h2><p>Send a document, receive structured results, and connect the output to the tools your agents already use.</p></div>
      <div className="integration-grid">
        <ol className="steps"><li><span>01</span><div><h3>Get an API key</h3><p>Sign up and generate your API key from the dashboard.</p></div></li><li><span>02</span><div><h3>Submit a document</h3><p>Send a URL or upload a file to the processing queue.</p></div></li><li><span>03</span><div><h3>Receive structured results</h3><p>Get structured JSON through webhook or polling.</p></div></li></ol>
        <div className="integration-plinth" aria-hidden="true">
          <svg className="integration-wormhole" viewBox="0 0 612 408" fill="none" preserveAspectRatio="none">
            <g className="integration-wormhole-base">
              <g className="integration-wormhole-rings integration-wormhole-drawing">
                <ellipse cx="306" cy="74" rx="245" ry="58" />
                <ellipse cx="306" cy="101" rx="193" ry="48" />
                <ellipse cx="306" cy="127" rx="137" ry="36" />
                <ellipse cx="306" cy="151" rx="79" ry="23" />
                <ellipse cx="306" cy="171" rx="42" ry="12" />
                <ellipse cx="306" cy="237" rx="42" ry="12" />
                <ellipse cx="306" cy="257" rx="79" ry="23" />
                <ellipse cx="306" cy="281" rx="137" ry="36" />
                <ellipse cx="306" cy="307" rx="193" ry="48" />
                <ellipse cx="306" cy="334" rx="245" ry="58" />
              </g>
              <g className="integration-wormhole-meridians integration-wormhole-drawing" id="integration-wormhole-meridian-paths">
                <path d="M61 74C93 109 216 126 281 177C298 190 302 199 306 204C302 209 298 218 281 231C216 282 93 299 61 334" />
                <path d="M82 49C130 89 230 118 287 176C299 188 303 198 306 204C303 210 299 220 287 232C230 290 130 319 82 359" />
                <path d="M123 32C162 79 242 117 292 176C301 188 304 198 306 204C304 210 301 220 292 232C242 291 162 329 123 376" />
                <path d="M180 21C208 74 255 116 297 176C303 187 305 198 306 204C305 210 303 221 297 232C255 292 208 334 180 387" />
                <path d="M243 17C255 72 274 116 301 177C305 188 306 198 306 204C306 210 305 220 301 231C274 292 255 336 243 391" />
                <path d="M280 16C285 72 291 119 304 178C306 189 306 199 306 204C306 209 306 219 304 230C291 289 285 336 280 392" />
                <path d="M306 16V392" />
                <path d="M332 16C327 72 321 119 308 178C306 189 306 199 306 204C306 209 306 219 308 230C321 289 327 336 332 392" />
                <path d="M369 17C357 72 338 116 311 177C307 188 306 198 306 204C306 210 307 220 311 231C338 292 357 336 369 391" />
                <path d="M432 21C404 74 357 116 315 176C309 187 307 198 306 204C307 210 309 221 315 232C357 292 404 334 432 387" />
                <path d="M489 32C450 79 370 117 320 176C311 188 308 198 306 204C308 210 311 220 320 232C370 291 450 329 489 376" />
                <path d="M530 49C482 89 382 118 325 176C313 188 309 198 306 204C309 210 313 220 325 232C382 290 482 319 530 359" />
                <path d="M551 74C519 109 396 126 331 177C314 190 310 199 306 204C310 209 314 218 331 231C396 282 519 299 551 334" />
              </g>
            </g>
            <g className="integration-wormhole-flow-layer"><use href="#integration-wormhole-meridian-paths" /></g>
          </svg>
          <span className="integration-placeholder">Placeholder</span>
        </div>
        <div className="code-card"><div className="code-head"><span>Illustrative flow · interface details unconfirmed</span><button type="button" className="copy-code">Copy</button></div><div className="tabs compact" role="tablist" aria-label="Code examples"><button role="tab" id="code-python" aria-selected="true" aria-controls="code-panel-python">Python</button><button role="tab" id="code-node" aria-selected="false" aria-controls="code-panel-node" tabIndex={-1}>Node.js</button><button role="tab" id="code-curl" aria-selected="false" aria-controls="code-panel-curl" tabIndex={-1}>cURL</button></div><div className="code-panels"><pre role="tabpanel" tabIndex={0} id="code-panel-python" aria-labelledby="code-python"><code># Illustrative only — no real endpoint{"\n"}result = knowhere.process("sample.pdf"){"\n"}print(result.structure)</code></pre><pre role="tabpanel" tabIndex={0} id="code-panel-node" aria-labelledby="code-node"><code>// Illustrative only — no real endpoint{"\n"}const result = await knowhere.process("sample.pdf"){"\n"}console.log(result.structure)</code></pre><pre role="tabpanel" tabIndex={0} id="code-panel-curl" aria-labelledby="code-curl"><code># Illustrative only — no real endpoint{"\n"}curl -X POST "[endpoint-to-be-confirmed]" \{"\n"}{"  "}-F "file=@sample.pdf"</code></pre></div><p className="sr-only" aria-live="polite" data-copy-live /></div>
        <div className="mcp"><h3>[ MCP ]</h3><p>Use Knowhere through MCP with Cursor, VS Code, Claude, or Codex.</p><a href="https://docs.knowhereto.ai/mcp" className="text-link">Read the MCP docs <i className="ri-arrow-right-s-line" aria-hidden="true" /></a></div>
      </div>
    </section>
    <section className="section shell reveal" id="pricing" aria-labelledby="pricing-title">
      <div className="pricing-card">
        <div className="pricing-heading"><p className="section-no">&gt;_PRICING</p><h2 id="pricing-title">Simple, transparent pricing.</h2><p>Pay only for what you use. No hidden fees, no complex tiers.</p></div>
        <div className="pricing-calculator">
          <div className="pricing-result-card"><div className="pricing-result-value"><strong data-pricing-pages>500 pages</strong><small>$1.50 per 100 pages</small></div></div>
          <dl className="pricing-facts"><div><dt>Estimated budget</dt><dd data-pricing-price>$7.50</dd></div><div><dt>100-page PDFs</dt><dd data-pricing-pdf>5 documents</dd></div><div><dt>500-page documents</dt><dd data-pricing-large>1 document</dd></div><div><dt>Commitment</dt><dd>No minimum</dd></div></dl>
          <div className="pricing-control-card"><label className="sr-only" htmlFor="pricing-pages">Pages to process</label><div className="pricing-range-control"><span className="pricing-range-fill" data-pricing-range-fill style={{'--pricing-progress': '4.0404%'}} aria-hidden="true" /><span className="pricing-range-handle" data-pricing-range-handle style={{'--pricing-progress': '4.0404%'}} aria-hidden="true" /><span className="pricing-range-budget" data-pricing-range-budget style={{'--pricing-progress': '4.0404%'}}><strong data-pricing-price>$7.50</strong></span><input className="pricing-range" id="pricing-pages" type="range" min={100} max={10000} step={100} defaultValue={500} aria-label="Pages to process" /></div></div>
        </div>
        <section className="pricing-file-limits" aria-labelledby="pricing-file-limits-title">
          <div className="pricing-file-limits-head"><h3 id="pricing-file-limits-title">File Size Limits</h3><p>Need higher limits? Contact <a href="mailto:team@knowhereto.ai">team@knowhereto.ai</a><br />for enterprise pricing with custom limits.</p></div>
          <dl><div><dt>.pdf</dt><dd>100M</dd></div><div><dt>.docx</dt><dd>50M</dd></div><div><dt>.xlsx</dt><dd>100M</dd></div><div><dt>.pptx</dt><dd>100M</dd></div></dl>
        </section>
      </div>
    </section>
    <section className="section shell reveal" id="enterprise" aria-labelledby="enterprise-title">
      <div className="enterprise-content">
        <p className="section-no enterprise-label">&gt;_ENTERPRISE</p>
        <div className="enterprise-copy"><h2 id="enterprise-title">Need custom limits or deployment support?</h2><div className="enterprise-copy-detail"><p className="lede">Talk to our team about custom rate limits, priority processing, deployment options, support, and SLA requirements.</p></div></div>
        <ul className="enterprise-metrics">
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><span>Placeholder</span><img src="/assets/enterprise-capability.png" alt="" /></div><div className="enterprise-metric-copy"><strong>Custom rate limits</strong><p>Discuss throughput limits for your production traffic.</p></div></li>
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><span>Placeholder</span><img src="/assets/enterprise-capability.png" alt="" /></div><div className="enterprise-metric-copy"><strong>Priority processing</strong><p>Plan priority handling for time-sensitive workloads.</p></div></li>
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><span>Placeholder</span><img src="/assets/enterprise-capability.png" alt="" /></div><div className="enterprise-metric-copy"><strong>Deployment options</strong><p>Review managed, dedicated, or self-hosted options.</p></div></li>
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><span>Placeholder</span><img src="/assets/enterprise-capability.png" alt="" /></div><div className="enterprise-metric-copy"><strong>Support requirements</strong><p>Align support channels and response expectations.</p></div></li>
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><span>Placeholder</span><img src="/assets/enterprise-capability.png" alt="" /></div><div className="enterprise-metric-copy"><strong>SLA requirements</strong><p>Define your uptime and service-level needs.</p></div></li>
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><span>Placeholder</span><img src="/assets/enterprise-capability.png" alt="" /></div><div className="enterprise-metric-copy"><strong>Commercial terms</strong><p>Discuss billing and terms for your usage.</p></div></li>
        </ul>
        <a className="button sales-link" href="mailto:team@knowhereto.ai">Contact Sales</a>
      </div>
    </section>
    <section className="section shell reveal" id="faq" aria-labelledby="faq-title">
        <div className="section-heading"><p className="section-no">&gt;_FAQ</p><h2 id="faq-title">Frequently Asked Questions</h2></div>
        <div className="faq-list">
          <details open><summary aria-expanded="true" aria-controls="faq-answer-1">When am I charged?<span aria-hidden="true">↓</span></summary><p id="faq-answer-1">Page credits are deducted when a job completes successfully. Failed jobs do not consume credits.</p></details>
          <details><summary aria-expanded="false" aria-controls="faq-answer-2">Do unused pages roll over?<span aria-hidden="true">↓</span></summary><p id="faq-answer-2">Page credits expire 3 months after purchase.</p></details>
          <details><summary aria-expanded="false" aria-controls="faq-answer-3">Can I get a refund?<span aria-hidden="true">↓</span></summary><p id="faq-answer-3">Contact team@knowhereto.ai for refund requests within 14 days of purchase.</p></details>
          <details><summary aria-expanded="false" aria-controls="faq-answer-4">What payment methods are accepted?<span aria-hidden="true">↓</span></summary><p id="faq-answer-4">We accept all major credit cards through Stripe: Visa, Mastercard, American Express, and more.</p></details>
          <details><summary aria-expanded="false" aria-controls="faq-answer-5">When does Knowhere use visual understanding?<span aria-hidden="true">↓</span></summary><p id="faq-answer-5">Knowhere uses Text Parse for clean electronic content and Vision Map when layouts, drawings, diagrams, scans, or spatial relationships carry meaning. Both remain connected through the same document map, so agents can retrieve text or reopen the original page as needed.</p></details>
        </div>
        {/* BRAIN FAQ intentionally hidden pending public status confirmation. */}
    </section>
    <section className="section shell final-cta reveal" id="final-cta" aria-labelledby="final-title">
      <div className="final-cta-art" aria-hidden="true">
        <svg className="final-cta-vector" viewBox="0 0 1280 410" preserveAspectRatio="none">
          <defs>
            <linearGradient id="final-cta-line-gradient" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="var(--main-600)" stopOpacity="0.32" />
              <stop offset="0.62" stopColor="var(--main-400)" stopOpacity="0.72" />
              <stop offset="1" stopColor="var(--main-300)" />
            </linearGradient>
          </defs>
          <FinalCtaPathFan convergenceX={finalCtaConvergence} />
          <g transform="translate(1280 0) scale(-1 1)"><FinalCtaPathFan convergenceX={finalCtaConvergence} /></g>
        </svg>
        <span className="final-cta-placeholder final-cta-placeholder--left">Placeholder image</span>
        <span className="final-cta-placeholder final-cta-placeholder--right">Placeholder image</span>
      </div>
      <div id="final-cta-copy"><p className="section-no">ENTERPRISE</p><h2 id="final-title">Ready to build with better document context?</h2><p className="lede">Start with the API, connect your existing agent workflow, and see how Knowhere handles the documents that plain text pipelines miss.</p></div>
      <div id="final-cta-actions"><a className="button final-cta-shimmer" href="https://knowhereto.ai/login">Start free trial</a><a className="button button-secondary" href="mailto:team@knowhereto.ai">Book a demo</a></div>
    </section>
  </main>
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-main">
        <a className="footer-brand" href="#top" aria-label="Knowhere, back to top"><img src="/assets/knowhere-back-to-top.svg" width={132} height={52} alt="" /></a>
        <nav className="footer-links" aria-label="Footer links"><a href="#comparison">Comparison</a><a href="#pricing">Pricing</a><a href="https://docs.knowhereto.ai/" target="_blank" rel="noopener noreferrer">Docs</a><a href="https://blog.knowhereto.ai/" target="_blank" rel="noopener noreferrer">Blog</a></nav>
      </div>
      <div className="footer-divider" aria-hidden="true" />
      <p className="footer-copyright" id="prototype-notice" tabIndex={-1}>© 2026 Knowhere API. Allrights reserved</p>
    </div>
  </footer>
  <div className="toast" role="status" aria-live="polite" hidden><p data-toast-message /><button type="button" aria-label="Close notification">×</button></div>
</div>


  )
}
