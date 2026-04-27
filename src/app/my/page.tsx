'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MyPage() {
  const router = useRouter()
  const [sheets, setSheets] = useState<any[]>([])
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [tab, setTab] = useState<'my' | 'bookmarks'>('my')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      const token = session.access_token

      const [sheetsRes, bookmarksRes] = await Promise.all([
        fetch('/api/sheets', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/bookmarks', { headers: { Authorization: `Bearer ${token}` } }),
      ])
      const [sheetsData, bookmarksData] = await Promise.all([
        sheetsRes.json(),
        bookmarksRes.json(),
      ])
      setSheets(sheetsData)
      setBookmarks(bookmarksData)
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

  const handleRemoveBookmark = async (sheetId: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ sheetId }),
    })
    setBookmarks(p => p.filter(b => b.sheetId !== sheetId))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-red-500 font-black text-lg">📣 믹스콜 에디터</Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">내 페이지</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{user?.email}</span>
          <button onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded border border-gray-200 text-gray-500 hover:text-gray-700">
            로그아웃</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* 탭 */}
        <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setTab('my')}
            className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${tab === 'my' ? 'bg-white text-gray-800 font-medium shadow-sm' : 'text-gray-500'}`}>
            내 콜표 {sheets.length > 0 && `(${sheets.length})`}
          </button>
          <button
            onClick={() => setTab('bookmarks')}
            className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${tab === 'bookmarks' ? 'bg-white text-gray-800 font-medium shadow-sm' : 'text-gray-500'}`}>
            🔖 북마크 {bookmarks.length > 0 && `(${bookmarks.length})`}
          </button>
        </div>

        {/* 새 콜표 버튼 */}
        {tab === 'my' && (
          <div className="flex justify-end mb-3">
            <button onClick={() => router.push('/editor')}
              className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors">
              + 새 콜표</button>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-400 py-20">불러오는 중…</div>
        ) : tab === 'my' ? (
          sheets.length === 0 ? (
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
                  <Link href={`/sheet/${sheet.id}`} className="flex-1 min-w-0">
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
                  </Link>
                  <div className="flex gap-2 ml-3 shrink-0">
                    <button onClick={() => router.push(`/editor?id=${sheet.id}`)}
                      className="text-xs px-3 py-1.5 rounded border border-gray-200 text-gray-500 hover:text-gray-700">
                      편집</button>
                    <button onClick={() => handleDelete(sheet.id)}
                      className="text-xs px-3 py-1.5 rounded border border-red-100 text-red-400 hover:text-red-600">
                      삭제</button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          bookmarks.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <p className="text-4xl mb-3">🔖</p>
              <p>북마크한 콜표가 없어요</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {bookmarks.map(bookmark => (
                <div key={bookmark.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                  <Link href={`/sheet/${bookmark.sheetId}`} className="flex-1 min-w-0">
                    {bookmark.sheet.artistName && (
                      <p className="text-xs text-gray-400">{bookmark.sheet.artistName}</p>
                    )}
                    <p className="font-medium text-gray-800 truncate">
                      {bookmark.sheet.songTitle || '제목 없음'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-gray-300">
                        {new Date(bookmark.sheet.updatedAt).toLocaleDateString('ko-KR')}
                      </p>
                      {bookmark.sheet.user?.nickname && (
                        <p className="text-xs text-gray-400">by {bookmark.sheet.user.nickname}</p>
                      )}
                      {bookmark.sheet._count.likes > 0 && (
                        <p className="text-xs text-red-400">❤️ {bookmark.sheet._count.likes}</p>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemoveBookmark(bookmark.sheetId)}
                    className="text-xs px-3 py-1.5 rounded border border-gray-200 text-gray-400 hover:text-red-400 ml-3 shrink-0">
                    🔖 해제</button>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  )
}