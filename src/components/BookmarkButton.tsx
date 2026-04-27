'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function BookmarkButton({ sheetId }: { sheetId: string }) {
  const [bookmarked, setBookmarked] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session) {
        const res = await fetch(`/api/bookmarks?sheetId=${sheetId}`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        })
        const data = await res.json()
        setBookmarked(data.bookmarked)
      }
    })
  }, [])

  const handleBookmark = async () => {
    if (!user || loading) return
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ sheetId }),
    })
    const data = await res.json()
    setBookmarked(data.bookmarked)
    setLoading(false)
  }

  if (!user) return null

  return (
    <button
      onClick={handleBookmark}
      disabled={loading}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
        bookmarked
          ? 'bg-yellow-50 border-yellow-200 text-yellow-500'
          : 'border-gray-200 text-gray-400 hover:border-yellow-200 hover:text-yellow-400'
      } disabled:cursor-default`}
    >
    {bookmarked ? '🔖 북마크됨' : '🔖 북마크'}
    </button>
  )
}