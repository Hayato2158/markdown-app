import express, { Request, Response } from 'express'


const router = express.Router()

type Note = {
  id: number
  title: string
  content: string
}

const notes: Note[] = [
  { id: 1, title: '初めてのノート', content: 'これは最初のノートです。' },
  { id: 2, title: '2つ目のノート', content: 'こちらは2つ目のノートです。' }
]

// 一覧取得
router.get('/', (_req: Request, res: Response) => {
  res.json(notes)
})

// 新規作成
router.post('/', (req: Request, res: Response) => {
  const newNote = req.body
  const note = { id: notes.length + 1, ...newNote }
  notes.push(note)
  res.status(201).json(note)
})

// ✅ 削除（ここがエラーの対象）
router.delete('/:id', (req: any, res: any) => {
    const id = Number(req.params.id)
  const index = notes.findIndex(note => note.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Note not found' })
  }

  notes.splice(index, 1)
  res.status(204).end()
})

router.put('/:id', (req: any, res: any) => {
    const id = Number(req.params.id)
    const index = notes.findIndex((note) => note.id === id)
  
    if (index === -1) {
      return res.status(404).json({ error: 'Note not found' })
    }
  
    const { title, content } = req.body
    notes[index] = { ...notes[index], title, content }
  
    res.status(200).json(notes[index])
  })

export default router
