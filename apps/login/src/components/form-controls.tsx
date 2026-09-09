import type { ComponentProps } from 'react'
import './form-controls.css'

export function Input({ className = '', ...props }: ComponentProps<'input'>) {
  return <input {...props} className={`control-input ${className}`} />
}

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'white' | 'black'
  loading?: boolean
}

export function Button({
  variant = 'black',
  loading = false,
  disabled,
  type = 'button',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`control-button control-button--${variant} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading && <span className="control-spinner" aria-hidden="true" />}
      <span className="control-button-content">{children}</span>
    </button>
  )
}
