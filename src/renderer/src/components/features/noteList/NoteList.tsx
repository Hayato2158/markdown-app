import { useState } from 'react'
import { useNotesList } from '../../../hooks/useNotesList'
import { NewNoteButton } from '@renderer/components/features/noteList/NewNoteButton'

export const NoteList = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const notes = useNotesList(refreshKey)

  const refresh = () => setRefreshKey((k) => k + 1)

  return (
    <div>
      <h2>ノート一覧</h2>
      <NewNoteButton onCreated={refresh} />
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong>: {note.content}
          </li>
        ))}
      </ul>
    </div>
  )
}
