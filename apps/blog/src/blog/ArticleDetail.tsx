import { IconChevronLeft, IconBrandLinkedin, IconBrandMastodon, IconBrandBluesky, IconBrandX, IconBrandFacebook } from '@tabler/icons-react';
import { ArticleCard, DynamicLeadCover, Header } from './BlogHome';
import { articles, articleDate, articleUrl } from './articles';
import articleContent from './content/pdf-parser.html?raw';
import './article-detail.css';

const socialLinks = [
  { name: 'LinkedIn', service: 'linkedin', Icon: IconBrandLinkedin },
  { name: 'Mastodon', service: 'mastodon', Icon: IconBrandMastodon },
  { name: 'Bluesky', service: 'bluesky', Icon: IconBrandBluesky },
  { name: 'X', service: 'twitter', Icon: IconBrandX },
  { name: 'Facebook', service: 'facebook', Icon: IconBrandFacebook },
];

function ShareLinks() {
  return <nav className="kb-detail-share" aria-label="Share article">
    <span>Share</span>
    {socialLinks.map(({ name, service, Icon }) => <a key={service}
      href={`${articleUrl(articles[0])}?share=${service}&nb=1`}
      target="_blank" rel="noopener noreferrer" aria-label={`Share on ${name}`} title={`Share on ${name}`}>
      <Icon size={18} aria-hidden="true" />
    </a>)}
  </nav>;
}

export default function ArticleDetail() {
  const article = articles[0];
  return <div className="kb kb-standard kb-detail" lang="en" id="top">
    <a className="kb-skip" href="#article-main">Skip to content</a>
    <Header standard />
    <main id="article-main">
      <article aria-labelledby="article-title">
        <header className="kb-detail-heading">
          <a className="kb-detail-back" href="/"><IconChevronLeft size={20} aria-hidden="true" /> Back</a>
          <h1 id="article-title">{article.title}</h1>
          <div className="kb-detail-meta"><span>OntosAI</span><span aria-hidden="true">•</span><time dateTime={article.date}>{articleDate(article.date, 'long')}</time><span aria-hidden="true">•</span><span>11–17 min read</span></div>
        </header>
        <figure className="kb-detail-cover"><DynamicLeadCover /></figure>
        <div className="kb-detail-body">
          <ShareLinks />
          <div className="kb-detail-content" dangerouslySetInnerHTML={{ __html: articleContent }} />
          <div className="kb-detail-end"><ShareLinks /><a className="kb-detail-back" href="/"><IconChevronLeft size={20} aria-hidden="true" /> Back</a></div>
        </div>
      </article>
      <section className="kb-detail-related kb-classic kb-hybrid kb-shell" aria-labelledby="related-title">
        <div className="kb-section-heading"><h2 id="related-title">Recommended articles</h2></div>
        <div className="kb-featured-grid">
          {[articles[1], articles[3], articles[2]].map(item => <ArticleCard key={item.slug} article={item} />)}
        </div>
      </section>
    </main>
  </div>;
}
