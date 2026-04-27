import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: '인증 필요' }, { status: 401 })
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (!user) return NextResponse.json({ error: '인증 실패' }, { status: 401 })

  const comment = await prisma.comment.findUnique({ where: { id } })
  if (!comment || comment.userId !== user.id)
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })

  await prisma.comment.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}