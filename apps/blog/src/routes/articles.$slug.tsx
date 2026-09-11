import { createFileRoute, notFound } from '@tanstack/react-router'
import ArticleDetail from '../blog/ArticleDetail'
import { articles } from '../blog/articles'
const contentFiles = import.meta.glob('../blog/content/*.html', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export const Route = createFileRoute('/articles/$slug')({
  loader: ({ params }) => {
    const article = articles.find(item => item.slug === params.slug)
    const content = contentFiles[`../blog/content/${params.slug === articles[0].slug ? 'pdf-parser' : params.slug}.html`]
    if (!article || !content) throw notFound()
    const words = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length
    return { article, content, readingTime: `${Math.ceil(words / 200)} min read` }
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.article.title ?? 'Article'} — Knowhere` }] }),
  component: ArticlePage,
})

function ArticlePage() {
  return <ArticleDetail {...Route.useLoaderData()} />
}
