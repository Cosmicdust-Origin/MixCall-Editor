'use client';

import { useMemo } from 'react';

interface VideoEmbedProps {
  url: string;
  label?: string;
  compact?: boolean; // 블록 내부용 소형 표시
}

// ─── URL 파싱 유틸 ────────────────────────────────────────────

function parseUrl(url: string): { type: 'youtube' | 'twitter' | 'other'; id?: string } {
  try {
    const u = new URL(url);
    const host = u.hostname.replace('www.', '');

    // YouTube
    if (host === 'youtube.com' || host === 'youtu.be') {
      let videoId: string | null = null;
      if (host === 'youtu.be') {
        videoId = u.pathname.slice(1).split('?')[0];
      } else if (u.pathname === '/watch') {
        videoId = u.searchParams.get('v');
      } else if (u.pathname.startsWith('/shorts/')) {
        videoId = u.pathname.replace('/shorts/', '').split('?')[0];
      } else if (u.pathname.startsWith('/embed/')) {
        videoId = u.pathname.replace('/embed/', '').split('?')[0];
      }
      if (videoId) return { type: 'youtube', id: videoId };
    }

    // Twitter / X
    if (host === 'twitter.com' || host === 'x.com') {
      return { type: 'twitter' };
    }

    return { type: 'other' };
  } catch {
    return { type: 'other' };
  }
}

// ─── 컴포넌트 ─────────────────────────────────────────────────

export default function VideoEmbed({ url, label, compact = false }: VideoEmbedProps) {
  const parsed = useMemo(() => parseUrl(url), [url]);

  if (parsed.type === 'youtube' && parsed.id) {
    return (
      <div className={compact ? 'mt-2' : 'mt-3'}>
        {label && (
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <span>🎬</span>
            <span>{label}</span>
          </p>
        )}
        {compact ? (
          // 블록 내부용: 링크 카드만 표시 (임베드는 에디터 무거워짐)
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-red-400 hover:text-red-300 
                       bg-red-950/30 border border-red-900/40 rounded px-2 py-1 transition-colors"
          >
            <YouTubeIcon />
            <span className="truncate max-w-[200px]">{url}</span>
            <ExternalLinkIcon />
          </a>
        ) : (
          // 상세 페이지용: 풀 임베드
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${parsed.id}`}
              title={label ?? 'YouTube 참고영상'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    );
  }

  if (parsed.type === 'twitter') {
    return (
      <div className={compact ? 'mt-2' : 'mt-3'}>
        {label && (
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <span>🔗</span>
            <span>{label}</span>
          </p>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-sky-400 hover:text-sky-300 
                     bg-sky-950/30 border border-sky-900/40 rounded px-2 py-1 transition-colors"
        >
          <XIcon />
          <span className="truncate max-w-[240px]">{url}</span>
          <ExternalLinkIcon />
        </a>
      </div>
    );
  }

  // 기타 링크
  return (
    <div className={compact ? 'mt-2' : 'mt-3'}>
      {label && (
        <p className="text-xs text-gray-400 mb-1">🔗 {label}</p>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-300 
                   bg-gray-800/40 border border-gray-700/40 rounded px-2 py-1 transition-colors"
      >
        <span className="truncate max-w-[240px]">{url}</span>
        <ExternalLinkIcon />
      </a>
    </div>
  );
}

// ─── 아이콘 ──────────────────────────────────────────────────

function YouTubeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.6 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.3.6 9.3.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.3 5.7L13.1 12l5.2 6.3h-2.4L12 13.3l-3.9 5H5.7l5.2-6.3L5.7 5.7h2.4l3.7 4.6 3.7-4.6h2.8z"/>
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15,3 21,3 21,9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}
