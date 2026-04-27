'use client'

import { useState } from 'react'

export default function ShareButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const url = `${window.location.origin}/sheet/${id}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleShare}
      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
    >
      {copied ? '✓ 링크 복사됨!' : '🔗 공유하기'}
    </button>
  )
}