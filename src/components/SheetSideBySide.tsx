import { Fragment } from 'react'
import { Block, ReferenceVideo } from '@/types'
import BlockNote from '@/components/BlockNote'
import SideFontSize from '@/components/SideFontSize'
import SectionLabel from '@/components/SectionLabel'
import { getBlockNote } from '@/lib/blockNote'
import { isBlankLyricLine, trimBlankLyricLines } from '@/lib/lyricLines'
import { SECTION_BADGE_CLASS, getSectionCategory } from '@/lib/sectionLabels'
import { getSectionTime } from '@/lib/sectionTime'
import { getSectionVideoId, parseYouTubeUrl } from '@/lib/youtube'

const MIX_CLASS = 'side-mix text-red-600 font-bold text-[11px] sm:text-xs leading-snug whitespace-pre-wrap break-words'

// 가사에 붙지 않은 믹스(구간 믹스, 믹스 블록): 모바일에선 두 칸 전체 폭, sm 이상에선 오른쪽 칸
// (좁은 오른쪽 칸에 긴 믹스가 몰려 세로로 길어지는 것을 막는다)
const STANDALONE_LEFT_CLASS = 'hidden sm:block min-w-0'
const STANDALONE_MIX_CLASS = 'col-span-2 sm:col-span-1 min-w-0 mb-1'

// 공백, 탭, 전각 공백, 점자 공백, 한글 채움 문자
const LEADING_BLANKS = /^[\s　⠀ㅤ]+/

function MixText({ text, alternatives }: { text?: string; alternatives?: { id: string; text: string }[] }) {
  return (
    <>
      {text && <p className={MIX_CLASS}>{text}</p>}
      {(alternatives ?? []).map(alt => (
        <div key={alt.id} className="mt-1">
          <span className="side-mix-alt-label text-[10px] font-bold text-orange-400">또는</span>
          <p className={MIX_CLASS}>{alt.text}</p>
        </div>
      ))}
    </>
  )
}

// 나란히 보기: 왼쪽 가사, 오른쪽 콜/믹스를 행 단위로 맞춘다 (서버/클라이언트 공용)
export default function SheetSideBySide({ blocks, referenceVideos }: {
  blocks: Block[]
  referenceVideos?: ReferenceVideo[]
}) {
  const sheetVideoId = referenceVideos?.map(v => parseYouTubeUrl(v.url)?.id).find(Boolean) ?? null

  return (
    <SideFontSize>
    <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-x-3 sm:gap-x-4">
      {blocks.map(block => {
        const note = getBlockNote(block).trim()
        return (
          <Fragment key={block.id}>
            {block.type === 'interlude' && (
              <>
                <div data-block-id={block.id} className="col-span-2 min-w-0 mt-3 first:mt-0 mb-1">
                  <SectionLabel
                    blockId={block.id}
                    label={block.label}
                    comment={block.comment}
                    badgeClass={SECTION_BADGE_CLASS[getSectionCategory(block.label)]}
                    time={getSectionTime(block)}
                    videoId={getSectionVideoId(block, sheetVideoId)}
                  />
                </div>
                {(block.text || (block.alternatives ?? []).length > 0) && (
                  <>
                    <div className={STANDALONE_LEFT_CLASS} />
                    <div className={STANDALONE_MIX_CLASS}>
                      <MixText text={block.text} alternatives={block.alternatives} />
                    </div>
                  </>
                )}
              </>
            )}
            {block.type === 'lyric' && (
              <>
                {trimBlankLyricLines(block.lines).map(line => {
                  if (isBlankLyricLine(line)) {
                    return <div key={line.id} aria-hidden="true" className="col-span-2 h-3" />
                  }
                  const mix = line.mix ? line.mix.replace(LEADING_BLANKS, '') : ''
                  return (
                    <Fragment key={line.id}>
                      <div className="min-w-0 mb-1">
                        {(line.jp || line.ko) && (
                          <p className="side-lyric text-gray-900 font-medium text-xs sm:text-sm leading-snug whitespace-pre-wrap break-words">
                            {line.jp || line.ko}
                          </p>
                        )}
                        {line.jp && line.hira && (
                          <p className="side-sub text-gray-400 text-[11px] sm:text-xs leading-snug whitespace-pre-wrap break-words">{line.hira}</p>
                        )}
                        {line.jp && line.ko && (
                          <p className="side-sub text-blue-500 text-[11px] sm:text-xs font-medium leading-snug whitespace-pre-wrap break-words">{line.ko}</p>
                        )}
                      </div>
                      <div className="min-w-0 mb-1">
                        {mix && <p className={MIX_CLASS}>{mix}</p>}
                      </div>
                    </Fragment>
                  )
                })}
                <div aria-hidden="true" className="col-span-2 h-2" />
              </>
            )}
            {block.type === 'mix' && (
              <>
                <div className={STANDALONE_LEFT_CLASS} />
                <div className={STANDALONE_MIX_CLASS}>
                  <MixText text={block.text} alternatives={block.alternatives} />
                </div>
                <div aria-hidden="true" className="col-span-2 h-2" />
              </>
            )}
            {block.type === 'performance' && (
              <>
                <div className="min-w-0" />
                <div className="min-w-0 mb-1">
                  <span className="side-perf inline-block text-[11px] sm:text-xs font-bold text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded">
                    {block.performanceType === '기타' && block.customLabel
                      ? block.customLabel
                      : block.performanceType}
                  </span>
                </div>
              </>
            )}
            {note && (
              <div className="col-span-2 min-w-0 mb-1">
                <BlockNote note={note} />
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
    </SideFontSize>
  )
}
