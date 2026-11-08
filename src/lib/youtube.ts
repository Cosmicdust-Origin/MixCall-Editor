// YouTube URL 파싱과 임베드 제어 헬퍼

function parseYouTubeStartSeconds(u: URL): number | undefined {
  const rawTime = u.searchParams.get('t') ?? u.searchParams.get('start') ?? u.hash.match(/(?:^#|[&#])t=([^&]+)/)?.[1]
  if (!rawTime) return undefined

  const value = rawTime.trim().toLowerCase()
  if (/^\d+$/.test(value)) return Number(value)

  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/)
  if (!match) return undefined

  const hours = Number(match[1] ?? 0)
  const minutes = Number(match[2] ?? 0)
  const seconds = Number(match[3] ?? 0)
  const total = hours * 3600 + minutes * 60 + seconds
  return total > 0 ? total : undefined
}

export function parseYouTubeUrl(url: string): { id: string; start?: number } | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace('www.', '')
    if (host !== 'youtube.com' && host !== 'youtu.be') return null

    let videoId: string | null = null
    if (host === 'youtu.be') {
      videoId = u.pathname.slice(1).split('?')[0]
    } else if (u.pathname === '/watch') {
      videoId = u.searchParams.get('v')
    } else if (u.pathname.startsWith('/shorts/')) {
      videoId = u.pathname.replace('/shorts/', '').split('?')[0]
    } else if (u.pathname.startsWith('/embed/')) {
      videoId = u.pathname.replace('/embed/', '').split('?')[0]
    }
    if (!videoId) return null
    return { id: videoId, start: parseYouTubeStartSeconds(u) }
  } catch {
    return null
  }
}

// 페이지의 다른 YouTube 임베드를 일시정지 (enablejsapi=1 인 iframe에만 먹힌다)
export function pauseOtherYouTubeEmbeds(except?: HTMLIFrameElement | null) {
  document.querySelectorAll<HTMLIFrameElement>('iframe[src*="youtube.com/embed/"]').forEach(iframe => {
    if (iframe === except) return
    iframe.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
      'https://www.youtube.com',
    )
  })
}

// 콜표 대표 영상: 참고영상 중 첫 YouTube 링크 (start는 링크의 시작 시각, 없으면 0)
export function getSheetSectionVideo(videos: { url: string }[] | undefined): { id: string; start: number } | null {
  for (const video of videos ?? []) {
    const parsed = parseYouTubeUrl(video.url)
    if (parsed) return { id: parsed.id, start: parsed.start ?? 0 }
  }
  return null
}

// 구간 블록의 재생 영상: 블록 자신의 유튜브 링크 → 콜표 대표 영상 순
export function getSectionVideoId(block: { referenceUrl?: string }, sheetVideoId: string | null): string | null {
  return (block.referenceUrl ? parseYouTubeUrl(block.referenceUrl)?.id : null) ?? sheetVideoId
}
