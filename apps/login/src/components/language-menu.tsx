import { useEffect, useRef, useState } from 'react'

export function LanguageMenu({
  chinese,
  onChange,
}: {
  chinese: boolean
  onChange: (chinese: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const optionsRef = useRef<Array<HTMLButtonElement | null>>([])
  const initialFocus = useRef(0)

  useEffect(() => {
    if (!open) return
    optionsRef.current[initialFocus.current]?.focus()
    function closeOutside(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [open])

  function close() {
    setOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <div
      className="login-language-menu"
      ref={menuRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault()
          close()
        }
      }}
    >
      <button
        className="language-button"
        ref={toggleRef}
        type="button"
        aria-label={chinese ? '选择语言' : 'Choose language'}
        title={chinese ? '选择语言' : 'Choose language'}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="login-language-options"
        onClick={() => {
          initialFocus.current = chinese ? 1 : 0
          setOpen(!open)
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            initialFocus.current = event.key === 'ArrowDown' ? 0 : 1
            setOpen(true)
          }
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM9.71002 19.6674C8.74743 17.6259 8.15732 15.3742 8.02731 13H4.06189C4.458 16.1765 6.71639 18.7747 9.71002 19.6674ZM10.0307 13C10.1811 15.4388 10.8778 17.7297 12 19.752C13.1222 17.7297 13.8189 15.4388 13.9693 13H10.0307ZM19.9381 13H15.9727C15.8427 15.3742 15.2526 17.6259 14.29 19.6674C17.2836 18.7747 19.542 16.1765 19.9381 13ZM4.06189 11H8.02731C8.15732 8.62577 8.74743 6.37407 9.71002 4.33256C6.71639 5.22533 4.458 7.8235 4.06189 11ZM10.0307 11H13.9693C13.8189 8.56122 13.1222 6.27025 12 4.24799C10.8778 6.27025 10.1811 8.56122 10.0307 11ZM14.29 4.33256C15.2526 6.37407 15.8427 8.62577 15.9727 11H19.9381C19.542 7.8235 17.2836 5.22533 14.29 4.33256Z" />
        </svg>
      </button>
      <div
        className="login-language-dropdown"
        id="login-language-options"
        role="menu"
        aria-label={chinese ? '语言' : 'Language'}
        hidden={!open}
      >
        {['English', '中文'].map((label, index) => (
          <button
            key={label}
            ref={(element) => { optionsRef.current[index] = element }}
            type="button"
            role="menuitemradio"
            aria-checked={chinese === (index === 1)}
            tabIndex={-1}
            onClick={() => {
              onChange(index === 1)
              close()
            }}
            onKeyDown={(event) => {
              const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1
                : event.key === 'ArrowDown' || event.key === 'ArrowUp' ? 1 - index : null
              if (next !== null) {
                event.preventDefault()
                optionsRef.current[next]?.focus()
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
