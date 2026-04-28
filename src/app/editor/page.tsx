'use client'

import { useState, useEffect } from 'react'
import { Block, Language } from '@/types'
import BlockList from '@/components/editor/BlockList'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const createInitialBlocks = (): Block[] => [
  { id: crypto.randomUUID(), type: 'lyric', lines: [{ id: crypto.randomUUID(), jp: '', hira: '', ko: '' }] }
]

export default function EditorPage() {
  const router = useRouter()
  const [blocks, setBlocks] = useState<Block[]>(createInitialBlocks)
  const [language, setLanguage] = useState<Language>('jp')
  const [songTitle, setSongTitle] = useState('')
  const [artistName, setArtistName] = useState('')
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [isPublic, setIsPublic] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [songLang, setSongLang] = useState<'ko' | 'jp' | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      const params = new URLSearchParams(window.location.search)
      const id = params.get('id')
      if (id && session) {
        const res = await fetch(`/api/sheets/${id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        })
        const data = await res.json()
        if (data.blocks) {
          setBlocks(data.blocks)
          setArtistName(data.artistName || '')
          setSongTitle(data.songTitle || '')
          setIsPublic(data.isPublic)
          setSongLang(data.songLang || null)
          setSavedId(id)
        }
      }
    })
  }, [])

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = type === 'lyric'
      ? { id: crypto.randomUUID(), type: 'lyric', lines: [{ id: crypto.randomUUID(), jp: '', hira: '', ko: '' }] }
      : type === 'mix'
      ? { id: crypto.randomUUID(), type: 'mix', text: '' }
      : { id: crypto.randomUUID(), type: 'interlude', label: '간주', text: '' }
    setBlocks(p => [...p, newBlock])
  }

  const handleSave = async () => {
    if (!user) { router.push('/login'); return }
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      const body = { artistName, songTitle, songLang, isPublic, blocks }

      if (savedId) {
        await fetch(`/api/sheets/${savedId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        })
      } else {
        const res = await fetch('/api/sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        })
        const data = await res.json()
        setSavedId(data.id)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 py-3">
        {/* 1행: 로고 + 저장/로그인 */}
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="text-red-500 font-black text-lg shrink-0">📣 믹스콜 에디터</Link>
          <div className="flex items-center gap-2 ml-auto">
            {user && (
              <button
                onClick={() => setIsPublic(p => !p)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors shrink-0 ${isPublic ? 'bg-green-50 border-green-200 text-green-600' : 'border-gray-200 text-gray-400'}`}>
                {isPublic ? '🌐 공개' : '🔒 비공개'}
              </button>
            )}
            {user ? (
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-xs px-4 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-30 transition-colors shrink-0">
                {saving ? '저장 중…' : savedId ? '✓ 업데이트' : '저장'}
              </button>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="text-xs px-4 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors shrink-0">
                🔑 로그인 후 저장
              </button>
            )}
            {user ? (
              <button onClick={() => router.push('/my')}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 shrink-0">
                내 콜표</button>
            ) : (
              <button onClick={() => router.push('/login')}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 shrink-0">
                로그인</button>
            )}
          </div>
        </div>

        {/* 2행: 아티스트명 + 곡 제목 */}
        <div className="flex gap-2 mt-2">
          <input
            value={artistName}
            onChange={e => setArtistName(e.target.value)}
            placeholder="아티스트명"
            className="flex-1 bg-transparent border-b border-gray-300 text-sm text-gray-700 px-1 py-1 outline-none focus:border-gray-500 placeholder:text-gray-400"
          />
          <input
            value={songTitle}
            onChange={e => setSongTitle(e.target.value)}
            placeholder="곡 제목"
            className="flex-1 bg-transparent border-b border-gray-300 text-sm text-gray-700 px-1 py-1 outline-none focus:border-gray-500 placeholder:text-gray-400"
          />
        </div>

        {/* 3행: 언어 토글 + 곡 언어 + 편집/미리보기 토글 */}
<div className="flex gap-2 mt-2 flex-wrap">
  <div className="flex rounded-lg border border-gray-200 overflow-hidden shrink-0">
    <button onClick={() => setLanguage('jp')}
      className={`text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${language === 'jp' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
      🇯🇵 일본어</button>
    <button onClick={() => setLanguage('ko')}
      className={`text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${language === 'ko' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
      🇰🇷 한국어</button>
  </div>

  <div className="flex rounded-lg border border-gray-200 overflow-hidden shrink-0">
    <button onClick={() => setSongLang('ko')}
      className={`text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${songLang === 'ko' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
      🇰🇷 한국 곡</button>
    <button onClick={() => setSongLang('jp')}
      className={`text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${songLang === 'jp' ? 'bg-red-100 text-red-500' : 'text-gray-500 hover:bg-gray-50'}`}>
      🇯🇵 일본 곡</button>
    <button onClick={() => setSongLang(null)}
      className={`text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${songLang === null ? 'bg-gray-200 text-gray-600' : 'text-gray-500 hover:bg-gray-50'}`}>
      미분류</button>
  </div>

  <div className="flex rounded-lg border border-gray-200 overflow-hidden shrink-0">
    <button onClick={() => setMode('edit')}
      className={`text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${mode === 'edit' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
      ✏️ 편집</button>
    <button onClick={() => setMode('preview')}
      className={`text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${mode === 'preview' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
      👁️ 미리보기</button>
  </div>
</div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {mode === 'edit' ? (
          <>
            <BlockList blocks={blocks} language={language} onChange={setBlocks} />
            <div className="flex gap-2 mt-4 justify-center">
              <button onClick={() => addBlock('lyric')}
                className="text-sm px-4 py-2 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors">
                + 가사 블록</button>
              <button onClick={() => addBlock('mix')}
                className="text-sm px-4 py-2 rounded-lg border border-dashed border-red-200 text-red-300 hover:text-red-500 hover:border-red-400 transition-colors">
                + 믹스 블록</button>
              <button onClick={() => addBlock('interlude')}
                className="text-sm px-4 py-2 rounded-lg border border-dashed border-blue-200 text-blue-300 hover:text-blue-500 hover:border-blue-400 transition-colors">
                + 간주/전주</button>
            </div>
          </>
        ) : (
          <Preview blocks={blocks} artistName={artistName} songTitle={songTitle} language={language} />
        )}
      </main>
    </div>
  )
}

function Preview({ blocks, artistName, songTitle, language }: {
  blocks: Block[], artistName: string, songTitle: string, language: Language
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = blocks.map(b => {
      if (b.type === 'lyric') return b.lines.map(l => {
        if (language === 'ko') return l.ko
        return [l.jp, l.hira, l.ko].filter(Boolean).join('\n')
      }).join('\n')
      if (b.type === 'mix') return b.text
      if (b.type === 'interlude') return `[${b.label}]\n${b.text}`
      return ''
    }).join('\n\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {(artistName || songTitle) && (
          <div>
            {artistName && <p className="text-gray-400 text-sm">{artistName}</p>}
            {songTitle && <h2 className="text-gray-900 font-bold text-xl">{songTitle}</h2>}
          </div>
        )}
        <button onClick={handleCopy}
          className="ml-auto text-sm px-3 py-1.5 rounded border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors">
          {copied ? '✓ 복사됨' : '📋 텍스트 복사'}</button>
      </div>
      <div className="bg-white rounded-xl p-6 shadow border border-gray-100 font-sans">
        {(artistName || songTitle) && (
          <div className="mb-4 pb-3 border-b border-gray-100">
            {artistName && <p className="text-gray-400 text-sm">{artistName}</p>}
            {songTitle && <h2 className="text-gray-900 font-bold text-lg">{songTitle}</h2>}
          </div>
        )}
        {blocks.map(block => (
          <div key={block.id} className="mb-4">
            {block.type === 'lyric' && block.lines.map(line =>
              (language === 'jp' ? line.jp : line.ko) ? (
                <div key={line.id} className="mb-2">
                  <p className="text-gray-900 font-medium text-sm leading-relaxed">
                    {language === 'jp' ? line.jp : line.ko}
                  </p>
                  {language === 'jp' && line.hira && <p className="text-gray-400 text-xs">{line.hira}</p>}
                  {language === 'jp' && line.ko && <p className="text-blue-500 text-xs font-medium">{line.ko}</p>}
                </div>
              ) : null
            )}
            {block.type === 'mix' && block.text && (
              <p className="text-red-600 font-bold text-sm leading-relaxed whitespace-pre-line">{block.text}</p>
            )}
            {block.type === 'interlude' && (
              <div className="my-2">
                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">{block.label}</span>
                {block.text && <p className="text-red-600 font-bold text-sm leading-relaxed whitespace-pre-line mt-1">{block.text}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}