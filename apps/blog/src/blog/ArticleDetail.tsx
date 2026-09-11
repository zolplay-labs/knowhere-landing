import { Link } from '@tanstack/react-router';
import { IconChevronLeft } from '@tabler/icons-react';
import { RiBlueskyFill, RiFacebookFill, RiLinkedinFill, RiMastodonFill, RiTwitterXFill } from '@remixicon/react';
import { ArticleCard, DynamicLeadCover } from './BlogHome';
import { Header } from './Header';
import { Footer } from './Footer';
import { articles, articleDate, articleUrl, type Article } from './articles';
import articleContent from './content/pdf-parser.html?raw';
import './article-detail.css';

const socialLinks = [
  { name: 'LinkedIn', service: 'linkedin', Icon: RiLinkedinFill },
  { name: 'Mastodon', service: 'mastodon', Icon: RiMastodonFill },
  { name: 'Bluesky', service: 'bluesky', Icon: RiBlueskyFill },
  { name: 'X', service: 'twitter', Icon: RiTwitterXFill },
  { name: 'Facebook', service: 'facebook', Icon: RiFacebookFill },
];

function ShareLinks({ article }: { article: Article }) {
  return <nav className="kb-detail-share" aria-label="Share article">
    <span>Share</span>
    {socialLinks.map(({ name, service, Icon }) => <a key={service}
      href={`${articleUrl(article)}?share=${service}&nb=1`}
      target="_blank" rel="noopener noreferrer" aria-label={`Share on ${name}`} title={`Share on ${name}`}>
      <Icon size={20} aria-hidden="true" />
    </a>)}
  </nav>;
}

export default function ArticleDetail({ article = articles[0], content = articleContent, readingTime = '11–17 min read' }: { article?: Article; content?: string; readingTime?: string }) {
  const recommendations = articles.filter(item => item.slug !== article.slug).slice(0, 4);

  return <div className="kb kb-standard kb-detail" lang="en" id="top">
    <a className="kb-skip" href="#article-main">Skip to content</a>
    <Header />
    <main id="article-main">
      <article className="kb-detail-grid kb-shell" aria-labelledby="article-title">
        <header className="kb-detail-heading">
          <Link className="kb-detail-back" to="/" preload="intent"><IconChevronLeft size={20} aria-hidden="true" /> Back</Link>
          <h1 id="article-title">{article.title}</h1>
          <div className="kb-detail-meta"><span>OntosAI</span><time dateTime={article.date}>{articleDate(article.date, 'long')}</time><span>{readingTime}</span></div>
        </header>
        <div className="kb-detail-primary">
        <figure className="kb-detail-cover">{article.category === 'Use Case' ? <img src={article.coverSource} width="4096" height="2304" alt="Use Case" /> : <DynamicLeadCover title={article.title} />}</figure>
        <div className="kb-detail-body">
          <ShareLinks article={article} />
          <div className="kb-detail-content" dangerouslySetInnerHTML={{ __html: content }} />
          <div className="kb-detail-end"><ShareLinks article={article} /><Link className="kb-detail-back" to="/" preload="intent"><IconChevronLeft size={20} aria-hidden="true" /> Back to blog</Link></div>
        </div>
        </div>
        <aside className="kb-detail-sidebar" aria-label="Recommended reading">
          <nav className="kb-detail-sidebar-inner kb-detail-recommendations" aria-label="Recommended reading">
            <h2>Recommended reading</h2>
            <ul>{recommendations.map(item => <li key={item.slug}>
              <a href={item.category === 'Use Case' ? `/articles/${item.slug}` : articleUrl(item)}>{item.title}</a>
            </li>)}</ul>
          </nav>
        </aside>
      </article>
      <section className="kb-detail-related kb-classic kb-hybrid kb-shell" aria-labelledby="related-title">
        <div className="kb-section-heading"><h2 id="related-title">Recommended articles</h2></div>
        <div className="kb-featured-grid">
          {[articles[1], articles[3], articles[2]].map(item => <ArticleCard key={item.slug} article={item} />)}
        </div>
      </section>
    </main>
    <Footer />
  </div>;
}
