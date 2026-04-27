'use client'

import { useState, useRef } from 'react'
import { InterludeBlock, MixPreset } from '@/types'
import { MIX_DB, getSuggestions, getNextTokens } from '@/lib/mixDb'
import BlockWrapper from './BlockWrapper'

interface Props {
  block: InterludeBlock
  onChange: (block: InterludeBlock) => void
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  onInsertLyric: () => void
  onInsertMix: () => void
  onInsertInterlude: () => void
}

const LABELS = ['전주', '간주', '간주 1', '간주 2', '아웃트로', '엔딩']

export default function InterludeBlockComp({ block, onChange, ...wrapperProps }: Props) {
  const [nameQuery, setNameQuery] = useState('')
  const [nameSuggestions, setNameSuggestions] = useState<MixPreset[]>([])
  const [showNameSug, setShowNameSug] = useState(false)
  const [wordInput, setWordInput] = useState('')
  const [currentTokens, setCurrentTokens] = useState<string[]>([])
  const [nextTokens, setNextTokens] = useState<string[]>([])
  const wordInputRef = useRef<HTMLInputElement>(null)

  const handleNameQuery = (val: string) => {
    setNameQuery(val)
    if (!val.trim()) { setNameSuggestions([]); setShowNameSug(false); return }
    const results = getSuggestions(val)
    setNameSuggestions(results)
    setShowNameSug(results.length > 0)
  }

  const selectMix = (mix: MixPreset) => {
    onChange({ ...block, text: mix.text })
    setCurrentTokens(mix.tokens)
    setNextTokens(getNextTokens('', mix.tokens))
    setNameQuery(''); setNameSuggestions([]); setShowNameSug(false)
    wordInputRef.current?.focus()
  }

  const handleWordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      const word = wordInput.trim()
      if (!word) return
      appendToken(word)
    }
  }

  const handleWordChange = (val: string) => {
    setWordInput(val)
    if (!val.trim()) { setNextTokens(getNextTokens('', currentTokens)); return }
    setNextTokens(getNextTokens(val, currentTokens))
  }

  const appendToken = (token: string) => {
    const newTokens = [...currentTokens, token]
    const newText = block.text ? block.text + ' ' + token : token
    onChange({ ...block, text: newText })
    setCurrentTokens(newTokens)
    setNextTokens(getNextTokens(token, newTokens))
    setWordInput('')
    wordInputRef.current?.focus()
  }

  return (
    <BlockWrapper type="interlude" {...wrapperProps}>
      <div className="flex flex-col gap-3">

        {/* 구간 레이블 */}
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-xs font-semibold text-gray-400 shrink-0">구간:</span>
          {LABELS.map(label => (
            <button key={label} onClick={() => onChange({ ...block, label })}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                block.label === label
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-blue-200 text-blue-400 hover:bg-blue-50'
              }`}>
              {label}
            </button>
          ))}
          <input
            value={LABELS.includes(block.label) ? '' : block.label}
            onChange={e => onChange({ ...block, label: e.target.value })}
            placeholder="직접 입력"
            className="text-xs px-2.5 py-1 rounded-full border border-blue-200 text-blue-400 outline-none focus:border-blue-400 placeholder:text-blue-200 w-20 bg-white"
          />
        </div>

        <div className="border-t border-blue-100" />

        {/* 믹스명 검색 */}
        <div className="relative">
          <span className="text-xs font-semibold text-gray-400 block mb-1">믹스명 검색</span>
          <input
            value={nameQuery}
            onChange={e => handleNameQuery(e.target.value)}
            onFocus={() => nameQuery && setShowNameSug(nameSuggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowNameSug(false), 150)}
            placeholder="믹스 이름으로 검색…"
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm outline-none focus:border-blue-300 placeholder:text-gray-300 shadow-sm"
          />
          {showNameSug && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {nameSuggestions.map(mix => (
                <div key={mix.id} onMouseDown={() => selectMix(mix)}
                  className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-0">
                  <span className="text-gray-800 font-medium text-sm">{mix.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">{mix.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 구호 조립 */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-400">구호 조립</span>
          <input
            ref={wordInputRef}
            value={wordInput}
            onChange={e => handleWordChange(e.target.value)}
            onKeyDown={handleWordKeyDown}
            placeholder="단어 입력 후 스페이스 또는 Enter"
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm outline-none focus:border-blue-300 placeholder:text-gray-300 shadow-sm"
          />
          {nextTokens.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {nextTokens.map((token, i) => (
                <button key={i} onClick={() => appendToken(token)}
                  className="text-xs px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-colors font-medium">
                  {token}
                </button>
              ))}
            </div>
          )}
          <textarea
            value={block.text}
            onChange={e => onChange({ ...block, text: e.target.value })}
            placeholder="구호가 여기에 쌓입니다 (직접 수정도 가능)"
            rows={Math.max(2, (block.text || '').split('\n').length + 1)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-red-500 font-bold text-sm outline-none focus:border-blue-300 resize-none leading-relaxed placeholder:text-gray-200 shadow-sm"
          />
        </div>

      </div>
    </BlockWrapper>
  )
}