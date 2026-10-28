import { LyricLine } from '@/types'

// 줄이 비어 있는 경우는 jp, hira, ko, mix에 글자가 하나도 없을 때뿐이다.
// 공백만 있는 줄(공백, 'ㅤ' U+3164, U+3000)은 의도적인 간격이므로 비어 있는 줄이 아니다.
export function isBlankLyricLine(line: LyricLine): boolean {
  return !line.jp && !line.hira && !line.ko && !line.mix
}

// 블록 맨 앞과 맨 뒤의 빈 줄은 버리고, 중간의 빈 줄은 유지한다.
// 모든 줄이 비어 있으면 빈 배열을 돌려준다.
export function trimBlankLyricLines(lines: LyricLine[]): LyricLine[] {
  let start = 0
  let end = lines.length
  while (start < end && isBlankLyricLine(lines[start])) start++
  while (end > start && isBlankLyricLine(lines[end - 1])) end--
  return lines.slice(start, end)
}

// 붙여넣기 방식: auto는 일본어/한글 줄을 자동 판별하고, pairs는 홀수 줄=원문, 짝수 줄=발음으로 읽는다.
export type PasteMode = 'auto' | 'pairs'

const hasJapaneseText = (text: string) => /[\u3040-\u30ff\u3400-\u9fff]/.test(text)
const hasKoreanText = (text: string) => /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/.test(text)

export function createLyricLine(fields: Partial<Pick<LyricLine, 'jp' | 'hira' | 'ko' | 'mix'>>): LyricLine {
  return {
    id: crypto.randomUUID(),
    jp: fields.jp ?? '',
    hira: fields.hira ?? '',
    ko: fields.ko ?? '',
    // mix는 값이 있을 때만 넣는다 (기존 줄에 mix: ''가 쓰이지 않도록)
    ...(fields.mix !== undefined && { mix: fields.mix }),
  }
}

// 붙여넣은 텍스트를 줄 단위로 나눈다. 줄 끝의 일반 공백·탭만 지우고(전각 공백 U+3000, ㅤ는 의도된 간격이라 유지)
// 앞 공백(콜 정렬용)은 남기며, 맨 앞/맨 뒤 빈 줄은 버리고 중간 빈 줄('')은 그대로 유지한다.
export function splitPastedLines(text: string): string[] {
  const lines = text.split(/\r?\n/).map(line => line.replace(/[ \t]+$/, ''))
  let start = 0
  let end = lines.length
  while (start < end && lines[start] === '') start++
  while (end > start && lines[end - 1] === '') end--
  return lines.slice(start, end)
}

// 빈 줄을 기준으로 줄 묶음(segment)을 나누고, 빈 줄은 빈 LyricLine으로 제자리에 낸다.
// 짝짓기는 묶음 안에서만 일어나므로 빈 줄을 넘어가지 않는다.
function mapSegments(lines: string[], parseSegment: (segment: string[]) => LyricLine[]): LyricLine[] {
  const parsed: LyricLine[] = []
  let segment: string[] = []
  const flush = () => {
    if (segment.length > 0) parsed.push(...parseSegment(segment))
    segment = []
  }

  for (const line of lines) {
    if (line === '') {
      flush()
      parsed.push(createLyricLine({}))
    } else {
      segment.push(line)
    }
  }
  flush()
  return parsed
}

// 메인 입력칸에 붙여넣은 줄들을 LyricLine 목록으로 바꾼다. (field는 붙여넣은 칸: 일본어 모드의 jp / 한국어 모드의 ko)
export function parseJapaneseKoreanPaste(lines: string[], field: 'jp' | 'ko', mode: PasteMode): LyricLine[] {
  // 한국어 모드: 모든 줄이 ko 줄. 모드는 무시한다.
  if (field === 'ko') {
    return lines.map(text => createLyricLine(text === '' ? {} : { ko: text }))
  }

  if (mode === 'pairs') {
    return mapSegments(lines, segment => {
      const parsed: LyricLine[] = []
      for (let i = 0; i < segment.length; i += 2) {
        parsed.push(createLyricLine({ jp: segment[i], ko: segment[i + 1] }))
      }
      return parsed
    })
  }

  const nonBlank = lines.filter(Boolean)
  const shouldPairReadings = nonBlank.some(hasJapaneseText)
    && nonBlank.some(line => hasKoreanText(line) && !hasJapaneseText(line))
  if (!shouldPairReadings) {
    return lines.map(text => createLyricLine(text === '' ? {} : { jp: text }))
  }

  return mapSegments(lines, segment => {
    const parsed: LyricLine[] = []
    for (let i = 0; i < segment.length; i += 1) {
      const current = segment[i]
      const next = segment[i + 1]

      if (hasJapaneseText(current)) {
        if (next && hasKoreanText(next) && !hasJapaneseText(next)) {
          parsed.push(createLyricLine({ jp: current, ko: next }))
          i += 1
        } else {
          parsed.push(createLyricLine({ jp: current }))
        }
      } else {
        parsed.push(createLyricLine({ ko: current }))
      }
    }
    return parsed
  })
}
