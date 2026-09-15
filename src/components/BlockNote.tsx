interface Props {
  note?: string
}

export default function BlockNote({ note }: Props) {
  const text = note?.trim()
  if (!text) return null

  return (
    <aside
      aria-label="블록 주석"
      className="mt-1.5 border-l-2 border-gray-200 pl-2 text-xs leading-relaxed text-gray-400 whitespace-pre-line"
    >
      <span aria-hidden="true" className="mr-1 text-gray-300">※</span>
      {text}
    </aside>
  )
}
