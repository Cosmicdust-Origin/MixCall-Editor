// 구간 시각 파싱/표시 헬퍼. 시각은 초 단위 정수로 다룬다.

// "m:ss" | "mm:ss" | "h:mm:ss" → 초. 형식이 틀리면 null
export function parseTimeInput(input: string): number | null {
  const text = input.trim()
  if (!text) return null
  const match = text.match(/^(?:(\d{1,2}):)?(\d{1,3}):(\d{2})$/)
  if (!match) return null
  return toSeconds(match[1], match[2], match[3])
}

function toSeconds(hour: string | undefined, minute: string, second: string): number | null {
  const s = Number(second)
  if (s > 59) return null
  if (hour === undefined) return Number(minute) * 60 + s
  const m = Number(minute)
  if (m > 59) return null
  return Number(hour) * 3600 + m * 60 + s
}

export function formatTime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const ss = String(s).padStart(2, '0')
  if (h === 0) return `${m}:${ss}`
  return `${h}:${String(m).padStart(2, '0')}:${ss}`
}

// 라벨 안의 첫 시각 표기 ("간주2 (2:48~)" → 168)
export function extractTimeFromLabel(label: string): number | null {
  const match = label.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/)
  if (!match) return null
  // 시:분:초 형식이면 앞 두 칸이 시/분, 아니면 분/초
  if (match[3] !== undefined) return toSeconds(match[1], match[2], match[3])
  return toSeconds(undefined, match[1], match[2])
}

// "+2:05" | "-0:30" | "−1:00" → 부호 있는 초. 부호 없으면 양수. 형식이 틀리면 null
export function parseSignedTimeInput(input: string): number | null {
  const text = input.trim()
  if (!text) return null
  const sign = text[0]
  const negative = sign === '-' || sign === '−'
  const body = negative || sign === '+' ? text.slice(1).trim() : text
  const seconds = parseTimeInput(body)
  if (seconds === null) return null
  return negative ? -seconds : seconds
}

export function formatSignedTime(seconds: number): string {
  const sign = seconds < 0 ? '-' : '+'
  return `${sign}${formatTime(Math.abs(seconds))}`
}

export function getSectionTime(block: { time?: number; label: string }): number | null {
  return block.time ?? extractTimeFromLabel(block.label)
}
