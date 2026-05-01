export type Language = 'jp' | 'ko';

// ─── 블록 공통 ───────────────────────────────────────────────
export interface BaseBlock {
  id: string;
  referenceUrl?: string; // 블록별 참고영상 링크 (YouTube or X)
}

// ─── 가사 블록 ────────────────────────────────────────────────
export interface LyricLine {
  id: string;
  jp?: string;   // 일본어 가사
  hira?: string; // 히라가나 (수동입력)
  ko?: string;   // 한국어 발음
}

export interface LyricBlock extends BaseBlock {
  type: 'lyric';
  lines: LyricLine[];
}

// ─── 믹스 블록 ────────────────────────────────────────────────
export interface MixAlternative {
  id: string;
  text: string;
}

export interface MixBlock extends BaseBlock {
  type: 'mix';
  mixPresetId?: string;
  text: string;
  alternatives?: MixAlternative[]; // "또는" 선택지 목록
}

// ─── 간주 블록 ────────────────────────────────────────────────
export interface InterludeBlock extends BaseBlock {
  type: 'interlude';
  label: string;
  text?: string;  // 추가
  mixName?: string;
  tokens?: string[];
}

// ─── 퍼포먼스 블록 ───────────────────────────────────────────
export type PerformanceType =
  | '오타게'
  | '후리코피'
  | '모슁'
  | '원진'
  | '투스텝'
  | 'DnB'
  | '기타';

export interface PerformanceBlock extends BaseBlock {
  type: 'performance';
  performanceType: PerformanceType;
  customLabel?: string; // performanceType이 '기타'일 때 직접 입력
  memo?: string;        // 선택 메모 (예: "2번 반복", "양손 펜라이트")
}

// ─── 유니언 ──────────────────────────────────────────────────
export type Block = LyricBlock | MixBlock | InterludeBlock | PerformanceBlock;

// ─── 믹스 프리셋 ──────────────────────────────────────────────
export type MixCategory = 'basic' | 'call' | 'namacall' | 'mid' | 'lang' | 'variant';

export interface MixPreset {
  id: string;
  name: string;
  category: MixCategory;
  tokens: string[];
  text: string;
  isOfficial: boolean;
}

// ─── 콜표 전체 참고영상 ────────────────────────────────────────
export interface ReferenceVideo {
  url: string;
  label?: string; // 선택: "1절 믹스", "공식 MV" 등 메모
}