import { createClient } from '@supabase/supabase-js'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// JWKS 기반 로컬 JWT 검증 — Auth 서버 왕복 없음
const JWKS = createRemoteJWKSet(
  new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL!}/auth/v1/.well-known/jwks.json`)
)

export async function verifyToken(token: string): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/auth/v1`,
    })
    return { sub: payload.sub as string }
  } catch {
    return null
  }
}

export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null

  const result = await verifyToken(token)
  return result?.sub ?? null
}
