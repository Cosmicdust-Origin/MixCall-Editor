import { NextRequest, NextResponse } from 'next/server'
import { MIX_DB, getSuggestions } from '@/lib/mixDb'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') || ''
  const results = query ? getSuggestions(query) : MIX_DB
  return NextResponse.json(results)
}