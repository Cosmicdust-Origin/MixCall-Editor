'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Props {
  sheet: any
}

export default function SheetCard({ sheet }: Props) {
  const router = useRouter()
  const [bookmarked, setBookmarked] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session) {
        const res = await fetch(`/api/bookmarks?sheetId=${sheet.id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        })
        const data = await res.json()
        setBookmarked(data.bookmarked)
      }
    })
  }, [])

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ sheetId: sheet.id }),
    })
    const data = await res.json()
    setBookmarked(data.bookmarked)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:border-gray-300 transition-colors">
      <Link href={`/sheet/${sheet.id}`} className="flex-1 min-w-0">
        {/* 1행: 아티스트명 + 날짜/닉네임 */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-400 truncate">{sheet.artistName || ''}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            <p className="text-xs text-gray-300">
              {mounted ? new Date(sheet.updatedAt).toLocaleDateString('ko-KR') : ''}
            </p>
            {sheet.user?.nickname && (
              <p className="text-xs text-gray-400">by {sheet.user.nickname}</p>
            )}
          </div>
        </div>
        {/* 2행: 곡목 + 언어뱃지 */}
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-800">{sheet.songTitle || '제목 없음'}</p>
          {sheet.songLang && (
            <span className={`text-xs px-1.5 py-0.5 rounded border font-medium shrink-0 ${
              sheet.songLang === 'ko'
                ? 'border-blue-200 text-blue-400'
                : 'border-red-200 text-red-400'
            }`}>
              {sheet.songLang === 'ko' ? '한국 곡' : '일본 곡'}
            </span>
          )}
        </div>
        {/* 3행: 좋아요 + 태그 */}
        {(sheet._count?.likes > 0 || sheet.tags?.length > 0) && (
          <div className="flex flex-wrap items-center gap-1 mt-1">
            {sheet._count?.likes > 0 && (
              <span className="text-xs text-red-400 mr-0.5">❤️ {sheet._count.likes}</span>
            )}
            {sheet.tags?.map((t: any) => (
              <button
                key={t.tag.id}
                onClick={e => { e.preventDefault(); e.stopPropagation(); router.push(`/?tag=${encodeURIComponent(t.tag.name)}`) }}
                className="text-xs px-1.5 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-100 hover:border-gray-300 hover:text-gray-600 transition-colors"
              >
                #{t.tag.name}
              </button>
            ))}
          </div>
        )}
      </Link>
      <div className="flex items-center gap-2 ml-3 shrink-0">
        {user && (
          <button
            onClick={handleBookmark}
            className={`text-xs px-2 py-1 rounded border transition-colors ${
              bookmarked
                ? 'bg-yellow-50 border-yellow-300 text-yellow-600'
                : 'border-gray-200 text-gray-300 hover:border-yellow-300 hover:text-yellow-400'
            }`}>
            {bookmarked ? '🔖 저장됨' : '🔖'}
          </button>
        )}
        <span className="text-gray-300 text-sm">→</span>
      </div>
    </div>
  )
}