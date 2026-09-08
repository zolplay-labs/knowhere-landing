import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="flex min-h-dvh items-center justify-center">
      Zolplay.
    </main>
  )
}
