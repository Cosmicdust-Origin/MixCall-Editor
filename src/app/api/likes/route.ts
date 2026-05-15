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
