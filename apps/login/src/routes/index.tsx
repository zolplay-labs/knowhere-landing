import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { FluidCover } from '../components/fluid-cover'
import { DataStream } from '../components/data-stream'
import { LanguageMenu } from '../components/language-menu'
import { Button, Input } from '../components/form-controls'
import {
  IconArrowRight,
  IconBrandGithub,
  IconCircleCheck,
} from '@tabler/icons-react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [chinese, setChinese] = useState(false)
  const t = (en: string, zh: string) => (chinese ? zh : en)
  return (
    <div className="login-page" lang={chinese ? 'zh-CN' : 'en'}>
      <div className="login-background" aria-hidden="true">
        <FluidCover />
      </div>
      <DataStream />
      <header className="login-header">
        <a
          className="brand"
          href="https://knowhereto.ai/"
          aria-label="Knowhere home"
        >
          <img
            src="/assets/knowhere-logo.svg"
            width="132"
            height="52"
            alt="Knowhere"
          />
        </a>
        <LanguageMenu chinese={chinese} onChange={setChinese} />
      </header>
      <main className="login-panel">
        <div className="form-area">
          <div className="form-heading">
            <div className="eyebrow">
              {t('YOUR NEXT BUILD STARTS HERE', '从这里，开始下一次创造')}
            </div>
            <h1>{t('Welcome to Knowhere', '欢迎来到 Knowhere')}</h1>
          </div>
          <LoginForm chinese={chinese} />
        </div>
      </main>
      <footer className="login-footer">
        <span>© {new Date().getFullYear()} Knowhere</span>
      </footer>
    </div>
  )
}

function LoginForm({ chinese }: { chinese: boolean }) {
  const emailRef = useRef<HTMLInputElement>(null)
  const previewSendTimer = useRef<number | null>(null)
  const [delivery, setDelivery] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [feedback, setFeedback] = useState<'email-invalid' | null>(null)
  const emailInvalid = feedback === 'email-invalid'
  const sending = delivery === 'sending'
  const t = (en: string, zh: string) => (chinese ? zh : en)
  useEffect(() => {
    return () => {
      if (previewSendTimer.current !== null) window.clearTimeout(previewSendTimer.current)
    }
  }, [])
  return (
    <>
      <div className="social-buttons">
        <Button variant="white" disabled={sending}>
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
        </Button>
        <Button variant="white" disabled={sending}>
          <IconBrandGithub size={19} />
          {t('Continue with GitHub', '使用 GitHub 继续')}
        </Button>
      </div>
      <div className="divider">
        <span>{t('or continue with email', '或使用邮箱继续')}</span>
      </div>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          if (previewSendTimer.current !== null) return
          if (!emailRef.current?.validity.valid) {
            setDelivery('idle')
            setFeedback('email-invalid')
            emailRef.current?.focus()
            return
          }
          setFeedback(null)
          setDelivery('sending')
          // Preview only: replace this simulated request with the email service response.
          previewSendTimer.current = window.setTimeout(() => {
            previewSendTimer.current = null
            setDelivery('sent')
          }, 1400)
        }}
      >
        <label htmlFor="email">{t('Email address', '邮箱地址')}</label>
        <Input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          pattern={'[^\\s@]+@[^\\s@]+\\.[^\\s@]+'}
          spellCheck={false}
          readOnly={sending}
          onChange={(event) => {
            setDelivery('idle')
            if (!emailInvalid || event.currentTarget.validity.valid) {
              setFeedback(null)
            }
          }}
          aria-invalid={emailInvalid}
          aria-describedby={feedback ? 'email-feedback' : undefined}
        />
        {feedback && (
          <p className="email-feedback" id="email-feedback" role="alert">
            {t('Please enter a valid email address.', '请输入有效的邮箱地址。')}
          </p>
        )}
        <Button className="submit-button" type="submit" loading={sending}>
          {sending
            ? t('Sending…', '发送中…')
            : delivery === 'sent'
              ? t('Resend email', '重新发送邮件')
              : t('Sign in with Email', '使用邮箱登录')}
          <IconArrowRight size={17} />
        </Button>
        <div role="status" aria-live="polite" aria-atomic="true">
          {delivery === 'sent' && (
            <div className="email-delivery">
              <IconCircleCheck className="email-delivery-icon" size={20} aria-hidden="true" />
              <p className="email-delivery-title">
                {t('Magic link sent, please check your email', '登录链接已发送，请查收邮件')}
              </p>
            </div>
          )}
        </div>
      </form>
    </>
  )
}
