import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: '인증 필요' }, { status: 401 })
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (!user) return NextResponse.json({ error: '인증 실패' }, { status: 401 })

  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  return NextResponse.json(profile)
}

export async function PATCH(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: '인증 필요' }, { status: 401 })
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (!user) return NextResponse.json({ error: '인증 실패' }, { status: 401 })

  const { nickname } = await req.json()
  const profile = await prisma.profile.upsert({
    where: { id: user.id },
    update: { nickname },
    create: { id: user.id, nickname },
  })
  return NextResponse.json(profile)
}