'use client'

import { useState } from 'react'
import { formatSignedTime, parseSignedTimeInput } from '@/lib/sectionTime'

interface Props {
  mode: 'replaced' | 'manual'
  suggested: number | null
  count: number
  fromLabel: number
  onApply: (delta: number) => void
  onClose: () => void
}

export default function SectionTimeShiftDialog({ mode, suggested, count, fromLabel, onApply, onClose }: Props) {
  const [value, setValue] = useState(suggested !== null ? formatSignedTime(suggested) : '')
  const delta = parseSignedTimeInput(value)
  const invalid = value.trim() !== '' && delta === null
  const canApply = delta !== null && delta !== 0

  return (
    <div className="fixed inset-0 z-[95] bg-black/40 px-4 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="time-shift-dialog-title">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h2 id="time-shift-dialog-title" className="font-bold text-gray-900">
          {mode === 'replaced' ? '참고영상이 바뀌었어요' : '구간 시각 일괄 이동'}
        </h2>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          {mode === 'replaced' ? '새 영상에 맞춰 ' : ''}시각이 있는 구간 {count}개를 같은 간격만큼 옮깁니다.
        </p>
        <label className="block mt-4">
          <span className="block text-xs font-medium text-gray-500 mb-1">이동할 시간</span>
          <input
            type="text"
            inputMode="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="예: +2:05 또는 -0:30"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </label>
        {invalid && <p className="text-xs text-red-500 mt-1">형식: +m:ss 또는 -m:ss</p>}
        <div className="flex flex-col gap-1 mt-3">
          {mode === 'replaced' && suggested === null && (
            <p className="text-xs text-gray-400">참고영상 링크에 노래 시작 시각(예: ?t=125)을 넣어두면 자동으로 계산돼요.</p>
          )}
          {fromLabel > 0 && (
            <p className="text-xs text-gray-400">라벨 글자에 적힌 시각(예: &quot;간주2 (2:48~)&quot;)은 바뀌지 않아요. 옮긴 시각은 시간 칸에 저장됩니다.</p>
          )}
          <p className="text-xs text-gray-400">블록에 따로 YouTube 링크가 있는 구간은 옮기지 않아요.</p>
        </div>
        <div className="flex gap-2 justify-end mt-5">
          <button
            type="button"
            onClick={onClose}
            className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            그대로 두기
          </button>
          <button
            type="button"
            disabled={!canApply}
            onClick={() => { if (delta !== null) onApply(delta) }}
            className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-900"
          >
            옮기기
          </button>
        </div>
      </div>
    </div>
  )
}
