'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function MyPage() {
  const router = useRouter()
  const [sheets, setSheets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      const res = await fetch('/api/sheets', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      })
      const data = await res.json()
      setSheets(data)
      setLoading(false)
    })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('삭제할까요?')) return
    const { data: { session } } = await supabase.auth.getSession()
    await fetch(`/api/sheets/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session?.access_token}` }
    })
    setSheets(p => p.filter(s => s.id !== id))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/editor')}
            className="text-red-500 font-black text-lg">📣 믹스콜 에디터</button>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">내 콜표</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{user?.email}</span>
          <button onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded border border-gray-200 text-gray-500 hover:text-gray-700">
            로그아웃</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">내 콜표 목록</h2>
          <button onClick={() => router.push('/editor')}
            className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors">
            + 새 콜표</button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">불러오는 중…</div>
        ) : sheets.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <p className="text-4xl mb-3">📝</p>
            <p>아직 저장된 콜표가 없어요</p>
            <button onClick={() => router.push('/editor')}
              className="mt-4 text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors">
              첫 콜표 만들기</button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sheets.map(sheet => (
              <div key={sheet.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${sheet.isPublic ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {sheet.isPublic ? '🌐 공개' : '🔒 비공개'}
                    </span>
                  </div>
                  <p className="font-medium text-gray-800 mt-1 truncate">
                    {sheet.artistName && <span className="text-gray-400 text-sm mr-1">{sheet.artistName}</span>}
                    {sheet.songTitle || '제목 없음'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(sheet.updatedAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div className="flex gap-2 ml-3 shrink-0">
                  <button
                    onClick={() => router.push(`/editor?id=${sheet.id}`)}
                    className="text-xs px-3 py-1.5 rounded border border-gray-200 text-gray-500 hover:text-gray-700">
                    편집</button>
                  <button
                    onClick={() => handleDelete(sheet.id)}
                    className="text-xs px-3 py-1.5 rounded border border-red-100 text-red-400 hover:text-red-600">
                    삭제</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}