import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconBrandGithub,
  IconCheck,
  IconLanguage,
  IconLock,
} from '@tabler/icons-react'

export const Route = createFileRoute('/')({ component: App })

// An original catenoid: evenly sampled meridians and latitude rings.
function ContextField() {
  function point(u: number, v: number) {
    const radius = 61 * Math.cosh(v)
    const x = radius * Math.cos(u)
    const z = radius * Math.sin(u)
    const y = v * 105
    return `${(300 + x * 0.91 + y * 0.29).toFixed(2)},${(244 + y * 0.9 - z * 0.38 - x * 0.19).toFixed(2)}`
  }
  const rings = Array.from({ length: 29 }, (_, i) => {
    const v = -1.63 + (i * 3.26) / 28
    return Array.from({ length: 97 }, (_, j) =>
      point((j * Math.PI) / 48, v),
    ).join(' ')
  })
  const meridians = Array.from({ length: 48 }, (_, i) =>
    Array.from({ length: 65 }, (_, j) =>
      point((i * Math.PI) / 24, -1.63 + (j * 3.26) / 64),
    ).join(' '),
  )
  return (
    <svg
      className="context-field"
      viewBox="0 0 600 490"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M300 12V478M35 244H565"
        stroke="currentColor"
        strokeOpacity=".16"
        strokeDasharray="3 6"
      />
      <g stroke="currentColor" strokeWidth=".65" opacity=".53">
        {rings.map((points) => (
          <polyline key={points} points={points} />
        ))}
        {meridians.map((points) => (
          <polyline key={points} points={points} />
        ))}
      </g>
      <path d="M291 244h18M300 235v18" stroke="currentColor" />
      <rect
        x="292"
        y="66"
        width="7"
        height="7"
        fill="#ff634a"
        transform="rotate(-12 295 69)"
      />
      <rect
        x="371"
        y="369"
        width="7"
        height="7"
        fill="#ff634a"
        transform="rotate(-12 374 372)"
      />
    </svg>
  )
}

function App() {
  const [chinese, setChinese] = useState(false)
  const t = (en: string, zh: string) => (chinese ? zh : en)
  return (
    <div className="login-page" lang={chinese ? 'zh-CN' : 'en'}>
      <aside
        className="brand-panel"
        aria-label={t('About Knowhere', '关于 Knowhere')}
      >
        <a
          className="brand"
          href="https://knowhereto.ai/"
          aria-label="Knowhere home"
        >
          <img
            src="/assets/knowhere-logo.svg"
            width="152"
            height="60"
            alt="Knowhere"
          />
        </a>
        <div className="brand-story">
          <div className="eyebrow">
            <span className="status-dot" />
            {t('CONTEXT, CONNECTED.', '让上下文，彼此连接。')}
          </div>
          <h2>
            {t('A little structure.', '让信息有序。')}
            <br />
            {t('A world of context.', '让上下文无限。')}
          </h2>
          <p>
            {t('Turn complex documents into context', '将复杂文档转化为')}
            <br />
            {t('your agents can use.', 'AI Agent 真正可用的上下文。')}
          </p>
        </div>
        <div className="field-frame">
          <span className="corner top-left" />
          <span className="corner top-right" />
          <ContextField />
          <span className="corner bottom-left" />
          <span className="corner bottom-right" />
          <div className="field-caption">
            <span>FIG. 01 — THE CONTEXT FIELD</span>
            <span>∞</span>
          </div>
        </div>
        <div className="brand-bottom">
          <span>
            {t('From information to understanding.', '从信息，到理解。')}
          </span>
          <span className="tiny-mark">↗</span>
        </div>
      </aside>

      <main className="login-panel">
        <header className="login-nav">
          <a href="https://knowhereto.ai/">
            <IconArrowLeft size={15} />
            {t('Back to website', '返回官网')}
          </a>
          <button
            className="language-button"
            onClick={() => setChinese(!chinese)}
            aria-label={t('Switch to Chinese', 'Switch to English')}
          >
            <IconLanguage size={17} />
            <span>{t('中文', 'EN')}</span>
          </button>
        </header>
        <div className="form-area">
          <div className="form-heading">
            <div className="eyebrow">
              {t('YOUR NEXT BUILD STARTS HERE', '从这里，开始下一次创造')}
            </div>
            <h1>{t('Welcome to Knowhere', '欢迎来到 Knowhere')}</h1>
            <p>
              {t(
                'Good context. Great things ahead.',
                '好的上下文，让创造更进一步。',
              )}
            </p>
          </div>
          <LoginForm chinese={chinese} />
          <div className="trial-note">
            <span className="trial-icon">
              <IconCheck size={14} stroke={2} />
            </span>
            <span>
              {t(
                'New here? Your free workspace is one sign-in away.',
                '首次使用？登录即可开启免费工作空间。',
              )}
            </span>
          </div>
        </div>
        <footer className="login-footer">
          <span>© {new Date().getFullYear()} Knowhere</span>
          <a
            href="https://docs.knowhereto.ai/"
            target="_blank"
            rel="noreferrer"
          >
            {t('Documentation', '使用文档')}
            <IconArrowUpRight size={14} />
          </a>
        </footer>
      </main>
    </div>
  )
}

function LoginForm({ chinese }: { chinese: boolean }) {
  const [showNotice, setShowNotice] = useState(false)
  const t = (en: string, zh: string) => (chinese ? zh : en)
  function unavailable() {
    setShowNotice(true)
  }
  return (
    <>
      <div className="social-buttons">
        <button className="social-button" onClick={unavailable}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.01v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.35Z"
            />
            <path
              fill="#34A853"
              d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.24-2.51c-.9.6-2.05.97-3.38.97-2.6 0-4.81-1.76-5.6-4.12H3.05v2.59A10 10 0 0 0 12 22Z"
            />
            <path
              fill="#FBBC05"
              d="M6.4 13.92a6 6 0 0 1 0-3.84V7.49H3.05a10 10 0 0 0 0 9.02l3.35-2.59Z"
            />
            <path
              fill="#EA4335"
              d="M12 5.96c1.47 0 2.79.51 3.82 1.51l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.95 5.49l3.35 2.59C7.19 7.72 9.4 5.96 12 5.96Z"
            />
          </svg>
          {t('Continue with Google', '使用 Google 继续')}
        </button>
        <button className="social-button" onClick={unavailable}>
          <IconBrandGithub size={19} />
          {t('Continue with GitHub', '使用 GitHub 继续')}
        </button>
      </div>
      <div className="divider">
        <span>{t('or continue with email', '或使用邮箱继续')}</span>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          unavailable()
        }}
      >
        <label htmlFor="email">{t('Email address', '邮箱地址')}</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          spellCheck={false}
          onChange={() => setShowNotice(false)}
          aria-describedby="email-hint"
        />
        <button className="submit-button" type="submit">
          {t('Continue with email', '使用邮箱继续')}
          <IconArrowRight size={17} />
        </button>
        <p className="email-hint" id="email-hint">
          <IconLock size={13} />
          {t(
            'A secure sign-in link. No password to remember.',
            '安全的邮箱登录链接，无需记住密码。',
          )}
        </p>
      </form>
      {showNotice && (
        <p className="auth-notice" role="status">
          {t(
            'This is a preview. Authentication is not connected yet; no sign-in link has been sent.',
            '当前为界面预览，尚未接入认证服务，未发送登录链接。',
          )}
        </p>
      )}
    </>
  )
}
