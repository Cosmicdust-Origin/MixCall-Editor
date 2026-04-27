import { MixPreset } from '@/types'

export const MIX_DB: MixPreset[] = [
  // ── 기본 믹스 ──────────────────────────────────────────────────────────
  { id: 'myohon-basic', name: '묘혼투스케 발동', category: 'basic', isOfficial: true,
    tokens: ['묘혼투스케', '캇센토비죠쿄', '자자', '화이보', '와이파'],
    text: '묘혼투스케! 캇센토비죠쿄! 자자! 화이보! 와이파!' },

  { id: 'myohon-dr', name: '묘혼도라이바', category: 'basic', isOfficial: true,
    tokens: ['묘혼도라이바', '캇센토비라이가', '자자', '바리보', '스토라이파'],
    text: '묘혼도라이바 캇센토비라이가 자자 바리보 스토라이파' },

  { id: 'myohon-dr-start', name: '묘혼도라이바 발동', category: 'basic', isOfficial: true,
    tokens: ['묘혼', '도라이바', '캇센토비', '라이가', '자자', '바리바리보', '스토라이파'],
    text: '묘혼 도라이바! 캇센토비 라이가!\n자 자 자 자 바리바리보!\n스토스토스토스토 스토라이파!' },

  { id: 'myohon-triple', name: '묘혼투스케 발동 삼연', category: 'basic', isOfficial: true,
    tokens: ['묘혼투스케', '캇센토비죠쿄', '자자', '화이보', '와이파', '이야이야'],
    text: '묘혼투스케! 캇센토비죠쿄! 자자! 화이보! 와이파! 이야이야~\n묘혼투스케! 캇센토비죠쿄! 자자! 화이보! 와이파! 이야이야~\n묘혼투스케! 캇센토비죠쿄! 자자! 화이보! 와이파!' },

  { id: 'myohon-waipa', name: '묘혼와이파 믹스', category: 'mid', isOfficial: true,
    tokens: ['묘혼투스케', '와이파', '챠페아페', '토라히', '진조', '화이야', '화이보'],
    text: '묘혼투스케 와이파\n묘혼투스케 와이파\n묘혼투스케 와이파\n챠페아페 토라히 묘혼투스케 진조 화이야 화이보 와이파' },

  { id: 'standard', name: '스탠다드 믹스', category: 'basic', isOfficial: true,
    tokens: ['타이가', '화이야', '사이바', '파이바', '다이바', '바이바', '자자'],
    text: '타이가! 화이야! 사이바! 파이바! 다이바! 바이바! 자자!' },

  { id: 'standard-full', name: '스탠다드 믹스 풀', category: 'basic', isOfficial: true,
    tokens: ['타이가', '화이야', '사이바', '파이바', '다이바', '바이바', '자자', '화이보', '와이파'],
    text: '타이가! 화이야! 사이바! 파이바! 다이바! 바이바! 자자! 화이보 👏 와이파!' },

  { id: 'standard-speed', name: '스탠다드 배속', category: 'basic', isOfficial: true,
    tokens: ['타이가화이야사이바파이바다이바바이바자자'],
    text: '타이가화이야사이바파이바다이바바이바자자!' },

  { id: 'standard-rev', name: '스탠다드 배속 역배속', category: 'variant', isOfficial: true,
    tokens: ['타이가화이야사이바파이바다이바바이바자자', '역배속'],
    text: '타이가화이야사이바파이바다이바바이바자자!\n자자바이바다이바파이바사이바화이야타이가!' },

  { id: 'jpn', name: '일본어 믹스', category: 'basic', isOfficial: true,
    tokens: ['토라', '히', '진조', '셍이', '아마', '신도', '캇센'],
    text: '토라! 히! 진조! 셍이! 아마! 신도! 캇센!' },

  { id: 'jpn-full', name: '일본어 믹스 풀', category: 'basic', isOfficial: true,
    tokens: ['토라', '히', '진조', '셍이', '아마', '신도', '캇센', '토비', '죠쿄'],
    text: '토라! 히! 진조! 셍이! 아마! 신도! 캇센! 토비! 죠쿄!' },

  { id: 'jpn-speed', name: '일본어 믹스 배속', category: 'basic', isOfficial: true,
    tokens: ['토라히진조셍이아마신도캇센'],
    text: '토라히진조셍이아마신도캇센!' },

  { id: 'jpn-speed-rev', name: '일본어 배속 역배속', category: 'variant', isOfficial: true,
    tokens: ['토라히진조셍이아마신도캇센', '역배속'],
    text: '토라히진조셍이아마신도캇센토비죠쿄토비캇센신도아마셍이진조히!' },

  { id: 'torahi', name: '토라히 일본어 믹스', category: 'basic', isOfficial: true,
    tokens: ['토라토라토라토라', '토라히', '진조', '셍이', '아마', '신도', '캇센', '토비', '죠쿄'],
    text: '토라토라토라토라 토라토라토라토라 토라토라토라토라 토라히! 진조! 셍이! 아마! 신도! 캇센! 토비! 죠쿄!' },

  { id: 'ainu', name: '아이누어 믹스', category: 'basic', isOfficial: true,
    tokens: ['챠페', '아페', '카라', '키나', '라라', '투스케', '묘혼투스케'],
    text: '챠페! 아페! 카라! 키나! 라라! 투스케! 묘혼투스케!' },

  { id: 'ainu-full', name: '아이누어 믹스 풀', category: 'basic', isOfficial: true,
    tokens: ['챠페', '아페', '카라', '키나', '라라', '투스케', '위스페', '케시', '시스파'],
    text: '챠페! 아페! 카라! 키나! 라라! 투스케! 위스페! 케시! 시스파~' },

  { id: 'ainu-jpn', name: '아이누어 일본어 가변', category: 'basic', isOfficial: true,
    tokens: ['위스페', '케시', '챠페', '카라키나', '카라아페', '죠쿄토비', '토라히진조셍이', '아마신도캇센'],
    text: '위스페 케시 챠페챠페챠페 챠페아페카라키나 카라아페 챠페\n죠쿄토비죠쿄 토라토라토라 토라히진조셍이아마신도캇센' },

  { id: 'ainu-jpn-full', name: '아이누어 일본어 가변 풀', category: 'basic', isOfficial: true,
    tokens: ['위스페', '케시', '챠페', '카라키나', '카라아페', '죠쿄토비', '토라히진조셍이', '아마신도캇센', '토비', '죠쿄'],
    text: '위스페 케시 챠페챠페챠페 챠페아페카라키나 카라아페 챠페\n죠쿄토비죠쿄 토라토라토라 토라히진조셍이아마신도캇센\n토비 죠쿄!' },

  { id: 'wontjang', name: '원장 믹스', category: 'basic', isOfficial: true,
    tokens: ['화이보', '와이파', '화마', '자스파', '화이파', '쿠파', '이에스쿠레이파'],
    text: '화이보! 와이파! 화마! 자스파! 화이파! 쿠파! 이에스 쿠레이파!' },

  { id: 'wontjang-speed', name: '원장 배속 믹스', category: 'basic', isOfficial: true,
    tokens: ['화이보와이파화마자스파화이파쿠파이에스쿠레이파'],
    text: '화이보와이파화마자스파화이파쿠파이에스쿠레이파!' },

  { id: 'wontjang-unchi', name: '원장 운치', category: 'variant', isOfficial: true,
    tokens: ['화이보', '와이파', '와와와와', '화마', '자스파', '자자자자', '쿠파', '쿠쿠쿠쿠', '이에스쿠레이파'],
    text: '화이보 와이파! 와와와와 와이파! 화마 자스파! 자자자자 자스파!\n화이파 쿠파! 쿠쿠쿠쿠 쿠파! 이에스 쿠레이파! 이에 이에스 쿠레이파!' },

  { id: 'thomas', name: '토마스 믹스', category: 'basic', isOfficial: true,
    tokens: ['토마스', '고돈', '헨리', '파시', '토비', '에도와도', '훗'],
    text: '토마스 고돈 헨리 파시 토비 에도와도 훗 후~!' },

  { id: 'manwon', name: '만원기차 믹스', category: 'basic', isOfficial: true,
    tokens: ['만인덴샤', '카케코미', '죠샤', '도아가', '시마리마스', '핫샤시마스'],
    text: '만인덴샤 카케코미죠샤 도아가 시마리마스 핫샤시마스' },

  { id: 'miyamoto', name: '미야모토무사시 믹스', category: 'basic', isOfficial: true,
    tokens: ['토비', '죠쿄', '노우', '세이', '쇼쿠', '손', '미야모토무사시'],
    text: '토비 죠쿄 노우 세이 쇼쿠 손 미야모토무사시' },

  { id: 'donguri', name: '동구리타케시 자기소개', category: 'basic', isOfficial: true,
    tokens: ['C3PO', 'R2D2', 'DTKC', '동구리타케시'],
    text: 'C3PO R2D2 DTKC 동구리타케시' },

  { id: 'donguri-start', name: '동구리타케시 발동', category: 'basic', isOfficial: true,
    tokens: ['C3PO', 'R2D2', 'DTKC', '동구리타케시'],
    text: 'C3PO! R2D2! DTKC! 동구리타케시!' },

  { id: 'dunson', name: '던슨 믹스', category: 'basic', isOfficial: true,
    tokens: ['단손', '휘자키', '투자', '데사', '자콘사'],
    text: '단손! 휘자키! 투자 데사 자콘사!' },

  { id: 'diaste', name: '디어스테 믹스', category: 'basic', isOfficial: true,
    tokens: ['모모', '쿠리', '이모', '치치', '이모토', '아부라', '단보루'],
    text: '모모 쿠리 이모 치치 이모토 아부라 단보루' },

  { id: 'saranghae', name: '사랑해 믹스', category: 'basic', isOfficial: true,
    tokens: ['사랑해', '사랑', '한다고'],
    text: '사랑해 사랑해 사랑 한다고 사랑해 사랑해 사랑 한다고' },

  { id: 'basic-start', name: '기본 믹스 발동', category: 'basic', isOfficial: true,
  tokens: ['우랴오이', '우랴오이', '우랴오이', '우랴오이', '👏 👏👏 👏👏', '자', '이쿠죠'],
  text: '우랴오이! 우랴오이! 우랴오이! 우랴오이! 👏 👏👏 👏👏 자 이쿠죠!' },

  { id: '48-basic', name: '48식 기본 발동', category: 'basic', isOfficial: true,
    tokens: ['우랴오이', '욧샤', '이쿠죠'],
    text: '우랴오이! 우랴오이! 우랴오이! 우랴오이! 아~ 욧샤 이쿠죠!' },

  { id: '48-mid1', name: '48식 중간 발동 1', category: 'basic', isOfficial: true,
    tokens: ['우랴오이', '모 잇쵸', '이쿠죠'],
    text: '우랴오이! 우랴오이! 우랴오이! 우랴오이! 아~ 모 잇쵸 이쿠죠!' },

  { id: '48-mid2', name: '48식 중간 발동 2', category: 'basic', isOfficial: true,
    tokens: ['우랴오이', '마다마다', '이쿠죠'],
    text: '우랴오이! 우랴오이! 우랴오이! 우랴오이! 아~ 마다마다 이쿠죠!' },

  { id: '48-last1', name: '48식 마지막 발동 1', category: 'basic', isOfficial: true,
    tokens: ['우랴오이', '라스트', '이쿠죠'],
    text: '우랴오이! 우랴오이! 우랴오이! 우랴오이! 아~ 라스트 이쿠죠!' },

  { id: '48-last2', name: '48식 마지막 발동 2', category: 'basic', isOfficial: true,
    tokens: ['우랴오이', '사이고', '이쿠죠'],
    text: '우랴오이! 우랴오이! 우랴오이! 우랴오이! 아~ 사이고 이쿠죠!' },

  { id: 'gwaebeop', name: '괘법 르네시떼 발동', category: 'basic', isOfficial: true,
    tokens: ['괘법', '르네시떼', '합천일류국밥', '부산', '사상', '와이파'],
    text: '괘법 르네시떼! 합천일류국밥! 부산! 사상! 와이파!' },

  // ── 콜/추임새 ───────────────────────────────────────────────────────────
  { id: 'haiseno', name: '하이세노 콜', category: 'call', isOfficial: true,
    tokens: ['하이세노', '오이'],
    text: '아~ 후후~ 👏👏 후우후우 하이하이세노! 하이세노! 오이 오이 오이오이오이오이!' },

  { id: 'haiseno-short', name: '하이세노 발동 생략', category: 'call', isOfficial: true,
    tokens: ['하이세노', '오이'],
    text: '하이세노! 오이 오이 오이오이오이오이!' },

  { id: 'haiseno-shout', name: '하이세노 함성 추가', category: 'call', isOfficial: true,
    tokens: ['우랴오이', '오이'],
    text: '우랴오이! 우랴오이! 우랴오이! 우랴오이! 오이! 오이오이오이오이!' },

  { id: 'haiseno-skip', name: '하이세노 완전 생략', category: 'call', isOfficial: true,
    tokens: ['오이'],
    text: '오이 오이 오이오이오이오이!' },

  { id: 'aiai', name: '아이아이 추임새', category: 'call', isOfficial: true,
    tokens: ['아이아이아이아이', '모 잇카이'],
    text: '아이아이아이아이 모 잇카이 아이아이아이아이 아이아이아이아이' },

  { id: 'aiai-meaning', name: '의미불아이아이', category: 'call', isOfficial: true,
    tokens: ['아이', '모 잇카이'],
    text: '아이 아이 아이 아이 아이 모 잇카이 아이 아이 아이 아이 아이 아이 아이 아이' },

  { id: 'aishiteru-aiai', name: '아이시테루 아이아이', category: 'call', isOfficial: true,
    tokens: ['아이시테루', '아이아이아이아이'],
    text: '아! 아! 아! 아! 아! 아! 아이시테루! 아이아이아이아이 아이시테루! 아이아이아이아이 아이시테루!' },

  { id: 'iettaiga', name: '이엣타이가 기본형', category: 'call', isOfficial: true,
    tokens: ['이엣타이가'],
    text: '이엣타이가!' },

  { id: 'iettaiga-call', name: '이엣타이가 추임새', category: 'call', isOfficial: true,
    tokens: ['이엣타이가', '화이보', '와이파'],
    text: '이엣타이가 화이보 와이파!' },

  { id: 'iettaiga-rep', name: '이엣타이가 반복형', category: 'call', isOfficial: true,
    tokens: ['이엣타이가', '화이보', '와이파'],
    text: '이엣타이가! 이엣타이가! 이엣타이가 화이보 와이파!' },

  { id: 'iettaiga-neg', name: '이엣타이가 부정형', category: 'call', isOfficial: true,
    tokens: ['이엣타이가', '이야이야이야이야'],
    text: '이엣타이가! 이엣타이가! 이야이야이야이야! 이엣타이가!' },

  { id: 'iettaiga-short', name: '이엣타이가 단축형', category: 'call', isOfficial: true,
    tokens: ['이엣', '이엣타이가'],
    text: '이엣, 이엣, 이엣타이가!' },

  { id: 'etanaru', name: '에타나루 콜', category: 'call', isOfficial: true,
    tokens: ['이엣', '망게', '에타나루'],
    text: '이엣! 망게! 에타나루!' },

  { id: 'oingu', name: '오잉구 추임새', category: 'call', isOfficial: true,
    tokens: ['오잉구'],
    text: '발동: 민나데 잇쇼니 오잉구! / 오~ 후후 (반복) or 오~ 👏👏 (반복)' },

  { id: 'ochisabi', name: '오치사비 간밧떼', category: 'call', isOfficial: true,
    tokens: ['오치사비', '간밧떼'],
    text: '### 오치사비 간밧떼!' },

  { id: 'mo-ikkai', name: '모 잇카이 연결', category: 'call', isOfficial: true,
    tokens: ['모 잇카이'],
    text: '모 잇카이! 모 잇카이! (스탠다드 or 일본어 배속)' },

  // ── 나마콜 ──────────────────────────────────────────────────────────────
  { id: 'nama-basic', name: '나마콜 기본형', category: 'namacall', isOfficial: true,
    tokens: ['아', '###'],
    text: '아, 아, 아~ ###!' },

  { id: 'oreno-call', name: '오레노 콜', category: 'namacall', isOfficial: true,
    tokens: ['오 레 노', '###'],
    text: '###~ ###~ 오 레 노 ###!' },

  { id: 'nama-rep', name: '나마콜 반복형', category: 'namacall', isOfficial: true,
    tokens: ['###'],
    text: '###~! ###~! ###~! ###~! (4회 반복)' },

  { id: 'lovely', name: '러블리 콜', category: 'namacall', isOfficial: true,
    tokens: ['L O V E', '러블리', '###'],
    text: 'L O V E 러블리 ###!' },

  { id: 'omaega', name: '오마에가 이치방', category: 'namacall', isOfficial: true,
    tokens: ['오마에가', '이치방', '오 레 노', '###'],
    text: '오마에가 이치방 오마에가 이치방 오 레 노 ###!' },

  { id: 'iyaiya-call', name: '이야이야 콜', category: 'namacall', isOfficial: true,
    tokens: ['이야이야이야이야', '맛떼맛떼', '오 레 노', '###'],
    text: '이야이야이야이야 맛떼맛떼맛떼맛떼 오 레 노 ###!' },

  { id: 'kawai-call', name: '카와이 콜', category: 'namacall', isOfficial: true,
    tokens: ['카와이', '초 카와이', '###'],
    text: '###(가) 카와이 초 카와이!' },

  { id: 'oreno-rep', name: '오레노 반복 콜', category: 'namacall', isOfficial: true,
    tokens: ['오레노', '오레노', '오 레 노', '###'],
    text: '오레노 오레노, 오레노 오레노, 오 레 노 ###!' },

  { id: 'cho-kawai', name: '쵸제츠 카와이', category: 'namacall', isOfficial: true,
    tokens: ['쵸제츠', '카와이', '###'],
    text: '쵸제츠 카와이! ###!' },

  { id: 'princess', name: '프린세스 콜', category: 'namacall', isOfficial: true,
    tokens: ['오 레노', '프린세스', '###'],
    text: '오 레노 프린세스! ###!' },

  // ── 중급 믹스 ───────────────────────────────────────────────────────────
  { id: 'world-chaos', name: '혼돈 믹스 (와루도 카오스)', category: 'mid', isOfficial: true,
    tokens: ['와', '와루도 카오스', '쇼교', '코구레', '시구레', '카구라', '콘고산', '쇼슈샤'],
    text: '와! 와! 와! 와! 와! 와! 와루도 카오스!\n쇼교! 코구레! 시구레! 카구라! 콘고산 쇼슈샤!' },

  { id: 'world-chaos-full', name: '혼돈 믹스 풀', category: 'mid', isOfficial: true,
    tokens: ['와', '와루도 카오스', '쇼교', '코구레', '시구레', '카구라', '콘고산', '쇼슈샤', '코쿤 무죠우', '세카이 콘돈'],
    text: '와! 와! 와! 와! 와! 와! 와루도 카오스!\n쇼교! 코구레! 시구레! 카구라! 콘고산 쇼슈샤!\n코쿤 무죠우 세카이 콘돈!' },

  { id: 'world-chaos-rev', name: '역혼돈 믹스', category: 'mid', isOfficial: true,
    tokens: ['쇼슈샤', '콘고산', '카구라', '시구레', '코구레', '쇼교', '와루도 카오스'],
    text: '쇼! 쇼! 쇼! 쇼! 쇼! 쇼! 쇼슈샤!\n콘고산! 카구라! 시구레! 코구레! 쇼교! 와루도 카오스!' },

  { id: 'world-chaos-3', name: '세카이콘돈 3연', category: 'mid', isOfficial: true,
    tokens: ['와루도', '와루도 카오스', '코쿤 무죠', '세카이콘돈', '쇼카사네삿테'],
    text: '와루도 와루도 와루도 와루도 아 와루도 카오스\n코쿤 무죠 세카이콘돈 쇼교 무죠우노 히비키아리\n아나타노와 쿠무간산 쇼교 쿄구레 시구레 카구라\n쇼카사네사 쇼카사네사 쇼카사네삿테 싯테루' },

  { id: 'world-peace', name: '세계평화 믹스 (와루도 피스)', category: 'mid', isOfficial: true,
    tokens: ['와', '와루도 피스', '이노리', '호토케', '히카쿠카', '달라이 라마'],
    text: '와! 와! 와! 와! 와! 와! 와루도 피스!\n이노리! 호토케! 히카쿠카! 도토쿠! 지젠카츠도! 달라이 라마!' },

  { id: 'world-peace-full', name: '세계평화 믹스 풀', category: 'mid', isOfficial: true,
    tokens: ['와', '와루도 피스', '이노리', '호토케', '달라이 라마', '가마쿠라 바쿠후'],
    text: '와! 와! 와! 와! 와! 와! 와루도 피스!\n이노리! 호토케! 히카쿠카! 도토쿠! 지젠카츠도! 달라이 라마!\n이이쿠니 츠쿠로 가마쿠라 바쿠후!' },

  { id: 'world-peace-rev', name: '역 세계평화 믹스', category: 'mid', isOfficial: true,
    tokens: ['달라이 라마', '지젠카츠도', '호토케', '이노리', '와루도 피스'],
    text: '다! 다! 다! 다! 다! 다! 달라이 라마!\n지젠카츠도! 도토쿠! 히카쿠카! 호토케! 이노리! 와루도 피스!' },

  { id: 'danbo', name: '단보 믹스', category: 'mid', isOfficial: true,
    tokens: ['요스이로', '콤바인', '단보노', '오카시이', '노린교', '스이산교', '사카나노'],
    text: '요스이로 콤바인 단보노 요스가 오카시이\n노린교 스이산교 사카나노 요스모 오카시이' },

  { id: 'danbo-3', name: '단보 코죠 삼연', category: 'mid', isOfficial: true,
    tokens: ['노린교', '스이산교', '사카나노', '오카시이', '고시히카리', '요스이로', '콤바인', '단보노'],
    text: '노린교, 스이산교, 사카나노 요스가! 👏 오카시이!\n고시히카리! 사사니시키! 이야이야이이야 마테마테마테마테!\n요스이로, 콤바인, 단보노 요스가! 👏 오카시이!' },

  { id: 'jiji', name: '십이간지 믹스', category: 'mid', isOfficial: true,
    tokens: ['네', '우시', '토라', '우', '사츠미', '이누이'],
    text: '네 우시 토라 우 네 우시 토라 우 사츠미\n우마 히츠 사루 토리 우마 히츠 사루 토리 이누이' },

  { id: 'bread', name: '빵 믹스', category: 'mid', isOfficial: true,
    tokens: ['빵', '포켓몬 빵', '프렛슈', '브렛도', '이토 빵', '마츠타카코', '야마자키', '하루노'],
    text: '빵 빵 빵 빵 포켓몬 빵 프렛슈 브렛도 이토 빵\n마츠타카코 마츠타카코 야마자키 하루노 빵 마츠리' },

  { id: 'rice', name: '쌀 믹스', category: 'mid', isOfficial: true,
    tokens: ['니혼마이', '하쿠마이', '겐마이', '고시히카리', '히토메보레'],
    text: '마이 마이 마이 마이 니혼마이\n하쿠마이 겐마이 킨가마이\n고시히카리 고시히카리\n오레노 ○○니 히토메보레!' },

  { id: 'aishiteru', name: '아이시떼루 믹스', category: 'mid', isOfficial: true,
    tokens: ['아이시떼루', '아이아이아이아이'],
    text: '아 아 아 아 아 아 아이시떼루\n아이아이아이아이 아이시떼루 아이아이아이아이 아이시떼루' },

  { id: 'bismarck', name: '비스마르크 코죠', category: 'mid', isOfficial: true,
    tokens: ['타카마루요', '히쿠마루', '비스마르크', '시지마루', '카즈단스', '니하이', '오하이', '칸츄하이', '아이 캔 플라이'],
    text: '타카마루요 타카마루요 타카마루 히쿠마루 비스마르크\n시지마루 아루신도 카즈단스 니하이 오 👏 하이!\n칸 츄 하이! 우롱 하이! 나츄라루 하이! 아이 캔 플라이!' },

  { id: 'bismarck-kaben', name: '비스마르크 가변 코죠', category: 'mid', isOfficial: true,
    tokens: ['칸', '젠', '세이', '이키', '젯타이', '료이키', '니하이', '오하이', '칸츄하이', '아이 캔 플라이'],
    text: '칸 젠 세이 이키 젯타이 료이키 니하이 오하이\n칸츄하이 우롱하이 나츄라루하이 아푸르 파이\n산가쿠 초코파이 엔제루 파이 타오파이파이 파울플라이\n피쳐 플라이 캐쳐 플라이 센터 플라이 아이 캔 플라이' },

  { id: 'triangle-short', name: '삼각함수 믹스 단축', category: 'mid', isOfficial: true,
    tokens: ['오레토', '아카이 이토', '오레노', '###', '이야이야'],
    text: '오레토 오마에노 아카이 이토 오레노 오레노 ###!\n이야이야이야이야 이야이야이야이야 오. 레. 노 ###!' },

  { id: 'triangle-full', name: '삼각함수 믹스 풀', category: 'mid', isOfficial: true,
    tokens: ['오레토', '아카이 이토', '오레노', '###', '이야이야', '사인', '코사인', '탄젠트', '도리마'],
    text: '(기본 믹스 발동 후)\n오레토 오마에노 아카이 이토 오레노 오레노 ###!\n이야이야이야이야 이야이야이야이야 오. 레. 노 ###!\n사인 코사인 탄젠트! 트라이앙구루 도리마!' },

  { id: 'hogwarts', name: '호그와트 믹스', category: 'mid', isOfficial: true,
    tokens: ['말포이', '그리핀도르', '루모스', '레비오사', '파토로나무', '싯떼루'],
    text: '말포이 말포이 말포이 말포이 아~ 그리핀도르!\n아시오 레다쿠토 루모스! 윙가디우무 레비오사\n아나타노와, 레디오사! 익스펙토 파토로나무\n토무 리도루 토무 리도루 보루데모돗떼 싯떼루?' },

  { id: 'hogwarts-full', name: '호그와트 믹스 풀', category: 'mid', isOfficial: true,
    tokens: ['말포이', '그리핀도르', '루모스', '레비오사', '파토로나무', '싯떼루', '허마이오니'],
    text: '말포이 말포이 말포이 말포이 아~ 그리핀도르!\n아시오 레다쿠토 루모스! 윙가디우무 레비오사\n아나타노와, 레디오사! 익스펙토 파토로나무\n토무 리도루 토무 리도루 보루데모돗떼 싯떼루?\n(허마이오니 그레인져!)' },

  { id: 'gachikoi', name: '가치코이 코죠', category: 'mid', isOfficial: true,
    tokens: ['이이타이 코토가', '아룬다요', '얏빠리', '###', '카와이이요', '스키스키', '다이스키', '아이시테루'],
    text: '이이타이 코토가 아룬다요 얏빠리 ###와 카와이이요\n스키스키 다이스키 얏빠스키 얏토 미츠케타 오히메 사마\n오레가 우마레테 키타 리유 소레와 ###니 데아우 타메\n오레토 잇쇼니 진세 아유모 세카이데 이치방 아이시테루\n아. 이. 시. 테. 루~' },

  { id: 'gachikoi-short', name: '쇼트 가치코이 코죠', category: 'mid', isOfficial: true,
    tokens: ['이이타이 코토가', '얏빠리', '###', '카와이이요', '스키스키', '아이시테루'],
    text: '이이타이 코토가 아룬다요 얏빠리 ###와 카와이이요\n스키스키 다이스키 얏빠스키 세카이데 이치방 아이시테루\n아. 이. 시. 테. 루~' },

  { id: 'gachikoi-en', name: '가치코이 코죠 영식', category: 'mid', isOfficial: true,
    tokens: ['###니', '데아에타', '무네니', '이타쿠', '코이코코로', '아이시테루'],
    text: '###니 데아에타 아노히카라 무네니 이타쿠 코이코코로\n이마 오보에루노와 ###다케 사아 사사게요 다이텐시\n오레가 우마레테 키타 리유 소레와 ###니 데아우 타메\n오레토 잇쇼니 진세 아유모 세카이데 이치방 아이시테루\n아. 이. 시. 테. 루~' },

  { id: 'gachikoi-shin', name: '가치코이 코죠 진', category: 'mid', isOfficial: true,
    tokens: ['이이타이 코토가', '우마쿠', '코토바니', '스키스키', '이타이인다'],
    text: '이이타이 코토가 아루케레도 우마쿠 코토바니 데키나쿠테\n스키스키 메오 미테 이에타나라 콘나니 쿠루시쿠 나이노카나\n보쿠가 코레카라 이키루 리유 ##노 에가오가 미타이카라\n보쿠다케노 키미쟈 나이케레도 키미다케노 보쿠데 이타이인다\n이. 타. 이. 인. 다' },

  { id: 'gachikoi-nama', name: '가치코이 나마콜 코죠', category: 'mid', isOfficial: true,
    tokens: ['이이타이 코토가', '###', '얏빠리', '카와이', '스키스키'],
    text: '이이타이 코토가 (오시팀) ### 얏빠리 카와이 (오시팀) ###\n스키스키 다이스키 (오시팀) ### 얏토 미츠케타(오시팀) ###\n오레가 우마레테 (오시팀) ### 소레와 ###니 (오시팀) ###\n오레토 잇쇼니 (오시팀) ### 세카이데 이치방 (오시팀) ###\n(오시팀) ###' },

  { id: 'gachikoi-start', name: '가치코이 발동', category: 'mid', isOfficial: true,
    tokens: ['이이타이 코토가', '자 이쿠죠', '###', '바모스', '안티아모'],
    text: '이이타이 코토가 자 이쿠죠 얏빠리 @@와 바모스\n스키스키 다이스키 게엔비아 얏토 미츠케타 챠카다\n오레가 우마레타 쥰토이세 소레와 @@니 세바루티\n오레토 잇쇼니 바모스가레라 세카이데 이치방 안티아모' },

  { id: 'menhera', name: '멘헤라 코죠', category: 'mid', isOfficial: true,
    tokens: ['이이타이 코토가', '모라하라', 'DV', '스토커', '스키스키', '아이시테네'],
    text: '이이타이 코토가 아룬다요! 모라하라 DV 스토커!\n스키스키 다이스키 못토시테! 멘헤라 코죠 고잇쇼니\n와타시가 우마레테 키타 리유 오모타이 아이오 모라우 타메\n와타시토 잇쇼니 케에야쿠 카와소 세카이데 이치방 아이시테네?\n아. 이. 시. 테. 네' },

  { id: 'kaben-sanren', name: '가변산렌 믹스', category: 'mid', isOfficial: true,
    tokens: ['진조', '화이야', '화이보', '와이파', '타이가', '챠페아페', '카라키나', '묘혼투스케', '이엣타이가'],
    text: '진조 화이야 화이보 와이파 타이가 타이가 타타타타 타이가\n챠페아페 카라키나 챠페아페 카라키나 묘혼투스케! 👏 와이파!\n화이야 화이야 토라토라 카라키나 챠페아페 화마 아마아마 자스파\n토라타이가 토라타이가 진조 셍이 이엣타이가!' },

  { id: 'chikipa', name: '치키파 믹스', category: 'mid', isOfficial: true,
    tokens: ['라이온', '토라', '치타', '라토라타', '사이', '고릴라', '죠', '사고죠', '캡사이신', '싯떼루', '시보칸'],
    text: '라이온 토라 치타! 라토라타 라토라타!\n사이 고릴라 죠! 사고죠~ 사고죠~\n에요(에요) 에요(에요) 에요(에요) 에요(에요) 캡사이신테 싯떼루?\n에요 카타테 시보칸!' },

  { id: 'chikipa-donguri', name: '동구리타케시 치키파 믹스', category: 'mid', isOfficial: true,
    tokens: ['사이', '판다', '하시비로코', '우에노', '도부츠엔'],
    text: '사이! 판다! 하시비로코! 우에노 도부츠엔노 라인업푸!' },

  { id: 'hayashi', name: '하야시오사무 믹스', category: 'mid', isOfficial: true,
    tokens: ['우랴오이', '마다 이카나이', '이마데쇼', '자 이쿠죠', '타이가', '화이야', '사이바', '자자'],
    text: '우랴오이 우랴오이 우랴오이 우랴오이 아 마다 이카나이\n우랴오이 우랴오이 우랴오이 우랴오이 아 마다 이카나이\n이츠 이쿠노 이마데쇼 👏👏👏👏👏 자 이쿠죠\n타이가 화이야 사이바 화이바 다이바 바이바 자자' },

  { id: 'takemei', name: '타케밍오리지널퍼펙트믹스', category: 'mid', isOfficial: true,
    tokens: ['자자', '화이보', '와이파', '헤루테이', '카이자', '바모스', '이자나기', '이자나미', '라오후', '쥰토이세'],
    text: '자자 화이보 와이파 헤루테이 카이자 바모스 이자나기 이에\n이자나미 챠카다 소뮤 보라루 제고 화셴 라오후 쥰토이세' },

  { id: 'galaxy', name: '은하코죠', category: 'mid', isOfficial: true,
    tokens: ['히카리노고토쿠', '카케메구루', '스키쟈네', '아이시테루'],
    text: '히카리노고토쿠 카케메구루 스키쟈네 아이시테루' },

  { id: 'accele', name: '앗체레 종막 쟈파 가변', category: 'mid', isOfficial: true,
    tokens: ['노죠', '마이', '우미우', '쵸', '죠쿄토비캇센', '토라히', '아마신', '아마셍', '진조히'],
    text: '노죠 마이 우미우 쵸 죠쿄토비캇센신도 아마셍이진조히\n토라 히 토라 히 토라토라토라토라\n토라히진조셍이아마신도\n아마신 아마신 아마신도\n아마셍 아마셍 진조히 토라히진조셍이 아마 신도\n캇센 토비 죠쿄 쵸 우미우 마이 노죠' },

  { id: 'accele-ex', name: '앗체레 종막 쟈파 가변 극의', category: 'mid', isOfficial: true,
    tokens: ['노죠', '마이', '우미우', '쵸', '죠쿄토비캇센', '토라히', '아마신', '고쿠이', '타마시', '덴쇼'],
    text: '노죠 마이 우미우 쵸 죠쿄토비캇센신도 아마셍이진조히\n토라 히 토라 히 토라토라토라토라\n토라히진조셍이아마신도\n아마신 아마신 아마신도\n아마셍 아마셍 진조히 토라히진조셍이 아마 신도\n캇센 토비 죠쿄 츄지츠 세츠나 토키 고요 신즈이\n고쿠이 타마시 덴쇼' },

  { id: 'shujo', name: '슈죠 코죠', category: 'mid', isOfficial: true,
    tokens: ['감바레', '데키루', '다메다메', '아키라메챠', '이노치오', '후지산다'],
    text: '감바레 감바레 데키루 데키루 다메다메 다메다메 아키라메챠\n@@@니 이노치오 카케루 소 오레니 츠이테 코이\n세켄와 사, 츠메테요 데모 와캇테쿠레루 히토와이루\ndon\'t worry be haapy 쿄카라 오마에와 후지산다' },

  { id: 'matsutaka', name: '마츠타카코토츠나가리타이가 코죠', category: 'mid', isOfficial: true,
    tokens: ['츠나가리타이', '마츠타카코토', '팡팡', '포켓몬 팡', '야마자키하루노'],
    text: '츠나가리타이 츠나가리타이 마츠타카코토 츠나가리타이\n츠나가리타이 츠나가리타이 츠나가리타이카라 팡팡 이쿠요\n팡 팡 팡 팡 포켓몬 팡 후렛시 브렛도 이토팡\n마츠타카코 오레노 마츠타카코 오레노 야마자키하루노 팡마츠리' },

  { id: 'starwars', name: '스타워즈 믹스', category: 'mid', isOfficial: true,
    tokens: ['화루콘', '미레니아무', 'C3PO', 'R2D2', '다스 베에다', '스카이워카', '한소로레이아', '츄밧카'],
    text: '화루콘 화루콘 화루콘 화루콘 아 미레니아무\n타이화이 타이화이 타이화이타 시스노 후쿠슈우 이엣타이가\nC3PO R2D2 메이자훠스 비위즈유\n다스 베에다 (오레노) 스카이워카 (오레노) 파루파팃테 싯테루\n한소로레이아 츄밧카' },

  { id: 'cheonrian', name: '천리안 믹스', category: 'mid', isOfficial: true,
    tokens: ['이후', '잇센', '에이치', '텐라이', '레이메이', '카가리비', '센리간'],
    text: '이후 잇센 에이치 에이고 쿠온 소우큐 텐라이\n레이메이 카가리비 긴레이 우타카타 코우츠 쿠로가네 요모스가라\n세이엔 이다텐 하나노엔 헤키레키 사미다레 센리간' },

  { id: 'unchi', name: '운치가변 믹스', category: 'mid', isOfficial: true,
    tokens: ['화이보', '와이파', '와와와와', '화마', '자스파', '화이파', '쿠파', '라이가', '도라이바', '스토라이파'],
    text: '화이보 와이파 와와와와 와이파 화마 자스파 자자자자 자스파\n화이파 쿠파 쿠쿠쿠쿠 쿠파 이에스쿠레이파 이에 이에스쿠레이파\n라이가 화이타 라라라라 라이가 사이다 화인다 사사사사 사이다\n도라이바 베이베 도도도도 도라이바 자자 자자 바리바리보\n스토스토스토스토 스토라이파' },

  { id: 'yami-unchi', name: '야미 운치', category: 'variant', isOfficial: true,
    tokens: ['라이가', '화이타', '라라라라', '사이다', '도라이바', '바리바리보', '스토라이파'],
    text: '라이가 파이타 라라라라 라이가! 사이다 화인다 사사사사 사이다!\n도라이바 베이베! 도도도도 도라이바! 자자! 자자! 바리바리보!\n스토스토스토스토 스토라이파!' },

  { id: 'dp-mukonya', name: 'DP무코냐 코죠 (포켓몬 DP 코죠)', category: 'mid', isOfficial: true,
    tokens: ['난다칸다', '히카리노', '카제요', '다이치요', '오오조라요', '무사시', '코지로우', '냐스', '로켓토단'],
    text: '난다칸다노 코에오 키키 히카리노 하야사데 얏테키타\n카제요 다이치요 오오조라요 세카이니 토도케요 단쟈라스\n우츄우니 츠타에요 쿠라이시스 텐시카 아쿠마카 소노나오 요메바\n다레모가 후루에루 미와쿠노 히비키 무사시 코지로우 냐스데 냐스\n지다이노 슈야쿠와 아타시타치 와레라 무테키노 로켓토단' },

  // ── 언어 계열 ───────────────────────────────────────────────────────────
  { id: 'doits-cancel', name: '도이츠캔슬+이탈리아어', category: 'lang', isOfficial: true,
    tokens: ['게엔비아', '티거', '호이엘', '쿤스트', '휘바', '캔슬', '안티아모', '티구레', '포코', '레플리칸테'],
    text: '게엔비아\n티거 호이엘 쿤스트 휘바 (캔슬)\n(캔슬) 게엔비아\n티거 호이엘 (캔슬) 👏👏👏👏👏 안티아모\n티구레 포코 레플리칸테 휘브라 바론바로 비브라멘토 테크노보라레 아스트랏시오네' },

  { id: 'doits-ura', name: '도이츠캔슬+우라도이츠+우라스페 (24소절)', category: 'lang', isOfficial: true,
    tokens: ['게엔비아', '티거', '호이엘', '쿤스트', '휘바', '캔슬', '바모스', '티구레', '훼고', '마라비쟈스'],
    text: '게엔비아\n티거 호이엘 쿤스트 휘바 (캔슬)\n(캔슬) 게엔비아\n티거 호이엘 쿤스트 휘바 👏👏👏👏👏 바모스\n티구레 훼고 시베루 피브라 부조 비브라루 시레나 디오사\n나비다 레노 앙헤르 세니시엔타 에스판시온 파이스데라스 마라비쟈스' },

  { id: 'doits-3', name: '도이치 3연 (도이치어 믹스)', category: 'lang', isOfficial: true,
    tokens: ['티거', '포이엘', '쿤스트', '피버', '타우쳐', '슈빙구', '칼 하인츠 슈나이더'],
    text: '티거! 포이엘! 쿤스트! 피버!\n타우쳐! 슈빙구! 훼미화자! 휘리겐!\n바자티건! 제윤구화! 게틴! 봐이나하텐!\n앗셴풋텔! 분다란드! 훈케! 후란메!\n포라-스셰테룬! 푸레야-덴! 헤르만칼츠!\n칼 하인츠 슈나이더!' },

  { id: 'portuguese', name: '포르투갈어 믹스', category: 'lang', isOfficial: true,
    tokens: ['바모스카레라', '디구루', '포크', '아루치휘샤루', '피브라', '페스카도라', '에쿠스쿠루일'],
    text: '(발동) 바모스카레라!\n디구루 포크 아루치휘샤루 피브라\n페스카도라 뷔브라사오 아루고다오\n보아루 에쿠스쿠루일!' },

  { id: 'portuguese-rev', name: '역포르투갈어 믹스', category: 'lang', isOfficial: true,
    tokens: ['에쿠스쿠루일', '보아루', '페스카도라', '디구루', '바모스카레라'],
    text: '(발동) 에쿠스쿠루일!\n보아루 아루고다오 뷔브라사오 페스카도라\n피브라 아루치휘샤루 포크\n디구루 바모스카레라!' },

  { id: 'ura-spe-rev', name: '역우라스페', category: 'lang', isOfficial: true,
    tokens: ['마라비쟈스', '파이스데라스', '에스판시온', '세니시엔타', '나비다', '바모스'],
    text: '(발동) 마라비쟈스!\n파이스데라스 에스판시온 세니시엔타 앙헤르 레노\n나비다 디오사 시레나 비브라루 부조 피브라\n훼고 티구레 바모스!' },

  // ── 변종/기타 ───────────────────────────────────────────────────────────
  { id: 'takemei-orig', name: '타케밍 오리지널', category: 'variant', isOfficial: true,
    tokens: ['자자', '화이보', '와이파', '헤루세이', '카이저', '바모스', '이자나기', '이자나미'],
    text: '자자! 화이보! 와이파! 헤루세이!\n카이저! 바모스! 이자나기! 이엣 이자나미!' },

  { id: 'hanabi', name: '하나비 믹스', category: 'variant', isOfficial: true,
    tokens: ['키쿠', '보탄', '타키', '하치', '센린', '요우라쿠', '카무로기쿠'],
    text: '고! 욘! 산니이치!\n키쿠! 보탄! 타키! 하치!\n센린 요우라쿠 카무로기쿠!' },

  { id: 'hanaarashi', name: '하나아라시 믹스', category: 'variant', isOfficial: true,
    tokens: ['사쿠라', '츠바키', '아야메', '쿠로유리', '카에데', '스이렌', '카키츠바타'],
    text: '사쿠라! 츠바키! 아야메! 쿠로유리!\n카에데! 스이렌카키츠바타!' },

  { id: 'iroha-mix', name: '이로하우타 믹스', category: 'variant', isOfficial: true,
    tokens: ['텐카무소노', '오타케비데', '요우카란만', '쿄란레이부노', '아이노 하나'],
    text: '텐카무소노 오타케비데\n요우카란만 사키마코레\n쿄란레이부노 나노모토니\n사가세테 미세요 아이노 하나' },

  { id: 'iroha-ko', name: '이로하우타 코죠', category: 'variant', isOfficial: true,
    tokens: ['이로하니', '오에도', '와가요', '다레조', '츠네나란', '아사키', '요이모세즈'],
    text: '이로하니 오에도 치리누루오\n와가요 다레조 츠네나란\n우이노 오쿠야마 쿄우 코에테\n아사키 유메미지 요이모세즈\n텐카모소노 오타케비데\n고노 요가 오와루 소노히마데\n쿄란레이부노 나노모토니\n사가세테 미세마스 아이노 하나' },

  { id: 'jeonjo', name: '전조 믹스', category: 'variant', isOfficial: true,
    tokens: ['텐쵸스루죠', '라스사비', '텐쵸'],
    text: '테! 테! 테! 테! 테! 테! 텐쵸스루죠!\n테! 테! 테! 테! 테! 테! 텐쵸스루죠!\n텐쵸! 텐쵸! 텐쵸! 텐쵸! 텐쵸! 텐쵸! 텐쵸스루죠!\n라스사비 텐쵸~!' },

  { id: 'inazuma', name: '이나즈마 일레븐 믹스', category: 'variant', isOfficial: true,
    tokens: ['키타 키타 키타 키타', '도라이브', '토네이도', '이엣타이가', '데스 스피어', '스토라이커', '이그니션'],
    text: '키타 키타 키타 키타 굿또 키타 타이가 타이가 타이가 도라이브\n화이야 화이야 토네이도 이카리노 텟츠이 이엣타이가!\n자자 자자 데스 스피어 스토 스토 스토 스토라이커\n키라 필즈 곳또 브레이크 그란도 화이야 이그니션!' },

  { id: 'tokiori', name: '토키오리 머메이드 믹스', category: 'variant', isOfficial: true,
    tokens: ['죠쿄', '토비', '캇센', '신도', '아마', '셍이', '토라히진조셍이', '우미우', '마이', '노죠'],
    text: '죠쿄! 토비! 캇센! 신도! 아마! 셍이! 신도진조히!\n토라! 히! 토라! 히! 죠쿄죠쿄죠쿄죠쿄!\n토라히진조셍이! 아마! 신도! 캇센! 토비! 죠쿄! 쵸! 우미우! 마이! 노죠!' },

  { id: 'wakage', name: '와카게노 이타리', category: 'variant', isOfficial: true,
    tokens: ['와카게노', '이타리', '겡끼요사'],
    text: '와카게노~ 이타리토~\n이완 바카리노 겡끼요사, 아이!' },

  { id: 'tsunagari', name: '쯔나가리 타이가', category: 'variant', isOfficial: true,
    tokens: ['쯔나가리 타이', '###', '쯔나가리 타이가', '화이야', '사이바', '자자', '화이보'],
    text: '쯔나가리 타이! 쯔나가리 타이! 얏빠리 ###또 쯔나가리 타이!\n쯔나가리 타이! 쯔나가리 타이! 쯔나가리타이까라 쯔나가리 타이가!\n화이야! 사이바! 파이바 다이바! 바이바! 자자! 화이보! 인죠! 자스파! 비브라루! 캇센! 이엣 나루다 화보리아스파!' },

  { id: 'motto', name: '못또 못또', category: 'variant', isOfficial: true,
    tokens: ['아이 캔 플라이', '유 캔 플라이', '위 캔 플라이', '못또못또'],
    text: '아이 캔 플라이! 유 캔 플라이!\n위 캔 플라이! 못또못또! (반복)' },

  { id: 'punpuku', name: '푼푸쿠 사무라이', category: 'variant', isOfficial: true,
    tokens: ['푼푸쿠', '사무라이', '돗치 이쿠', '서쿠루 케이'],
    text: '푼푸쿠 사무라이 돗치 이쿠\n푼푸쿠 사무라이 돗치 이쿠\n푼푸쿠 사무라이 돗치 이쿠\n푼푸쿠 사무라이 서쿠루 케이!' },

  { id: 'ittai', name: '일체대 믹스', category: 'variant', isOfficial: true,
    tokens: ['렛츠고', '닛타이다이', '닛타다이', '후'],
    text: '렛츠고 닛타이다이\n닛타다이 닛타다이 닛타다이 후!\n닛타다이 닛타다이 닛타다이 후!\n닛타다이 닛타다이 닛타다이 후!\n렛츠고 닛타이다이!' },

  { id: 'standard-rev2', name: '스탠다드 배속 역배속', category: 'variant', isOfficial: true,
    tokens: ['타이가화이야사이바파이바다이바바이바자자', '역배속'],
    text: '타이가화이야사이바파이바다이바바이바자자!\n자자바이바다이바파이바사이바화이야타이가!' },

  { id: 'jpn-speed-rev2', name: '일본어 배속 역배속', category: 'variant', isOfficial: true,
    tokens: ['토라히진조셍이아마신도캇센', '역배속'],
    text: '토라히진조셍이아마신도캇센토비죠쿄토비캇센신도아마셍이진조히!' },
]

