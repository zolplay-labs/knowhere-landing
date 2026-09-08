import { createFileRoute } from '@tanstack/react-router'
import BlogHome from '../blog/BlogHome'

export const Route = createFileRoute('/')({ component: BlogHome })
