import { Block } from '@/types'
import { getBlockNote } from '@/lib/blockNote'

// 기기별 UI 편의 설정. 문서 데이터와는 무관하다.
export type EditorMode = 'basic' | 'advanced'

export const EDITOR_MODE_KEY = 'mix-call-editor:editor-mode'

// 고급 기능으로 만든 내용이 문서에 하나라도 있는지 (처음 열 때 기본 모드를 정하는 용도)
export function documentUsesAdvanced(doc: { blocks: Block[] }): boolean {
  return doc.blocks.some(block => {
    if (getBlockNote(block).trim() || block.referenceUrl?.trim()) return true
    if (block.type === 'performance') return true
    if (block.type === 'lyric') return block.lines.some(line => line.mix !== undefined)
    if (block.type === 'interlude') {
      return block.time !== undefined
        || Boolean(block.comment?.trim())
        || Boolean(block.text?.trim())
        || Boolean(block.alternatives?.length)
    }
    if (block.type === 'mix') return Boolean(block.alternatives?.length)
    return false
  })
}
