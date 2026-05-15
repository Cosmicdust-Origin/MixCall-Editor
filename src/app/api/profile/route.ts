import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/supabaseServer'

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const profile = await prisma.profile.findUnique({ where: { id: userId } })
  return NextResponse.json(profile)
}

export async function PATCH(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const { nickname } = await req.json()
  const profile = await prisma.profile.upsert({
    where: { id: userId },
    update: { nickname },
    create: { id: userId, nickname },
  })
  return NextResponse.json(profile)
}
