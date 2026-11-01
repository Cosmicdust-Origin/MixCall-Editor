'use client'

import { useState } from 'react'
import { InterludeBlock } from '@/types'
import {
  ALL_SECTION_LABELS,
  QUICK_SECTION_LABELS,
  SECTION_CHIP_CLASS,
  SECTION_GROUPS,
  getSectionCategory,
} from '@/lib/sectionLabels'
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

export default function InterludeBlockComp({ block, onChange, ...wrapperProps }: Props) {
  const [showAll, setShowAll] = useState(false)
  const [mixOpen, setMixOpen] = useState(false)

  // 더보기에만 있는 템플릿 라벨이 선택돼 있으면 첫 줄에 그 칩을 함께 보여준다 (펼침은 사용자 토글만 따름)
  const quickLabels = ALL_SECTION_LABELS.includes(block.label) && !QUICK_SECTION_LABELS.includes(block.label)
    ? [...QUICK_SECTION_LABELS, block.label]
    : QUICK_SECTION_LABELS
  const expanded = showAll
  // 내용이 있으면 항상 보이게 파생 (되돌리기로 복원돼도 숨지 않도록)
  const hasMix = Boolean(block.text?.trim() || block.alternatives?.length)

  const renderChip = (label: string) => {
    const chip = SECTION_CHIP_CLASS[getSectionCategory(label)]
    return (
      <button
        type="button"
        key={label}
        onClick={() => onChange({ ...block, label })}
        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
          block.label === label ? chip.active : chip.idle
        }`}
      >
        {label}
      </button>
    )
  }

  return (
    <BlockWrapper type="interlude" {...wrapperProps}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-xs font-semibold text-gray-400 shrink-0">구간:</span>
            {quickLabels.map(renderChip)}
            <button
              type="button"
              onClick={() => setShowAll(value => !value)}
              className="text-xs text-gray-400 hover:text-gray-600 px-1"
            >
              {expanded ? '접기 ▴' : '더보기 ▾'}
            </button>
            <input
              value={ALL_SECTION_LABELS.includes(block.label) ? '' : block.label}
              onChange={event => onChange({ ...block, label: event.target.value })}
              placeholder="직접 입력"
              className="text-xs px-2.5 py-1 rounded-full border border-blue-200 text-blue-400 outline-none focus:border-blue-400 placeholder:text-blue-200 w-20 bg-white"
            />
          </div>
          {expanded && (
            <div className="flex flex-col gap-1.5">
              {SECTION_GROUPS.map(group => (
                <div key={group.name} className="flex items-start gap-2">
                  <span className="text-[10px] text-gray-400 w-8 shrink-0 pt-1.5">{group.name}</span>
                  <div className="flex flex-wrap gap-1.5">{group.labels.map(renderChip)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {hasMix || mixOpen ? (
          <>
            <div className="border-t border-blue-100" />
            <div className="flex justify-end gap-3 -mb-1">
              {hasMix ? (
                <button
                  type="button"
                  onClick={() => {
                    onChange({ ...block, text: '', alternatives: undefined, mixPresetId: undefined })
                    setMixOpen(false)
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  믹스 지우기
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMixOpen(false)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  접기
                </button>
              )}
            </div>
            <MixContentEditor
              value={block}
              onChange={patch => onChange({ ...block, ...patch })}
              accent="blue"
            />
          </>
        ) : (
          <button
            type="button"
            onClick={() => setMixOpen(true)}
            className="text-xs px-2.5 py-1 rounded border border-dashed border-blue-200 text-blue-400 hover:text-blue-600 hover:border-blue-300 self-start"
          >
            + 믹스
          </button>
        )}
      </div>
    </BlockWrapper>
  )
}
