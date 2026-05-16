import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/supabaseServer'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sheetId = searchParams.get('sheetId')
  if (!sheetId) return NextResponse.json({ error: '필요한 파라미터 없음' }, { status: 400 })

  const sheet = await prisma.callSheet.findUnique({ where: { id: sheetId }, select: { isPublic: true, userId: true } })
  if (!sheet) return NextResponse.json({ error: '없음' }, { status: 404 })
  if (!sheet.isPublic) {
    const userId = await getUserIdFromRequest(req)
    if (!userId || userId !== sheet.userId) {
      return NextResponse.json({ error: '권한 없음' }, { status: 403 })
    }
  }

  const comments = await prisma.comment.findMany({
    where: { sheetId, parentId: null },
    include: {
      user: { select: { nickname: true } },
      replies: {
        include: { user: { select: { nickname: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(comments)
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const { sheetId, content, parentId } = await req.json()
  if (!sheetId || !content?.trim()) return NextResponse.json({ error: '내용 필요' }, { status: 400 })

  const sheet = await prisma.callSheet.findUnique({ where: { id: sheetId }, select: { isPublic: true, userId: true } })
  if (!sheet) return NextResponse.json({ error: '없음' }, { status: 404 })
  if (!sheet.isPublic && sheet.userId !== userId) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }

  const comment = await prisma.comment.create({
    data: {
      sheetId,
      userId,
      content: content.trim(),
      parentId: parentId || null,
    },
    include: { user: { select: { nickname: true } } },
  })
  return NextResponse.json(comment)
}
