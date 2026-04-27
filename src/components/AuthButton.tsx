'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthButton() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [])

  if (user) return (
    <button onClick={() => router.push('/my')}
      className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors">
      내 콜표
    </button>
  )

  return (
    <button onClick={() => router.push('/login')}
      className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors">
      로그인
    </button>
  )
}