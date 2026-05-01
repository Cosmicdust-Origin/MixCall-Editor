'use client';

import { useState } from 'react';
import type { ReferenceVideo } from '@/types';

interface ReferenceVideoManagerProps {
  videos: ReferenceVideo[];
  onChange: (videos: ReferenceVideo[]) => void;
}

function isValidUrl(str: string) {
  try { new URL(str); return true; } catch { return false; }
}

function getUrlType(url: string): 'youtube' | 'twitter' | 'other' {
  try {
    const host = new URL(url).hostname.replace('www.', '');
    if (host === 'youtube.com' || host === 'youtu.be') return 'youtube';
    if (host === 'twitter.com' || host === 'x.com') return 'twitter';
  } catch { /* noop */ }
  return 'other';
}

const TYPE_STYLE = {
  youtube: 'bg-red-950/50 text-red-400 border-red-900/50',
  twitter: 'bg-sky-950/50 text-sky-400 border-sky-900/50',
  other:   'bg-gray-800/60 text-gray-400 border-gray-700',
};
const TYPE_LABEL = { youtube: '▶ YT', twitter: '✕ X', other: '🔗' };

export default function ReferenceVideoManager({ videos, onChange }: ReferenceVideoManagerProps) {
  const [open, setOpen] = useState(videos.length > 0);
  const [draftUrl, setDraftUrl] = useState('');
  const [draftLabel, setDraftLabel] = useState('');

  function addVideo() {
    const url = draftUrl.trim();
    if (!url || !isValidUrl(url)) return;
    onChange([...videos, { url, label: draftLabel.trim() || undefined }]);
    setDraftUrl('');
    setDraftLabel('');
  }

  function removeVideo(idx: number) {
    onChange(videos.filter((_, i) => i !== idx));
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
      >
        <span className="w-4 h-4 rounded-full border border-gray-600 hover:border-gray-400 
                         flex items-center justify-center transition-colors">+</span>
        곡 참고영상 추가
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">🎬 곡 참고영상</span>
        {videos.length === 0 && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            접기
          </button>
        )}
      </div>

      {/* 기존 목록 */}
      {videos.map((v, i) => {
        const t = getUrlType(v.url);
        return (
          <div key={i} className="flex items-center gap-2 group">
            <span className={`text-xs px-1.5 py-0.5 rounded border shrink-0 ${TYPE_STYLE[t]}`}>
              {TYPE_LABEL[t]}
            </span>
            <span className="text-xs text-gray-400 truncate flex-1 min-w-0">
              {v.label ? <><span className="text-gray-300">{v.label}</span> · </> : null}
              {v.url}
            </span>
            <button
              type="button"
              onClick={() => removeVideo(i)}
              className="text-gray-700 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 
                         transition-all shrink-0"
              aria-label="삭제"
            >
              ✕
            </button>
          </div>
        );
      })}

      {/* 추가 입력 */}
      <div className="flex flex-col gap-1.5 pt-1 border-t border-gray-800">
        <input
          type="url"
          value={draftUrl}
          onChange={e => setDraftUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addVideo()}
          placeholder="YouTube 또는 X 링크"
          className="w-full text-xs bg-transparent border-b border-gray-700 focus:border-gray-400 
                     outline-none py-0.5 text-gray-300 placeholder:text-gray-600 transition-colors"
        />
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={draftLabel}
            onChange={e => setDraftLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addVideo()}
            placeholder="메모 (선택 · 예: 공식 MV, 1절 믹스영상)"
            className="flex-1 text-xs bg-transparent border-b border-gray-700 focus:border-gray-400 
                       outline-none py-0.5 text-gray-500 placeholder:text-gray-600 transition-colors"
          />
          <button
            type="button"
            onClick={addVideo}
            disabled={!draftUrl || !isValidUrl(draftUrl)}
            className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 
                       disabled:opacity-30 disabled:cursor-not-allowed text-gray-200 
                       transition-colors shrink-0"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}
