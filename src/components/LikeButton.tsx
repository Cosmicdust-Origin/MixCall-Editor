'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

function authHeaders(accessToken?: string): HeadersInit {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
}

export default function LikeButton({ sheetId }: { sheetId: string }) {
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadLikeState = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`/api/likes?sheetId=${sheetId}`, {
        headers: authHeaders(session?.access_token),
      })
      if (!res.ok || cancelled) return

      const data = await res.json()
      setCount(data.count)
      setLiked(data.liked)
    }

    loadLikeState()
    return () => { cancelled = true }
  }, [sheetId])

  const handleLike = async () => {
    if (loading) return
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(session?.access_token),
        },
        body: JSON.stringify({ sheetId }),
      })
      if (!res.ok) return

      const data = await res.json()
      setCount(data.count)
      setLiked(data.liked)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
        liked
          ? 'bg-red-50 border-red-200 text-red-500'
          : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
      } disabled:cursor-default disabled:opacity-60`}
    >
      <span>{liked ? '❤️' : '🤍'}</span>
      <span className="font-medium">{count}</span>
    </button>
  )
}
