import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import {
  IconArrowRight as FiArrowRight,
  IconArrowLeft as FiArrowLeft,
} from '@tabler/icons-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { HeroDataStream } from '../../../pricing/src/components/hero-data-stream';
import { articles, articleDate, type Article } from './articles';
import { ProcessedArticleCover } from './ProcessedArticleCover';
import coverSettings from './local-fluid-cover/render-settings.json';
import studioSettings from './local-fluid-cover/studio-settings.json';
import leadLogo from './local-fluid-cover/logo.svg';
import productSettings from './local-fluid-cover/product-render-settings.json';
import productSource from './local-fluid-cover/product-source.jpg';
import type { MeshGradientRenderValues } from '../../../login/src/lib/fluid-gradient/mesh-gradient-renderer';

export function DynamicLeadCover({ label, title }: { label?: string; title?: string }) {
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

  return <div className={`kb-lead-logo-art${label ? ' kb-product-cover' : ' kb-lead-marble-cover'}`} aria-hidden={label ? undefined : true}>
    <canvas ref={canvasRef} />
    <div className="kb-lead-content-gradient" />
    {label ? <span className="kb-cover-type">{label}</span> : <>
      <img src={leadLogo} alt="" />
      <span className="kb-lead-art-title">{title}</span>
    </>}
  </div>;
}

export function ArticleCard({ article, originalCover = false, coverOverride }: {
  article: Article;
  originalCover?: boolean;
  coverOverride?: string;
}) {
  return <article className="kb-card kb-card-hybrid">
    <Link to="/article-preview" preload="intent">
      <div className="kb-card-image">
        {coverOverride ? <img className="kb-cover" src={coverOverride} width="4096" height="2304" alt={article.category} />
          : (originalCover || ('originalCover' in article && article.originalCover)) ? <img className="kb-cover" src={`/covers/categories/${article.category.toLowerCase()}.png`}
          width="4096" height="2304" alt={article.category} />
          : <ProcessedArticleCover source={article.coverSource} label={article.category} />}
      </div>
      <div className="kb-card-copy">
        <h3>{article.title}</h3>
        <p>{article.description}</p>
      </div>
      <div className="kb-card-footer">
        <time dateTime={article.date}>{articleDate(article.date, 'long')}</time>
        <span className="kb-card-read" aria-hidden="true">Read <FiArrowRight /></span>
      </div>
    </Link>
  </article>;
}

function LeadArticle({ article }: { article: Article }) {
  return <article className="kb-photon-lead" aria-labelledby="lead-title">
    <Link to="/article-preview" preload="intent">
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
          <DynamicLeadCover title={article.title} />
        </div>
      </div>
    </Link>
  </article>;
}

function Pagination({ currentPage, pageCount, onPageChange }: {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  return <nav className="kb-pagination" aria-label="Article pages">
    <div className="kb-pagination-side kb-pagination-previous">
      {currentPage > 1 && <a href="#articles" onClick={() => onPageChange(currentPage - 1)}>
        <FiArrowLeft aria-hidden="true" /> preview
      </a>}
    </div>
    <div className="kb-pagination-pages">
      {Array.from({ length: pageCount }, (_, index) => index + 1).map(page =>
        page === currentPage
          ? <span key={page} aria-current="page">{page}</span>
          : <a key={page} href="#articles" onClick={() => onPageChange(page)} aria-label={`Page ${page}`}>{page}</a>)}
    </div>
    <div className="kb-pagination-side kb-pagination-next">
      {currentPage < pageCount && <a href="#articles" onClick={() => onPageChange(currentPage + 1)}>
        next <FiArrowRight aria-hidden="true" />
      </a>}
    </div>
  </nav>;
}

function ArticleBrowser() {
  const [category, setCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const matching = articles
    .filter(article => category === 'All' || article.category === category);

  return <section className="kb-latest kb-shell" id="articles" aria-labelledby="latest-title">
    <div className="kb-section-heading">
      <span className="kb-eyebrow">[ BROWSE ]</span>
      <h2 id="latest-title">All articles</h2>
    </div>
    <div className="kb-filterbar">
      <div className="kb-filters" aria-label="Filter articles">
        {['All', 'Product', 'Research', 'News', 'Use Case'].map(item =>
          <button key={item} aria-pressed={category === item} onClick={() => { setCategory(item); setCurrentPage(1); }}>
            {item}
          </button>)}
      </div>
    </div>
    <div className="kb-article-grid">
      {matching.slice((currentPage - 1) * 9, currentPage * 9).map(article => <ArticleCard key={article.slug} article={article} />)}
    </div>
    {matching.length === 0 && <div className="kb-empty">
      <h3>No articles here just yet.</h3>
      <p>Try another topic.</p>
      <button onClick={() => setCategory('All')}>
        View all articles <FiArrowRight aria-hidden="true" />
      </button>
    </div>}
    {matching.length > 9 && <Pagination currentPage={currentPage} pageCount={Math.ceil(matching.length / 9)} onPageChange={setCurrentPage} />}
  </section>;
}

function BlogLayout() {
  return <main id="blog-main" className="kb-classic kb-hybrid">
    <section className="kb-intro kb-shell" aria-labelledby="blog-title">
      <HeroDataStream />
      <h1 id="blog-title">Blog</h1>
      <p>Product updates, research, and ideas for building better agents.</p>
    </section>
    <div className="kb-shell">
      <LeadArticle article={articles[0]} />
    </div>
    <section className="kb-classic-featured kb-shell" aria-labelledby="featured-title">
      <div className="kb-section-heading">
        <span className="kb-eyebrow">[ FEATURED ]</span>
        <h2 id="featured-title">Featured articles</h2>
      </div>
      <div className="kb-featured-grid">
        {articles.slice(1, 4).map((article, index) =>
          <ArticleCard key={article.slug} article={article} originalCover
            coverOverride={index === 2 ? '/covers/featured/does-90-percent-rag-project.png' : undefined} />)}
      </div>
    </section>
    <ArticleBrowser />
  </main>;
}

export default function BlogHome() {
  return <div className="kb kb-standard" lang="en" id="top">
    <a className="kb-skip" href="#blog-main">Skip to content</a>
    <Header />
    <BlogLayout />
    <Footer />
  </div>;
}
