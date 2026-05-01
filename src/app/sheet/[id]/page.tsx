import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Block, ReferenceVideo } from '@/types'
import Link from 'next/link'
import ShareButton from '@/components/ShareButton'
import type { Metadata } from 'next'
import Comments from '@/components/Comments'
import LikeButton from '@/components/LikeButton'
import BookmarkButton from '@/components/BookmarkButton'
import VideoEmbed from '@/components/VideoEmbed'
import SheetTagEditor from '@/components/SheetTagEditor'

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
    // ✅ tags 포함
    include: { user: true, tags: { include: { tag: true } } },
  })

  if (!sheet || !sheet.isPublic) notFound()

  const blocks = sheet.blocks as unknown as Block[]
  const referenceVideos = ((sheet as any).referenceVideos ?? []) as ReferenceVideo[]
  const tags = sheet.tags.map(t => t.tag.name)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-red-500 font-black text-lg">📣 믹스콜 에디터</Link>
          <div className="flex items-center gap-2">
            <LikeButton sheetId={id} />
            <BookmarkButton sheetId={id} />
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
          <div className="flex items-center gap-2">
            <h2 className="text-gray-900 font-bold text-2xl">{sheet.songTitle || '제목 없음'}</h2>
            {(sheet as any).songLang && (
              <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${
                (sheet as any).songLang === 'ko'
                  ? 'border-blue-200 text-blue-400'
                  : 'border-red-200 text-red-400'
              }`}>
                {(sheet as any).songLang === 'ko' ? '한국 곡' : '일본 곡'}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-300 mt-1">
            {new Date(sheet.updatedAt).toLocaleDateString('ko-KR')} 업데이트
          </p>
          {(sheet.user as any)?.nickname && (
            <p className="text-xs text-gray-400 mt-0.5">by {(sheet.user as any).nickname}</p>
          )}
          {/* ✅ 태그 */}
          <SheetTagEditor sheetId={id} initialTags={tags} ownerId={sheet.userId} />
        </div>

        {/* 곡 전체 참고영상 */}
        {referenceVideos.length > 0 && (
          <div className="mb-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
            <p className="text-xs font-medium text-gray-400">🎬 참고영상</p>
            {referenceVideos.map((v, i) => (
              <VideoEmbed key={i} url={v.url} label={v.label} compact={false} />
            ))}
          </div>
        )}

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
              {block.type === 'mix' && (
                <div>
                  {block.text && (
                    <p className="text-red-600 font-bold text-sm leading-relaxed whitespace-pre-line">
                      {block.text}
                    </p>
                  )}
                  {(block.alternatives ?? []).map(alt => (
                    <div key={alt.id} className="mt-1">
                      <span className="text-xs font-bold text-orange-400">또는</span>
                      <p className="text-red-600 font-bold text-sm leading-relaxed whitespace-pre-line">
                        {alt.text}
                      </p>
                    </div>
                  ))}
                </div>
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
              {block.type === 'performance' && (
                <div className="my-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded">
                    {block.performanceType === '기타' && block.customLabel
                      ? block.customLabel
                      : block.performanceType}
                  </span>
                  {block.memo && (
                    <span className="text-xs text-gray-400">{block.memo}</span>
                  )}
                </div>
              )}
              {block.referenceUrl && (
                <VideoEmbed url={block.referenceUrl} compact={false} />
              )}
            </div>
          ))}
        </div>

        <Comments sheetId={id} />
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