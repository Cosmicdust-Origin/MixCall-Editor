'use client'

import { useState, useRef, useEffect } from 'react'

interface TagSuggestion {
  id: string
  name: string
  _count: { callSheets: number }
}

interface Props {
  tags: string[]
  onChange: (tags: string[]) => void
}

export default function TagInput({ tags, onChange }: Props) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([])
  const [showSug, setShowSug] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const q = input.trim()
    if (!q) { setSuggestions([]); setShowSug(false); return }
    fetch(`/api/tags?q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(data => {
        setSuggestions(data)
        setShowSug(data.length > 0)
      })
  }, [input])

  const addTag = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed || tags.includes(trimmed)) { setInput(''); setShowSug(false); return }
    onChange([...tags, trimmed])
    setInput('')
    setSuggestions([])
    setShowSug(false)
    inputRef.current?.focus()
  }

  const removeTag = (name: string) => {
    onChange(tags.filter(t => t !== name))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-gray-400">🏷️ 태그</span>

      {/* 태그 칩 + 입력 */}
      <div className="relative flex flex-wrap gap-1.5 items-center bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm focus-within:border-gray-400 transition-colors min-h-[40px]">
        {tags.map(tag => (
          <span key={tag}
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
            #{tag}
            <button onClick={() => removeTag(tag)}
              className="text-gray-400 hover:text-red-400 transition-colors leading-none">
              ✕
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSug(false), 150)}
          onFocus={() => input && setShowSug(suggestions.length > 0)}
          placeholder={tags.length === 0 ? '태그 입력 후 Enter (예: PSYCHIC FEVER 생탄)' : ''}
          className="flex-1 min-w-[120px] text-xs outline-none bg-transparent text-gray-700 placeholder:text-gray-300"
        />

        {/* 자동완성 드롭다운 */}
        {showSug && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {suggestions.map(s => (
              <div key={s.id} onMouseDown={() => addTag(s.name)}
                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">#{s.name}</span>
                <span className="text-xs text-gray-400">{s._count.callSheets}개 콜표</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-300">쉼표 또는 Enter로 추가 · 기존 태그 자동완성 지원</p>
    </div>
  )
}