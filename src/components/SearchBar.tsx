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
  defaultValue?: string       // 키워드 검색용 (q/title 모드)
  defaultMode?: Mode
  defaultTags?: string[]      // 태그 모드 초기 선택 태그
}

export default function SearchBar({ defaultValue, defaultMode = 'all', defaultTags = [] }: Props) {
  const router = useRouter()
  const [value, setValue] = useState(defaultValue || '')
  const [mode, setMode] = useState<Mode>(defaultMode)
  const [selectedTags, setSelectedTags] = useState<string[]>(defaultTags)
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
        // 이미 선택된 태그는 드롭다운에서 제외
        const filtered = data.filter((t: TagSuggestion) => !selectedTags.includes(t.name))
        setSuggestions(filtered)
        setShowSuggestions(filtered.length > 0)
      } catch {
        setSuggestions([])
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [value, mode, selectedTags])

  const navigateWithTags = (tags: string[]) => {
    if (tags.length === 0) { router.push('/'); return }
    const params = tags.map(t => `tag=${encodeURIComponent(t)}`).join('&')
    router.push(`/?${params}`)
  }

  const handleTagSelect = (tagName: string) => {
    const next = [...selectedTags, tagName]
    setSelectedTags(next)
    setValue('')
    setShowSuggestions(false)
    navigateWithTags(next)
  }

  const handleTagRemove = (tagName: string) => {
    const next = selectedTags.filter(t => t !== tagName)
    setSelectedTags(next)
    navigateWithTags(next)
  }

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode)
    setSelectedTags([])
    setValue('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    const v = value.trim()

    if (mode === 'tag') {
      // 입력창에 텍스트가 있으면 태그로 추가 후 검색
      const next = v && !selectedTags.includes(v) ? [...selectedTags, v] : selectedTags
      setValue('')
      setSelectedTags(next)
      navigateWithTags(next)
    } else if (!v) {
      router.push('/')
    } else if (mode === 'title') {
      router.push(`/?q=${encodeURIComponent(v)}&mode=title`)
    } else {
      router.push(`/?q=${encodeURIComponent(v)}`)
    }
  }

  const hasFilter = mode === 'tag' ? selectedTags.length > 0 : !!value

  const placeholder =
    mode === 'tag'
      ? selectedTags.length > 0 ? '태그 추가...' : '태그명으로 검색...'
      : mode === 'title' ? '곡 제목으로 검색...'
      : '아티스트명 또는 곡 제목으로 검색...'

  return (
    <div className="mb-4" ref={containerRef}>
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          {/* 태그 모드: 선택된 태그 칩 + 입력창 */}
          <div className={`flex flex-wrap items-center gap-1.5 bg-white border rounded-lg px-3 shadow-sm transition-colors ${showSuggestions ? 'border-gray-400' : 'border-gray-200'} ${mode === 'tag' && selectedTags.length > 0 ? 'py-1.5' : 'py-0'}`}>
            {mode === 'tag' && selectedTags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 shrink-0">
                #{tag}
                <button
                  type="button"
                  onMouseDown={e => { e.preventDefault(); handleTagRemove(tag) }}
                  className="text-gray-400 hover:text-red-400 transition-colors leading-none"
                >✕</button>
              </span>
            ))}
            <input
              value={value}
              onChange={e => setValue(e.target.value)}
              onFocus={() => { if (mode === 'tag' && suggestions.length > 0) setShowSuggestions(true) }}
              placeholder={placeholder}
              className={`flex-1 min-w-[120px] text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-300 ${mode === 'tag' && selectedTags.length > 0 ? 'py-1' : 'py-2.5'}`}
            />
          </div>

          {/* 태그 자동완성 드롭다운 */}
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
            onClick={() => { setValue(''); setSelectedTags([]); router.push('/') }}
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
