'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Block, Language, LyricLine, ReferenceVideo } from '@/types'
import BlockList from '@/components/editor/BlockList'
import ReferenceVideoManager from '@/components/editor/ReferenceVideoManager'
import TagInput from '@/components/editor/TagInput'
import QuickInsertBar from '@/components/editor/QuickInsertBar'
import VideoEmbed from '@/components/VideoEmbed'
import SheetBlocks from '@/components/SheetBlocks'
import { getBlockNote } from '@/lib/blockNote'
import { PasteMode, trimBlankLyricLines } from '@/lib/lyricLines'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

type SheetTagResponse = {
  tag: {
    name: string
  }
}

type EditorDocument = {
  artistName: string
  songTitle: string
  songLang: 'ko' | 'jp' | null
  editorLanguage: Language
  isPublic: boolean
  blocks: Block[]
  referenceVideos: ReferenceVideo[]
  tags: string[]
}

type LocalDraft = {
  version: 1
  sheetId: string | null
  savedAt: string
  document: EditorDocument
}

type LanguageSwitchRequest = {
  from: Language
  to: Language
}

const DRAFT_PREFIX = 'mix-call-editor:draft:'
const PASTE_MODE_KEY = 'mix-call-editor:paste-mode'
const UNSAVED_MESSAGE = '저장하지 않은 변경사항이 있습니다. 페이지를 나갈까요?'

const getDraftKey = (sheetId: string | null) => `${DRAFT_PREFIX}${sheetId ?? 'new'}`
const serializeDocument = (document: EditorDocument) => JSON.stringify(document)

const createInitialBlocks = (): Block[] => [
  { id: crypto.randomUUID(), type: 'lyric', lines: [{ id: crypto.randomUUID(), jp: '', hira: '', ko: '' }] }
]

