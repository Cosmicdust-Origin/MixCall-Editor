import { Block, ReferenceVideo } from '@/types'
import SectionLabel from '@/components/SectionLabel'
import { SECTION_BADGE_CLASS, getSectionCategory } from '@/lib/sectionLabels'
import { getSectionTime } from '@/lib/sectionTime'
import { groupSheetSections } from '@/lib/sheetSections'
import { getSectionVideoId, parseYouTubeUrl } from '@/lib/youtube'

const MIX_CLASS = 'text-red-600 font-bold text-xs sm:text-sm leading-relaxed whitespace-pre-wrap'

// 믹스만 / 구간만 요약 보기 (서버/클라이언트 공용)
export default function SheetSummary({ blocks, referenceVideos, view }: {
  blocks: Block[]
  referenceVideos?: ReferenceVideo[]
  view: 'mix' | 'sections'
}) {
  const sheetVideoId = referenceVideos?.map(v => parseYouTubeUrl(v.url)?.id).find(Boolean) ?? null
  const groups = groupSheetSections(blocks).filter(g => g.hasContent && (view === 'mix' || g.section))

  if (groups.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-6">
        {view === 'mix' ? '믹스가 있는 구간이 없어요' : '표시할 구간이 없어요'}
      </p>
    )
  }

  return (
    <>
      {groups.map((group, index) => {
        const { section } = group
        return (
          <div key={section?.id ?? `pre-${index}`} className={view === 'mix' ? 'mb-4' : 'mb-2'}>
            {section && (
              <SectionLabel
                blockId={section.id}
                label={section.label}
                comment={section.comment}
                badgeClass={SECTION_BADGE_CLASS[getSectionCategory(section.label)]}
                time={getSectionTime(section)}
                videoId={getSectionVideoId(section, sheetVideoId)}
              />
            )}
            {view === 'mix' && group.items.map((item, i) => {
              if (item.kind === 'mix') {
                return (
                  <div key={i} className="mt-1">
                    {item.text && <p className={MIX_CLASS}>{item.text}</p>}
                    {item.alternatives.map((alt, j) => (
                      <div key={j} className="mt-1">
                        <span className="text-xs font-bold text-orange-400">또는</span>
                        <p className={MIX_CLASS}>{alt}</p>
                      </div>
                    ))}
                  </div>
                )
              }
              if (item.kind === 'lineMix') {
                return <p key={i} className={`mt-1 ${MIX_CLASS}`}>{item.text}</p>
              }
              return (
                <div key={i}>
                  <span className="inline-block my-0.5 text-xs font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded">
                    {item.label}
                  </span>
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
