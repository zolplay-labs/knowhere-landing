import { useState } from 'react'
import revenueChart from '../../assets/source-chart.png'
import marginAnalysis from '../../assets/source-margin.png'
import revenueAnalysis from '../../assets/source-revenue.png'
import revenueTable from '../../assets/source-table.png'

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

export function DocumentMap() {
  const [activeThemeId, setActiveThemeId] = useState(themes[0].id)
  const activeTheme = themes.find(theme => theme.id === activeThemeId) ?? themes[0]

  return (
    <section className="document-map reveal" aria-labelledby="document-map-title">
      <div className="document-map-label"><span id="document-map-title">Document map</span><span>Theme → file → section → pages</span></div>
      <div className="document-map-switcher" aria-label="Choose a document theme">
        {themes.map((theme, index) => (
          <button
            type="button"
            key={theme.id}
            aria-pressed={theme.id === activeThemeId}
            onClick={() => setActiveThemeId(theme.id)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>{theme.label}
          </button>
        ))}
      </div>
      <div className="document-map-hierarchy">
        <div className="document-map-hierarchy-canvas" data-document-count={activeTheme.documents.length} style={{ '--document-count': activeTheme.documents.length }}>
          <div className="document-map-theme"><span>THEME</span><strong>{activeTheme.label}</strong></div>
          <div className="document-map-trunk" aria-hidden="true" />
          <div className="document-map-content" key={activeTheme.id} aria-live="polite">
            <div className="document-map-documents" data-document-count={activeTheme.documents.length}>
              {activeTheme.documents.map((document, documentIndex) => (
                <article className="document-branch" key={document.name}>
                  <header className="document-node">
                    <span>DOCUMENT {documentIndex + 1}</span>
                    <strong>{document.name}</strong>
                  </header>
                  <div className="document-branch-line" aria-hidden="true" />
                  <div
                    className="document-sections"
                    data-section-count={document.sections.length}
                    style={{ '--section-count': document.sections.length }}
                  >
                    {document.sections.map((section, sectionIndex) => (
                      <section className="section-node" key={section.name}>
                        <header>
                          <span>SECTION {sectionIndex + 1}</span>
                          <strong>{section.name}</strong>
                        </header>
                        <div className="section-pages">
                          {section.pages.map(page => (
                            <figure className="section-page" key={page.number}>
                              <img src={page.image} alt="" />
                              <figcaption><span>PAGE {page.number}</span></figcaption>
                            </figure>
                          ))}
                        </div>
                      </section>
                    ))}
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
