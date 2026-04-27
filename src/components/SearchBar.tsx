'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchBar({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()
  const [value, setValue] = useState(defaultValue || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      router.push(`/?q=${encodeURIComponent(value.trim())}`)
    } else {
      router.push('/')
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-4">
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="아티스트명 또는 곡 제목으로 검색..."
        className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400 shadow-sm placeholder:text-gray-300"
      />
      <button type="submit"
        className="px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700 transition-colors shrink-0">
        검색
      </button>
      {defaultValue && (
        <button type="button"
          onClick={() => { setValue(''); router.push('/') }}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-gray-400 text-sm hover:text-gray-600 transition-colors shrink-0">
          ✕
        </button>
      )}
    </form>
  )
}