'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function LikeButton({ sheetId }: { sheetId: string }) {
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    fetch(`/api/likes?sheetId=${sheetId}`)
      .then(r => r.json())
      .then(d => setCount(d.count))
  }, [])

  const handleLike = async () => {
    if (!user || loading) return
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ sheetId }),
    })
    const data = await res.json()
    setCount(data.count)
    setLiked(data.liked)
    setLoading(false)
  }

  return (
    <button
      onClick={handleLike}
      disabled={!user || loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
        liked
          ? 'bg-red-50 border-red-200 text-red-500'
          : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
      } disabled:cursor-default`}
    >
      <span>{liked ? '❤️' : '🤍'}</span>
      <span className="font-medium">{count}</span>
    </button>
  )
}