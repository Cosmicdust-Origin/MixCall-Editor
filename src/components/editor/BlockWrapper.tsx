'use client'

import { useState } from 'react'
import VideoLinkInput from './VideoLinkInput'

interface Props {
  type: 'lyric' | 'mix' | 'interlude' | 'performance'
  isFirst: boolean
  isLast: boolean
  referenceUrl?: string
  onReferenceUrlChange: (url: string) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  onDuplicate: () => void
  onMergeWithPrev?: () => void
  onInsertLyric: () => void
  onInsertMix: () => void
  onInsertInterlude: () => void
  onInsertPerformance: () => void
  children: React.ReactNode
}

export default function BlockWrapper({
  type, isFirst, isLast,
  referenceUrl, onReferenceUrlChange,
  onMoveUp, onMoveDown, onDelete, onDuplicate, onMergeWithPrev,
  onInsertLyric, onInsertMix, onInsertInterlude, onInsertPerformance,
  children
}: Props) {
  const [hover, setHover] = useState(false)

  const styles = {
    lyric: {
      border: hover ? 'border-gray-400' : 'border-gray-300',
      bg: 'bg-white',
      label: 'LYRIC',
      labelColor: 'text-gray-500 bg-white',
    },
    mix: {
      border: hover ? 'border-red-400' : 'border-red-200',
      bg: 'bg-red-50',
      label: 'MIX',
      labelColor: 'text-red-400 bg-red-50',
    },
    interlude: {
      border: hover ? 'border-blue-400' : 'border-blue-200',
      bg: 'bg-blue-50',
      label: 'INTERLUDE',
      labelColor: 'text-blue-400 bg-blue-50',
    },
    performance: {
      border: hover ? 'border-purple-400' : 'border-purple-200',
      bg: 'bg-purple-50',
      label: 'PERFORMANCE',
      labelColor: 'text-purple-400 bg-purple-50',
    },
  }[type]

  return (
    <div
      className={`relative rounded-xl border ${styles.border} ${styles.bg} transition-colors shadow-sm`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className={`absolute -top-2.5 left-3 text-[10px] font-bold tracking-widest px-1 ${styles.labelColor}`}>
        {styles.label}
      </span>

      <div className="p-4 pt-5">
        {children}
        <VideoLinkInput
          value={referenceUrl}
          onChange={onReferenceUrlChange}
        />
      </div>

      <div className={`flex gap-1 px-4 pb-3 flex-wrap transition-opacity ${hover ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={onMoveUp} disabled={isFirst}
          className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-400 disabled:opacity-20 hover:text-gray-600 hover:border-gray-300">↑</button>
        <button onClick={onMoveDown} disabled={isLast}
          className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-400 disabled:opacity-20 hover:text-gray-600 hover:border-gray-300">↓</button>
        <button onClick={onDuplicate}
          className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300">복제</button>
        {onMergeWithPrev && (
          <button onClick={onMergeWithPrev}
            className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300">↑ 합치기</button>
        )}
        <button onClick={onDelete}
          className="text-xs px-2 py-1 rounded border border-red-200 text-red-300 hover:text-red-500 hover:border-red-300">✕ 삭제</button>
        <span className="flex-1" />
        <button onClick={onInsertLyric}
          className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-400 hover:text-gray-600">+ 가사</button>
        <button onClick={onInsertMix}
          className="text-xs px-2 py-1 rounded border border-red-200 text-red-300 hover:text-red-500">+ 믹스</button>
        <button onClick={onInsertInterlude}
          className="text-xs px-2 py-1 rounded border border-blue-200 text-blue-300 hover:text-blue-500">+ 간주</button>
        <button onClick={onInsertPerformance}
          className="text-xs px-2 py-1 rounded border border-purple-200 text-purple-300 hover:text-purple-500">+ 퍼포먼스</button>
      </div>
    </div>
  )
}