export default function EditorPage() {
  const router = useRouter()
  const [blocks, setBlocks] = useState<Block[]>(createInitialBlocks)
  const [language, setLanguage] = useState<Language>('jp')
  const [songTitle, setSongTitle] = useState('')
  const [artistName, setArtistName] = useState('')
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [isPublic, setIsPublic] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [songLang, setSongLang] = useState<'ko' | 'jp' | null>(null)
  const [referenceVideos, setReferenceVideos] = useState<ReferenceVideo[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [baseline, setBaseline] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [autoSaveDraft, setAutoSaveDraft] = useState(false)
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null)
  const [pendingDraft, setPendingDraft] = useState<LocalDraft | null>(null)
  const [languageSwitch, setLanguageSwitch] = useState<LanguageSwitchRequest | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [pasteMode, setPasteMode] = useState<PasteMode>('auto')

  const dirtyRef = useRef(false)
  const guardActiveRef = useRef(false)
  const allowNextPopRef = useRef(false)
  const pendingNavigationRef = useRef<(() => void) | null>(null)

  const editorDocument = useMemo<EditorDocument>(() => ({
    artistName,
    songTitle,
    songLang,
    editorLanguage: language,
    isPublic,
    blocks,
    referenceVideos,
    tags,
  }), [artistName, songTitle, songLang, language, isPublic, blocks, referenceVideos, tags])

  const serializedDocument = useMemo(
    () => serializeDocument(editorDocument),
    [editorDocument],
  )
  const isDirty = baseline !== null && baseline !== serializedDocument

  const applyDocument = (document: EditorDocument) => {
    setArtistName(document.artistName)
    setSongTitle(document.songTitle)
    setSongLang(document.songLang)
    setLanguage(document.editorLanguage)
    setIsPublic(document.isPublic)
    setBlocks(document.blocks)
    setReferenceVideos(document.referenceVideos)
    setTags(document.tags)
  }

  useEffect(() => {
    let cancelled = false

    const loadEditor = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled) return

      setUser(session?.user ?? null)
      const id = new URLSearchParams(window.location.search).get('id')
      let loadedDocument: EditorDocument = {
        artistName: '',
        songTitle: '',
        songLang: null,
        editorLanguage: 'jp',
        isPublic: false,
        blocks,
        referenceVideos: [],
        tags: [],
      }

      if (id && session) {
        try {
          const response = await fetch(`/api/sheets/${id}`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          })
          const data = await response.json()
          if (!response.ok) throw new Error(data.error || '콜표를 불러오지 못했습니다.')

          loadedDocument = {
            artistName: data.artistName || '',
            songTitle: data.songTitle || '',
            songLang: data.songLang || null,
            editorLanguage: data.editorLanguage || 'jp',
            isPublic: data.isPublic ?? false,
            blocks: data.blocks,
            referenceVideos: data.referenceVideos ?? [],
            tags: (data.tags ?? []).map((tag: SheetTagResponse) => tag.tag.name),
          }
          setSavedId(id)
        } catch (error) {
          setSaveMessage(error instanceof Error ? error.message : '콜표를 불러오지 못했습니다.')
        }
      }

      if (cancelled) return
      applyDocument(loadedDocument)
      setBaseline(serializeDocument(loadedDocument))

      try {
        const storedDraft = localStorage.getItem(getDraftKey(id))
        if (storedDraft) {
          const draft = JSON.parse(storedDraft) as LocalDraft
          if (
            draft.version === 1
            && draft.document
            && serializeDocument(draft.document) !== serializeDocument(loadedDocument)
          ) {
            setPendingDraft(draft)
          }
        }
      } catch {
        localStorage.removeItem(getDraftKey(id))
      }

      setReady(true)
    }

    void loadEditor()
    return () => { cancelled = true }
    // 초기 상태를 한 번만 서버/로컬 저장소와 맞춘다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 붙여넣기 방식은 기기별 편의 설정이라 localStorage에만 저장한다. (hydration 불일치를 피해 마운트 후에 읽음)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(PASTE_MODE_KEY)
        if (stored === 'auto' || stored === 'pairs') setPasteMode(stored)
      } catch {
        // 저장소를 쓸 수 없으면 기본값 유지
      }
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  const changePasteMode = (next: PasteMode) => {
    setPasteMode(next)
    try {
      localStorage.setItem(PASTE_MODE_KEY, next)
    } catch {
      // 저장 실패는 무시
    }
  }

  useEffect(() => {
    dirtyRef.current = isDirty
  }, [isDirty])

  useEffect(() => {
    if (!ready) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return
      event.preventDefault()
      event.returnValue = ''
    }

    const handlePopState = () => {
      if (allowNextPopRef.current) {
        allowNextPopRef.current = false
        guardActiveRef.current = false
        const pendingNavigation = pendingNavigationRef.current
        pendingNavigationRef.current = null
        pendingNavigation?.()
        return
      }

      if (!guardActiveRef.current || !dirtyRef.current) return

      if (window.confirm(UNSAVED_MESSAGE)) {
        guardActiveRef.current = false
        allowNextPopRef.current = true
        window.history.back()
      } else {
        window.history.pushState({ ...window.history.state, mixEditorGuard: true }, '', window.location.href)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [ready])

  useEffect(() => {
    if (!ready) return

    if (isDirty && !guardActiveRef.current) {
      window.history.pushState({ ...window.history.state, mixEditorGuard: true }, '', window.location.href)
      guardActiveRef.current = true
      return
    }

    if (!isDirty && guardActiveRef.current) {
      allowNextPopRef.current = true
      window.history.back()
    }
  }, [isDirty, ready])

  useEffect(() => {
    if (!ready || !autoSaveDraft || !isDirty) return

    const timer = window.setTimeout(() => {
      const draft: LocalDraft = {
        version: 1,
        sheetId: savedId,
        savedAt: new Date().toISOString(),
        document: editorDocument,
      }
      localStorage.setItem(getDraftKey(savedId), JSON.stringify(draft))
      setDraftSavedAt(draft.savedAt)
    }, 1200)

    return () => window.clearTimeout(timer)
  }, [autoSaveDraft, editorDocument, isDirty, ready, savedId])

  const navigateTo = (href: string) => {
    if (dirtyRef.current && !window.confirm(UNSAVED_MESSAGE)) return

    const navigate = () => router.push(href)
    if (guardActiveRef.current) {
      pendingNavigationRef.current = navigate
      allowNextPopRef.current = true
      window.history.back()
    } else {
      navigate()
    }
  }

  const toggleAutoSaveDraft = (enabled: boolean) => {
    setAutoSaveDraft(enabled)
    setDraftSavedAt(null)
    if (!enabled) localStorage.removeItem(getDraftKey(savedId))
  }

  const restoreDraft = () => {
    if (!pendingDraft) return
    applyDocument(pendingDraft.document)
    setAutoSaveDraft(true)
    setDraftSavedAt(pendingDraft.savedAt)
    setPendingDraft(null)
  }

  const discardDraft = () => {
    localStorage.removeItem(getDraftKey(savedId))
    setPendingDraft(null)
  }

  const requestLanguageSwitch = (target: Language) => {
    if (target === language) return
    const hasLyricContent = blocks.some(block => (
      block.type === 'lyric'
      && block.lines.some(line => line.jp?.trim() || line.hira?.trim() || line.ko?.trim())
    ))

    if (!hasLyricContent) {
      setLanguage(target)
      return
    }

    setLanguageSwitch({ from: language, to: target })
  }

  const switchKoreanToJapanese = (destination: 'jp' | 'ko') => {
    if (destination === 'jp') {
      setBlocks(currentBlocks => currentBlocks.map(block => {
        if (block.type !== 'lyric') return block
        return {
          ...block,
          lines: block.lines.map(line => {
            if (!line.ko?.trim() || line.jp?.trim()) return line
            return { ...line, jp: line.ko, ko: '' }
          }),
        }
      }))
    }
    setLanguage('jp')
    setLanguageSwitch(null)
  }

  const switchJapaneseToKorean = (mode: 'original' | 'merge') => {
    setBlocks(currentBlocks => currentBlocks.map(block => {
      if (block.type !== 'lyric') return block

      if (mode === 'original') {
        return {
          ...block,
          lines: block.lines.map(line => ({
            ...line,
            jp: '',
            hira: '',
            ko: line.jp?.trim() ? line.jp : line.ko?.trim() ? line.ko : line.hira ?? '',
          })),
        }
      }

      return {
        ...block,
        lines: block.lines.flatMap(line => {
          const values = [line.jp, line.hira, line.ko].filter(
            (value): value is string => Boolean(value?.trim()),
          )
          if (values.length === 0) return [{ ...line, jp: '', hira: '', ko: '' }]

          // 믹스는 마지막 줄(발음 아래)에 붙여 유지한다
          return values.map<LyricLine>((value, index) => ({
            id: index === 0 ? line.id : crypto.randomUUID(),
            jp: '',
            hira: '',
            ko: value,
            ...(line.mix !== undefined && index === values.length - 1 && { mix: line.mix }),
          }))
        }),
      }
    }))
    setLanguage('ko')
    setLanguageSwitch(null)
  }

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = type === 'lyric'
      ? { id: crypto.randomUUID(), type: 'lyric', lines: [{ id: crypto.randomUUID(), jp: '', hira: '', ko: '' }] }
      : type === 'mix'
      ? { id: crypto.randomUUID(), type: 'mix', text: '' }
      : type === 'interlude'
      ? { id: crypto.randomUUID(), type: 'interlude', label: '간주', text: '' }
      : { id: crypto.randomUUID(), type: 'performance', performanceType: '오타게' }
    setBlocks(p => [...p, newBlock])
  }

  const handleSave = async () => {
    if (!user) { navigateTo('/login'); return }
    setSaving(true)
    setSaveMessage(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) throw new Error('로그인이 만료되었습니다. 다시 로그인해 주세요.')

      let response: Response
      if (savedId) {
        response = await fetch(`/api/sheets/${savedId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(editorDocument),
        })
      } else {
        response = await fetch('/api/sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(editorDocument),
        })
      }

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '저장에 실패했습니다.')

      const previousDraftKey = getDraftKey(savedId)
      const nextSavedId = savedId ?? data.id
      if (!nextSavedId) throw new Error('저장된 콜표 ID를 확인하지 못했습니다.')

      setSavedId(nextSavedId)
      setBaseline(serializedDocument)
      localStorage.removeItem(previousDraftKey)
      localStorage.removeItem(getDraftKey(nextSavedId))
      setDraftSavedAt(null)
      setSaveMessage('저장되었습니다.')
    } catch (error) {
      console.error(error)
      setSaveMessage(error instanceof Error ? error.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {pendingDraft && (
        <div className="fixed inset-0 z-[100] bg-black/40 px-4 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="draft-dialog-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h2 id="draft-dialog-title" className="font-bold text-gray-900">임시저장된 수정본이 있습니다</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {new Date(pendingDraft.savedAt).toLocaleString('ko-KR')}에 이 기기에 저장한 수정본을 복구할까요?
              서버의 콜표는 아직 변경되지 않았습니다.
            </p>
            <div className="flex gap-2 justify-end mt-5">
              <button
                type="button"
                onClick={discardDraft}
                className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
              >
                임시본 삭제
              </button>
              <button
                type="button"
                onClick={restoreDraft}
                className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700"
              >
                복구
              </button>
            </div>
          </div>
        </div>
      )}

      {languageSwitch && (
        <div className="fixed inset-0 z-[90] bg-black/40 px-4 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="language-dialog-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h2 id="language-dialog-title" className="font-bold text-gray-900">
              {languageSwitch.from === 'ko' ? '한국어 내용을 어디에 넣을까요?' : '일본어 가사와 발음을 어떻게 합칠까요?'}
            </h2>
            {languageSwitch.from === 'ko' ? (
              <>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  일본어 편집은 위쪽 가사와 아래쪽 한국어 발음 두 칸을 사용합니다.
                  이미 양쪽에 내용이 있는 줄은 덮어쓰지 않고 그대로 유지합니다.
                </p>
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => switchKoreanToJapanese('jp')}
                    className="text-left rounded-xl border border-gray-200 p-3 hover:border-gray-400 hover:bg-gray-50"
                  >
                    <span className="block text-sm font-bold text-gray-800">위쪽 일본어 가사 칸으로 옮기기</span>
                    <span className="block text-xs text-gray-400 mt-1">한국어 곡 가사를 주 가사 또는 믹스 타이밍 표시에 사용할 때</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => switchKoreanToJapanese('ko')}
                    className="text-left rounded-xl border border-gray-200 p-3 hover:border-gray-400 hover:bg-gray-50"
                  >
                    <span className="block text-sm font-bold text-gray-800">아래쪽 한국어 발음 칸에 유지</span>
                    <span className="block text-xs text-gray-400 mt-1">내용을 옮기지 않고 현재 한국어 칸에 그대로 둘 때</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  한국어 편집은 한 줄만 사용합니다. 빈 값은 자동으로 건너뛰며, 선택하기 전에는 기존 내용을 변경하지 않습니다.
                </p>
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => switchJapaneseToKorean('original')}
                    className="text-left rounded-xl border border-gray-200 p-3 hover:border-gray-400 hover:bg-gray-50"
                  >
                    <span className="block text-sm font-bold text-gray-800">발음 줄을 버리고 원문만 사용</span>
                    <span className="block text-xs text-red-400 mt-1">한국어 발음과 히라가나 내용은 제거됩니다.</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => switchJapaneseToKorean('merge')}
                    className="text-left rounded-xl border border-gray-200 p-3 hover:border-gray-400 hover:bg-gray-50"
                  >
                    <span className="block text-sm font-bold text-gray-800">원문과 발음을 각각 가사줄로 합치기</span>
                    <span className="block text-xs text-gray-400 mt-1">원문, 히라가나, 한국어 발음을 작성된 순서대로 별도 줄로 보존합니다.</span>
                  </button>
                </div>
              </>
            )}
            <button
              type="button"
              onClick={() => setLanguageSwitch(null)}
              className="mt-4 text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 w-full"
            >
              취소
            </button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 py-3">
        {/* 1행: 로고 + 저장/로그인 */}
        <div className="flex items-center justify-between gap-2">
          <button type="button" onClick={() => navigateTo('/')} className="text-red-500 font-black text-lg shrink-0">📣 믹스콜 에디터</button>
          <div className="flex items-center gap-2 ml-auto">
            {user && (
              <button
                onClick={() => setIsPublic(p => !p)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors shrink-0 ${isPublic ? 'bg-green-50 border-green-200 text-green-600' : 'border-gray-200 text-gray-400'}`}>
                {isPublic ? '🌐 공개' : '🔒 비공개'}
              </button>
            )}
            {user ? (
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-xs px-4 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-30 transition-colors shrink-0">
                {saving ? '저장 중…' : savedId ? '✓ 업데이트' : '저장'}
              </button>
            ) : (
              <button
                onClick={() => navigateTo('/login')}
                className="text-xs px-4 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors shrink-0">
                🔑 로그인 후 저장
              </button>
            )}
            {user ? (
              <button onClick={() => navigateTo('/my')}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 shrink-0">
                내 콜표</button>
            ) : (
              <button onClick={() => navigateTo('/login')}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 shrink-0">
                로그인</button>
            )}
          </div>
        </div>

        {/* 2행: 아티스트명 + 곡 제목 */}
        <div className="flex gap-2 mt-2">
          <input
            value={artistName}
            onChange={e => setArtistName(e.target.value)}
            placeholder="아티스트명"
            className="flex-1 bg-transparent border-b border-gray-300 text-sm text-gray-700 px-1 py-1 outline-none focus:border-gray-500 placeholder:text-gray-400"
          />
          <input
            value={songTitle}
            onChange={e => setSongTitle(e.target.value)}
            placeholder="곡 제목"
            className="flex-1 bg-transparent border-b border-gray-300 text-sm text-gray-700 px-1 py-1 outline-none focus:border-gray-500 placeholder:text-gray-400"
          />
        </div>

        {/* 3행: 언어 토글 + 곡 언어 + 편집/미리보기 토글 */}
        <div className="flex gap-2 mt-2 flex-wrap">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden shrink-0">
            <button onClick={() => requestLanguageSwitch('jp')}
              className={`text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${language === 'jp' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
              🇯🇵 일본어</button>
            <button onClick={() => requestLanguageSwitch('ko')}
              className={`text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${language === 'ko' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
              🇰🇷 한국어</button>
          </div>

          <div className="flex rounded-lg border border-gray-200 overflow-hidden shrink-0">
            <button onClick={() => setSongLang('jp')}
              className={`text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${songLang === 'jp' ? 'bg-red-100 text-red-500' : 'text-gray-500 hover:bg-gray-50'}`}>
              🇯🇵 일본 곡</button>
            <button onClick={() => setSongLang('ko')}
              className={`text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${songLang === 'ko' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
              🇰🇷 한국 곡</button>
            <button onClick={() => setSongLang(null)}
              className={`text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${songLang === null ? 'bg-gray-200 text-gray-600' : 'text-gray-500 hover:bg-gray-50'}`}>
              미분류</button>
          </div>

          <div className="flex rounded-lg border border-gray-200 overflow-hidden shrink-0">
            <button onClick={() => setMode('edit')}
              className={`text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${mode === 'edit' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
              ✏️ 편집</button>
            <button onClick={() => setMode('preview')}
              className={`text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${mode === 'preview' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
              👁️ 미리보기</button>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2 min-h-5 flex-wrap">
          <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoSaveDraft}
              onChange={event => toggleAutoSaveDraft(event.target.checked)}
              className="accent-gray-800"
            />
            이 기기에 임시 자동저장
          </label>
          {isDirty && <span className="text-xs text-orange-500">● 저장하지 않은 변경사항</span>}
          {!isDirty && baseline && <span className="text-xs text-gray-300">저장된 상태</span>}
          {draftSavedAt && (
            <span className="text-xs text-blue-400">
              임시저장 {new Date(draftSavedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          {saveMessage && (
            <span className={`text-xs ${saveMessage === '저장되었습니다.' ? 'text-green-500' : 'text-red-500'}`}>
              {saveMessage}
            </span>
          )}
        </div>

        <QuickInsertBar />
      </header>

      <main data-quick-insert-scope className="max-w-2xl mx-auto px-4 py-6">
        {mode === 'edit' ? (
          <>
            {/* 곡 메타 카드: 참고영상 + 태그 */}
            <div className="mb-4 p-3 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
              <ReferenceVideoManager
                videos={referenceVideos}
                onChange={setReferenceVideos}
              />
              <div className="border-t border-gray-100" />
              <TagInput tags={tags} onChange={setTags} />
            </div>

            {language === 'jp' && (
              <div className="mb-3 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-gray-500 shrink-0">가사 붙여넣기</span>
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden shrink-0">
                    <button type="button" aria-pressed={pasteMode === 'auto'} onClick={() => changePasteMode('auto')}
                      className={`text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${pasteMode === 'auto' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                      자동 판별</button>
                    <button type="button" aria-pressed={pasteMode === 'pairs'} onClick={() => changePasteMode('pairs')}
                      className={`text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${pasteMode === 'pairs' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                      2줄씩 (원문·발음)</button>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  {pasteMode === 'auto'
                    ? '일본어 줄 다음의 한글 줄을 발음으로 자동 연결'
                    : '홀수 줄은 원문, 짝수 줄은 발음 (빈 줄 기준으로 끊어서)'}
                </p>
              </div>
            )}

            <BlockList blocks={blocks} language={language} pasteMode={pasteMode} onChange={setBlocks} />
            <div className="flex gap-2 mt-4 justify-center flex-wrap">
              <button onClick={() => addBlock('lyric')}
                className="text-sm px-4 py-2 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors">
                + 가사 블록</button>
              <button onClick={() => addBlock('mix')}
                className="text-sm px-4 py-2 rounded-lg border border-dashed border-red-200 text-red-300 hover:text-red-500 hover:border-red-400 transition-colors">
                + 믹스 블록</button>
              <button onClick={() => addBlock('interlude')}
                className="text-sm px-4 py-2 rounded-lg border border-dashed border-blue-200 text-blue-300 hover:text-blue-500 hover:border-blue-400 transition-colors">
                + 간주/전주</button>
              <button onClick={() => addBlock('performance')}
                className="text-sm px-4 py-2 rounded-lg border border-dashed border-purple-200 text-purple-300 hover:text-purple-500 hover:border-purple-400 transition-colors">
                + 퍼포먼스</button>
            </div>
          </>
        ) : (
          <Preview blocks={blocks} artistName={artistName} songTitle={songTitle} language={language} referenceVideos={referenceVideos} tags={tags} />
        )}
      </main>
    </div>
  )
}

function Preview({ blocks, artistName, songTitle, language, referenceVideos, tags }: {
  blocks: Block[], artistName: string, songTitle: string, language: Language, referenceVideos: ReferenceVideo[], tags: string[]
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = blocks.map(b => {
      let content = ''
      if (b.type === 'lyric') content = trimBlankLyricLines(b.lines).map(l => {
        if (language === 'ko') return [l.ko, l.mix].filter(Boolean).join('\n')
        return [l.jp, l.hira, l.ko, l.mix].filter(Boolean).join('\n')
      }).join('\n')
      if (b.type === 'mix') {
        content = [
          b.text,
          ...(b.alternatives ?? []).map(alternative => `또는\n${alternative.text}`),
        ].filter(Boolean).join('\n')
      }
      if (b.type === 'interlude') {
        content = [
          `[${b.label}]`,
          b.text,
          ...(b.alternatives ?? []).map(alternative => `또는\n${alternative.text}`),
        ].filter(Boolean).join('\n')
      }
      if (b.type === 'performance') {
        content = `[${b.performanceType === '기타' && b.customLabel ? b.customLabel : b.performanceType}]`
      }
      const note = getBlockNote(b).trim()
      return [content, note ? `※ ${note}` : ''].filter(Boolean).join('\n')
    }).join('\n\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {(artistName || songTitle) && (
          <div>
            {artistName && <p className="text-gray-400 text-sm">{artistName}</p>}
            {songTitle && <h2 className="text-gray-900 font-bold text-xl">{songTitle}</h2>}
          </div>
        )}
        <button onClick={handleCopy}
          className="ml-auto text-sm px-3 py-1.5 rounded border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors">
          {copied ? '✓ 복사됨' : '📋 텍스트 복사'}</button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {referenceVideos.length > 0 && (
        <div className="mb-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
          <p className="text-xs font-medium text-gray-400">🎬 참고영상</p>
          {referenceVideos.map((v, i) => (
            <VideoEmbed key={i} url={v.url} label={v.label} compact={false} />
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow border border-gray-100 font-sans">
        {(artistName || songTitle) && (
          <div className="mb-4 pb-3 border-b border-gray-100">
            {artistName && <p className="text-gray-400 text-sm">{artistName}</p>}
            {songTitle && <h2 className="text-gray-900 font-bold text-lg">{songTitle}</h2>}
          </div>
        )}
        <SheetBlocks blocks={blocks} />
      </div>
    </div>
  )
}
