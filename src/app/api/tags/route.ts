import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tags?q=검색어 — 태그 자동완성
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''

  const tags = await prisma.tag.findMany({
    where: q ? { name: { contains: q, mode: 'insensitive' } } : {},
    orderBy: { callSheets: { _count: 'desc' } },
    take: 10,
    select: { id: true, name: true, _count: { select: { callSheets: true } } },
  })

  return NextResponse.json(tags)
}