import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sheetId = searchParams.get('sheetId')
  const token = req.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) return NextResponse.json({ bookmarked: false })
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (!user) return NextResponse.json({ bookmarked: false })

  if (sheetId) {
    // 특정 콜표 북마크 여부
    const existing = await prisma.bookmark.findUnique({
      where: { sheetId_userId: { sheetId, userId: user.id } }
    })
    return NextResponse.json({ bookmarked: !!existing })
  } else {
    // 내 북마크 목록
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      include: {
        sheet: {
          include: { user: true, _count: { select: { likes: true } } }
        }
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(bookmarks)
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: '인증 필요' }, { status: 401 })
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (!user) return NextResponse.json({ error: '인증 실패' }, { status: 401 })

  const { sheetId } = await req.json()

  const existing = await prisma.bookmark.findUnique({
    where: { sheetId_userId: { sheetId, userId: user.id } }
  })

  if (existing) {
    await prisma.bookmark.delete({ where: { sheetId_userId: { sheetId, userId: user.id } } })
    return NextResponse.json({ bookmarked: false })
  } else {
    await prisma.bookmark.create({ data: { sheetId, userId: user.id } })
    return NextResponse.json({ bookmarked: true })
  }
}