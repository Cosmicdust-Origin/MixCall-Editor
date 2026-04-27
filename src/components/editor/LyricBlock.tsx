'use client'

import { LyricBlock, LyricLine, Language } from '@/types'
import BlockWrapper from './BlockWrapper'

interface Props {
  block: LyricBlock
  language: Language
  onChange: (block: LyricBlock) => void
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  onInsertLyric: () => void
  onInsertMix: () => void
  onInsertInterlude: () => void
}

export default function LyricBlockComp({ block, language, onChange, ...wrapperProps }: Props) {

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

  return (
    <BlockWrapper type="lyric" {...wrapperProps}>
      <div className="flex flex-col gap-3">
        {block.lines.map((line, idx) => (
          <div key={line.id} className={`flex gap-2 items-start ${idx < block.lines.length - 1 ? 'pb-3 border-b border-gray-100' : ''}`}>
            <div className="flex-1 flex flex-col gap-1">
              <input
                value={language === 'jp' ? line.jp : line.ko}
                onChange={e => updateLine(line.id, language === 'jp' ? 'jp' : 'ko', e.target.value)}
                placeholder={language === 'jp' ? '일본어 가사 입력...' : '한국어 가사 입력...'}
                className="flex-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-gray-900 text-sm outline-none focus:border-gray-400 placeholder:text-gray-300"
              />
              {language === 'jp' && (
                <>
                  <input
                    value={line.hira}
                    onChange={e => updateLine(line.id, 'hira', e.target.value)}
                    placeholder="히라가나 독음 (선택)"
                    className="bg-gray-50 border border-gray-100 rounded px-3 py-1.5 text-gray-600 text-xs outline-none focus:border-gray-300 placeholder:text-gray-300"
                  />
                  <input
                    value={line.ko}
                    onChange={e => updateLine(line.id, 'ko', e.target.value)}
                    placeholder="한국어 발음 (선택)"
                    className="bg-gray-50 border border-gray-100 rounded px-3 py-1.5 text-blue-600 text-xs outline-none focus:border-gray-300 placeholder:text-gray-300"
                  />
                </>
              )}
            </div>
            {block.lines.length > 1 && (
              <button onClick={() => removeLine(line.id)}
                className="mt-2 text-gray-300 hover:text-red-400 text-sm transition-colors">✕</button>
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