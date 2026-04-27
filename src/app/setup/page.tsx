'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      // 이미 닉네임 있으면 스킵
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      })
      const profile = await res.json()
      if (profile?.nickname) router.push('/my')
    })
  }, [])

  const handleSubmit = async () => {
    if (!nickname.trim()) { setError('닉네임을 입력해줘요'); return }
    if (nickname.length > 20) { setError('20자 이하로 입력해줘요'); return }
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ nickname: nickname.trim() }),
    })
    if (res.ok) router.push('/editor')
    else setError('저장 실패, 다시 시도해줘요')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8 text-center">
          <span className="text-2xl">📣</span>
          <h1 className="text-xl font-black text-gray-900 mt-2">닉네임 설정</h1>
          <p className="text-sm text-gray-400 mt-1">콜표에 표시될 이름을 정해줘요</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="닉네임 (20자 이하)"
            maxLength={20}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400 placeholder:text-gray-300"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading || !nickname.trim()}
            className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 disabled:opacity-30 transition-colors">
            {loading ? '저장 중…' : '시작하기'}
          </button>
        </div>
      </div>
    </div>
  )
}