import { useEffect, useRef, useState } from 'react';
import {
  IconArrowUpRight as FiArrowUpRight,
  IconArrowRight as FiArrowRight,
  IconArrowLeft as FiArrowLeft,
  IconX as FiX,
  IconMenu2 as FiMenu,
  IconLayoutColumns,
  IconBrandGithub as FaGithub,
} from '@tabler/icons-react';
import { Footer } from './Footer';
import { HeroDataStream } from '../../../pricing/src/components/hero-data-stream';
import { articles, articleDate, type Article } from './articles';
import coverSettings from './local-fluid-cover/render-settings.json';
import studioSettings from './local-fluid-cover/studio-settings.json';
import leadLogo from './local-fluid-cover/logo.svg';
import productSettings from './local-fluid-cover/product-render-settings.json';
import productSource from './local-fluid-cover/product-source.jpg';
import type { MeshGradientRenderValues } from '../../../login/src/lib/fluid-gradient/mesh-gradient-renderer';

const navigation = [
  ['Comparison', 'https://knowhereto.ai/#comparison'],
  ['Pricing', 'https://knowhereto.ai/#pricing'],
  ['Docs', 'https://docs.knowhereto.ai/'],
  ['Blog', '/'],
] as const;

function Cover({ article, featured = false }: { article: Article; featured?: boolean }) {
  return <img className="kb-cover" src={`/covers/${article.slug}.webp`}
    width="1200" height="900" alt="" loading={featured ? 'eager' : 'lazy'}
    fetchPriority={featured ? 'high' : undefined} decoding="async" />;
}

export function DynamicLeadCover({ label }: { label?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    let cancelled = false;
    let dispose = () => {};

    import('../../../login/src/lib/fluid-gradient/mesh-gradient-renderer').then(async ({ createMeshGradientSurface }) => {
      if (cancelled) return;
      const image = label ? new Image() : null;
      if (image) {
        image.src = productSource;
        await image.decode();
        if (cancelled) return;
      }
      const imageSource = image ? { image, rotationDeg: 0, flipHorizontal: false, flipVertical: false } : null;
      const surface = createMeshGradientSurface(canvas);
      const values = (label ? productSettings : coverSettings) as MeshGradientRenderValues;
      let renderValues = values;
      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
      let frame = 0;
      let phase = studioSettings.values['motion.time'] / 100;
      let previousTime = 0;
      let inView = false;
      surface.resize(studioSettings.canvas.size.width, studioSettings.canvas.size.height, 1);

      const draw = () => {
        surface.render(renderValues, phase, imageSource);
        if (canvas.dataset.ready !== 'true') canvas.dataset.ready = 'true';
      };
      const animate = (time: number) => {
        phase = (phase + Math.min((time - previousTime) / 1000, 0.1) * studioSettings.values['motion.speed']) % 1;
        previousTime = time;
        draw();
        frame = requestAnimationFrame(animate);
      };
      const sync = () => {
        cancelAnimationFrame(frame);
        const { width, height } = canvas.getBoundingClientRect();
        if (width <= 0 || height <= 0 || document.hidden || !inView) return;
        // Match the grain visible in the studio at 50% zoom, independently of cover size.
        renderValues = { ...values, pixelSize: values.pixelSize * (studioSettings.canvas.size.height * 0.5) / height };
        draw();
        previousTime = performance.now();
        if (!reducedMotion.matches && values.gradientMode !== 'image-processing') frame = requestAnimationFrame(animate);
      };
      const observer = new ResizeObserver(sync);
      observer.observe(canvas);
      const visibilityObserver = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        sync();
      });
      visibilityObserver.observe(canvas);
      document.addEventListener('visibilitychange', sync);
      reducedMotion.addEventListener('change', sync);
      dispose = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        visibilityObserver.disconnect();
        document.removeEventListener('visibilitychange', sync);
        reducedMotion.removeEventListener('change', sync);
        surface.dispose();
      };
      sync();
    }).catch(() => {
      canvas.dataset.ready = 'false';
    });

    return () => {
      cancelled = true;
      dispose();
    };
  }, [label]);

  return <div className={`kb-lead-logo-art${label ? ' kb-product-cover' : ''}`} aria-hidden={label ? undefined : true}>
    <canvas ref={canvasRef} />
    <div className="kb-lead-content-gradient" />
    {label ? <span className="kb-cover-type">{label}</span> : <img src={leadLogo} alt="" />}
  </div>;
}

