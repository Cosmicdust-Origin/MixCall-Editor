export const revalidate = 0

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AuthButton from '@/components/AuthButton'
import SearchBar from '@/components/SearchBar'

async function getPublicSheets(query?: string) {
  try {
    const sheets = await prisma.callSheet.findMany({
      where: {
        isPublic: true,
        ...(query ? {
          OR: [
            { artistName: { contains: query, mode: 'insensitive' } },
            { songTitle: { contains: query, mode: 'insensitive' } },
          ]
        } : {})
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
      include: { user: true, _count: { select: { likes: true } } },
    })
    return sheets
  } catch {
    return []
  }
}

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const sheets = await getPublicSheets(q)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-4 py-4">
  <div className="max-w-2xl mx-auto flex items-center justify-between">
    <div>
      <h1 className="text-red-500 font-black text-xl">📣 믹스콜 에디터</h1>
      <p className="text-xs text-gray-400 mt-0.5">아이돌 공연 콜/믹스 콜표 제작 도구</p>
    </div>
    <div className="flex items-center gap-2">
      <AuthButton />
      <Link href="/editor"
        className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors">
        ✏️ 콜표 만들기
      </Link>
    </div>
  </div>
</header>

      <main className="max-w-2xl mx-auto px-4 py-6">
  <SearchBar defaultValue={q} />

        {/* 공개 콜표 목록 */}
        <div className="mb-6">
          <h2 className="font-bold text-gray-800 mb-3">
  {q ? `"${q}" 검색 결과` : '📋 등록된 콜표'}
  <span className="text-sm font-normal text-gray-400 ml-2">{sheets.length}개</span>
</h2>

          {sheets.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-gray-400 text-sm">아직 등록된 콜표가 없어요</p>
              <p className="text-gray-300 text-xs mt-1">첫 번째 콜표를 만들어보세요!</p>
              <Link href="/editor"
                className="inline-block mt-4 text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors">
                콜표 만들기
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {sheets.map(sheet => (
                <Link key={sheet.id} href={`/sheet/${sheet.id}`}
  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:border-gray-300 transition-colors">
  <div>
    {sheet.artistName && (
      <p className="text-xs text-gray-400">{sheet.artistName}</p>
    )}
    <p className="font-medium text-gray-800">
      {sheet.songTitle || '제목 없음'}
    </p>
    <div className="flex items-center gap-2 mt-0.5">
  <p className="text-xs text-gray-300">
    {new Date(sheet.updatedAt).toLocaleDateString('ko-KR')}
  </p>
  {(sheet.user as any)?.nickname && (
    <p className="text-xs text-gray-400">by {(sheet.user as any).nickname}</p>
  )}
  {sheet._count.likes > 0 && (
    <p className="text-xs text-red-400">❤️ {sheet._count.likes}</p>
  )}
</div>
  </div>
  <span className="text-gray-300 text-sm">→</span>
</Link>
              ))}
            </div>
          )}
        </div>

        {/* 에디터 바로가기 */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-center mb-6">
          <p className="text-gray-600 text-sm mb-3">직접 콜표를 만들고 싶다면?</p>
          <Link href="/editor"
            className="inline-block text-sm px-6 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium">
            ✏️ 믹스콜 에디터 바로가기
          </Link>
        </div>

        {/* 크레딧 */}
        <p className="text-center text-xs text-gray-300">
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