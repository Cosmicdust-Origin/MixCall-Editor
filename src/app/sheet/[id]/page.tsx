import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Block } from '@/types'
import Link from 'next/link'
import ShareButton from '@/components/ShareButton'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const sheet = await prisma.callSheet.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!sheet || !sheet.isPublic) return {}

  const songTitle = sheet.songTitle || '콜표'
const artistName = sheet.artistName || ''
const author = (sheet.user as any)?.nickname
const displayTitle = [artistName, songTitle].filter(Boolean).join(' - ')
const description = author ? `${displayTitle} | by ${author}` : displayTitle

return {
  title: `${displayTitle} | 믹스콜 에디터`,
  description,
  openGraph: {
    title: `${displayTitle} | 믹스콜 에디터`,
    description,
    url: `https://mix-call-editor.vercel.app/sheet/${id}`,
    images: [
      {
        url: `https://mix-call-editor.vercel.app/api/og?title=${encodeURIComponent(songTitle)}&artist=${encodeURIComponent(artistName)}&author=${encodeURIComponent(author || '')}`,
        width: 1200,
        height: 630,
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${displayTitle} | 믹스콜 에디터`,
    description,
    images: [`https://mix-call-editor.vercel.app/api/og?title=${encodeURIComponent(songTitle)}&artist=${encodeURIComponent(artistName)}&author=${encodeURIComponent(author || '')}`],
  },
}
}

export default async function SheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sheet = await prisma.callSheet.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!sheet || !sheet.isPublic) notFound()

  const blocks = sheet.blocks as unknown as Block[]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-red-500 font-black text-lg">📣 믹스콜 에디터</Link>
          <div className="flex items-center gap-2">
            <ShareButton id={id} />
            <Link href="/editor"
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors">
              ✏️ 내 콜표 만들기
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-4">
          {sheet.artistName && <p className="text-gray-400 text-sm">{sheet.artistName}</p>}
          <h2 className="text-gray-900 font-bold text-2xl">{sheet.songTitle || '제목 없음'}</h2>
          <p className="text-xs text-gray-300 mt-1">
            {new Date(sheet.updatedAt).toLocaleDateString('ko-KR')} 업데이트
          </p>
          {(sheet.user as any)?.nickname && (
            <p className="text-xs text-gray-400 mt-0.5">by {(sheet.user as any).nickname}</p>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-100 font-sans">
          {blocks.map(block => (
            <div key={block.id} className="mb-4">
              {block.type === 'lyric' && block.lines.map(line =>
                line.jp || line.ko ? (
                  <div key={line.id} className="mb-2">
                    <p className="text-gray-900 font-medium text-sm leading-relaxed">
                      {line.jp || line.ko}
                    </p>
                    {line.jp && line.hira && (
                      <p className="text-gray-400 text-xs leading-relaxed">{line.hira}</p>
                    )}
                    {line.jp && line.ko && (
                      <p className="text-blue-500 text-xs font-medium leading-relaxed">{line.ko}</p>
                    )}
                  </div>
                ) : null
              )}
              {block.type === 'mix' && block.text && (
                <p className="text-red-600 font-bold text-sm leading-relaxed whitespace-pre-line">
                  {block.text}
                </p>
              )}
              {block.type === 'interlude' && (
                <div className="my-2">
                  <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                    {block.label}
                  </span>
                  {block.text && (
                    <p className="text-red-600 font-bold text-sm leading-relaxed whitespace-pre-line mt-1">
                      {block.text}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-300 mt-6">
          이 에디터의 믹스 DB는{' '}
          <a href="https://twitter.com/K_LIVEIDOL_INFO" target="_blank" rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 underline">
            라이도 인포 (@K_LIVEIDOL_INFO)
          </a>
          {' '}와의 협력으로 만들어졌습니다.
        </p>
      </main>
    </div>
  )
}