'use client'

import { Block, LyricBlock, MixBlock, InterludeBlock, Language } from '@/types'
import LyricBlockComp from './LyricBlock'
import MixBlockComp from './MixBlock'
import InterludeBlockComp from './InterludeBlock'

interface Props {
  blocks: Block[]
  language: Language
  onChange: (blocks: Block[]) => void
}

export default function BlockList({ blocks, language, onChange }: Props) {
  const updateBlock = (id: string, updated: Block) => {
    onChange(blocks.map(b => b.id === id ? updated : b))
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

  return (
    <div className="flex flex-col gap-2">
      {blocks.map((block, idx) => {
        const commonProps = {
          isFirst: idx === 0,
          isLast: idx === blocks.length - 1,
          onMoveUp: () => moveBlock(block.id, 'up'),
          onMoveDown: () => moveBlock(block.id, 'down'),
          onDelete: () => removeBlock(block.id),
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
        }

        if (block.type === 'lyric') return (
          <LyricBlockComp key={block.id} block={block as LyricBlock}
            language={language}
            onChange={updated => updateBlock(block.id, updated)}
            {...commonProps} />
        )
        if (block.type === 'mix') return (
          <MixBlockComp key={block.id} block={block as MixBlock}
            onChange={updated => updateBlock(block.id, updated)}
            {...commonProps} />
        )
        if (block.type === 'interlude') return (
          <InterludeBlockComp key={block.id} block={block as InterludeBlock}
            onChange={updated => updateBlock(block.id, updated)}
            {...commonProps} />
        )
      })}
    </div>
  )
}