import { useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'

// Magic UI's circle reveal, using the landing page's existing theme state and icons.
// https://magicui.design/docs/components/animated-theme-toggler
export function AnimatedThemeToggler({ onClick, children, ...props }) {
  const transitionRef = useRef(null)

  useEffect(() => () => transitionRef.current?.skipTransition(), [])

  const toggleTheme = async event => {
    const root = document.documentElement
    if (root.dataset.themeTransition === 'active') return

    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClick(event)
      return
    }

    const { left, top, width, height } = event.currentTarget.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    root.style.setProperty('--theme-reveal-origin', `${x / innerWidth * 100}% ${y / innerHeight * 100}%`)
    root.style.setProperty('--theme-reveal-radius', `${radius / (Math.hypot(innerWidth, innerHeight) / Math.SQRT2) * 100}%`)
    root.dataset.themeTransition = 'active'

    const transition = document.startViewTransition(() => flushSync(() => onClick(event)))
    transitionRef.current = transition
    try {
      await transition.finished
    } catch {
      // A skipped transition still applies the theme change.
    } finally {
      transitionRef.current = null
      delete root.dataset.themeTransition
      root.style.removeProperty('--theme-reveal-origin')
      root.style.removeProperty('--theme-reveal-radius')
    }
  }

  return <button {...props} onClick={toggleTheme}>{children}</button>
}
