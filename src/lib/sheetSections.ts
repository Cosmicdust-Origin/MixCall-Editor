import { Block, InterludeBlock } from '@/types'

export type SheetView = 'full' | 'mix' | 'sections' | 'side'

export function parseSheetView(value: string | string[] | undefined | null): SheetView {
  const v = Array.isArray(value) ? value[0] : value
  return v === 'mix' || v === 'sections' || v === 'side' ? v : 'full'
}

export type SummaryItem =
  | { kind: 'mix'; text: string; alternatives: string[] }
  | { kind: 'lineMix'; text: string }
  | { kind: 'performance'; label: string }

export interface SheetSection {
  section: InterludeBlock | null // null = 첫 구간 라벨 이전 블록들
  items: SummaryItem[]
  hasContent: boolean
}

// 공백, 탭, 전각 공백, 점자 공백, 한글 채움 문자
const LEADING_BLANKS = /^[\s　⠀ㅤ]+/

function toMixItem(text: string | undefined, alternatives: { text: string }[] | undefined): SummaryItem | null {
  const main = text?.trim() ?? ''
  const alts = (alternatives ?? []).map(a => a.text?.trim() ?? '').filter(Boolean)
  if (!main && alts.length === 0) return null
  return { kind: 'mix', text: main, alternatives: alts }
}

// 블록을 구간 라벨(interlude) 단위로 묶고, 요약 보기에 쓸 믹스/퍼포먼스만 추린다
export function groupSheetSections(blocks: Block[]): SheetSection[] {
  const groups: SheetSection[] = []
  let current: SheetSection = { section: null, items: [], hasContent: false }

  const push = (item: SummaryItem | null) => {
    if (item) current.items.push(item)
  }

  for (const block of blocks) {
    if (block.type === 'interlude') {
      groups.push(current)
      current = { section: block, items: [], hasContent: false }
      push(toMixItem(block.text, block.alternatives))
    } else if (block.type === 'mix') {
      push(toMixItem(block.text, block.alternatives))
    } else if (block.type === 'lyric') {
      for (const line of block.lines) {
        if (!line.mix?.trim()) continue
        current.items.push({ kind: 'lineMix', text: line.mix.replace(LEADING_BLANKS, '') })
      }
    } else if (block.type === 'performance') {
      current.items.push({
        kind: 'performance',
        label: block.performanceType === '기타' && block.customLabel ? block.customLabel : block.performanceType,
      })
    }
  }
  groups.push(current)

  for (const group of groups) {
    group.hasContent = group.items.length > 0 || Boolean(group.section?.comment?.trim())
  }
  return groups.filter(group => group.section !== null || group.hasContent)
}
