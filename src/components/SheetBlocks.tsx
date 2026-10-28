import { Block } from '@/types'
import BlockNote from '@/components/BlockNote'
import VideoEmbed from '@/components/VideoEmbed'
import { getBlockNote } from '@/lib/blockNote'
import { isBlankLyricLine, trimBlankLyricLines } from '@/lib/lyricLines'

// 공개 콜표와 에디터 미리보기가 함께 쓰는 블록 렌더러 (서버/클라이언트 공용)
export default function SheetBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map(block => (
        <div key={block.id} className="mb-4">
          {block.type === 'lyric' && trimBlankLyricLines(block.lines).map(line => {
            // 빈 줄은 가사 한 줄(높이 + 여백)만큼의 간격으로 표시
            if (isBlankLyricLine(line)) {
              return (
                <div key={line.id} aria-hidden="true" className="mb-2 text-sm leading-relaxed">&nbsp;</div>
              )
            }
            if (!(line.jp || line.ko)) return null
            return (
              <div key={line.id} className="mb-2">
                <p className="text-gray-900 font-medium text-sm leading-relaxed whitespace-pre-wrap">
                  {line.jp || line.ko}
                </p>
                {line.jp && line.hira && (
                  <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-wrap">{line.hira}</p>
                )}
                {line.jp && line.ko && (
                  <p className="text-blue-500 text-xs font-medium leading-relaxed whitespace-pre-wrap">{line.ko}</p>
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
            <div className="my-2">
              <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                {block.label}
              </span>
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
