export type BlockType = 'lyric' | 'mix' | 'interlude'

export interface LyricLine {
  id: string
  jp: string
  hira: string
  ko: string
}

export interface LyricBlock {
  id: string
  type: 'lyric'
  lines: LyricLine[]
}

export interface MixBlock {
  id: string
  type: 'mix'
  mixPresetId?: string
  text: string
}

export interface InterludeBlock {
  id: string
  type: 'interlude'
  label: string // '전주' | '간주' | '아웃트로' 등
  text: string  // 믹스 구호 (없으면 빈 문자열)
}

export type Block = LyricBlock | MixBlock | InterludeBlock

export interface MixPreset {
  id: string
  name: string
  category: 'basic' | 'call' | 'namacall' | 'mid' | 'lang' | 'variant'
  bars?: number
  tokens: string[]
  text: string
  isOfficial: boolean
  userId?: string
}

export interface CallSheet {
  id: string
  userId: string
  songId?: string
  artistName?: string
  songTitle?: string
  isPublic: boolean
  blocks: Block[]
  createdAt: string
  updatedAt: string
}

export type Language = 'jp' | 'ko'