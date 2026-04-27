'use client'

import { useState } from 'react'
import { Block, Language } from '@/types'
import BlockList from '@/components/editor/BlockList'

const createInitialBlocks = (): Block[] => [
  { id: crypto.randomUUID(), type: 'lyric', lines: [{ id: crypto.randomUUID(), jp: '', hira: '', ko: '' }] }
]

export default function EditorPage() {
  const [blocks, setBlocks] = useState<Block[]>(createInitialBlocks)
  const [language, setLanguage] = useState<Language>('jp')
  const [songTitle, setSongTitle] = useState('')
  const [artistName, setArtistName] = useState('')
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = type === 'lyric'
      ? { id: crypto.randomUUID(), type: 'lyric', lines: [{ id: crypto.randomUUID(), jp: '', hira: '', ko: '' }] }
      : type === 'mix'
      ? { id: crypto.randomUUID(), type: 'mix', text: '' }
      : { id: crypto.randomUUID(), type: 'interlude', label: '간주', text: '' }
    setBlocks(p => [...p, newBlock])
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 px-4 py-3 flex items-center gap-3">
        <span className="text-red-500 font-black text-lg shrink-0">📣 콜표 에디터</span>

        <div className="flex gap-2 flex-1 max-w-md">
          <input
            value={artistName}
            onChange={e => setArtistName(e.target.value)}
            placeholder="아티스트명"
            className="flex-1 bg-transparent border-b border-zinc-700 text-sm text-zinc-300 px-1 py-1 outline-none focus:border-zinc-500 placeholder:text-zinc-700"
          />
          <input
            value={songTitle}
            onChange={e => setSongTitle(e.target.value)}
            placeholder="곡 제목"
            className="flex-1 bg-transparent border-b border-zinc-700 text-sm text-zinc-300 px-1 py-1 outline-none focus:border-zinc-500 placeholder:text-zinc-700"
          />
        </div>

        {/* 언어 토글 */}
        <div className="flex rounded-lg border border-zinc-700 overflow-hidden shrink-0">
          <button
            onClick={() => setLanguage('jp')}
            className={`text-xs px-3 py-1.5 transition-colors ${language === 'jp' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
          >🇯🇵 일본어</button>
          <button
            onClick={() => setLanguage('ko')}
            className={`text-xs px-3 py-1.5 transition-colors ${language === 'ko' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
          >🇰🇷 한국어</button>
        </div>

        {/* 편집/미리보기 토글 */}
        <div className="flex rounded-lg border border-zinc-700 overflow-hidden shrink-0">
          <button
            onClick={() => setMode('edit')}
            className={`text-xs px-3 py-1.5 transition-colors ${mode === 'edit' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
          >✏️ 편집</button>
          <button
            onClick={() => setMode('preview')}
            className={`text-xs px-3 py-1.5 transition-colors ${mode === 'preview' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
          >👁️ 미리보기</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {mode === 'edit' ? (
          <>
            <BlockList blocks={blocks} language={language} onChange={setBlocks} />

            {/* 블록 추가 버튼 */}
            <div className="flex gap-2 mt-4 justify-center">
              <button
                onClick={() => addBlock('lyric')}
                className="text-sm px-4 py-2 rounded-lg border border-dashed border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-colors"
              >+ 가사 블록</button>
              <button
                onClick={() => addBlock('mix')}
                className="text-sm px-4 py-2 rounded-lg border border-dashed border-red-900/50 text-red-900 hover:text-red-600 hover:border-red-700 transition-colors"
              >+ 믹스 블록</button>
              <button
                onClick={() => addBlock('interlude')}
                className="text-sm px-4 py-2 rounded-lg border border-dashed border-blue-900/50 text-blue-900 hover:text-blue-600 hover:border-blue-700 transition-colors"
              >+ 간주/전주</button>
            </div>
          </>
        ) : (
          <Preview
            blocks={blocks}
            artistName={artistName}
            songTitle={songTitle}
            language={language}
          />
        )}
      </main>
    </div>
  )
}

// ── 미리보기 ─────────────────────────────────────────────────────────────────
function Preview({ blocks, artistName, songTitle, language }: {
  blocks: Block[]
  artistName: string
  songTitle: string
  language: Language
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = blocks.map(b => {
      if (b.type === 'lyric') {
        return b.lines.map(l => {
          if (language === 'ko') return l.ko
          return [l.jp, l.hira, l.ko].filter(Boolean).join('\n')
        }).join('\n')
      }
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
            {artistName && <p className="text-zinc-500 text-sm">{artistName}</p>}
            {songTitle && <h2 className="text-zinc-100 font-bold text-xl">{songTitle}</h2>}
          </div>
        )}
        <button
          onClick={handleCopy}
          className="ml-auto text-sm px-3 py-1.5 rounded border border-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors"
        >{copied ? '✓ 복사됨' : '📋 텍스트 복사'}</button>
      </div>

      {/* 콜표 */}
      <div className="bg-white rounded-xl p-6 shadow-2xl font-sans">
        {(artistName || songTitle) && (
          <div className="mb-4 pb-3 border-b border-gray-200">
            {artistName && <p className="text-gray-400 text-sm">{artistName}</p>}
            {songTitle && <h2 className="text-gray-900 font-bold text-lg">{songTitle}</h2>}
          </div>
        )}

        {blocks.map(block => (
          <div key={block.id} className="mb-4">
            {block.type === 'lyric' && (
              block.lines.map(line => (
                (language === 'jp' ? line.jp : line.ko) ? (
                  <div key={line.id} className="mb-2">
                    <p className="text-gray-900 font-medium text-sm leading-relaxed">
                      {language === 'jp' ? line.jp : line.ko}
                    </p>
                    {language === 'jp' && line.hira && (
                      <p className="text-gray-400 text-xs leading-relaxed">{line.hira}</p>
                    )}
                    {language === 'jp' && line.ko && (
                      <p className="text-blue-500 text-xs font-medium leading-relaxed">{line.ko}</p>
                    )}
                  </div>
                ) : null
              ))
            )}
            {block.type === 'mix' && block.text && (
              <p className="text-red-600 font-bold text-sm leading-relaxed whitespace-pre-line">{block.text}</p>
            )}
            {block.type === 'interlude' && (
              <div className="my-2">
                <span className="text-xs font-bold text-blue-400 bg-blue-50 px-2 py-0.5 rounded">{block.label}</span>
                {block.text && <p className="text-red-600 font-bold text-sm leading-relaxed whitespace-pre-line mt-1">{block.text}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}