// 토큰 텍스트로 검색 — 이름 + 토큰 내용 둘 다
export function getSuggestions(query: string): MixPreset[] {
  if (!query.trim()) return []
  const q = query.trim().toLowerCase().replace(/\s/g, '')
  return MIX_DB.filter(mix =>
    mix.name.toLowerCase().replace(/\s/g, '').includes(q) ||
    mix.tokens.some(t => t.toLowerCase().replace(/\s/g, '').includes(q))
  ).slice(0, 8)
}

export function getNextTokens(query: string, currentTokens: string[] = []): string[] {
  const results: string[] = []
  const q = query.trim().toLowerCase().replace(/\s/g, '')

  // 현재 입력값으로 매칭
  if (q) {
    const seen = new Set<string>()
    MIX_DB.forEach(mix => {
      mix.tokens.forEach((token, idx) => {
        const t = token.toLowerCase().replace(/\s/g, '')
        if (t.includes(q) && !seen.has(token)) {
          seen.add(token)
          results.push(token)
          if (idx + 1 < mix.tokens.length && !seen.has(mix.tokens[idx + 1])) {
            seen.add(mix.tokens[idx + 1])
            results.push(mix.tokens[idx + 1])
          }
        }
      })
    })
  }

  // 마지막 선택 토큰 기준 다음 추천 (중복 허용 — 우랴오이x4 같은 경우)
  if (currentTokens.length > 0) {
    const lastToken = currentTokens[currentTokens.length - 1].toLowerCase().replace(/\s/g, '')
    const nextCandidates: string[] = []
    MIX_DB.forEach(mix => {
      mix.tokens.forEach((token, idx) => {
        const t = token.toLowerCase().replace(/\s/g, '')
        if (t === lastToken && idx + 1 < mix.tokens.length) {
          const next = mix.tokens[idx + 1]
          if (!nextCandidates.includes(next)) nextCandidates.push(next)
        }
      })
    })
    nextCandidates.forEach(c => {
      if (!results.includes(c)) results.push(c)
    })
  }

  return results.slice(0, 10)
}