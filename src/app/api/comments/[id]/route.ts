import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/supabaseServer'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const comment = await prisma.comment.findUnique({ where: { id } })
  if (!comment || comment.userId !== userId) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }

  await prisma.comment.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
