'use client'

import { PerformanceBlock, PerformanceType } from '@/types'
import BlockWrapper from './BlockWrapper'

interface Props {
  block: PerformanceBlock
  onChange: (block: PerformanceBlock) => void
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  onInsertLyric: () => void
  onInsertMix: () => void
  onInsertInterlude: () => void
  onInsertPerformance: () => void
  referenceUrl?: string
  onReferenceUrlChange: (url: string) => void
}

const PERFORMANCE_TYPES: PerformanceType[] = ['오타게', '후리코피', '모슁', '원진', '투스텝', 'DnB', '기타']

const TYPE_EMOJI: Record<PerformanceType, string> = {
  '오타게': '🤸',
  '후리코피': '💃',
  '모슁': '🌊',
  '원진': '⭕',
  '투스텝': '👣',
  'DnB': '🥁',
  '기타': '✏️',
}

export default function PerformanceBlockComp({ block, onChange, ...wrapperProps }: Props) {
  return (
    <BlockWrapper type="performance" {...wrapperProps}>
      <div className="flex flex-col gap-3">

        {/* 퍼포먼스 타입 선택 */}
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-xs font-semibold text-gray-400 shrink-0">종류:</span>
          {PERFORMANCE_TYPES.map(t => (
            <button key={t} onClick={() => onChange({ ...block, performanceType: t })}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                block.performanceType === t
                  ? 'bg-purple-500 border-purple-500 text-white'
                  : 'border-purple-200 text-purple-400 hover:bg-purple-50'
              }`}>
              {TYPE_EMOJI[t]} {t}
            </button>
          ))}
        </div>

        {/* 기타 직접 입력 */}
        {block.performanceType === '기타' && (
          <input
            value={block.customLabel ?? ''}
            onChange={e => onChange({ ...block, customLabel: e.target.value })}
            placeholder="직접 입력 (예: 사이다, 점프)"
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm outline-none focus:border-purple-300 placeholder:text-gray-300 shadow-sm"
          />
        )}

        {/* 메모 */}
        <input
          value={block.memo ?? ''}
          onChange={e => onChange({ ...block, memo: e.target.value })}
          placeholder="메모 (선택 · 예: 2번 반복, 양손 펜라이트)"
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-500 text-sm outline-none focus:border-purple-300 placeholder:text-gray-300 shadow-sm"
        />

      </div>
    </BlockWrapper>
  )
}