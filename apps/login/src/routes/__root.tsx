import faviconUrl from '../../../../public/assets/knowhere-favicon.svg?url'
import { themeInitScript } from "../../../../shared/site-chrome/theme";
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Sign in — Knowhere',
      },
      {
        name: 'description',
        content:
          'Sign in to Knowhere. Turn complex documents into context your agents can use.',
      },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: faviconUrl },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;450;500;550;600&display=swap',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
