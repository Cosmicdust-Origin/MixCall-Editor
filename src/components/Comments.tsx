'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: { nickname: string | null }
  replies: {
    id: string
    content: string
    createdAt: string
    user: { nickname: string | null }
  }[]
}

export default function Comments({ sheetId }: { sheetId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [user, setUser] = useState<any>(null)
  const [input, setInput] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyInput, setReplyInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    fetchComments()
  }, [])

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?sheetId=${sheetId}`)
    const data = await res.json()
    setComments(data)
  }

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token
  }

  const handleSubmit = async () => {
    if (!input.trim()) return
    setLoading(true)
    const token = await getToken()
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ sheetId, content: input }),
    })
    setInput('')
    await fetchComments()
    setLoading(false)
  }

  const handleReply = async (parentId: string) => {
    if (!replyInput.trim()) return
    setLoading(true)
    const token = await getToken()
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ sheetId, content: replyInput, parentId }),
    })
    setReplyInput('')
    setReplyTo(null)
    await fetchComments()
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('삭제할까요?')) return
    const token = await getToken()
    await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    await fetchComments()
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="mt-8">
      <h3 className="font-bold text-gray-700 mb-4">💬 댓글 {comments.length > 0 ? `${comments.length}개` : ''}</h3>

      {/* 댓글 목록 */}
      <div className="flex flex-col gap-4 mb-6">
        {comments.map(comment => (
          <div key={comment.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            {/* 댓글 본문 */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {comment.user.nickname || '익명'}
                  </span>
                  <span className="text-xs text-gray-300">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">{comment.content}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {user && (
                  <button
                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                    className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-400 hover:text-gray-600">
                    답글
                  </button>
                )}
                {user?.id === comment.id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs px-2 py-1 rounded border border-red-100 text-red-300 hover:text-red-500">
                    삭제
                  </button>
                )}
              </div>
            </div>

            {/* 답글 */}
            {comment.replies.length > 0 && (
              <div className="mt-3 flex flex-col gap-3 pl-4 border-l-2 border-gray-100">
                {comment.replies.map(reply => (
                  <div key={reply.id} className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {reply.user.nickname || '익명'}
                        </span>
                        <span className="text-xs text-gray-300">{formatDate(reply.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">{reply.content}</p>
                    </div>
                    {user?.id === reply.id && (
                      <button
                        onClick={() => handleDelete(reply.id)}
                        className="text-xs px-2 py-1 rounded border border-red-100 text-red-300 hover:text-red-500 shrink-0">
                        삭제
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 답글 입력 */}
            {replyTo === comment.id && user && (
              <div className="mt-3 flex gap-2 pl-4">
                <input
                  value={replyInput}
                  onChange={e => setReplyInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleReply(comment.id)}
                  placeholder="답글 입력..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 text-gray-800"
                />
                <button
                  onClick={() => handleReply(comment.id)}
                  disabled={loading || !replyInput.trim()}
                  className="text-xs px-3 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-30">
                  등록
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 댓글 입력 */}
      {user ? (
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="댓글을 입력하세요..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400 text-gray-800 bg-white shadow-sm"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700 disabled:opacity-30 transition-colors shrink-0">
            등록
          </button>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-300 text-sm border border-dashed border-gray-200 rounded-xl">
          댓글은 로그인한 사용자만 작성할 수 있어요
        </div>
      )}
    </div>
  )
}