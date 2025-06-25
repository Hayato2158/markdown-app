import { unwrap } from 'jotai/utils'
import { v7 as uuidv7 } from 'uuid'
import { atom } from 'jotai'

/** tyes */
import { NoteInfo } from '@renderer/contents/note'

const getNotes = async (): Promise<NoteInfo[]> => {
  const response = await window.electron.getNotes()
  if (response?.success && response.data) {
    return response.data.sort((a, b) => b.lastEditTime.getTime() - a.lastEditTime.getTime())
  }
  return []
}

const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(getNotes())
export const notesAtom = unwrap(notesAtomAsync, (prev) => prev || [])

export const selectedNoteIndexAtom = atom<number | null>(0)

/**
 * note選択
 */
const selectedNoteAtomAsync = atom(async (get) => {
  const notes: NoteInfo[] = get(notesAtom)
  const index = get(selectedNoteIndexAtom)

  if (!notes || notes.length === 0) {
    return null
  }

  const selectedNote: NoteInfo = notes[index ?? 0]
  const response = await window.electron.readNote(selectedNote?.uuid)

  if (response?.success && response.data) {
    return response.data
  }

  return selectedNote
})

export const selectedNoteAtom = unwrap(
  selectedNoteAtomAsync,
  (prev) =>
    prev ?? {
      uuid: uuidv7(),
      title: '',
      content: '',
      lastEditTime: new Date()
    }
)

/**
 * noteの保存
 */
export const saveNoteAtom = atom(null, (get, set) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  set(
    notesAtom,
    notes.map((note) => {
      if (note.uuid === selectedNote.uuid) {
        return {
          ...note,
          lastEditTime: new Date()
        }
      }

      return note
    })
  )
})

/**
 * noteの新規作成
 */
export const createNoteAtom = atom(null, async (get, set) => {
  const response = await window.electron.createNote('新規ノート')
  if (!response.success || !response.data) return

  const refreshed = await window.electron.getNotes()
  if (refreshed.success && refreshed.data) {
    set(notesAtom, refreshed.data)
    set(selectedNoteIndexAtom, 0)
    console.log('[createNoteAtom] refreshed:', refreshed.data.length)
  }
});

/**
 * noteの削除
 */
export const deleteNoteAtom = atom(null, async (get, set) => {
  const selectedNote = get(selectedNoteAtom)
  if (!selectedNote) return

  const success = await window.electron.deleteNote(selectedNote.title, selectedNote.uuid)
  if (!success) return

  const refreshed = await window.electron.getNotes()
  if (refreshed.success && refreshed.data) {
    set(notesAtom, refreshed.data)
    set(selectedNoteIndexAtom, 0)
  }
})
