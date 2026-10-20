'use client'

import { MixBlock } from '@/types'
import BlockWrapper from './BlockWrapper'
import MixContentEditor from './MixContentEditor'

interface Props {
  block: MixBlock
  onChange: (block: MixBlock) => void
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  onDuplicate: () => void
  onMergeWithPrev?: () => void
  onInsertLyric: () => void
  onInsertMix: () => void
  onInsertInterlude: () => void
  onInsertPerformance: () => void
  referenceUrl?: string
  onReferenceUrlChange: (url: string) => void
  note?: string
  onNoteChange: (note: string) => void
}

export default function MixBlockComp({ block, onChange, ...wrapperProps }: Props) {
  return (
    <BlockWrapper type="mix" {...wrapperProps}>
      <MixContentEditor
        value={block}
        onChange={patch => onChange({ ...block, ...patch })}
        accent="red"
      />
    </BlockWrapper>
  )
}
