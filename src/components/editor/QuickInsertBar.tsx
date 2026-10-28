'use client'

import { useEffect, useRef, useState } from 'react'

type TextField = HTMLInputElement | HTMLTextAreaElement

const ITEMS = [
  { key: 'ideographic-space', char: '　', label: '␣ 공백', ariaLabel: '전각 공백 넣기' },
  ...['👏', '❤️', '🩷', '💜', '💚', '💛', '🧡', '💙', '🩵', '🤍', '🖤'].map(emoji => ({
    key: emoji,
    char: emoji,
    label: emoji,
    ariaLabel: `${emoji} 넣기`,
  })),
]

const HIDE_DELAY_MS = 150

// scope 안의 텍스트 입력칸(textarea, text/search input)만 대상으로 삼는다.
function getQualifyingField(target: EventTarget | null): TextField | null {
  if (target instanceof HTMLTextAreaElement) {
    return target.closest('[data-quick-insert-scope]') ? target : null
  }
  if (target instanceof HTMLInputElement) {
    const type = target.type
    if (type !== 'text' && type !== 'search' && type !== '') return null
    return target.closest('[data-quick-insert-scope]') ? target : null
  }
  return null
}

export default function QuickInsertBar() {
  const [visible, setVisible] = useState(false)
  const fieldRef = useRef<TextField | null>(null)

  useEffect(() => {
    let hideTimer: number | undefined

    const handleFocusIn = (event: FocusEvent) => {
      const field = getQualifyingField(event.target)
      if (!field) return
      window.clearTimeout(hideTimer)
      fieldRef.current = field
      setVisible(true)
    }

    // 다른 입력칸으로 옮겨가는 순간의 깜빡임을 막기 위해 잠깐 기다렸다가 숨긴다.
    const handleFocusOut = (event: FocusEvent) => {
      if (!getQualifyingField(event.target)) return
      window.clearTimeout(hideTimer)
      hideTimer = window.setTimeout(() => setVisible(false), HIDE_DELAY_MS)
    }

    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)
    return () => {
      window.clearTimeout(hideTimer)
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
    }
  }, [])

  const insert = (char: string) => {
    const el = fieldRef.current
    if (!el || !el.isConnected) return

    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? start
    const next = el.value.slice(0, start) + char + el.value.slice(end)
    // React가 추적하는 value 세터를 우회해 직접 넣고 input 이벤트로 state를 동기화한다.
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
    Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(el, next)
    el.dispatchEvent(new Event('input', { bubbles: true }))

    const caret = start + char.length
    requestAnimationFrame(() => {
      // 모바일에서 포커스를 잃었다면 다시 돌려준다.
      if (document.activeElement !== el) el.focus({ preventScroll: true })
      el.setSelectionRange(caret, caret)
    })
  }

  if (!visible) return null

  return (
    // sticky 헤더 바로 아래에 겹쳐 띄워, 나타날 때 본문이 밀리지 않게 한다.
    <div className="absolute inset-x-0 top-full flex items-center gap-1 overflow-x-auto border-b border-gray-200 bg-white/95 px-4 py-2 shadow-sm backdrop-blur" role="toolbar" aria-label="빠른 입력">
      {ITEMS.map(item => (
        <button
          key={item.key}
          type="button"
          aria-label={item.ariaLabel}
          onPointerDown={e => e.preventDefault()}
          onMouseDown={e => e.preventDefault()}
          onClick={() => insert(item.char)}
          className="h-8 min-w-8 shrink-0 rounded-lg border border-gray-200 bg-white px-2 text-base leading-none text-gray-700 hover:bg-gray-50 active:bg-gray-100"
        >
          {item.label === '␣ 공백' ? <span className="text-xs">{item.label}</span> : item.label}
        </button>
      ))}
      <span className="shrink-0 pl-1 text-[10px] text-gray-400">🩷🩵는 구형 기기에서 □로 보일 수 있어요</span>
    </div>
  )
}
