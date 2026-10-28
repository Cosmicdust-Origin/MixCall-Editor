import { useCallback, useRef, useState } from 'react'

export type ChangeKind = 'typing' | 'action'

type Options = {
  limit?: number
  typingIdleMs?: number
}

// 문서 전체 스냅샷 기반 되돌리기/다시 실행.
// checkpoint는 변경을 적용하기 "전에" 현재 문서와 함께 호출한다.
export function useEditorHistory<T>({ limit = 100, typingIdleMs = 1000 }: Options = {}) {
  const pastRef = useRef<T[]>([])
  const futureRef = useRef<T[]>([])
  const lastTypingAtRef = useRef<number | null>(null) // 진행 중인 입력 묶음의 마지막 시각
  const checkpointedRef = useRef(false) // 같은 이벤트 안의 중복 기록 방지
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const sync = useCallback(() => {
    setCanUndo(pastRef.current.length > 0)
    setCanRedo(futureRef.current.length > 0)
  }, [])

  const checkpoint = useCallback((current: T, kind: ChangeKind) => {
    if (checkpointedRef.current) return
    checkpointedRef.current = true
    queueMicrotask(() => { checkpointedRef.current = false })

    if (kind === 'typing') {
      const now = Date.now()
      const lastTypingAt = lastTypingAtRef.current
      lastTypingAtRef.current = now
      // 같은 입력 묶음이면 새 단계를 만들지 않는다
      if (lastTypingAt !== null && now - lastTypingAt < typingIdleMs) return
    } else {
      lastTypingAtRef.current = null
    }

    pastRef.current.push(current)
    if (pastRef.current.length > limit) pastRef.current.shift()
    futureRef.current = []
    sync()
  }, [limit, typingIdleMs, sync])

  const undo = useCallback((current: T): T | null => {
    const prev = pastRef.current.pop()
    if (prev === undefined) return null
    futureRef.current.push(current)
    lastTypingAtRef.current = null
    sync()
    return prev
  }, [sync])

  const redo = useCallback((current: T): T | null => {
    const next = futureRef.current.pop()
    if (next === undefined) return null
    pastRef.current.push(current)
    lastTypingAtRef.current = null
    sync()
    return next
  }, [sync])

  const reset = useCallback(() => {
    pastRef.current = []
    futureRef.current = []
    lastTypingAtRef.current = null
    sync()
  }, [sync])

  return { checkpoint, undo, redo, reset, canUndo, canRedo }
}
