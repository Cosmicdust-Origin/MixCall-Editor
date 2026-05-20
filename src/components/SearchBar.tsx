'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

type Mode = 'all' | 'tag' | 'title'

interface TagSuggestion {
  id: string
  name: string
  _count: { callSheets: number }
}

interface Props {
  defaultValue?: string
  defaultMode?: Mode
}

export default function SearchBar({ defaultValue, defaultMode = 'all' }: Props) {
  const router = useRouter()
  const [value, setValue] = useState(defaultValue || '')
  const [mode, setMode] = useState<Mode>(defaultMode)
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 태그 자동완성
  useEffect(() => {
    if (mode !== 'tag' || value.trim().length === 0) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/tags?q=${encodeURIComponent(value.trim())}`)
        const data = await res.json()
        setSuggestions(data)
        setShowSuggestions(data.length > 0)
      } catch {
        setSuggestions([])
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [value, mode])

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode)
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    const v = value.trim()
    if (!v) { router.push('/'); return }
    if (mode === 'tag') {
      router.push(`/?tag=${encodeURIComponent(v)}`)
    } else if (mode === 'title') {
      router.push(`/?q=${encodeURIComponent(v)}&mode=title`)
    } else {
      router.push(`/?q=${encodeURIComponent(v)}`)
    }
  }

  const handleTagSelect = (tagName: string) => {
    setValue(tagName)
    setShowSuggestions(false)
    router.push(`/?tag=${encodeURIComponent(tagName)}`)
  }

  const hasFilter = !!defaultValue

  const placeholder =
    mode === 'tag' ? '태그명으로 검색...' :
    mode === 'title' ? '곡 제목으로 검색...' :
    '아티스트명 또는 곡 제목으로 검색...'

  return (
    <div className="mb-4" ref={containerRef}>
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            onFocus={() => { if (mode === 'tag' && suggestions.length > 0) setShowSuggestions(true) }}
            placeholder={placeholder}
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400 shadow-sm placeholder:text-gray-300"
          />
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
              {suggestions.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onMouseDown={() => handleTagSelect(tag.name)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between transition-colors"
                >
                  <span className="text-gray-700">#{tag.name}</span>
                  <span className="text-xs text-gray-400">{tag._count.callSheets}개</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="submit"
          className="px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700 transition-colors shrink-0">
          검색
        </button>
        {hasFilter && (
          <button type="button"
            onClick={() => { setValue(''); router.push('/') }}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-gray-400 text-sm hover:text-gray-600 transition-colors shrink-0">
            ✕
          </button>
        )}
      </form>

      {/* 검색 모드 토글 */}
      <div className="flex gap-1.5 mt-2">
        {([
          { key: 'all', label: '전체' },
          { key: 'tag', label: '# 태그' },
          { key: 'title', label: '곡목' },
        ] as { key: Mode; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleModeChange(key)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              mode === key
                ? 'bg-gray-800 border-gray-800 text-white'
                : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
