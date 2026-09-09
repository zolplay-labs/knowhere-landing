import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, Input } from '../components/form-controls'
import '../components/control-preview.css'

export const Route = createFileRoute('/components')({
  head: () => ({
    meta: [
      { title: '组件状态 — Knowhere' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: ComponentPreview,
})

function ComponentPreview() {
  const [clicks, setClicks] = useState(0)
  const [loading, setLoading] = useState(false)
  return (
    <main className="control-preview" lang="zh-CN">
      <header>
        <a href="/">← 返回登录页</a>
        <h1>表单组件与状态</h1>
        <p>与登录页共用组件和 token。标注的状态固定展示，交互区可实际操作。</p>
      </header>
      <section aria-labelledby="input-states">
        <h2 id="input-states">输入框</h2>
        <div className="control-preview-grid">
          {[
            ['empty', '默认 / 空值'],
            ['filled', '已填写'],
            ['hover', '悬停'],
            ['focus', '聚焦 / 单层绿边'],
            ['error', '错误'],
            ['readonly', '只读'],
            ['disabled', '禁用'],
          ].map(([state, label]) => (
            <div key={state}>
              <label htmlFor={`preview-${state}`}>{label}</label>
              <Input
                id={`preview-${state}`}
                defaultValue={state === 'empty' ? '' : state === 'error' ? 'invalid-email' : 'you@company.com'}
                placeholder="you@company.com"
                data-preview-state={state}
                readOnly={state === 'readonly'}
                disabled={state === 'disabled'}
                aria-invalid={state === 'error'}
                aria-describedby={state === 'error' ? 'preview-error-hint' : undefined}
              />
              {state === 'error' && (
                <p className="email-feedback" id="preview-error-hint">请输入有效的邮箱地址。</p>
              )}
            </div>
          ))}
        </div>
      </section>
      {(['white', 'black'] as const).map((variant) => (
        <section key={variant} aria-labelledby={`${variant}-states`}>
          <h2 id={`${variant}-states`}>{variant === 'white' ? '白底按钮' : '黑底按钮'}</h2>
          <div className="control-preview-grid">
            {[
              ['default', '默认'], ['hover', '悬停'], ['pressed', '按下'],
              ['focus', '键盘聚焦'], ['disabled', '禁用'], ['loading', '加载中'],
            ].map(([state, label]) => (
              <div key={state}>
                <p className="control-preview-label">{label}</p>
                <Button
                  variant={variant}
                  data-preview-state={state}
                  disabled={state === 'disabled'}
                  loading={state === 'loading'}
                  onClick={() => setClicks((value) => value + 1)}
                >
                  {state === 'loading' ? '处理中…' : '继续 / Continue'}
                </Button>
              </div>
            ))}
          </div>
        </section>
      ))}
      <section aria-labelledby="interactive-states">
        <h2 id="interactive-states">实际交互</h2>
        <p role="status">已响应 {clicks} 次点击。禁用或加载中的按钮不会增加计数。</p>
        <Button variant="white" onClick={() => setLoading(!loading)}>
          {loading ? '结束加载预览' : '开始加载预览'}
        </Button>
        <Button loading={loading} onClick={() => setClicks((value) => value + 1)}>
          {loading ? '处理中…' : '测试按钮'}
        </Button>
      </section>
    </main>
  )
}
