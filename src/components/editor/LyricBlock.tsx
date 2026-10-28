'use client'

import { useState } from 'react'
import { LyricBlock, LyricLine, Language } from '@/types'
import BlockWrapper from './BlockWrapper'
import { PasteMode, createLyricLine, parseJapaneseKoreanPaste, splitPastedLines } from '@/lib/lyricLines'

interface Props {
  block: LyricBlock
  language: Language
  pasteMode: PasteMode
  onChange: (block: LyricBlock) => void
  onSplit: (lineIdx: number) => void
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

function lyricFields(line: LyricLine): Pick<LyricLine, 'jp' | 'hira' | 'ko'> {
  return {
    jp: line.jp,
    hira: line.hira,
    ko: line.ko,
  }
}

export default function LyricBlockComp({ block, language, pasteMode, onChange, onSplit, ...wrapperProps }: Props) {
  // '+믹스'로 방금 연 줄에만 자동 포커스 (저장된 빈 믹스칸이 로드 시 포커스를 가져가지 않도록)
  const [openedMixId, setOpenedMixId] = useState<string | null>(null)

  const updateLine = (id: string, field: 'jp' | 'hira' | 'ko', value: string) => {
    onChange({ ...block, lines: block.lines.map(l => l.id === id ? { ...l, [field]: value } : l) })
  }

  // 믹스: undefined면 입력칸 닫기, ''면 빈 입력칸 열기
  const setLineMix = (id: string, value: string | undefined) => {
    onChange({ ...block, lines: block.lines.map(l => l.id === id ? { ...l, mix: value } : l) })
  }

  const addLine = () => {
    onChange({ ...block, lines: [...block.lines, { id: crypto.randomUUID(), jp: '', hira: '', ko: '' }] })
  }

  const removeLine = (id: string) => {
    if (block.lines.length <= 1) return
    onChange({ ...block, lines: block.lines.filter(l => l.id !== id) })
  }

  const moveLine = (id: string, dir: 'up' | 'down') => {
    const idx = block.lines.findIndex(l => l.id === id)
    const next = [...block.lines]
    const swap = dir === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    onChange({ ...block, lines: next })
  }

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    lineId: string,
    field: 'jp' | 'ko',
    target: 'main' | 'reading' | 'mix',
  ) => {
    const pasted = splitPastedLines(e.clipboardData.getData('text'))
    if (pasted.length <= 1) return // 줄바꿈 없으면 기본 붙여넣기

    e.preventDefault()
    const currentIdx = block.lines.findIndex(l => l.id === lineId)
    const newLines = [...block.lines]

    // 발음칸/믹스칸: 현재 줄부터 아래로 순서대로 해당 칸만 채운다. (나머지는 건드리지 않음)
    if (target === 'reading' || target === 'mix') {
      const fillField = target === 'reading' ? 'ko' : 'mix'
      pasted.forEach((text, k) => {
        const idx = currentIdx + k
        // 믹스칸의 빈 줄은 믹스가 없던 줄에 빈 입력칸을 열지 않고 건너뛴다
        const skipEmptyMix = fillField === 'mix' && text === ''
        if (idx < newLines.length) {
          if (skipEmptyMix && newLines[idx].mix === undefined) return
          newLines[idx] = { ...newLines[idx], [fillField]: text }
        } else {
          newLines.push(createLyricLine(skipEmptyMix ? {} : { [fillField]: text }))
        }
      })
      onChange({ ...block, lines: newLines })
      return
    }

    const parsedLines = parseJapaneseKoreanPaste(pasted, field, pasteMode)

    newLines[currentIdx] = { ...newLines[currentIdx], ...lyricFields(parsedLines[0]) }

    newLines.splice(currentIdx + 1, 0, ...parsedLines.slice(1))
    onChange({ ...block, lines: newLines })
  }

  return (
    <BlockWrapper type="lyric" {...wrapperProps}>
      <div className="flex flex-col gap-1">
        {block.lines.map((line, idx) => (
          <div key={line.id}>
            <div className="flex gap-2 items-start">
              <div className="flex-1 flex flex-col gap-1">
                <input
                  value={language === 'jp' ? line.jp : line.ko}
                  onChange={e => updateLine(line.id, language === 'jp' ? 'jp' : 'ko', e.target.value)}
                  onPaste={e => handlePaste(e, line.id, language === 'jp' ? 'jp' : 'ko', 'main')}
                  placeholder={language === 'jp' ? '일본어 가사 입력...' : '한국어 가사 입력...'}
                  className="flex-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-gray-900 text-sm outline-none focus:border-gray-400 placeholder:text-gray-300"
                />
                {language === 'jp' && (
                  <input
                    value={line.ko}
                    onChange={e => updateLine(line.id, 'ko', e.target.value)}
                    onPaste={e => handlePaste(e, line.id, 'ko', 'reading')}
                    placeholder="한국어 발음 (선택)"
                    className="bg-gray-50 border border-gray-100 rounded px-3 py-1.5 text-blue-600 text-xs outline-none focus:border-gray-300 placeholder:text-gray-300"
                  />
                )}
                {line.mix !== undefined && (
                  <div className="flex items-center gap-1">
                    <input
                      value={line.mix}
                      onChange={e => setLineMix(line.id, e.target.value)}
                      onPaste={e => handlePaste(e, line.id, 'ko', 'mix')}
                      placeholder="믹스/콜 (선택)"
                      autoFocus={openedMixId === line.id}
                      className="flex-1 min-w-0 bg-red-50/50 border border-red-100 rounded px-3 py-1.5 text-red-600 font-bold text-xs outline-none focus:border-red-300 placeholder:text-red-200"
                    />
                    <button
                      type="button"
                      onClick={() => setLineMix(line.id, undefined)}
                      aria-label="믹스 삭제"
                      className="text-xs text-red-300 hover:text-red-500 shrink-0">✕</button>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 mt-1 shrink-0">
                <button
                  onClick={() => moveLine(line.id, 'up')}
                  disabled={idx === 0}
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-30 text-xs leading-none">↑</button>
                <button
                  onClick={() => moveLine(line.id, 'down')}
                  disabled={idx === block.lines.length - 1}
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-30 text-xs leading-none">↓</button>
              </div>
              {(block.lines.length > 1 || line.mix === undefined) && (
                <div className="flex flex-col items-center gap-1 mt-2 shrink-0">
                  {block.lines.length > 1 && (
                    <button onClick={() => removeLine(line.id)}
                      className="text-gray-500 hover:text-red-500 text-sm leading-none transition-colors">✕</button>
                  )}
                  {line.mix === undefined && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenedMixId(line.id)
                        setLineMix(line.id, '')
                      }}
                      aria-label="이 줄에 믹스 추가"
                      className="text-[10px] leading-none px-1 py-0.5 rounded border border-red-200 text-red-400 hover:text-red-600 hover:border-red-300">+믹스</button>
                  )}
                </div>
              )}
            </div>

            {idx < block.lines.length - 1 && (
              <div className="relative h-6 flex items-center justify-center my-1">
                <div className="absolute inset-x-0 top-1/2 border-t border-gray-300" />
                <button
                  onClick={() => onSplit(idx + 1)}
                  className="relative bg-white border border-gray-400 rounded-full text-xs px-2.5 py-0.5 text-gray-600 hover:text-red-500 hover:border-red-300 transition-colors shadow-sm z-10">
                  ✂️ 분리
                </button>
              </div>
            )}
          </div>
        ))}
        <button onClick={addLine}
          className="self-start text-xs px-3 py-1 rounded border border-dashed border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors">
          + 줄 추가
        </button>
      </div>
    </BlockWrapper>
  )
}
