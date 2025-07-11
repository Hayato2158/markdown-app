import { useEffect } from 'react'
import { useAtom, useSetAtom, useAtomValue } from 'jotai'

/** store */
import { selectedNoteIndexAtom as selectedNoteIndex, notesAtom } from '@renderer/store/useNotes'
import type { NoteInfo } from '@renderer/contents/note'

export const useNotesList = ({ onSelect }: { onSelect?: () => void }) => {
  const notes = useAtomValue(notesAtom)
  const setNotes = useSetAtom(notesAtom)
  const [selectedIndex, setSelectedNoteIndex] = useAtom(selectedNoteIndex)

  /** 一覧をAPIから取得してセット */
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('http://localhost:8000/notes')
        const data: NoteInfo[] = await res.json()
        setNotes(data)
      } catch (error) {
        console.error('ノート一覧の取得に失敗しました:', error)
      }
    }

    fetchNotes()
  }, [setNotes])

  /** ノート選択 */
  const handleNoteSelect = (index: number): void => {
    setSelectedNoteIndex(index)
    if (onSelect) onSelect()
  }

  return {
    notes,
    selectedIndex,
    handleNoteSelect,
  }
}
