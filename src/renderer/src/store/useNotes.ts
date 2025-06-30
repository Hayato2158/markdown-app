import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'
import { v7 as uuidv7 } from 'uuid'
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

const selectedNoteAtomAsync = atom(async (get) => {
  const notes = get(notesAtom)
  const index = get(selectedNoteIndexAtom) ?? 0

  if (!notes?.length) return null

  const selectedNote = notes[index]
  const response = await window.electron.readNote(selectedNote.uuid)

  return (response?.success && response.data) ? response.data : selectedNote
})

export const selectedNoteAtom = unwrap(selectedNoteAtomAsync, (prev) =>
  prev ?? {
    uuid: uuidv7(),
    title: '',
    content: '',
    lastEditTime: new Date()
  }
)

export const saveNoteAtom = atom(null, (get, set) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)
  if (!selectedNote || !notes) return

  set(notesAtom, notes.map((note) =>
    note.uuid === selectedNote.uuid ? { ...note, lastEditTime: new Date() } : note
  ))
})

export const createNoteAtom = atom(null, async (set) => {
  const response = await window.electron.createNote('新規ノート')
  if (!response.success || !response.data) return

})

export const deleteNoteAtom = atom(null, async (get, set) => {
  const selectedNote = get(selectedNoteAtom)
  if (!selectedNote) return

  const response = await window.electron.deleteNote(selectedNote.title, selectedNote.uuid)
  if (!response.success) return

  set(refreshNotesAtom) // 一括更新で反映
})

/**
 * notes と selectedNoteIndex を一括更新
 */
export const refreshNotesAtom = atom(null, async (_get, set) => {
  const refreshed = await window.electron.getNotes()
  if (refreshed.success && refreshed.data) {
    set(notesAtom, refreshed.data.sort((a, b) => b.lastEditTime.getTime() - a.lastEditTime.getTime()))
    set(selectedNoteIndexAtom, 0)
    console.log('[refreshNotesAtom] refreshed:', refreshed.data.length)
  }
})
