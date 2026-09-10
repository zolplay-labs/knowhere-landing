import { createFileRoute } from '@tanstack/react-router'
import ArticleDetail from '../blog/ArticleDetail'

export const Route = createFileRoute('/article-preview')({
  head: () => ({ meta: [
    { title: 'How to Choose a PDF Parser API for AI Agents — Knowhere' },
    { name: 'robots', content: 'noindex, nofollow' },
  ] }),
  component: ArticleDetail,
})
