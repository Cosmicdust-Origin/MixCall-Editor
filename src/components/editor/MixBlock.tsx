'use client'

import { useState, useRef } from 'react'
import { MixBlock, MixPreset } from '@/types'
import { MIX_DB, getSuggestions, getNextTokens } from '@/lib/mixDb'
import BlockWrapper from './BlockWrapper'

interface Props {
  block: MixBlock
  onChange: (block: MixBlock) => void
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  onInsertLyric: () => void
  onInsertMix: () => void
  onInsertInterlude: () => void
}

const QUICK_MIXES = ['기본 믹스 발동', '묘혼투스케 발동', '묘혼도라이바', '이엣타이가 추임새', '하이세노 콜', '사랑해 믹스', '원장 믹스', '혼돈 믹스 (와루도 카오스)']

export default function MixBlockComp({ block, onChange, ...wrapperProps }: Props) {
  // 믹스명 검색
  const [nameQuery, setNameQuery] = useState('')
  const [nameSuggestions, setNameSuggestions] = useState<MixPreset[]>([])
  const [showNameSug, setShowNameSug] = useState(false)

  // 구호 조립
  const [wordInput, setWordInput] = useState('')
  const [currentTokens, setCurrentTokens] = useState<string[]>([])
  const [nextTokens, setNextTokens] = useState<string[]>([])
  const wordInputRef = useRef<HTMLInputElement>(null)

  // 믹스명 검색 핸들러
  const handleNameQuery = (val: string) => {
    setNameQuery(val)
    if (!val.trim()) { setNameSuggestions([]); setShowNameSug(false); return }
    const results = getSuggestions(val)
    setNameSuggestions(results)
    setShowNameSug(results.length > 0)
  }

  // 믹스 통째로 선택
  const selectMix = (mix: MixPreset) => {
    onChange({ ...block, text: mix.text, mixPresetId: mix.id })
    setCurrentTokens(mix.tokens)
    setNextTokens(getNextTokens('', mix.tokens))
    setNameQuery('')
    setNameSuggestions([])
    setShowNameSug(false)
    wordInputRef.current?.focus()
  }

  // 단어 입력 핸들러 — 스페이스바로 확정
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
    if (!val.trim()) {
      setNextTokens(getNextTokens('', currentTokens))
      return
    }
    setNextTokens(getNextTokens(val, currentTokens))
  }

  // 토큰 추가
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
    <BlockWrapper type="mix" {...wrapperProps}>
      <div className="flex flex-col gap-3">

        {/* ── 1. 믹스명 검색 ── */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-gray-400">믹스명 검색</span>
          </div>
          <input
            value={nameQuery}
            onChange={e => handleNameQuery(e.target.value)}
            onFocus={() => nameQuery && setShowNameSug(nameSuggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowNameSug(false), 150)}
            placeholder="예: 묘혼투스케, 호그와트, 비스마르크…"
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm outline-none focus:border-gray-400 placeholder:text-gray-300 shadow-sm"
          />
          {showNameSug && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {nameSuggestions.map(mix => (
                <div
                  key={mix.id}
                  onMouseDown={() => selectMix(mix)}
                  className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <span className="text-gray-800 font-medium text-sm">{mix.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">{mix.category}</span>
                </div>
              ))}
            </div>
          )}

          {/* 빠른 선택 칩 */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {QUICK_MIXES.map(name => {
              const mix = MIX_DB.find(m => m.name === name)
              if (!mix) return null
              return (
                <button key={mix.id} onClick={() => selectMix(mix)}
                  className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors">
                  {mix.name}
                </button>
              )
            })}
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* ── 2. 구호 직접 조립 ── */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-400">구호 조립</span>

          {/* 단어 입력 */}
          <div className="flex gap-2 items-center">
            <input
              ref={wordInputRef}
              value={wordInput}
              onChange={e => handleWordChange(e.target.value)}
              onKeyDown={handleWordKeyDown}
              placeholder="단어 입력 후 스페이스 또는 Enter"
              className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm outline-none focus:border-gray-400 placeholder:text-gray-300 shadow-sm"
            />
          </div>

          {/* 다음 단어 추천 */}
          {nextTokens.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {nextTokens.map((token, i) => (
                <button key={i} onClick={() => appendToken(token)}
                  className="text-xs px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors font-medium">
                  {token}
                </button>
              ))}
            </div>
          )}

          {/* 완성된 구호 textarea */}
          <textarea
            value={block.text}
            onChange={e => onChange({ ...block, text: e.target.value })}
            placeholder="구호가 여기에 쌓입니다 (직접 수정도 가능)"
            rows={Math.max(2, (block.text || '').split('\n').length + 1)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-red-500 font-bold text-sm outline-none focus:border-gray-400 resize-none leading-relaxed placeholder:text-gray-200 shadow-sm"
          />
        </div>

      </div>
    </BlockWrapper>
  )
}