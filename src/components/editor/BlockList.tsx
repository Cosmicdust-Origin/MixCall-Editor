'use client'

import { Fragment } from 'react'
import { Block, LyricBlock, MixBlock, InterludeBlock, PerformanceBlock, Language } from '@/types'
import LyricBlockComp from './LyricBlock'
import MixBlockComp from './MixBlock'
import InterludeBlockComp from './InterludeBlock'
import PerformanceBlockComp from './PerformanceBlock'
import { getBlockNote } from '@/lib/blockNote'
import { PasteMode } from '@/lib/lyricLines'

interface Props {
  blocks: Block[]
  language: Language
  pasteMode: PasteMode
  onChange: (blocks: Block[]) => void
}

export default function BlockList({ blocks, language, pasteMode, onChange }: Props) {
  const updateBlock = (id: string, updated: Block) => {
    onChange(blocks.map(b => b.id === id ? updated : b))
  }

  const updateReferenceUrl = (id: string, url: string) => {
    onChange(blocks.map(b => b.id === id ? { ...b, referenceUrl: url } : b))
  }

  const updateNote = (id: string, note: string) => {
    onChange(blocks.map(b => b.id === id ? { ...b, note } : b))
  }

  const removeBlock = (id: string) => {
    if (blocks.length <= 1) return
    onChange(blocks.filter(b => b.id !== id))
  }

  const moveBlock = (id: string, dir: 'up' | 'down') => {
    const idx = blocks.findIndex(b => b.id === id)
    const next = [...blocks]
    const swap = dir === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    onChange(next)
  }

  const insertAfter = (id: string, newBlock: Block) => {
    const idx = blocks.findIndex(b => b.id === id)
    const next = [...blocks]
    next.splice(idx + 1, 0, newBlock)
    onChange(next)
  }

  const duplicateBlock = (id: string) => {
    const block = blocks.find(b => b.id === id)
    if (!block) return
    // lines 배열이 있으면 각 line의 id도 새로 만들어줘야 함
    const cloned: Block = block.type === 'lyric'
      ? {
          ...(block as LyricBlock),
          id: crypto.randomUUID(),
          lines: (block as LyricBlock).lines.map(l => ({ ...l, id: crypto.randomUUID() }))
        }
      : { ...block, id: crypto.randomUUID() }
    const idx = blocks.findIndex(b => b.id === id)
    const next = [...blocks]
    next.splice(idx + 1, 0, cloned)
    onChange(next)
  }

  const splitBlock = (blockId: string, lineIdx: number) => {
    const block = blocks.find(b => b.id === blockId)
    if (!block || block.type !== 'lyric') return
    const lines = (block as LyricBlock).lines
    if (lineIdx <= 0 || lineIdx >= lines.length) return

    const block1: LyricBlock = {
      ...block as LyricBlock,
      id: crypto.randomUUID(),
      lines: lines.slice(0, lineIdx),
      note: undefined,
    }
    const block2: LyricBlock = { ...block as LyricBlock, id: crypto.randomUUID(), lines: lines.slice(lineIdx) }

    const idx = blocks.findIndex(b => b.id === blockId)
    const next = [...blocks]
    next.splice(idx, 1, block1, block2)
    onChange(next)
  }

  const mergeWithPrev = (id: string) => {
    const idx = blocks.findIndex(b => b.id === id)
    if (idx <= 0) return
    const prev = blocks[idx - 1]
    const curr = blocks[idx]
    if (prev.type !== 'lyric' || curr.type !== 'lyric') return
    const merged: LyricBlock = {
      ...prev,
      lines: [...(prev as LyricBlock).lines, ...(curr as LyricBlock).lines],
      note: [getBlockNote(prev), getBlockNote(curr)].map(note => note.trim()).filter(Boolean).join('\n') || undefined,
    }
    const next = [...blocks]
    next.splice(idx - 1, 2, merged)
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-2">
      {blocks.map((block, idx) => {
        const prevBlock = idx > 0 ? blocks[idx - 1] : null
        const canMergeWithPrev = block.type === 'lyric' && prevBlock?.type === 'lyric'

        const commonProps = {
          isFirst: idx === 0,
          isLast: idx === blocks.length - 1,
          referenceUrl: block.referenceUrl,
          onReferenceUrlChange: (url: string) => updateReferenceUrl(block.id, url),
          note: getBlockNote(block),
          onNoteChange: (note: string) => updateNote(block.id, note),
          onMoveUp: () => moveBlock(block.id, 'up'),
          onMoveDown: () => moveBlock(block.id, 'down'),
          onDelete: () => removeBlock(block.id),
          onDuplicate: () => duplicateBlock(block.id),
          onMergeWithPrev: canMergeWithPrev ? () => mergeWithPrev(block.id) : undefined,
          onInsertLyric: () => insertAfter(block.id, {
            id: crypto.randomUUID(), type: 'lyric',
            lines: [{ id: crypto.randomUUID(), jp: '', hira: '', ko: '' }]
          }),
          onInsertMix: () => insertAfter(block.id, {
            id: crypto.randomUUID(), type: 'mix', text: ''
          }),
          onInsertInterlude: () => insertAfter(block.id, {
            id: crypto.randomUUID(), type: 'interlude', label: '간주', text: ''
          }),
          onInsertPerformance: () => insertAfter(block.id, {
            id: crypto.randomUUID(), type: 'performance', performanceType: '오타게'
          }),
        }

        let content: React.ReactNode = null
        if (block.type === 'lyric') content = (
          <LyricBlockComp block={block as LyricBlock}
            language={language}
            pasteMode={pasteMode}
            onChange={updated => updateBlock(block.id, updated)}
            onSplit={(lineIdx) => splitBlock(block.id, lineIdx)}
            {...commonProps} />
        )
        else if (block.type === 'mix') content = (
          <MixBlockComp block={block as MixBlock}
            onChange={updated => updateBlock(block.id, updated)}
            {...commonProps} />
        )
        else if (block.type === 'interlude') content = (
          <InterludeBlockComp block={block as InterludeBlock}
            onChange={updated => updateBlock(block.id, updated)}
            {...commonProps} />
        )
        else if (block.type === 'performance') content = (
          <PerformanceBlockComp block={block as PerformanceBlock}
            onChange={updated => updateBlock(block.id, updated)}
            {...commonProps} />
        )

        return (
          <Fragment key={block.id}>
            {canMergeWithPrev && (
              <div className="relative h-6 flex items-center justify-center my-1">
                <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-gray-300" />
                <button
                  type="button"
                  aria-label="위 가사 블록과 합치기"
                  onClick={() => mergeWithPrev(block.id)}
                  className="relative bg-white border border-gray-400 rounded-full text-xs px-2.5 py-0.5 text-gray-600 hover:text-blue-500 hover:border-blue-300 transition-colors shadow-sm z-10"
                >
                  ⤒ 합치기
                </button>
              </div>
            )}
            {content}
          </Fragment>
        )
      })}
    </div>
  )
}
