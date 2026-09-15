import { Block } from '@/types'

export function getBlockNote(block: Block): string {
  if (block.note !== undefined) return block.note
  return block.type === 'performance' ? block.memo ?? '' : ''
}
