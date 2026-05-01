import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabaseServer'

async function getUser(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  return user
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sheet = await prisma.callSheet.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  })
  if (!sheet) return NextResponse.json({ error: '없음' }, { status: 404 })
  if (!sheet.isPublic) {
    const user = await getUser(req)
    if (!user || user.id !== sheet.userId)
      return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }
  return NextResponse.json(sheet)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const sheet = await prisma.callSheet.findUnique({ where: { id } })
  if (!sheet || sheet.userId !== user.id)
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })

  const body = await req.json()
  const tagNames: string[] | undefined = body.tags

  const updated = await prisma.callSheet.update({
    where: { id },
    data: {
      artistName: body.artistName ?? sheet.artistName,
      songTitle: body.songTitle ?? sheet.songTitle,
      songLang: body.songLang !== undefined ? body.songLang : sheet.songLang,
      isPublic: body.isPublic ?? sheet.isPublic,
      blocks: body.blocks ?? sheet.blocks,
      referenceVideos: body.referenceVideos ?? sheet.referenceVideos,
      // 태그가 body에 포함된 경우에만 업데이트
      ...(tagNames !== undefined && {
        tags: {
          deleteMany: {},
          create: await Promise.all(tagNames.map(async name => {
            const tag = await prisma.tag.upsert({
              where: { name },
              update: {},
              create: { name },
            })
            return { tagId: tag.id }
          }))
        }
      })
    },
    include: { tags: { include: { tag: true } } },
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const sheet = await prisma.callSheet.findUnique({ where: { id } })
  if (!sheet || sheet.userId !== user.id)
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })

  await prisma.callSheet.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}