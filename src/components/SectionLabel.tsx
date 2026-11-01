'use client'

import { useEffect, useState } from 'react'
import { formatTime } from '@/lib/sectionTime'
import { pauseOtherYouTubeEmbeds } from '@/lib/youtube'

const OPEN_EVENT = 'mixcall:section-player'

interface Props {
  blockId: string
  label: string
  badgeClass: string
  time: number | null
  videoId: string | null
}

// 구간 라벨 배지. 시각과 참고영상이 있으면 눌러서 그 시각부터 인라인 재생한다
export default function SectionLabel({ blockId, label, badgeClass, time, videoId }: Props) {
  const [open, setOpen] = useState(false)

  // 다른 구간이 열리면 이 구간은 닫는다 (한 번에 하나만 재생)
  useEffect(() => {
    const onOpen = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== blockId) setOpen(false)
    }
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_EVENT, onOpen)
  }, [blockId])

  if (time === null || videoId === null) {
    return <span className={`text-xs font-bold px-2 py-0.5 rounded ${badgeClass}`}>{label}</span>
  }

  const toggle = () => {
    if (open) {
      setOpen(false)
      return
    }
    window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: blockId }))
    // 새 iframe은 아직 마운트 전이라 페이지의 기존 임베드를 모두 멈추면 된다
    pauseOtherYouTubeEmbeds(null)
    setOpen(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={`${label} 구간 영상 ${open ? '닫기' : `${formatTime(time)}부터 재생`}`}
        className={`text-xs font-bold px-2 py-0.5 rounded ${badgeClass} inline-flex items-center gap-1 hover:opacity-80 transition-opacity`}
      >
        {label}
        <span className="font-normal opacity-80">{open ? '■ 닫기' : `▶ ${formatTime(time)}`}</span>
      </button>
      {open && (
        <div className="mt-2 mb-1">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?start=${time}&autoplay=1&playsinline=1&enablejsapi=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${label} 구간 영상`}
              className="absolute inset-0 w-full h-full rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  )
}
