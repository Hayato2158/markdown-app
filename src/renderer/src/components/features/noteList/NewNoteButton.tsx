import { useEffect, useState } from 'react'

export const NewNoteButton = ({ onCreated }: { onCreated: () => void }) => {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '新しいノート',
          content: 'ここに内容を入力...',
        }),
      })

      if (!response.ok) {
        throw new Error('作成に失敗しました')
      }

      onCreated()
    } catch (err) {
      console.error('[ノート作成エラー]', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? '作成中...' : '新規ノート作成'}
    </button>
  )
}
