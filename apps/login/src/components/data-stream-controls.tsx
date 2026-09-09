import { useEffect, useState } from 'react'
import { Button } from './form-controls'
import { DEFAULT_STREAM_SETTINGS, STREAM_CONTROLS, type StreamSettings } from './data-stream-settings'
import './data-stream-controls.css'

export function DataStreamControls({ settings, onChange, chinese }: {
  settings: StreamSettings
  onChange: (settings: StreamSettings) => void
  chinese: boolean
}) {
  const [open, setOpen] = useState(false)
  useEffect(() => { setOpen(window.innerWidth >= 1100) }, [])
  return (
    <details className="stream-controls" open={open} onToggle={event => setOpen(event.currentTarget.open)}>
      <summary>{chinese ? '底部纹理' : 'Data flow'}</summary>
      <div className="stream-controls-body">
        <p>{chinese ? '实时预览' : 'Live preview'}</p>
        {STREAM_CONTROLS.map(control => (
          <div className="stream-control" key={control.key}>
            <label htmlFor={`stream-${control.key}`}>{chinese ? control.zh : control.en}</label>
            <output htmlFor={`stream-${control.key}`}>
              {Number(settings[control.key].toFixed(2))}{control.unit}
            </output>
            <input
              id={`stream-${control.key}`}
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={settings[control.key]}
              onChange={event => onChange({ ...settings, [control.key]: Number(event.currentTarget.value) })}
            />
          </div>
        ))}
        <div className="stream-control-actions">
          <Button variant="white" aria-pressed={settings.paused} onClick={() => onChange({ ...settings, paused: !settings.paused })}>
            {settings.paused ? (chinese ? '继续流动' : 'Resume') : (chinese ? '暂停' : 'Pause')}
          </Button>
          <Button variant="white" onClick={() => onChange({ ...DEFAULT_STREAM_SETTINGS })}>
            {chinese ? '重置' : 'Reset'}
          </Button>
        </div>
      </div>
    </details>
  )
}
