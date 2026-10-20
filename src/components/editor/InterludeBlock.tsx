'use client'

import { InterludeBlock } from '@/types'
import BlockWrapper from './BlockWrapper'
import MixContentEditor from './MixContentEditor'

interface Props {
  block: InterludeBlock
  onChange: (block: InterludeBlock) => void
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  onDuplicate: () => void
  onMergeWithPrev?: () => void
  onInsertLyric: () => void
  onInsertMix: () => void
  onInsertInterlude: () => void
  onInsertPerformance: () => void
  referenceUrl?: string
  onReferenceUrlChange: (url: string) => void
  note?: string
  onNoteChange: (note: string) => void
}

const LABELS = ['전주', '간주', '간주 1', '간주 2', '아웃트로', '엔딩']

export default function InterludeBlockComp({ block, onChange, ...wrapperProps }: Props) {
  return (
    <BlockWrapper type="interlude" {...wrapperProps}>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-xs font-semibold text-gray-400 shrink-0">구간:</span>
          {LABELS.map(label => (
            <button
              type="button"
              key={label}
              onClick={() => onChange({ ...block, label })}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                block.label === label
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-blue-200 text-blue-400 hover:bg-blue-50'
              }`}
            >
              {label}
            </button>
          ))}
          <input
            value={LABELS.includes(block.label) ? '' : block.label}
            onChange={event => onChange({ ...block, label: event.target.value })}
            placeholder="직접 입력"
            className="text-xs px-2.5 py-1 rounded-full border border-blue-200 text-blue-400 outline-none focus:border-blue-400 placeholder:text-blue-200 w-20 bg-white"
          />
        </div>

        <div className="border-t border-blue-100" />

        <MixContentEditor
          value={block}
          onChange={patch => onChange({ ...block, ...patch })}
          accent="blue"
        />
      </div>
    </BlockWrapper>
  )
}