export function ArticleCard({ article, classic = false, hybrid = false }: { article: Article; classic?: boolean; hybrid?: boolean }) {
  return <article className={`kb-card${hybrid ? ' kb-card-hybrid' : ''}`}>
    <a href="/article-preview">
      {hybrid ? <div className="kb-card-image">
        {article.category === 'Product' ? <DynamicLeadCover label={article.category} /> : <>
          <div className="kb-cover kb-cover-placeholder" aria-hidden="true" />
          <span className="kb-category"><span />{article.category}</span>
        </>}
      </div> : <Cover article={article} />}
      {classic && !hybrid ? <>
        <div className="kb-meta">
          <span className="kb-category"><span />{article.category}</span>
          <time dateTime={article.date}>{articleDate(article.date)}</time>
        </div>
        <h3>{article.title}</h3>
        <p>{article.description}</p>
        <span className="kb-read">Read more <FiArrowRight aria-hidden="true" /></span>
      </> : <>
        <div className="kb-card-copy">
          <h3>{article.title}</h3>
          <p>{article.description}</p>
        </div>
        <div className="kb-card-footer">
          <time dateTime={article.date}>{articleDate(article.date, hybrid ? 'long' : 'short')}</time>
          {hybrid
            ? <span className="kb-card-read" aria-hidden="true">Read <FiArrowRight /></span>
            : <span className="kb-read">Read</span>}
        </div>
      </>}
    </a>
  </article>;
}

function FeaturedArticle({ article, titleId = 'featured-title' }: { article: Article; titleId?: string }) {
  return <article className="kb-featured" aria-labelledby={titleId}>
    <a href="/article-preview">
      <div className="kb-featured-details">
        <time dateTime={article.date}>{articleDate(article.date)}</time>
        <div className="kb-featured-copy">
          <div>
            <h2 id={titleId}>{article.title}</h2>
            <p>{article.description}</p>
          </div>
          <div className="kb-card-footer">
            <span className="kb-category">{article.category}</span>
            <span className="kb-read">Read</span>
          </div>
        </div>
      </div>
      <div className="kb-featured-image"><Cover article={article} featured /></div>
    </a>
  </article>;
}

function LeadArticle({ article }: { article: Article }) {
  return <article className="kb-photon-lead" aria-labelledby="lead-title">
    <a href="/article-preview">
      <div className="kb-lead-image">
        <div className="kb-lead-cover-copy">
          <div className="kb-lead-story">
            <span className="kb-lead-cover-tag"><span aria-hidden="true" />{article.category}</span>
            <h2 className="kb-lead-cover-title" id="lead-title">{article.title}</h2>
            <p>{article.description}</p>
            <time dateTime={article.date}>{articleDate(article.date, 'long')}</time>
          </div>
        </div>
        <div className="kb-lead-cover-art" aria-hidden="true">
          <DynamicLeadCover />
        </div>
      </div>
    </a>
  </article>;
}

function ArticleBrowser() {
  return <section className="kb-latest" id="articles" aria-label="More articles">
    <div className="kb-article-grid">
      {articles.slice(1).map(article =>
        <ArticleCard key={article.slug} article={article} />)}
    </div>
    <Pagination />
  </section>;
}

function Pagination({ currentPage = 1, pageCount = 2 }: { currentPage?: number; pageCount?: number }) {
  const pageUrl = (page: number) => page === 1
    ? 'https://blog.knowhereto.ai/'
    : `https://blog.knowhereto.ai/?query-22-page=${page}`;

  return <nav className="kb-pagination" aria-label="Article pages">
    <div className="kb-pagination-side kb-pagination-previous">
      {currentPage > 1 && <a href={pageUrl(currentPage - 1)}>
        <FiArrowLeft aria-hidden="true" /> Previous page
      </a>}
    </div>
    <div className="kb-pagination-pages">
      {Array.from({ length: pageCount }, (_, index) => index + 1).map(page =>
        page === currentPage
          ? <span key={page} aria-current="page">{page}</span>
          : <a key={page} href={pageUrl(page)} aria-label={`Page ${page}`}>{page}</a>)}
    </div>
    <div className="kb-pagination-side kb-pagination-next">
      {currentPage < pageCount && <a href={pageUrl(currentPage + 1)}>
        Next page <FiArrowRight aria-hidden="true" />
      </a>}
    </div>
  </nav>;
}

function ClassicArticleBrowser({ start = 3, hybrid = false }: { start?: number; hybrid?: boolean }) {
  const [category, setCategory] = useState('All');
  const matching = articles.slice(start)
    .filter(article => category === 'All' || article.category === category);

  return <section className="kb-latest kb-shell" id="articles" aria-labelledby="latest-title">
    <div className="kb-section-heading">
      <span className="kb-eyebrow">{hybrid ? '[ BROWSE ]' : '▸ Browse'}</span>
      <h2 id="latest-title">All articles</h2>
    </div>
    <div className="kb-filterbar">
      <div className="kb-filters" aria-label="Filter articles">
        {['All', 'Product', 'Research', 'News', 'Use Case'].map(item =>
          <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>
            {item}
          </button>)}
      </div>
    </div>
    <div className="kb-article-grid">
      {matching.map(article => <ArticleCard key={article.slug} article={article} classic hybrid={hybrid} />)}
    </div>
    {matching.length === 0 && <div className="kb-empty">
      <h3>No articles here just yet.</h3>
      <p>Try another topic.</p>
      <button onClick={() => setCategory('All')}>
        View all articles <FiArrowRight aria-hidden="true" />
      </button>
    </div>}
    {category === 'All' && <Pagination />}
  </section>;
}

