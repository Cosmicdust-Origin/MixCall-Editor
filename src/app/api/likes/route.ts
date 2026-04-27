import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sheetId = searchParams.get('sheetId')
  if (!sheetId) return NextResponse.json({ error: '필요한 파라미터 없음' }, { status: 400 })

  const count = await prisma.like.count({ where: { sheetId } })
  return NextResponse.json({ count })
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: '인증 필요' }, { status: 401 })
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (!user) return NextResponse.json({ error: '인증 실패' }, { status: 401 })

  const { sheetId } = await req.json()

  // 이미 좋아요 했으면 취소
  const existing = await prisma.like.findUnique({
    where: { sheetId_userId: { sheetId, userId: user.id } }
  })

  if (existing) {
    await prisma.like.delete({ where: { sheetId_userId: { sheetId, userId: user.id } } })
    const count = await prisma.like.count({ where: { sheetId } })
    return NextResponse.json({ count, liked: false })
  } else {
    await prisma.like.create({ data: { sheetId, userId: user.id } })
    const count = await prisma.like.count({ where: { sheetId } })
    return NextResponse.json({ count, liked: true })
  }
}