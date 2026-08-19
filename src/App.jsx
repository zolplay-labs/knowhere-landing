import { useEffect, useMemo } from 'react'
import { Agentation } from 'agentation'
import legacyPage from './legacy-page.html?raw'
import { PageStyleControls } from './page-style-controller'

function readLegacyPage(source) {
  const document = new DOMParser().parseFromString(source, 'text/html')
  const styles = [...document.querySelectorAll('style')]
    .map((style) => style.textContent)
    .join('\n')
  const scripts = [...document.querySelectorAll('script:not([type="module"])')]
    .map((script) => script.textContent)
    .filter((script) => script.trim())

  document.querySelectorAll('script, style, #page-style-dialkit').forEach((node) => node.remove())

  return {
    markup: document.body.innerHTML,
    scripts,
    styles,
  }
}

export function App() {
  const page = useMemo(() => readLegacyPage(legacyPage), [])

  useEffect(() => {
    for (const script of page.scripts) {
      Function(script)()
    }
  }, [page])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: page.styles }} />
      <div dangerouslySetInnerHTML={{ __html: page.markup }} />
      <PageStyleControls />
      {import.meta.env.DEV && <Agentation />}
    </>
  )
}
