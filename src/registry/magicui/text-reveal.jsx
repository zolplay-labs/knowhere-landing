import { Fragment, useEffect } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'

function TextRevealWord({ children, highlighted = false, progress, range }) {
  const opacity = useTransform(progress, range, [0, 1])

  return (
    <span className={`text-reveal-word${highlighted ? ' is-highlighted' : ''}`}>
      <span className="text-reveal-word-muted">{children}</span>
      <motion.span className="text-reveal-word-active" style={{ opacity }}>
        {children}
      </motion.span>
    </span>
  )
}

export function TextReveal({ children, className = '', highlights = [], progress = 1 }) {
  const progressValue = useMotionValue(progress)
  const reducedMotion = useReducedMotion()

  if (typeof children !== 'string') {
    throw new Error('TextReveal: children must be a string')
  }

  const paragraphs = children.trim().split(/\n{2,}/)
  const wordCount = children.trim().split(/\s+/).length
  const highlightedWords = new Set(
    highlights.flatMap(({ startWord, endWord }) => (
      Array.from({ length: endWord - startWord + 1 }, (_, index) => startWord + index)
    )),
  )
  let wordIndex = 0

  useEffect(() => {
    if (reducedMotion) {
      progressValue.set(progress)
      return undefined
    }

    const animation = animate(progressValue, progress, {
      duration: 1.05,
      ease: 'linear',
    })
    return () => animation.stop()
  }, [progress, progressValue, reducedMotion])

  return (
    <div className={`text-reveal ${className}`.trim()} aria-label={children}>
      <span className="text-reveal-content" aria-hidden="true">
        {paragraphs.map((paragraph, paragraphIndex) => {
          const renderedWords = paragraph.split(/\s+/).map(word => {
            const start = wordIndex / wordCount
            wordIndex += 1
            const end = wordIndex / wordCount

            return (
              <TextRevealWord
                highlighted={highlightedWords.has(wordIndex)}
                key={`${wordIndex}-${word}`}
                progress={progressValue}
                range={[start, end]}
              >
                {word}
              </TextRevealWord>
            )
          })
          const tailWordCount = Math.min(4, renderedWords.length)

          return (
            <Fragment key={`${paragraphIndex}-${paragraph}`}>
              {paragraphIndex > 0 && <span className="text-reveal-paragraph-break" />}
              {renderedWords.slice(0, -tailWordCount)}
              <span className="text-reveal-tail">
                {renderedWords.slice(-tailWordCount)}
              </span>
            </Fragment>
          )
        })}
      </span>
    </div>
  )
}
