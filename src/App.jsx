import { Agentation } from 'agentation'
import '@fontsource/atkinson-hyperlegible-next/400.css'
import { LandingPage } from './landing/LandingPage'
import './landing/landing.css'
import { PageStyleControls } from './page-style-controller'

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
  }
}

export function App() {
  return (
    <>
      <LandingPage />
      <PageStyleControls />
      {import.meta.env.DEV && (
        <Agentation copyToClipboard={false} onCopy={copyToClipboard} />
      )}
    </>
  )
}
