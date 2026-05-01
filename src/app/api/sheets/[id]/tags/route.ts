import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabaseServer'

async function getUser(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  return user
}

// POST /api/sheets/[id]/tags — 태그 추가 (누구나)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const sheet = await prisma.callSheet.findUnique({ where: { id } })
  if (!sheet || !sheet.isPublic) return NextResponse.json({ error: '없음' }, { status: 404 })

  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: '태그명 필요' }, { status: 400 })

  const tag = await prisma.tag.upsert({
    where: { name: name.trim() },
    update: {},
    create: { name: name.trim() },
  })

  // 이미 있으면 무시
  await prisma.callSheetTag.upsert({
    where: { callSheetId_tagId: { callSheetId: id, tagId: tag.id } },
    update: {},
    create: { callSheetId: id, tagId: tag.id },
  })

  const updated = await prisma.callSheet.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  })
  return NextResponse.json(updated?.tags.map(t => t.tag.name) ?? [])
}

// DELETE /api/sheets/[id]/tags — 태그 삭제 (작성자만)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const sheet = await prisma.callSheet.findUnique({ where: { id } })
  if (!sheet || sheet.userId !== user.id)
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })

  const { name } = await req.json()
  const tag = await prisma.tag.findUnique({ where: { name } })
  if (!tag) return NextResponse.json({ error: '없음' }, { status: 404 })

  await prisma.callSheetTag.delete({
    where: { callSheetId_tagId: { callSheetId: id, tagId: tag.id } },
  })

  const updated = await prisma.callSheet.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  })
  return NextResponse.json(updated?.tags.map(t => t.tag.name) ?? [])
}