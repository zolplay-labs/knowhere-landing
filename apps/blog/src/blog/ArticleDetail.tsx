import { Link } from '@tanstack/react-router';
import { IconChevronLeft } from '@tabler/icons-react';
import { RiBlueskyFill, RiFacebookFill, RiLinkedinFill, RiMastodonFill, RiTwitterXFill } from '@remixicon/react';
import { ArticleCard } from './BlogHome';
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
        <div className="kb-detail-body">
          <div className="kb-detail-content" dangerouslySetInnerHTML={{ __html: content }} />
          <div className="kb-detail-end"><Link className="kb-detail-back" to="/" preload="intent"><IconChevronLeft size={20} aria-hidden="true" /> Back to blog</Link></div>
        </div>
        </div>
        <aside className="kb-detail-sidebar" aria-label="Article information">
          <div className="kb-detail-sidebar-inner kb-detail-information">
            <h2>Article information</h2>
            <dl>
              <div><dt>Author</dt><dd>OntosAI</dd></div>
              <div><dt>Published</dt><dd><time dateTime={article.date}>{articleDate(article.date, 'long')}</time></dd></div>
              <div><dt>Category</dt><dd>{article.category}</dd></div>
              <div><dt>Reading time</dt><dd>{readingTime}</dd></div>
            </dl>
            <ShareLinks article={article} />
          </div>
        </aside>
      </article>
      <section className="kb-detail-related kb-classic kb-hybrid kb-shell" aria-labelledby="related-title">
        <div className="kb-section-heading"><h2 id="related-title">Recommended articles</h2></div>
        <div className="kb-featured-grid">
          {recommendations.slice(0, 3).map(item => <ArticleCard key={item.slug} article={item} />)}
        </div>
      </section>
    </main>
    <Footer />
  </div>;
}
