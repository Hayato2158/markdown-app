import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'
import { v7 as uuidv7 } from 'uuid'
import { NoteInfo } from '@renderer/contents/note'

const getNotes = async (): Promise<NoteInfo[]> => {
  const response = await fetch('http://localhost:8000/notes')
  if (!response.ok) return []

  const data: NoteInfo[] = await response.json()
  return data.sort((a, b) => new Date(b.lastEditTime).getTime() - new Date(a.lastEditTime).getTime())
}

export const notesAtom = atom<NoteInfo[] | null>(null)
export const selectedNoteIndexAtom = atom(0)

const selectedNoteAtomAsync = atom(async (get) => {
  const notes = get(notesAtom)
  const index = get(selectedNoteIndexAtom) ?? 0
  if (!notes?.length) return null

  const selected = notes[index]
  const response = await fetch(`http://localhost:8000/notes/${selected.uuid}`)
  return response.ok ? await response.json() : selected
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

export const createNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom) ?? []

  const res = await fetch('http://localhost:8000/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: '新しいノート',
      content: '',
      lastEditTime: new Date().toISOString()
    })
  })

  if (!res.ok) return console.error('ノート作成失敗')

  const newNote: NoteInfo = await res.json()
  set(notesAtom, [newNote, ...notes])
  set(selectedNoteIndexAtom, 0)
})

export const deleteNoteAtom = atom(null, async (get, set) => {
  const selectedNote = get(selectedNoteAtom)
  if (!selectedNote) return

  const res = await fetch(`http://localhost:8000/notes/${selectedNote.uuid}`, {
    method: 'DELETE'
  })

  if (!res.ok) return
  set(refreshNotesAtom)
})

export const refreshNotesAtom = atom(null, async (_get, set) => {
  const response = await fetch('http://localhost:8000/notes')
  if (!response.ok) return

  const data: NoteInfo[] = await response.json()
  set(notesAtom, data.sort((a, b) => new Date(b.lastEditTime).getTime() - new Date(a.lastEditTime).getTime()))
  set(selectedNoteIndexAtom, 0)
  console.log('[refreshNotesAtom] refreshed:', data.length)
})
