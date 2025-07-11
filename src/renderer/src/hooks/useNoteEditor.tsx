import { MDXEditorMethods } from '@mdxeditor/editor'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRef } from 'react'

/** store */
import { saveNoteAtom, selectedNoteAtom } from '../store/useNotes'

/** types */
import { NoteContent, NoteInfo } from '../contents/note'
import { AUTE_SAVING_TIME } from '../contents/enums'

export const useNoteEditor = () => {
  const selectedNote = useAtomValue(selectedNoteAtom)
  const saveNote = useSetAtom(saveNoteAtom)
  const editor = useRef<MDXEditorMethods>(null)

  const updateNote = async (note: NoteInfo): Promise<void> => {
    try {
      await fetch(`http://localhost:8000/notes/${note.uuid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
          lastEditTime: note.lastEditTime.toISOString(),
        }),
      })
    } catch (e) {
      console.error('ノートの保存に失敗しました:', e)
    }
  }

  const handleAutoSave = async (content: NoteContent): Promise<void> => {
    if (!content || !selectedNote?.uuid) return

    const changeNoteInfo: NoteInfo = {
      uuid: selectedNote.uuid,
      title: selectedNote.title,
      content,
      lastEditTime: new Date(),
    }

    setTimeout(async () => {
      await updateNote(changeNoteInfo)
      saveNote()
    }, AUTE_SAVING_TIME)
  }

  const handleBlur = async (): Promise<void> => {
    if (!selectedNote) return

    const markDownContent = editor.current?.getMarkdown()
    if (!markDownContent) return

    const changeNoteInfo: NoteInfo = {
      uuid: selectedNote.uuid,
      title: selectedNote.title,
      content: markDownContent,
      lastEditTime: new Date(),
    }

    await updateNote(changeNoteInfo)
  }

  return {
    editor,
    selectedNote,
    handleBlur,
    handleAutoSave,
  }
}
