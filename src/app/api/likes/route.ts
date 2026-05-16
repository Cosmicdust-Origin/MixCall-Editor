import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/supabaseServer'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sheetId = searchParams.get('sheetId')
  if (!sheetId) return NextResponse.json({ error: '필요한 파라미터 없음' }, { status: 400 })

  const count = await prisma.like.count({ where: { sheetId } })
  return NextResponse.json({ count })
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const { sheetId } = await req.json()

  const sheet = await prisma.callSheet.findUnique({ where: { id: sheetId }, select: { isPublic: true, userId: true } })
  if (!sheet) return NextResponse.json({ error: '없음' }, { status: 404 })
  if (!sheet.isPublic && sheet.userId !== userId) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }

  const existing = await prisma.like.findUnique({
    where: { sheetId_userId: { sheetId, userId } },
  })

  if (existing) {
    await prisma.like.delete({ where: { sheetId_userId: { sheetId, userId } } })
    const count = await prisma.like.count({ where: { sheetId } })
    return NextResponse.json({ count, liked: false })
  }

  await prisma.like.create({ data: { sheetId, userId } })
  const count = await prisma.like.count({ where: { sheetId } })
  return NextResponse.json({ count, liked: true })
}
