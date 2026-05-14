import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (!user) return NextResponse.json({ error: '인증 실패' }, { status: 401 })

  const sheets = await prisma.callSheet.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    include: { tags: { include: { tag: true } } },
  })
  return NextResponse.json(sheets)
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

    const { data: { user } } = await supabaseAdmin.auth.getUser(token)
    if (!user) return NextResponse.json({ error: '인증 실패' }, { status: 401 })

    await prisma.profile.upsert({
      where: { id: user.id },
      update: {},
      create: { id: user.id },
    })

    const body = await req.json()
    const tagNames: string[] = body.tags ?? []

    const sheet = await prisma.callSheet.create({
      data: {
        userId: user.id,
        artistName: body.artistName || null,
        songTitle: body.songTitle || null,
        songLang: body.songLang || null,
        editorLanguage: body.editorLanguage || null,
        isPublic: body.isPublic ?? false,
        blocks: body.blocks,
        referenceVideos: body.referenceVideos ?? [],
        tags: {
          create: await Promise.all(tagNames.map(async name => {
            const tag = await prisma.tag.upsert({
              where: { name },
              update: {},
              create: { name },
            })
            return { tagId: tag.id }
          }))
        }
      },
      include: { tags: { include: { tag: true } } },
    })
    return NextResponse.json(sheet)
  } catch (e) {
    console.error('POST /api/sheets error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}