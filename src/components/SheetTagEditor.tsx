'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Props {
  sheetId: string
  initialTags: string[]
  ownerId: string
}

interface TagSuggestion {
  id: string
  name: string
  _count: { callSheets: number }
}

export default function SheetTagEditor({ sheetId, initialTags, ownerId }: Props) {
  const [tags, setTags] = useState<string[]>(initialTags)
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([])
  const [showSug, setShowSug] = useState(false)
  const [user, setUser] = useState<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [])

  useEffect(() => {
    const q = input.trim()
    if (!q) { setSuggestions([]); setShowSug(false); return }
    fetch(`/api/tags?q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(data => { setSuggestions(data); setShowSug(data.length > 0) })
  }, [input])

  const addTag = async (name: string) => {
    const trimmed = name.trim()
    if (!trimmed || tags.includes(trimmed)) { setInput(''); setShowSug(false); return }
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch(`/api/sheets/${sheetId}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ name: trimmed }),
    })
    const updated = await res.json()
    setTags(updated)
    setInput('')
    setShowSug(false)
    inputRef.current?.focus()
  }

  const removeTag = async (name: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch(`/api/sheets/${sheetId}/tags`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ name }),
    })
    const updated = await res.json()
    setTags(updated)
  }

  const isOwner = user?.id === ownerId

  return (
    <div className="mt-2">
      {/* 태그 목록 */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
            <Link href={`/?tag=${encodeURIComponent(tag)}`} className="hover:text-gray-700">
              #{tag}
            </Link>
            {/* 삭제는 작성자만 */}
            {isOwner && (
              <button onClick={() => removeTag(tag)}
                className="text-gray-300 hover:text-red-400 transition-colors leading-none">
                ✕
              </button>
            )}
          </span>
        ))}

        {/* 태그 추가는 로그인한 누구나 */}
        {user && (
          <div className="relative">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input) } }}
              onBlur={() => setTimeout(() => setShowSug(false), 150)}
              placeholder="+ 태그 추가"
              className="text-xs px-2 py-0.5 rounded-full border border-dashed border-gray-300 text-gray-400 outline-none focus:border-gray-400 placeholder:text-gray-300 w-24 bg-transparent"
            />
            {showSug && (
              <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden min-w-[160px]">
                {suggestions.map(s => (
                  <div key={s.id} onMouseDown={() => addTag(s.name)}
                    className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700">#{s.name}</span>
                    <span className="text-xs text-gray-400">{s._count.callSheets}개</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}