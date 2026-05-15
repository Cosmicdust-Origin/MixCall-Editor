import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/supabaseServer'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sheetId = searchParams.get('sheetId')
  const userId = await getUserIdFromRequest(req)

  if (!userId) return NextResponse.json({ bookmarked: false })

  if (sheetId) {
    const existing = await prisma.bookmark.findUnique({
      where: { sheetId_userId: { sheetId, userId } },
    })
    return NextResponse.json({ bookmarked: !!existing })
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      sheet: {
        include: { user: true, _count: { select: { likes: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(bookmarks)
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const { sheetId } = await req.json()

  const existing = await prisma.bookmark.findUnique({
    where: { sheetId_userId: { sheetId, userId } },
  })

  if (existing) {
    await prisma.bookmark.delete({ where: { sheetId_userId: { sheetId, userId } } })
    return NextResponse.json({ bookmarked: false })
  }

  await prisma.bookmark.create({ data: { sheetId, userId } })
  return NextResponse.json({ bookmarked: true })
}
