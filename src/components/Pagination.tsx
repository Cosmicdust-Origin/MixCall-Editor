import Link from 'next/link'

interface Props {
  page: number
  totalPages: number
  query?: string
  tags: string[]
  mode?: string
}

export default function Pagination({ page, totalPages, query, tags, mode }: Props) {
  const href = (p: number) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    tags.forEach(t => params.append('tag', t))
    if (mode) params.set('mode', mode)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return qs ? `/?${qs}` : '/'
  }

  // 첫/마지막 페이지 + 현재 페이지 ±1, 사이 간격은 …
  const nums = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
  const items: (number | 'gap')[] = []
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) items.push('gap')
    items.push(n)
  })

  const navBase = 'h-8 px-3 inline-flex items-center text-xs rounded-lg border'
  const numBase = 'min-w-8 h-8 inline-flex items-center justify-center text-xs rounded-lg border'

  return (
    <nav aria-label="페이지 이동" className="flex items-center justify-center gap-1 mt-4 flex-wrap">
      {page > 1 ? (
        <Link href={href(page - 1)} className={`${navBase} border-gray-200 text-gray-600 hover:bg-gray-50`}>← 이전</Link>
      ) : (
        <span className={`${navBase} text-gray-300 border-gray-100`}>← 이전</span>
      )}
      {items.map((it, i) => it === 'gap' ? (
        <span key={`gap-${i}`} className="text-xs text-gray-300 px-1">…</span>
      ) : it === page ? (
        <span key={it} aria-current="page" className={`${numBase} bg-gray-800 border-gray-800 text-white`}>{it}</span>
      ) : (
        <Link key={it} href={href(it)} className={`${numBase} border-gray-200 text-gray-600 hover:bg-gray-50`}>{it}</Link>
      ))}
      {page < totalPages ? (
        <Link href={href(page + 1)} className={`${navBase} border-gray-200 text-gray-600 hover:bg-gray-50`}>다음 →</Link>
      ) : (
        <span className={`${navBase} text-gray-300 border-gray-100`}>다음 →</span>
      )}
    </nav>
  )
}
