import { useEffect, useState } from 'react'

type Note = {
  id: number
  title: string
  content: string
}

export const useNotesList = (refreshKey: number) => {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/notes')
        const data = await res.json()
        setNotes(data)
      } catch (error) {
        console.error('[fetchNotes error]', error)
      }
    }

    fetchNotes()
  }, [refreshKey])

  return notes
}
