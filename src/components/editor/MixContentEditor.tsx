'use client'

import { useRef, useState } from 'react'
import { MixAlternative, MixPreset } from '@/types'
import { MIX_DB, getNextTokens, getSuggestions } from '@/lib/mixDb'

interface MixContentValue {
  text?: string
  mixPresetId?: string
  alternatives?: MixAlternative[]
}

interface Props {
  value: MixContentValue
  onChange: (patch: Partial<MixContentValue>) => void
  accent?: 'red' | 'blue'
}

const QUICK_MIXES = [
  '기본 믹스 발동',
  '묘혼투스케 발동',
  '묘혼도라이바',
  '이엣타이가 추임새',
  '하이세노 콜',
  '사랑해 믹스',
  '원장 믹스',
  '혼돈 믹스 (와루도 카오스)',
]

const ACCENT = {
  red: {
    focus: 'focus:border-gray-400',
    suggestionHover: 'hover:bg-gray-50',
    token: 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100 hover:text-red-700',
  },
  blue: {
    focus: 'focus:border-blue-300',
    suggestionHover: 'hover:bg-blue-50',
    token: 'bg-blue-50 border-blue-100 text-blue-500 hover:bg-blue-100 hover:text-blue-700',
  },
} as const

export default function MixContentEditor({ value, onChange, accent = 'red' }: Props) {
  const [nameQuery, setNameQuery] = useState('')
  const [nameSuggestions, setNameSuggestions] = useState<MixPreset[]>([])
  const [showNameSuggestions, setShowNameSuggestions] = useState(false)
  const [wordInput, setWordInput] = useState('')
  const [currentTokens, setCurrentTokens] = useState<string[]>([])
  const [nextTokens, setNextTokens] = useState<string[]>([])
  const [pendingMix, setPendingMix] = useState<MixPreset | null>(null)
  const wordInputRef = useRef<HTMLInputElement>(null)
  const theme = ACCENT[accent]
  const text = value.text ?? ''
  const alternatives = value.alternatives ?? []

  const handleNameQuery = (nextQuery: string) => {
    setNameQuery(nextQuery)
    if (!nextQuery.trim()) {
      setNameSuggestions([])
      setShowNameSuggestions(false)
      return
    }

    const results = getSuggestions(nextQuery)
    setNameSuggestions(results)
    setShowNameSuggestions(results.length > 0)
  }

  const applyMix = (mix: MixPreset, mode: 'replace' | 'append') => {
    const nextText = mode === 'append' && text.trim()
      ? `${text}\n${mix.text}`
      : mix.text

    onChange({ text: nextText, mixPresetId: mix.id })
    setCurrentTokens(mix.tokens)
    setNextTokens(getNextTokens('', mix.tokens))
    setNameQuery('')
    setNameSuggestions([])
    setShowNameSuggestions(false)
    setPendingMix(null)
    wordInputRef.current?.focus()
  }

  const selectMix = (mix: MixPreset) => {
    if (text.trim()) {
      setPendingMix(mix)
      setShowNameSuggestions(false)
      return
    }

    applyMix(mix, 'replace')
  }

  const appendToken = (token: string) => {
    const newTokens = [...currentTokens, token]
    onChange({ text: text ? `${text} ${token}` : token })
    setCurrentTokens(newTokens)
    setNextTokens(getNextTokens(token, newTokens))
    setWordInput('')
    wordInputRef.current?.focus()
  }

  const handleWordChange = (nextValue: string) => {
    setWordInput(nextValue)
    setNextTokens(getNextTokens(nextValue.trim(), currentTokens))
  }

  const handleWordKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== ' ' && event.key !== 'Enter') return

    event.preventDefault()
    const word = wordInput.trim()
    if (word) appendToken(word)
  }

  const addAlternative = () => {
    onChange({
      alternatives: [...alternatives, { id: crypto.randomUUID(), text: '' }],
    })
  }

  const updateAlternative = (id: string, alternativeText: string) => {
    onChange({
      alternatives: alternatives.map(alternative => (
        alternative.id === id ? { ...alternative, text: alternativeText } : alternative
      )),
    })
  }

  const removeAlternative = (id: string) => {
    onChange({ alternatives: alternatives.filter(alternative => alternative.id !== id) })
  }

  return (
    <div className="flex flex-col gap-3">
      {pendingMix && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5 flex flex-col gap-2">
          <p className="text-xs text-orange-700 font-medium">
            기존 내용이 있어요. <span className="font-bold">{pendingMix.name}</span>을 어떻게 할까요?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => applyMix(pendingMix, 'replace')}
              className="text-xs px-3 py-1 rounded border border-orange-300 text-orange-600 hover:bg-orange-100 transition-colors"
            >
              교체
            </button>
            <button
              type="button"
              onClick={() => applyMix(pendingMix, 'append')}
              className="text-xs px-3 py-1 rounded border border-orange-300 text-orange-600 hover:bg-orange-100 transition-colors"
            >
              이어붙이기
            </button>
            <button
              type="button"
              onClick={() => setPendingMix(null)}
              className="text-xs px-3 py-1 rounded border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors ml-auto"
            >
              취소
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        <span className="text-xs font-semibold text-gray-400 block mb-1">믹스명 검색</span>
        <input
          value={nameQuery}
          onChange={event => handleNameQuery(event.target.value)}
          onFocus={() => nameQuery && setShowNameSuggestions(nameSuggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowNameSuggestions(false), 150)}
          placeholder="예: 묘혼투스케, 호그와트, 비스마르크…"
          className={`w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm outline-none ${theme.focus} placeholder:text-gray-300 shadow-sm`}
        />
        {showNameSuggestions && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {nameSuggestions.map(mix => (
              <button
                type="button"
                key={mix.id}
                onMouseDown={event => {
                  event.preventDefault()
                  selectMix(mix)
                }}
                className={`w-full flex items-center justify-between px-3 py-2 cursor-pointer ${theme.suggestionHover} border-b border-gray-100 last:border-0 text-left`}
              >
                <span className="text-gray-800 font-medium text-sm">{mix.name}</span>
                <span className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">{mix.category}</span>
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {QUICK_MIXES.map(name => {
            const mix = MIX_DB.find(candidate => candidate.name === name)
            if (!mix) return null
            return (
              <button
                type="button"
                key={mix.id}
                onClick={() => selectMix(mix)}
                className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              >
                {mix.name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-gray-400">구호 조립</span>
        <input
          ref={wordInputRef}
          value={wordInput}
          onChange={event => handleWordChange(event.target.value)}
          onKeyDown={handleWordKeyDown}
          placeholder="단어 입력 후 스페이스 또는 Enter"
          className={`w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm outline-none ${theme.focus} placeholder:text-gray-300 shadow-sm`}
        />
        {nextTokens.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {nextTokens.map((token, index) => (
              <button
                type="button"
                key={`${token}-${index}`}
                onClick={() => appendToken(token)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors font-medium ${theme.token}`}
              >
                {token}
              </button>
            ))}
          </div>
        )}
        <textarea
          value={text}
          onChange={event => onChange({ text: event.target.value })}
          placeholder="구호가 여기에 쌓입니다 (직접 수정도 가능)"
          rows={Math.max(2, text.split('\n').length + 1)}
          className={`w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-red-500 font-bold text-sm outline-none ${theme.focus} resize-none leading-relaxed placeholder:text-gray-200 shadow-sm`}
        />
      </div>

      {alternatives.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
          {alternatives.map(alternative => (
            <div key={alternative.id} className="flex items-start gap-2">
              <span className="text-xs font-bold text-orange-400 mt-2.5 shrink-0">또는</span>
              <textarea
                value={alternative.text}
                onChange={event => updateAlternative(alternative.id, event.target.value)}
                placeholder="대체 구호 입력"
                rows={Math.max(2, alternative.text.split('\n').length + 1)}
                className="flex-1 bg-white border border-orange-200 rounded-lg px-3 py-2 text-red-500 font-bold text-sm outline-none focus:border-orange-400 resize-none leading-relaxed placeholder:text-orange-200 shadow-sm"
              />
              <button
                type="button"
                onClick={() => removeAlternative(alternative.id)}
                className="text-xs text-gray-300 hover:text-red-400 mt-2.5 shrink-0 transition-colors"
                aria-label="대체 구호 삭제"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addAlternative}
        className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-500 transition-colors self-start"
      >
        <span className="w-4 h-4 rounded-full border border-orange-300 flex items-center justify-center text-[10px]">+</span>
        또는 추가
      </button>
    </div>
  )
}
