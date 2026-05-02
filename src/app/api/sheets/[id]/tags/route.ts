import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/supabaseServer'

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  const result = await verifyToken(token)
  return result?.sub ?? null
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = await getUserId(req)
  if (!userId) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const sheet = await prisma.callSheet.findUnique({ where: { id } })
  if (!sheet || !sheet.isPublic) return NextResponse.json({ error: '없음' }, { status: 404 })

  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: '태그명 필요' }, { status: 400 })

  const tag = await prisma.tag.upsert({
    where: { name: name.trim() },
    update: {},
    create: { name: name.trim() },
  })

  await prisma.callSheetTag.upsert({
    where: { callSheetId_tagId: { callSheetId: id, tagId: tag.id } },
    update: {},
    create: { callSheetId: id, tagId: tag.id },
  })

  const currentTags = await prisma.callSheetTag.findMany({
    where: { callSheetId: id },
    include: { tag: true },
  })
  return NextResponse.json(currentTags.map(t => t.tag.name))
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = await getUserId(req)
  if (!userId) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const sheet = await prisma.callSheet.findUnique({ where: { id } })
  if (!sheet || sheet.userId !== userId)
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })

  const { name } = await req.json()
  const tag = await prisma.tag.findUnique({ where: { name } })
  if (!tag) return NextResponse.json({ error: '없음' }, { status: 404 })

  await prisma.callSheetTag.delete({
    where: { callSheetId_tagId: { callSheetId: id, tagId: tag.id } },
  })

  const currentTags = await prisma.callSheetTag.findMany({
    where: { callSheetId: id },
    include: { tag: true },
  })
  return NextResponse.json(currentTags.map(t => t.tag.name))
}