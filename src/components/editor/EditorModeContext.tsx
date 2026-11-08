'use client'

import { createContext, useContext } from 'react'

// true = 고급 모드. Provider 밖에서 렌더되면 기존처럼 모든 기능이 보인다.
const EditorModeContext = createContext<boolean>(true)

export const EditorModeProvider = EditorModeContext.Provider

export function useAdvancedEditor(): boolean {
  return useContext(EditorModeContext)
}
