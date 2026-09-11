import { createFileRoute, notFound } from '@tanstack/react-router'
import ArticleDetail from '../blog/ArticleDetail'
import { articles } from '../blog/articles'
import realWork from '../blog/content/why-llms-fail-at-real-work.html?raw'
import visaProcessing from '../blog/content/beyond-the-openclaw-hype-visa-processing.html?raw'
import literatureReview from '../blog/content/how-i-cured-my-ais-amnesia-literature-review.html?raw'

const contentBySlug: Record<string, string> = {
  'why-llms-fail-at-real-work': realWork,
  'beyond-the-openclaw-hype-visa-processing': visaProcessing,
  'how-i-cured-my-ais-amnesia-literature-review': literatureReview,
}

export const Route = createFileRoute('/articles/$slug')({
  loader: ({ params }) => {
    const article = articles.find(item => item.slug === params.slug)
    const content = contentBySlug[params.slug]
    if (!article || !content) throw notFound()
    const words = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length
    return { article, content, readingTime: `${Math.ceil(words / 200)} min read` }
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.article.title ?? 'Article'} — Knowhere` }] }),
  component: UseCaseDetail,
})

function UseCaseDetail() {
  return <ArticleDetail {...Route.useLoaderData()} />
}
