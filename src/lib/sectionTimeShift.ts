// 콜표 대표 영상이 바뀌었을 때 구간 시각을 일괄 이동하는 헬퍼
import { Block } from '@/types'
import { getSectionTime } from './sectionTime'
import { parseYouTubeUrl } from './youtube'

// 대표 영상을 따라가는 구간: 간주 블록 중 자체 YouTube 링크가 없고 시각이 있는 것
function isShiftable(block: Block): boolean {
  if (block.type !== 'interlude') return false
  if (block.referenceUrl && parseYouTubeUrl(block.referenceUrl)) return false
  return getSectionTime(block) !== null
}

export function countShiftableSections(blocks: Block[]): { count: number; fromLabel: number } {
  let count = 0
  let fromLabel = 0
  for (const block of blocks) {
    if (!isShiftable(block)) continue
    count++
    if (block.type === 'interlude' && block.time === undefined) fromLabel++
  }
  return { count, fromLabel }
}

export function shiftSectionTimes(blocks: Block[], delta: number): { blocks: Block[]; shifted: number; clamped: number; fromLabel: number } {
  let shifted = 0
  let clamped = 0
  let fromLabel = 0
  const next = blocks.map(block => {
    if (block.type !== 'interlude' || !isShiftable(block)) return block
    const target = (getSectionTime(block) as number) + delta
    shifted++
    if (target < 0) clamped++
    if (block.time === undefined) fromLabel++
    return { ...block, time: Math.max(0, target) }
  })
  return { blocks: next, shifted, clamped, fromLabel }
}
