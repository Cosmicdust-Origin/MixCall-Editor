'use client'

import { LyricBlock, LyricLine, Language } from '@/types'
import BlockWrapper from './BlockWrapper'

interface Props {
  block: LyricBlock
  language: Language
  onChange: (block: LyricBlock) => void
  onSplit: (lineIdx: number) => void
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  onInsertLyric: () => void
  onInsertMix: () => void
  onInsertInterlude: () => void
}

export default function LyricBlockComp({ block, language, onChange, onSplit, ...wrapperProps }: Props) {

  const updateLine = (id: string, field: keyof LyricLine, value: string) => {
    onChange({ ...block, lines: block.lines.map(l => l.id === id ? { ...l, [field]: value } : l) })
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

  return (
    <BlockWrapper type="lyric" {...wrapperProps}>
      <div className="flex flex-col gap-3">
        {block.lines.map((line, idx) => (
          <div key={line.id}>
            <div className="flex gap-2 items-start">
              <div className="flex-1 flex flex-col gap-1">
                <input
                  value={language === 'jp' ? line.jp : line.ko}
                  onChange={e => updateLine(line.id, language === 'jp' ? 'jp' : 'ko', e.target.value)}
                  placeholder={language === 'jp' ? '일본어 가사 입력...' : '한국어 가사 입력...'}
                  className="flex-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-gray-900 text-sm outline-none focus:border-gray-400 placeholder:text-gray-300"
                />
                {language === 'jp' && (
                  <input
                    value={line.ko}
                    onChange={e => updateLine(line.id, 'ko', e.target.value)}
                    placeholder="한국어 발음 (선택)"
                    className="bg-gray-50 border border-gray-100 rounded px-3 py-1.5 text-blue-600 text-xs outline-none focus:border-gray-300 placeholder:text-gray-300"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1 mt-1 shrink-0">
                <button
                  onClick={() => moveLine(line.id, 'up')}
                  disabled={idx === 0}
                  className="text-gray-300 hover:text-gray-500 disabled:opacity-20 text-xs leading-none">↑</button>
                <button
                  onClick={() => moveLine(line.id, 'down')}
                  disabled={idx === block.lines.length - 1}
                  className="text-gray-300 hover:text-gray-500 disabled:opacity-20 text-xs leading-none">↓</button>
              </div>
              {block.lines.length > 1 && (
                <button onClick={() => removeLine(line.id)}
                  className="mt-2 text-gray-300 hover:text-red-400 text-sm transition-colors shrink-0">✕</button>
              )}
            </div>

            {/* 줄 사이 분리 버튼 */}
            {idx < block.lines.length - 1 && (
              <div className="relative h-6 flex items-center justify-center my-1">
                <div className="absolute inset-x-0 top-1/2 border-t border-gray-100" />
                <button
                  onClick={() => onSplit(idx + 1)}
                  className="relative bg-white border border-gray-200 rounded-full text-xs px-2.5 py-0.5 text-gray-300 hover:text-red-400 hover:border-red-200 transition-colors shadow-sm z-10">
                  ✂️ 여기서 분리
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