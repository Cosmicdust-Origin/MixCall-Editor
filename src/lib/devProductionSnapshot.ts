import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Block, ReferenceVideo } from '@/types'

interface SnapshotTag {
  tag: {
    id: string
    name: string
  }
}

export interface DevProductionSheet {
  id: string
  userId: string
  artistName: string | null
  songTitle: string | null
  songLang: string | null
  editorLanguage: string | null
  isPublic: boolean
  blocks: Block[]
  referenceVideos: ReferenceVideo[]
  createdAt: string
  updatedAt: string
  tags: SnapshotTag[]
  user: {
    id: string
    nickname: string | null
  }
  _count: {
    likes: number
  }
}

interface DevProductionSnapshot {
  version: 1
  source: string
  fetchedAt: string
  sheets: DevProductionSheet[]
}

const snapshotPath = join(process.cwd(), 'work', 'production-snapshot.json')

export async function getDevProductionSnapshot(): Promise<DevProductionSnapshot | null> {
  if (process.env.NODE_ENV !== 'development') return null

  try {
    const rawSnapshot = await readFile(snapshotPath, 'utf8')
    const snapshot = JSON.parse(rawSnapshot) as DevProductionSnapshot
    if (snapshot.version !== 1 || !Array.isArray(snapshot.sheets)) return null
    return snapshot
  } catch {
    return null
  }
}

export async function getDevProductionSheet(id: string): Promise<DevProductionSheet | null> {
  const snapshot = await getDevProductionSnapshot()
  return snapshot?.sheets.find(sheet => sheet.id === id) ?? null
}
