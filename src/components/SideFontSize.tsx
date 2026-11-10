'use client'

import { ReactNode, useSyncExternalStore } from 'react'

const SIDE_FONT_KEY = 'mix-call-editor:side-font'
const SIDE_FONT_EVENT = 'mixcall:side-font'
const DEFAULT_LEVEL = 3

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener(SIDE_FONT_EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(SIDE_FONT_EVENT, callback)
  }
}

function getSnapshot(): number {
  try {
    const level = Number(localStorage.getItem(SIDE_FONT_KEY))
    return Number.isInteger(level) && level >= 1 && level <= 5 ? level : DEFAULT_LEVEL
  } catch {
    return DEFAULT_LEVEL
  }
}

function getServerSnapshot(): number {
  return DEFAULT_LEVEL
}

// 나란히 보기 글자 크기 조절 (기기별 설정)
export default function SideFontSize({ children }: { children: ReactNode }) {
  const level = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // 빠르게 연속으로 눌러도 누적되도록 렌더 시점 값이 아닌 저장된 현재 값 기준으로 계산
  const change = (delta: number) => {
    const next = Math.min(5, Math.max(1, getSnapshot() + delta))
    try {
      localStorage.setItem(SIDE_FONT_KEY, String(next))
    } catch {
      // 저장 실패는 무시
    }
    window.dispatchEvent(new Event(SIDE_FONT_EVENT))
  }

  const buttonClass = 'h-7 px-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30'

  return (
    <div>
      <div className="flex items-center justify-end gap-1 mb-2 text-xs text-gray-400">
        글자 크기
        <button type="button" aria-label="글자 작게" disabled={level <= 1} onClick={() => change(-1)} className={buttonClass}>가-</button>
        <span>{level}/5</span>
        <button type="button" aria-label="글자 크게" disabled={level >= 5} onClick={() => change(1)} className={buttonClass}>가+</button>
      </div>
      <div data-side-size={level}>{children}</div>
    </div>
  )
}
