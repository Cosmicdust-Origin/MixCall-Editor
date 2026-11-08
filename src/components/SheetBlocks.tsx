import { Block, InterludeBlock, ReferenceVideo } from '@/types'
import BlockNote from '@/components/BlockNote'
import SectionLabel from '@/components/SectionLabel'
import SheetSideBySide from '@/components/SheetSideBySide'
import SheetSummary from '@/components/SheetSummary'
import VideoEmbed from '@/components/VideoEmbed'
import { getBlockNote } from '@/lib/blockNote'
import { isBlankLyricLine, trimBlankLyricLines } from '@/lib/lyricLines'
import { SECTION_BADGE_CLASS, getSectionCategory } from '@/lib/sectionLabels'
import { getSectionTime } from '@/lib/sectionTime'
import { SheetView } from '@/lib/sheetSections'
import { getSectionVideoId, parseYouTubeUrl } from '@/lib/youtube'

const isLabelOnlyInterlude = (block: Block): block is InterludeBlock =>
  block.type === 'interlude' && !block.text?.trim() && !(block.alternatives ?? []).length

// 공개 콜표와 에디터 미리보기가 함께 쓰는 블록 렌더러 (서버/클라이언트 공용)
export default function SheetBlocks({ blocks, referenceVideos, view = 'full' }: {
  blocks: Block[]
  referenceVideos?: ReferenceVideo[]
  view?: SheetView
}) {
  if (view === 'side') return <SheetSideBySide blocks={blocks} referenceVideos={referenceVideos} />
  if (view !== 'full') return <SheetSummary blocks={blocks} referenceVideos={referenceVideos} view={view} />

  // 구간 라벨 탭 시 재생할 콜표 대표 영상 (첫 번째 유튜브 링크)
  const sheetVideoId = referenceVideos?.map(v => parseYouTubeUrl(v.url)?.id).find(Boolean) ?? null

  return (
    <>
      {blocks.map(block => (
        // 내용 없는 간주(라벨만)는 바로 아래 블록과 4px만 띄운다
        <div
          key={block.id}
          data-block-id={block.id}
          className={isLabelOnlyInterlude(block) ? 'mb-1' : 'mb-4'}
        >
          {block.type === 'lyric' && trimBlankLyricLines(block.lines).map(line => {
            // 빈 줄은 가사 한 줄(높이 + 여백)만큼의 간격으로 표시
            if (isBlankLyricLine(line)) {
              return (
                <div key={line.id} aria-hidden="true" className="mb-0.5 text-sm leading-relaxed">&nbsp;</div>
              )
            }
            if (!(line.jp || line.ko || line.mix)) return null
            return (
              <div key={line.id} className="mb-0.5">
                {(line.jp || line.ko) && (
                  <p className="text-gray-900 font-medium text-sm leading-relaxed whitespace-pre-wrap">
                    {line.jp || line.ko}
                  </p>
                )}
                {line.jp && line.hira && (
                  <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-wrap">{line.hira}</p>
                )}
                {line.jp && line.ko && (
                  <p className="text-blue-500 text-xs font-medium leading-relaxed whitespace-pre-wrap">{line.ko}</p>
                )}
                {line.mix && (
                  <p className="text-red-600 font-bold text-xs leading-relaxed whitespace-pre-wrap">{line.mix}</p>
                )}
              </div>
            )
          })}
          {block.type === 'mix' && (
            <div>
              {block.text && (
                <p className="text-red-600 font-bold text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {block.text}
                </p>
              )}
              {(block.alternatives ?? []).map(alt => (
                <div key={alt.id} className="mt-1">
                  <span className="text-xs font-bold text-orange-400">또는</span>
                  <p className="text-red-600 font-bold text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {alt.text}
                  </p>
                </div>
              ))}
            </div>
          )}
          {block.type === 'interlude' && (
            <div className="mt-2">
              <SectionLabel
                blockId={block.id}
                label={block.label}
                comment={block.comment}
                badgeClass={SECTION_BADGE_CLASS[getSectionCategory(block.label)]}
                time={getSectionTime(block)}
                videoId={getSectionVideoId(block, sheetVideoId)}
              />
              {block.text && (
                <p className="text-red-600 font-bold text-xs sm:text-sm leading-relaxed whitespace-pre-wrap mt-1">
                  {block.text}
                </p>
              )}
              {(block.alternatives ?? []).map(alternative => (
                <div key={alternative.id} className="mt-1">
                  <span className="text-xs font-bold text-orange-400">또는</span>
                  <p className="text-red-600 font-bold text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {alternative.text}
                  </p>
                </div>
              ))}
            </div>
          )}
          {block.type === 'performance' && (
            <div className="my-2 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded">
                {block.performanceType === '기타' && block.customLabel
                  ? block.customLabel
                  : block.performanceType}
              </span>
            </div>
          )}
          <BlockNote note={getBlockNote(block)} />
          {block.referenceUrl && (
            <VideoEmbed url={block.referenceUrl} compact={false} />
          )}
        </div>
      ))}
    </>
  )
}