function ClassicLayout({ withLead = false }: { withLead?: boolean }) {
  const featuredStart = withLead ? 1 : 0;
  return <main id="blog-main" className={`kb-classic${withLead ? ' kb-hybrid' : ''}`}>
    <section className="kb-intro kb-shell" aria-labelledby="blog-title">
      {withLead && <HeroDataStream />}
      <h1 id="blog-title">Blog</h1>
      <p>Knowledge infra for your coding agents.</p>
    </section>
    {withLead ? <div className="kb-shell">
      <LeadArticle article={articles[0]} />
    </div> : <div className="kb-mood">
      <img src="/brand/blog-glass-cells.webp" alt="" width="1920" height="720" fetchPriority="high" />
      <p>Traditional RAG is doomed. Period.</p>
    </div>}
    <section className="kb-classic-featured kb-shell" aria-labelledby="featured-title">
      <div className="kb-section-heading">
        <span className="kb-eyebrow">{withLead ? '[ FEATURED ]' : '▸ Featured'}</span>
        <h2 id="featured-title">Featured articles</h2>
      </div>
      <div className="kb-featured-grid">
        {articles.slice(featuredStart, featuredStart + 3).map(article =>
          <ArticleCard key={article.slug} article={article} classic hybrid={withLead} />)}
      </div>
    </section>
    <ClassicArticleBrowser start={featuredStart + 3} hybrid={withLead} />
  </main>;
}

export function Header({ standard = false }: { standard?: boolean }) {
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
          Get API Key {!standard && <FiArrowUpRight aria-hidden="true" />}
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
      {standard && <a className="kb-mobile-api" href="https://knowhereto.ai/login">Get API Key <FiArrowUpRight aria-hidden="true" /></a>}
    </nav>}
  </header>;
}

function GridController() {
  const [visible, setVisible] = useState(false);

  return <>
    <div id="blog-grid-overlay" className="kb-grid-overlay kb-shell" hidden={!visible} aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => <span key={index} />)}
    </div>
    <button type="button" className="kb-grid-controller" aria-controls="blog-grid-overlay"
      aria-pressed={visible} onClick={() => setVisible(!visible)}>
      <IconLayoutColumns size={18} aria-hidden="true" />
      <span>Layout grid</span>
      <span className="kb-grid-switch" aria-hidden="true" />
    </button>
  </>;
}

export default function BlogHome() {
  const [layout, setLayout] = useState<'classic' | 'news' | 'hybrid'>('classic');
  useEffect(() => {
    const saved = localStorage.getItem('knowhere-blog-layout');
    if (saved === 'news' || saved === 'hybrid') setLayout(saved);
  }, []);

  return <div className={`kb${layout === 'hybrid' ? ' kb-standard' : ''}`} lang="en" id="top">
    <a className="kb-skip" href="#blog-main">Skip to content</a>
    <Header standard={layout === 'hybrid'} />
    {layout !== 'news' ? <ClassicLayout key={layout} withLead={layout === 'hybrid'} /> : <main id="blog-main" className="kb-news kb-shell">
      <section className="kb-intro" aria-labelledby="blog-title">
        <span className="kb-eyebrow">[ What's new ]</span>
        <div className="kb-intro-heading">
          <h1 id="blog-title">Blog</h1>
          <p>Knowledge infra for your coding agents.</p>
        </div>
      </section>
      <FeaturedArticle article={articles[0]} />
      <ArticleBrowser />
    </main>}
    {layout === 'hybrid' ? <Footer /> : <footer className="kb-footer">
      <a href="#top" aria-label="Back to top"><img src="/brand/knowhere-footer-mark.svg" width="37" height="42" alt="" /></a>
      <nav aria-label="Footer navigation">
        {navigation.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
      </nav>
      <p>© {new Date().getFullYear()} KNOWHERE. KNOWLEDGE BEYOND BOUNDARIES.</p>
      <div className="kb-footer-wordmark kb-shell" aria-hidden="true" />
    </footer>}
    <GridController />
    <div className="kb-layout-controller" role="group" aria-label="排版版本" lang="zh-CN">
      <span>排版版本</span>
      {([['classic', 'V1 原版'], ['news', 'V2 新闻列表'], ['hybrid', 'V3 组合版']] as const).map(([value, label]) =>
        <button key={value} type="button" aria-pressed={layout === value} aria-controls="blog-main"
          onClick={() => {
            setLayout(value);
            localStorage.setItem('knowhere-blog-layout', value);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}>{label}</button>)}
    </div>
  </div>;
}
