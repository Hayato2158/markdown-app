import { useState } from 'react'
import { useNotesList } from '../../../hooks/useNotesList'
import { NewNoteButton } from '@renderer/components/features/noteList/NewNoteButton'

export const NoteList = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const notes = useNotesList(refreshKey)


  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  const refresh = () => setRefreshKey((k) => k + 1)

  const startEditing = (note: { id: number; title: string; content: string }) => {
    setEditingNoteId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const cancelEditing = () => {
    setEditingNoteId(null)
    setEditTitle('')
    setEditContent('')
  }

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/notes/${editingNoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: editTitle, content: editContent })
      })

      if (!res.ok) {
        throw new Error('更新に失敗しました')
      }

      cancelEditing()
      refresh()
    } catch (err) {
      console.error('[ノート更新エラー]', err)
    }
  }

  const handleDelete = async (id: number) => {
    const ok = confirm('このノートを削除してもよいですか？')
    if (!ok) return

    try {
      const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('削除に失敗しました')
      }

      refresh()
    } catch (err) {
      console.error('[ノート削除エラー]', err)
    }
  }

  return (
    <div>
      <h2>ノート一覧</h2>
      <NewNoteButton onCreated={refresh} />
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            {editingNoteId === note.id ? (
              <div>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="タイトル"
                />
                <br />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="内容"
                />
                <br />
                <button onClick={handleUpdate}>保存</button>
                <button onClick={cancelEditing}>キャンセル</button>
              </div>
            ) : (
              <div>
                <strong>{note.title}</strong>: {note.content}
                <button className="button button--primary" onClick={() => startEditing(note)} style={{ marginLeft: '1em' }}>
                  編集
                </button>
                <button className="button button--danger" onClick={() => handleDelete(note.id)} style={{ marginLeft: '0.5em' }}>
                  削除
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
