import { useRef, useState } from 'react';
import {
  IconArrowUpRight as FiArrowUpRight,
  IconArrowRight as FiArrowRight,
  IconSearch as FiSearch,
  IconX as FiX,
  IconMenu2 as FiMenu,
  IconBrandGithub as FaGithub,
} from '@tabler/icons-react';
import { articles, articleDate, articleUrl, type Article } from './articles';

const navigation = [
  ['Comparison', 'https://knowhereto.ai/#comparison'],
  ['Pricing', 'https://knowhereto.ai/#pricing'],
  ['Docs', 'https://docs.knowhereto.ai/'],
  ['Blog', '/'],
] as const;

function Cover({ kind }: { kind: Article['artwork'] }) {
  return <div className={`kb-cover kb-cover-${kind}`} aria-hidden="true">
    <div className="kb-cover-grid" />
    <div className="kb-art"><i /><i /><i /><i /></div>
    <span className="kb-cover-brand">KNOWHERE®</span>
    <span className="kb-cover-label">IMAGE PLACEHOLDER ↗</span>
  </div>;
}

function ArticleMeta({ article }: { article: Article }) {
  return <div className="kb-meta">
    <span className={`kb-category kb-category-${article.category.toLowerCase()}`}>
      <span />{article.category}
    </span>
    <time dateTime={article.date}>{articleDate(article.date)}</time>
  </div>;
}

function ArticleCard({ article }: { article: Article }) {
  return <article className="kb-card">
    <a href={articleUrl(article)}>
      <Cover kind={article.artwork} />
      <ArticleMeta article={article} />
      <h3>{article.title}<FiArrowUpRight aria-hidden="true" /></h3>
      <p>{article.description}</p>
      <span className="kb-read">Read more
        <FiArrowRight aria-hidden="true" />
      </span>
    </a>
  </article>;
}

function ArticleBrowser() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  // The original homepage lists its three featured stories separately.
  const matching = articles.slice(3)
    .filter(article => (category === 'All' || article.category === category)
      && `${article.title} ${article.description}`.toLowerCase()
        .includes(query.trim().toLowerCase()));

  return <section className="kb-latest kb-shell" id="articles"
    aria-labelledby="latest-title">
    <div className="kb-section-heading">
      <span className="kb-eyebrow">▸ Browse</span>
      <h2 id="latest-title">All articles</h2>
    </div>
    <div className="kb-filterbar">
      <div className="kb-filters" aria-label="Filter articles">
        {['All', 'Product', 'Research', 'News', 'Use Case'].map(item =>
          <button key={item} aria-pressed={category === item}
            onClick={() => setCategory(item)}>
            {item}
          </button>)}
      </div>
      <div className="kb-search">
        <FiSearch aria-hidden="true" />
        <input type="search" aria-label="Search articles"
          placeholder="Search articles" value={query}
          onChange={event => setQuery(event.target.value)} />
        {query && <button aria-label="Clear search" onClick={() => setQuery('')}>
          <FiX aria-hidden="true" />
        </button>}
      </div>
    </div>
    <p className="kb-results" role="status">
      {matching.length} {matching.length === 1 ? 'article' : 'articles'}
      {category !== 'All' ? ` in ${category}` : ''}
    </p>
    <div className="kb-article-grid">
      {matching.map(article =>
        <ArticleCard key={article.slug} article={article} />)}
    </div>
    {matching.length === 0 && <div className="kb-empty">
      <h3>No articles here just yet.</h3>
      <p>Try another topic or a different search.</p>
      <button onClick={() => { setCategory('All'); setQuery(''); }}>
        View all articles <FiArrowRight aria-hidden="true" />
      </button>
    </div>}
    {category === 'All' && !query.trim() &&
      <nav className="kb-pagination" aria-label="Article pages">
        <span aria-current="page">1</span>
        <a href="https://blog.knowhereto.ai/?query-22-page=2"
          aria-label="Page 2">2</a>
        <a href="https://blog.knowhereto.ai/?query-22-page=2">
          Next page <FiArrowRight aria-hidden="true" />
        </a>
      </nav>}
  </section>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  return <header className="kb-header" onKeyDown={event => {
    if (event.key === 'Escape' && open) {
      setOpen(false);
      menuButton.current?.focus();
    }
  }}>
    <div className="kb-shell kb-nav">
      <a href="https://knowhereto.ai/" aria-label="Knowhere home">
        <img src="/brand/knowhere-back-to-top.svg" width="132" height="52" alt="Knowhere" />
      </a>
      <nav className="kb-desktop-nav" aria-label="Main navigation">
        {navigation.map(([label, href]) => <a key={label} href={href}
          aria-current={label === 'Blog' ? 'page' : undefined}>{label}</a>)}
      </nav>
      <div className="kb-nav-actions">
        <a className="kb-github" href="https://knowhereto.ai/github" aria-label="GitHub">
          <FaGithub />
        </a>
        <a className="kb-api-button" href="https://knowhereto.ai/login">
          Get API Key <FiArrowUpRight aria-hidden="true" />
        </a>
        <button ref={menuButton} className="kb-menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open} aria-controls="blog-menu" onClick={() => setOpen(!open)}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </div>
    {open && <nav id="blog-menu" className="kb-mobile-nav" aria-label="Mobile navigation">
      {navigation.map(([label, href]) => <a key={label} href={href}
        onClick={() => setOpen(false)}>{label}<FiArrowUpRight aria-hidden="true" /></a>)}
    </nav>}
  </header>;
}

export default function BlogHome() {
  return <div className="kb" lang="en" id="top">
    <a className="kb-skip" href="#blog-main">Skip to content</a>
    <Header />
    <main id="blog-main">
      <section className="kb-intro kb-shell">
        <h1>Blog</h1>
        <p>Knowledge infra for your coding agents.</p>
      </section>
      <div className="kb-mood">
        <img src="/brand/blog-glass-cells.webp" alt=""
          width="1920" height="720" fetchPriority="high" />
        <p>Traditional RAG is doomed. Period.</p>
      </div>
      <section className="kb-featured kb-shell" aria-labelledby="featured-title">
        <div className="kb-section-heading">
          <span className="kb-eyebrow">▸ Featured</span>
          <h2 id="featured-title">Featured articles</h2>
        </div>
        <div className="kb-featured-grid">
          {articles.slice(0, 3).map(article =>
            <ArticleCard key={article.slug} article={article} />)}
        </div>
      </section>
      <ArticleBrowser />
    </main>
    <footer className="kb-footer">
      <a href="#top" aria-label="Back to top"><img src="/brand/knowhere-footer-mark.svg" width="37" height="42" alt="" /></a>
      <nav aria-label="Footer navigation">
        {navigation.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
      </nav>
      <p>© {new Date().getFullYear()} KNOWHERE. KNOWLEDGE BEYOND BOUNDARIES.</p>
      <div className="kb-footer-wordmark kb-shell" aria-hidden="true" />
    </footer>
  </div>;
}
