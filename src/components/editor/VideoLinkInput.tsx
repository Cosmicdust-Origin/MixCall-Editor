'use client';

import { useState } from 'react';

interface VideoLinkInputProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

function isValidUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function getUrlType(url: string): 'youtube' | 'twitter' | 'other' | null {
  if (!isValidUrl(url)) return null;
  const host = new URL(url).hostname.replace('www.', '');
  if (host === 'youtube.com' || host === 'youtu.be') return 'youtube';
  if (host === 'twitter.com' || host === 'x.com') return 'twitter';
  return 'other';
}

export default function VideoLinkInput({ value = '', onChange, placeholder }: VideoLinkInputProps) {
  const [open, setOpen] = useState(!!value);
  const [draft, setDraft] = useState(value);

  const urlType = getUrlType(draft);
  const isValid = !!urlType;

  function handleBlur() {
    if (draft && isValid) {
      onChange(draft);
    } else if (!draft) {
      onChange('');
    }
  }

  function handleClear() {
    setDraft('');
    onChange('');
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 
                   transition-colors mt-2 group"
      >
        <span className="w-4 h-4 rounded-full border border-gray-600 group-hover:border-gray-400 
                         flex items-center justify-center text-[10px] transition-colors">
          +
        </span>
        참고영상 링크 추가
      </button>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      {/* 타입 배지 */}
      <span className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${
        urlType === 'youtube'
          ? 'bg-red-950/50 text-red-400 border border-red-900/50'
          : urlType === 'twitter'
          ? 'bg-sky-950/50 text-sky-400 border border-sky-900/50'
          : urlType === 'other'
          ? 'bg-gray-800 text-gray-400 border border-gray-700'
          : 'bg-gray-800/50 text-gray-600 border border-gray-800'
      }`}>
        {urlType === 'youtube' ? '▶ YT' : urlType === 'twitter' ? '✕ X' : urlType === 'other' ? '🔗' : '🔗'}
      </span>

      {/* 입력 */}
      <input
        type="url"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder ?? 'YouTube 또는 X 링크'}
        className="flex-1 text-xs bg-transparent border-b border-gray-700 focus:border-gray-400 
                   outline-none py-0.5 text-gray-300 placeholder:text-gray-600 min-w-0 transition-colors"
      />

      {/* 삭제 */}
      <button
        type="button"
        onClick={handleClear}
        className="text-gray-600 hover:text-gray-400 text-xs shrink-0 transition-colors"
        aria-label="링크 삭제"
      >
        ✕
      </button>
    </div>
  );
}
