// 구간(interlude 블록) 라벨 템플릿과 분류. 데이터 타입명은 'interlude' 그대로 둔다.
export type SectionCategory = 'instrumental' | 'verse' | 'chorus' | 'bridge' | 'namacall' | 'other'

// 화면 표시용 그룹. 색은 그룹이 아니라 getSectionCategory(label)로 정한다.
export const SECTION_GROUPS: { category: SectionCategory; name: string; labels: string[] }[] = [
  { category: 'instrumental', name: '연주', labels: ['전주', '간주', '간주 1', '간주 2', '아웃트로', '엔딩'] },
  { category: 'verse', name: '절', labels: ['1절', '2절', 'A1', 'B1', 'A2', 'B2'] },
  { category: 'chorus', name: '사비', labels: ['사비', '사비1', '사비2', '오치사비', '라스사비'] },
  { category: 'bridge', name: '기타', labels: ['브릿지', 'C멜로', '나마콜'] },
]

// "더보기" 앞에 항상 보여 줄 라벨
export const QUICK_SECTION_LABELS = ['전주', '간주', '1절', '2절', '사비', '라스사비', '아웃트로']

export const ALL_SECTION_LABELS = SECTION_GROUPS.flatMap(group => group.labels)

// 키워드로 분류. 위에서부터 먼저 맞는 규칙이 이긴다.
export function getSectionCategory(label: string): SectionCategory {
  const text = label.trim()
  if (/나마콜|생콜/.test(text)) return 'namacall'
  if (/브릿지|bridge|\bbri\.?|c\s*멜로|c\s*메로|^c\d|댄브|댄스\s*브레이크/i.test(text)) return 'bridge'
  // 프리코러스는 사비보다 먼저 걸러서 절로 본다
  if (/프리\s*코러스|pre-?chorus/i.test(text)) return 'verse'
  if (/사비|코러스|chorus|(^|[^a-z])(l\.?|o\.?|oc)?sb\d*/i.test(text)) return 'chorus'
  if (/\d\s*절|^[ab]\d*([^a-z]|$)|[ab]\s*멜로|[ab]\s*메로|^\d[ab]\b/i.test(text)) return 'verse'
  if (/전주|간주|아웃트로|outro|엔딩|ending|인트로|intro|오프닝/i.test(text)) return 'instrumental'
  return 'other'
}

// Tailwind v4는 소스에 그대로 적힌 클래스만 생성하므로 전부 리터럴로 둔다
export const SECTION_BADGE_CLASS: Record<SectionCategory, string> = {
  instrumental: 'bg-blue-50 text-blue-500',
  verse: 'bg-emerald-50 text-emerald-600',
  chorus: 'bg-rose-50 text-rose-500',
  bridge: 'bg-indigo-50 text-indigo-500',
  namacall: 'bg-orange-50 text-orange-500',
  other: 'bg-gray-100 text-gray-500',
}

export const SECTION_CHIP_CLASS: Record<SectionCategory, { idle: string; active: string }> = {
  instrumental: {
    idle: 'border-blue-200 text-blue-400 hover:bg-blue-50',
    active: 'bg-blue-500 border-blue-500 text-white',
  },
  verse: {
    idle: 'border-emerald-200 text-emerald-500 hover:bg-emerald-50',
    active: 'bg-emerald-500 border-emerald-500 text-white',
  },
  chorus: {
    idle: 'border-rose-200 text-rose-400 hover:bg-rose-50',
    active: 'bg-rose-500 border-rose-500 text-white',
  },
  bridge: {
    idle: 'border-indigo-200 text-indigo-400 hover:bg-indigo-50',
    active: 'bg-indigo-500 border-indigo-500 text-white',
  },
  namacall: {
    idle: 'border-orange-200 text-orange-400 hover:bg-orange-50',
    active: 'bg-orange-500 border-orange-500 text-white',
  },
  other: {
    idle: 'border-gray-200 text-gray-400 hover:bg-gray-50',
    active: 'bg-gray-500 border-gray-500 text-white',
  },
}
