import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useState, useEffect } from 'react'
import { selectedNoteAtom, notesAtom, saveNoteAtom } from '@renderer/store/useNotes'
import type { NoteInfo } from '../../features/contents/note'

export const NoteTitle = () => {
  const selectedNote = useAtomValue(selectedNoteAtom)
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useAtom(notesAtom)
  const saveNote = useSetAtom(saveNoteAtom)

  useEffect(() => {
    if (selectedNote?.title) {
      setTitle(selectedNote.title)
    }
  }, [selectedNote])

  const handleSave = async () => {
    if (!selectedNote?.uuid || title === selectedNote.title) return

    const updatedNote: NoteInfo = {
      ...selectedNote,
      title,
      lastEditTime: new Date(),
    }

    try {
      const res = await fetch(`http://localhost:8000/notes/${updatedNote.uuid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote),
      })

      if (!res.ok) {
        console.error('タイトル更新失敗')
        return
      }

      // ローカルstate更新
      setNotes(
        (prev) =>
          prev?.map((note) =>
            note.uuid === updatedNote.uuid ? { ...note, title } : note
          ) ?? []
      )
      saveNote()
    } catch (err) {
      console.error('タイトル保存エラー:', err)
    }
  }

  const handleBlur = () => handleSave()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur() // 自動で blur による保存を誘発
    }
  }

  return (
    <input
      className="note-title-input"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder="タイトルを入力"
    />
  )
}
