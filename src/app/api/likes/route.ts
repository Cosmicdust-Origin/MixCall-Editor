import { createHmac } from 'crypto'
import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/supabaseServer'

type LikeIdentity = {
  voterKey: string
  userId: string | null
}

function getClientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get('x-vercel-forwarded-for')
    ?? req.headers.get('x-forwarded-for')
    ?? req.headers.get('x-real-ip')

  const ip = forwarded?.split(',')[0]?.trim().toLowerCase()
  if (ip) return ip.startsWith('::ffff:') ? ip.slice(7) : ip

  return process.env.NODE_ENV === 'production' ? null : '127.0.0.1'
}

async function getLikeIdentity(req: NextRequest): Promise<LikeIdentity | null> {
  const userId = await getUserIdFromRequest(req)
  if (userId) return { voterKey: `user:${userId}`, userId }

  const ip = getClientIp(req)
  const secret = process.env.LIKE_IP_HASH_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!ip || !secret) return null

  const ipHash = createHmac('sha256', secret).update(ip).digest('hex')
  return { voterKey: `ip:${ipHash}`, userId: null }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sheetId = searchParams.get('sheetId')
  if (!sheetId) return NextResponse.json({ error: '필요한 파라미터 없음' }, { status: 400 })

  const identity = await getLikeIdentity(req)
  const [count, existing] = await Promise.all([
    prisma.like.count({ where: { sheetId } }),
    identity
      ? prisma.like.findUnique({
          where: { sheetId_voterKey: { sheetId, voterKey: identity.voterKey } },
          select: { id: true },
        })
      : null,
  ])

  return NextResponse.json({ count, liked: !!existing })
}

export async function POST(req: NextRequest) {
  const identity = await getLikeIdentity(req)
  if (!identity) {
    return NextResponse.json({ error: '요청자 식별 정보를 확인할 수 없음' }, { status: 503 })
  }

  const { sheetId } = await req.json()
  if (!sheetId) return NextResponse.json({ error: '필요한 파라미터 없음' }, { status: 400 })

  const sheet = await prisma.callSheet.findUnique({
    where: { id: sheetId },
    select: { isPublic: true, userId: true },
  })
  if (!sheet) return NextResponse.json({ error: '없음' }, { status: 404 })
  if (!sheet.isPublic && sheet.userId !== identity.userId) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }

  const existing = await prisma.like.findUnique({
    where: { sheetId_voterKey: { sheetId, voterKey: identity.voterKey } },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
    const count = await prisma.like.count({ where: { sheetId } })
    return NextResponse.json({ count, liked: false })
  }

  try {
    await prisma.like.create({
      data: {
        sheetId,
        voterKey: identity.voterKey,
        userId: identity.userId,
      },
    })
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
      throw error
    }
  }

  const count = await prisma.like.count({ where: { sheetId } })
  return NextResponse.json({ count, liked: true })
}
